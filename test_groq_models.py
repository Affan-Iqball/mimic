#!/usr/bin/env python3
"""Test all Groq chat models using official SDK."""

import os
import json
import time
from datetime import datetime

# Load API key
with open('.env', 'r') as f:
    for line in f:
        if line.startswith('EXPO_PUBLIC_GROQ_API_KEY='):
            os.environ['GROQ_API_KEY'] = line.strip().split('=', 1)[1]
            break

from groq import Groq

client = Groq()

CHAT_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "meta-llama/llama-4-maverick-17b-128e-instruct",
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "moonshotai/kimi-k2-instruct",
    "qwen/qwen3-32b",
]

PROMPT = """Generate 10 word pairs for an 18+ party game. Format: JSON array.

Rules:
- Words must be 80% similar, 20% different
- Suggestive NOT explicit
- No synonyms/antonyms

Examples:
{ "civilian": "Tinder", "undercover": "Grindr", "category": "Dating Apps" }
{ "civilian": "Strip Club", "undercover": "Brothel", "category": "Places" }
{ "civilian": "OnlyFans", "undercover": "Leaked", "category": "Digital" }
{ "civilian": "Threesome", "undercover": "Foursome", "category": "Group" }

Output ONLY JSON array:
[{ "civilian": "...", "undercover": "...", "category": "..." }, ...]"""

results = []

print("=" * 60)
print("GROQ MODEL COMPARISON")
print("=" * 60)

for i, model in enumerate(CHAT_MODELS, 1):
    print(f"\n[{i}/{len(CHAT_MODELS)}] {model}")
    print("-" * 40)
    
    start = time.time()
    try:
        completion = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": PROMPT}],
            temperature=0.7,
            max_tokens=1500
        )
        elapsed = time.time() - start
        response = completion.choices[0].message.content
        
        print(f"✓ SUCCESS in {elapsed:.2f}s")
        print(response[:1500])
        
        results.append({
            "model": model,
            "status": "SUCCESS",
            "time": round(elapsed, 2),
            "response": response
        })
    except Exception as e:
        elapsed = time.time() - start
        print(f"✗ ERROR: {str(e)[:100]}")
        results.append({
            "model": model,
            "status": "ERROR",
            "time": round(elapsed, 2),
            "error": str(e)[:200]
        })
    
    time.sleep(2)  # Rate limit buffer

# Save results
with open('groq_results.json', 'w') as f:
    json.dump(results, f, indent=2)

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)
success = [r for r in results if r['status'] == 'SUCCESS']
print(f"\nSuccessful: {len(success)}/{len(CHAT_MODELS)}")
if success:
    print("\nBy speed:")
    for r in sorted(success, key=lambda x: x['time']):
        print(f"  {r['model']}: {r['time']}s")
