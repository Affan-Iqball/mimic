#!/usr/bin/env node
/**
 * AI Model Tester CLI
 * Interactive tool for testing prompts across multiple AI providers
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ═══════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════

const CONFIG_FILE = path.join(process.cwd(), '.ai-tester-config.json');
const RESULTS_DIR = path.join(process.cwd(), 'ai-tester-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

function getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

const PROVIDERS = {
    groq: {
        name: 'Groq',
        baseUrl: 'api.groq.com',
        modelsPath: '/openai/v1/models',
        chatPath: '/openai/v1/chat/completions',
        filterModels: (models) => models.filter(m =>
            !m.includes('whisper') &&
            !m.includes('tts') &&
            !m.includes('guard') &&
            !m.includes('orpheus')
        )
    },
    openrouter: {
        name: 'OpenRouter',
        baseUrl: 'openrouter.ai',
        modelsPath: '/api/v1/models',
        chatPath: '/api/v1/chat/completions',
        filterModels: (models) => models.filter(m =>
            !m.includes('embed') &&
            !m.includes('moderation') &&
            !m.includes('whisper') &&
            !m.includes('tts')
        )
    }
};

// ═══════════════════════════════════════════════════════════════════
// COLORS & FORMATTING
// ═══════════════════════════════════════════════════════════════════

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlue: '\x1b[44m',
    bgGreen: '\x1b[42m',
    bgRed: '\x1b[41m',
};

const log = {
    info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    header: (msg) => console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}`),
    divider: () => console.log(`${colors.dim}${'─'.repeat(60)}${colors.reset}`),
};

// ═══════════════════════════════════════════════════════════════════
// CONFIG MANAGEMENT
// ═══════════════════════════════════════════════════════════════════

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        }
    } catch (e) { }
    return { providers: {}, selectedModels: [], lastPrompt: '' };
}

function saveConfig(config) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// ═══════════════════════════════════════════════════════════════════
// API HELPERS
// ═══════════════════════════════════════════════════════════════════

function httpRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        req.setTimeout(120000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        if (postData) req.write(postData);
        req.end();
    });
}

async function fetchModels(providerKey, apiKey) {
    const provider = PROVIDERS[providerKey];
    if (!provider) return [];

    try {
        const response = await httpRequest({
            hostname: provider.baseUrl,
            path: provider.modelsPath,
            method: 'GET',
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        if (response.status === 200 && response.data.data) {
            // For OpenRouter, filter by pricing (free models only)
            if (providerKey === 'openrouter') {
                const allModels = response.data.data;
                log.info(`Found ${allModels.length} total models. Filtering free models...`);

                const freeModels = allModels.filter(m => {
                    // Check if model is free (pricing is 0 or has :free suffix)
                    const pricing = m.pricing;
                    if (!pricing) return false;
                    const promptCost = parseFloat(pricing.prompt || '1');
                    const completionCost = parseFloat(pricing.completion || '1');
                    return (promptCost === 0 && completionCost === 0) || m.id.includes(':free');
                }).map(m => m.id);

                log.success(`Found ${freeModels.length} free models!`);

                let models = freeModels;
                if (provider.filterModels) {
                    models = provider.filterModels(models);
                }
                return models.sort();
            }

            // For other providers (Groq)
            let models = response.data.data.map(m => m.id);
            if (provider.filterModels) {
                models = provider.filterModels(models);
            }
            return models.sort();
        }
    } catch (e) {
        log.error(`Failed to fetch models: ${e.message}`);
    }
    return [];
}

async function pingModel(provider, apiKey, modelId) {
    try {
        const postData = JSON.stringify({
            model: modelId,
            messages: [{ role: 'user', content: 'Hi' }],
            max_tokens: 1
        });

        const response = await httpRequest({
            hostname: provider.baseUrl,
            path: provider.chatPath,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, postData);

        // Model is accessible if we get 200 or rate limit (429 means it exists but busy)
        return response.status === 200 || response.status === 429;
    } catch (e) {
        return false;
    }
}

async function testModel(providerKey, apiKey, modelId, prompt, retries = 3) {
    const provider = PROVIDERS[providerKey];
    const startTime = Date.now();

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const postData = JSON.stringify({
                model: modelId,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 3000
            });

            const response = await httpRequest({
                hostname: provider.baseUrl,
                path: provider.chatPath,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            }, postData);

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

            if (response.status === 200 && response.data.choices) {
                return {
                    success: true,
                    model: modelId,
                    time: elapsed,
                    response: response.data.choices[0].message.content,
                    attempt
                };
            } else {
                throw new Error(response.data.error?.message || `HTTP ${response.status}`);
            }
        } catch (e) {
            if (attempt < retries) {
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(r => setTimeout(r, delay));
            } else {
                return {
                    success: false,
                    model: modelId,
                    time: ((Date.now() - startTime) / 1000).toFixed(2),
                    error: e.message,
                    attempts: retries
                };
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
// READLINE HELPERS
// ═══════════════════════════════════════════════════════════════════

function createRL() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}

function ask(rl, question) {
    return new Promise(resolve => rl.question(question, resolve));
}

// ═══════════════════════════════════════════════════════════════════
// MENU FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

function showWelcome(config) {
    console.clear();
    console.log(`
${colors.bright}${colors.cyan}╔══════════════════════════════════════════════════════════╗
║                    🤖 AI Model Tester                     ║
╚══════════════════════════════════════════════════════════╝${colors.reset}
`);

    log.header('Connected Providers:');
    for (const [key, provider] of Object.entries(PROVIDERS)) {
        const cfg = config.providers[key];
        if (cfg && cfg.apiKey && cfg.models?.length > 0) {
            log.success(`${provider.name} (${cfg.models.length} models available)`);
        } else if (cfg && cfg.apiKey) {
            log.warn(`${provider.name} (API key set, no models loaded)`);
        } else {
            log.error(`${provider.name} (not configured)`);
        }
    }

    const selectedCount = config.selectedModels?.length || 0;
    console.log(`\n${colors.dim}Selected models for testing: ${selectedCount}${colors.reset}`);
    log.divider();
}

async function menuAddApiKey(rl, config) {
    console.log('\n');
    log.header('Add/Update API Key');

    const providerKeys = Object.keys(PROVIDERS);
    providerKeys.forEach((key, i) => {
        console.log(`  [${i + 1}] ${PROVIDERS[key].name}`);
    });
    console.log(`  [0] Back`);

    const choice = await ask(rl, '\nSelect provider: ');
    const idx = parseInt(choice) - 1;

    if (idx < 0 || idx >= providerKeys.length) return;

    const providerKey = providerKeys[idx];
    const apiKey = await ask(rl, `Enter API key for ${PROVIDERS[providerKey].name}: `);

    if (!apiKey.trim()) {
        log.error('No API key entered');
        return;
    }

    log.info('Fetching available models...');
    const models = await fetchModels(providerKey, apiKey.trim());

    if (models.length > 0) {
        config.providers[providerKey] = {
            apiKey: apiKey.trim(),
            models: models
        };
        // Auto-select all models
        config.selectedModels = [...new Set([...(config.selectedModels || []), ...models.map(m => `${providerKey}:${m}`)])];
        saveConfig(config);
        log.success(`Found ${models.length} models! All selected for testing.`);
    } else {
        log.error('Could not fetch models. Check your API key.');
    }

    await ask(rl, '\nPress Enter to continue...');
}

async function menuSelectModels(rl, config) {
    console.log('\n');
    log.header('Select Models for Testing');

    const allModels = [];
    for (const [providerKey, cfg] of Object.entries(config.providers)) {
        if (cfg.models) {
            cfg.models.forEach(m => allModels.push({ provider: providerKey, model: m, id: `${providerKey}:${m}` }));
        }
    }

    if (allModels.length === 0) {
        log.warn('No models available. Add an API key first.');
        await ask(rl, '\nPress Enter to continue...');
        return;
    }

    console.log('\nCurrent selection:');
    allModels.forEach((m, i) => {
        const selected = config.selectedModels?.includes(m.id);
        const mark = selected ? `${colors.green}✓${colors.reset}` : `${colors.dim}○${colors.reset}`;
        console.log(`  ${mark} [${i + 1}] ${m.model}`);
    });

    console.log(`\n  [A] Select All`);
    console.log(`  [N] Select None`);
    console.log(`  [P] Filter by Ping (test each model)`);
    console.log(`  [0] Back`);

    const choice = await ask(rl, '\nToggle model (number) or action: ');

    if (choice.toLowerCase() === 'a') {
        config.selectedModels = allModels.map(m => m.id);
        saveConfig(config);
        log.success('All models selected');
    } else if (choice.toLowerCase() === 'n') {
        config.selectedModels = [];
        saveConfig(config);
        log.success('All models deselected');
    } else if (choice.toLowerCase() === 'p') {
        // Filter by ping
        await filterModelsByPing(config);
        saveConfig(config);
    } else {
        const idx = parseInt(choice) - 1;
        if (idx >= 0 && idx < allModels.length) {
            const modelId = allModels[idx].id;
            if (config.selectedModels?.includes(modelId)) {
                config.selectedModels = config.selectedModels.filter(m => m !== modelId);
            } else {
                config.selectedModels = [...(config.selectedModels || []), modelId];
            }
            saveConfig(config);
        }
    }

    // Stay in menu for more changes
    if (choice !== '0') {
        await menuSelectModels(rl, config);
    }
}

async function filterModelsByPing(config) {
    const selected = config.selectedModels || [];
    if (selected.length === 0) {
        log.warn('No models selected to filter.');
        return;
    }

    log.info(`Testing ${selected.length} selected models...`);
    const workingModels = [];

    for (let i = 0; i < selected.length; i++) {
        const [providerKey, modelId] = selected[i].split(':');
        const provider = PROVIDERS[providerKey];
        const apiKey = config.providers[providerKey]?.apiKey;

        if (!provider || !apiKey) continue;

        const progress = `[${i + 1}/${selected.length}]`;
        process.stdout.write(`\r${colors.dim}${progress} Testing: ${modelId.substring(0, 40).padEnd(40)}${colors.reset}`);

        const works = await pingModel(provider, apiKey, modelId);
        if (works) {
            workingModels.push(selected[i]);
            process.stdout.write(` ${colors.green}✓${colors.reset}`);
        } else {
            process.stdout.write(` ${colors.red}✗${colors.reset}`);
        }

        await new Promise(r => setTimeout(r, 200));
    }

    process.stdout.write('\r' + ' '.repeat(80) + '\r');
    config.selectedModels = workingModels;
    log.success(`Kept ${workingModels.length} working models out of ${selected.length}`);
}

async function menuEnterPrompt(rl, config) {
    console.log('\n');
    log.header('Enter Prompt & Test');

    if (!config.selectedModels || config.selectedModels.length === 0) {
        log.error('No models selected. Please select models first.');
        await ask(rl, '\nPress Enter to continue...');
        return;
    }

    console.log(`${colors.dim}Enter your prompt (type END on a new line to finish):${colors.reset}\n`);

    let prompt = '';
    let line;
    while ((line = await ask(rl, '')) !== 'END') {
        prompt += line + '\n';
    }
    prompt = prompt.trim();

    if (!prompt) {
        log.error('Empty prompt');
        return;
    }

    config.lastPrompt = prompt;
    saveConfig(config);

    await runTests(config, prompt);
    await ask(rl, '\nPress Enter to continue...');
}

async function menuLoadLastPrompt(rl, config) {
    if (!config.lastPrompt) {
        log.warn('No saved prompt found');
        await ask(rl, '\nPress Enter to continue...');
        return;
    }

    console.log('\n');
    log.header('Last Prompt:');
    console.log(`${colors.dim}${config.lastPrompt.substring(0, 500)}${config.lastPrompt.length > 500 ? '...' : ''}${colors.reset}`);

    const confirm = await ask(rl, '\nRun this prompt? (y/n): ');
    if (confirm.toLowerCase() === 'y') {
        await runTests(config, config.lastPrompt);
    }
    await ask(rl, '\nPress Enter to continue...');
}

async function runTests(config, prompt) {
    console.log('\n');
    log.header('Running Tests...');
    log.divider();

    const results = [];
    const selected = config.selectedModels || [];

    for (let i = 0; i < selected.length; i++) {
        const [providerKey, modelId] = selected[i].split(':');
        const apiKey = config.providers[providerKey]?.apiKey;

        if (!apiKey) {
            log.error(`No API key for provider: ${providerKey}`);
            continue;
        }

        console.log(`\n${colors.bright}[${i + 1}/${selected.length}] ${modelId}${colors.reset}`);
        process.stdout.write(`${colors.dim}Testing...${colors.reset}`);

        const result = await testModel(providerKey, apiKey, modelId, prompt);
        results.push(result);

        // Clear "Testing..." line
        process.stdout.write('\r' + ' '.repeat(50) + '\r');

        if (result.success) {
            console.log(`${colors.green}✓ SUCCESS${colors.reset} (${result.time}s)`);
            log.divider();
            console.log(result.response.substring(0, 2000));
            if (result.response.length > 2000) console.log(`${colors.dim}...[truncated]${colors.reset}`);
        } else {
            console.log(`${colors.red}✗ FAILED${colors.reset} after ${result.attempts} attempts: ${result.error}`);
        }
        log.divider();

        // Rate limiting
        await new Promise(r => setTimeout(r, 1500));
    }

    // Summary
    log.header('Summary');
    const successful = results.filter(r => r.success).sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
    const failed = results.filter(r => !r.success);

    console.log(`\n${colors.green}Successful: ${successful.length}${colors.reset}`);
    if (successful.length > 0) {
        console.log(`${colors.dim}By speed:${colors.reset}`);
        successful.forEach(r => console.log(`  ${r.model}: ${r.time}s`));
    }

    if (failed.length > 0) {
        console.log(`\n${colors.red}Failed: ${failed.length}${colors.reset}`);
        failed.forEach(r => console.log(`  ${r.model}: ${r.error}`));
    }

    // Save results with timestamp
    const timestamp = getTimestamp();
    const resultsFile = path.join(RESULTS_DIR, `results_${timestamp}.json`);
    fs.writeFileSync(resultsFile, JSON.stringify({
        timestamp: new Date().toISOString(),
        modelsCount: results.length,
        successCount: successful.length,
        failedCount: failed.length,
        results: results
    }, null, 2));
    log.info(`Results saved to ${resultsFile}`);
}

async function menuSeeModels(rl, config) {
    console.log('\n');
    log.header('All Available Models by Provider');
    log.divider();

    let totalModels = 0;
    for (const [providerKey, provider] of Object.entries(PROVIDERS)) {
        const cfg = config.providers[providerKey];
        console.log(`\n${colors.bright}${colors.cyan}${provider.name}${colors.reset}`);

        if (cfg && cfg.models && cfg.models.length > 0) {
            cfg.models.forEach((model, i) => {
                const selected = config.selectedModels?.includes(`${providerKey}:${model}`);
                const mark = selected ? `${colors.green}✓${colors.reset}` : `${colors.dim}○${colors.reset}`;
                console.log(`  ${mark} ${model}`);
            });
            console.log(`${colors.dim}  (${cfg.models.length} models)${colors.reset}`);
            totalModels += cfg.models.length;
        } else {
            console.log(`${colors.dim}  No API key configured${colors.reset}`);
        }
    }

    log.divider();
    console.log(`\n${colors.bright}Total: ${totalModels} models${colors.reset}`);
    await ask(rl, '\nPress Enter to continue...');
}

// ═══════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════

async function main() {
    const rl = createRL();
    let config = loadConfig();

    while (true) {
        showWelcome(config);

        console.log(`
  ${colors.bright}[1]${colors.reset} Add/Update API Key
  ${colors.bright}[2]${colors.reset} Select Models (${config.selectedModels?.length || 0} selected)
  ${colors.bright}[3]${colors.reset} Enter Prompt & Test
  ${colors.bright}[4]${colors.reset} Load Last Prompt
  ${colors.bright}[5]${colors.reset} See All Models
  ${colors.bright}[0]${colors.reset} Exit
`);

        const choice = await ask(rl, 'Choose option: ');

        switch (choice) {
            case '1':
                await menuAddApiKey(rl, config);
                config = loadConfig();
                break;
            case '2':
                await menuSelectModels(rl, config);
                config = loadConfig();
                break;
            case '3':
                await menuEnterPrompt(rl, config);
                break;
            case '4':
                await menuLoadLastPrompt(rl, config);
                break;
            case '5':
                await menuSeeModels(rl, config);
                break;
            case '0':
                console.log('\nGoodbye! 👋\n');
                rl.close();
                process.exit(0);
            default:
                log.warn('Invalid option');
        }
    }
}

main().catch(console.error);
