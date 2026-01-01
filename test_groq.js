// Test ALL Groq models with the FULL prompt from user's conversation
const https = require('https');
const fs = require('fs');

// Load API key from .env
const envContent = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = envContent.match(/EXPO_PUBLIC_GROQ_API_KEY=(.+)/);
const API_KEY = apiKeyMatch ? apiKeyMatch[1].trim() : '';

// ALL chat-capable models
const MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "moonshotai/kimi-k2-instruct",
    "moonshotai/kimi-k2-instruct-0905",
    "openai/gpt-oss-120b",
    "openai/gpt-oss-20b",
    "qwen/qwen3-32b",
    "groq/compound",
    "groq/compound-mini",
];

// THE FULL PROMPT from user's conversation
const PROMPT = `You are the Lead Game Designer for "Mimic", a social deduction party game.

## GAME MECHANICS
- Civilians receive one secret word (e.g., "Tinder")
- Undercover receives a SIMILAR but DIFFERENT word (e.g., "Grindr")
- Players give one-word clues to prove they know their word WITHOUT revealing it
- The twist: Undercover doesn't know they're the imposter

## YOUR TASK
Generate word pairs for the "AFTER DARK" pack (18+ mature/suggestive content).

## THE GOLDEN RULE
Words must be "Situational Cousins" — 80% similar, 20% different.
- SHARED: Category, context, usage, vibe
- DIFFERENT: Specific details, intensity, implication

## STRICT CONSTRAINTS
✗ NO Synonyms (Big/Large = BANNED)
✗ NO Antonyms (Hot/Cold = BANNED)  
✗ NO Disconnected concepts (Car/Banana = BANNED)
✗ NO explicit body parts, graphic acts, or slurs
✓ Suggestive, not explicit
✓ Slang, innuendo, adult humor allowed

## VALIDATION ALGORITHM (Run before outputting)
1. Can a vague clue (e.g., "It's naughty") apply to BOTH words? → If NO, discard
2. Is there a specific detail that creates a "trap"? → If NO, discard

## EXISTING EXAMPLES (Match this tone exactly)
{ civilian: "Tinder", undercover: "Grindr", category: "Dating Apps" }
{ civilian: "Kiss", undercover: "Make Out", category: "Actions" }
{ civilian: "Strip Club", undercover: "Brothel", category: "Places" }
{ civilian: "One Night Stand", undercover: "Booty Call", category: "Relationships" }
{ civilian: "Lingerie", undercover: "Nothing", category: "Clothing" }
{ civilian: "OnlyFans", undercover: "Leaked", category: "Digital" }
{ civilian: "Nudes", undercover: "Dick Pic", category: "Digital" }
{ civilian: "Threesome", undercover: "Foursome", category: "Group" }
{ civilian: "Vibrator", undercover: "Dildo", category: "Toys" }
{ civilian: "Dominant", undercover: "Submissive", category: "Kink" }
{ civilian: "Sugar Daddy", undercover: "Sugar Baby", category: "Archetype" }
{ civilian: "Morning Wood", undercover: "Blue Balls", category: "Physiology" }
{ civilian: "Condom", undercover: "Raw", category: "Safety" }
{ civilian: "MILF", undercover: "DILF", category: "Archetype" }
{ civilian: "Drunk", undercover: "Blackout", category: "State" }

## OUTPUT FORMAT
Return ONLY a raw JSON array:
[
  { "civilian": "Word A", "undercover": "Word B", "category": "Category" },
  ...
]

## TASK
Generate 25 NEW word pairs following these rules. Categories: Dating, Kink, Nightlife, Digital Scandals, Archetypes.`;

async function testModel(model) {
    return new Promise((resolve) => {
        const startTime = Date.now();

        const data = JSON.stringify({
            model: model,
            messages: [{ role: "user", content: PROMPT }],
            temperature: 0.7,
            max_tokens: 3000
        });

        const options = {
            hostname: 'api.groq.com',
            path: '/openai/v1/chat/completions',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                try {
                    const json = JSON.parse(body);
                    if (json.error) {
                        resolve({ model, status: 'ERROR', time: elapsed, error: json.error.message });
                    } else {
                        const content = json.choices?.[0]?.message?.content || 'No content';
                        resolve({ model, status: 'SUCCESS', time: elapsed, response: content });
                    }
                } catch (e) {
                    resolve({ model, status: 'ERROR', time: elapsed, error: body.substring(0, 200) });
                }
            });
        });

        req.on('error', (e) => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            resolve({ model, status: 'ERROR', time: elapsed, error: e.message });
        });

        req.setTimeout(120000, () => {
            req.destroy();
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            resolve({ model, status: 'ERROR', time: elapsed, error: 'Timeout after 120s' });
        });

        req.write(data);
        req.end();
    });
}

async function main() {
    console.log('='.repeat(70));
    console.log('GROQ MODEL TEST - FULL PROMPT');
    console.log(`Testing ${MODELS.length} models with complete prompt`);
    console.log('='.repeat(70));
    console.log();

    const results = [];

    for (let i = 0; i < MODELS.length; i++) {
        const model = MODELS[i];
        console.log(`\n[${i + 1}/${MODELS.length}] ${model}`);
        console.log('='.repeat(60));

        const result = await testModel(model);
        results.push(result);

        if (result.status === 'SUCCESS') {
            console.log(`✓ SUCCESS (${result.time}s)`);
            console.log('-'.repeat(60));
            console.log(result.response);
        } else {
            console.log(`✗ ERROR (${result.time}s): ${result.error.substring(0, 150)}`);
        }

        // Rate limit buffer
        await new Promise(r => setTimeout(r, 2000));
    }

    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));

    const successful = results.filter(r => r.status === 'SUCCESS');
    const failed = results.filter(r => r.status === 'ERROR');

    console.log(`\nSuccessful: ${successful.length}/${MODELS.length}`);
    console.log(`Failed: ${failed.length}/${MODELS.length}`);

    if (successful.length > 0) {
        console.log('\n--- SUCCESS (by speed) ---');
        successful.sort((a, b) => parseFloat(a.time) - parseFloat(b.time));
        successful.forEach(r => console.log(`  ${r.model}: ${r.time}s`));
    }

    // Save full results
    fs.writeFileSync('groq_full_results.json', JSON.stringify(results, null, 2));
    console.log('\nFull results saved to groq_full_results.json');
}

main();
