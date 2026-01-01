const fs = require('fs');
const content = fs.readFileSync('/home/affan/Desktop/MY Projects /undercover-clone/data/spicyWords.ts', 'utf8');

// Extract words from SPICY_WORDS
const spicyMatch = content.match(/export const SPICY_WORDS.*?\n\];/s);
const spicyWords = new Set();
if (spicyMatch) {
    const matches = spicyMatch[0].matchAll(/civilian:\s*"([^"]+)"/g);
    for (const m of matches) spicyWords.add(m[1].toLowerCase());
    const matches2 = spicyMatch[0].matchAll(/undercover:\s*"([^"]+)"/g);
    for (const m of matches2) spicyWords.add(m[1].toLowerCase());
}

// Process UNDEFINED_WORDS - keep only unique pairs
const undefinedStart = content.indexOf('export const UNDEFINED_WORDS');
const undefinedEnd = content.indexOf('];', undefinedStart) + 2;
const beforeUndefined = content.slice(0, undefinedStart);
const afterUndefined = content.slice(undefinedEnd);
const undefinedSection = content.slice(undefinedStart, undefinedEnd);

const seenCivilians = new Set();
const keepLines = [];

const lines = undefinedSection.split('\n');
for (const line of lines) {
    // Check if it's a data line
    const civMatch = line.match(/civilian:\s*"([^"]+)"/);
    const underMatch = line.match(/undercover:\s*"([^"]+)"/);

    if (civMatch && underMatch) {
        const civ = civMatch[1].toLowerCase();
        const under = underMatch[1].toLowerCase();

        // Skip if in SPICY_WORDS or already seen
        const inSpicy = spicyWords.has(civ) || spicyWords.has(under);
        const alreadySeen = seenCivilians.has(civ);

        if (!inSpicy && !alreadySeen) {
            keepLines.push(line);
            seenCivilians.add(civ);
        }
    } else {
        // Keep comment/header lines
        keepLines.push(line);
    }
}

const newContent = beforeUndefined + keepLines.join('\n') + afterUndefined;
fs.writeFileSync('/home/affan/Desktop/MY Projects /undercover-clone/data/spicyWords.ts', newContent);

console.log('Done! Kept ' + seenCivilians.size + ' unique pairs (removed ' + (167 - seenCivilians.size) + ' duplicates)');
