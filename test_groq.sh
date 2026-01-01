#!/bin/bash
# Test Groq models - simplified prompt without newlines

source .env
API_KEY="$EXPO_PUBLIC_GROQ_API_KEY"

MODELS=(
    "llama-3.1-8b-instant"
    "llama-3.3-70b-versatile"
    "meta-llama/llama-4-maverick-17b-128e-instruct"
    "meta-llama/llama-4-scout-17b-16e-instruct"
    "moonshotai/kimi-k2-instruct"
    "qwen/qwen3-32b"
)

# Single-line prompt to avoid JSON escaping issues
PROMPT="Generate 10 word pairs for an 18+ party game. Words must be 80% similar, 20% different. Suggestive not explicit. Examples: Tinder/Grindr, Strip Club/Brothel, OnlyFans/Leaked, Threesome/Foursome. Output ONLY JSON array: [{\"civilian\":\"...\",\"undercover\":\"...\",\"category\":\"...\"}]"

echo "=============================================="
echo "GROQ MODEL COMPARISON"
echo "=============================================="

for MODEL in "${MODELS[@]}"; do
    echo ""
    echo "MODEL: $MODEL"
    echo "----------------------------------------"
    
    START=$(date +%s.%N)
    
    RESPONSE=$(curl -s -X POST "https://api.groq.com/openai/v1/chat/completions" \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: application/json" \
        -d "{\"model\":\"$MODEL\",\"messages\":[{\"role\":\"user\",\"content\":\"$PROMPT\"}],\"temperature\":0.7,\"max_tokens\":1500}")
    
    END=$(date +%s.%N)
    ELAPSED=$(echo "$END - $START" | bc)
    
    if echo "$RESPONSE" | grep -q '"error"'; then
        ERROR=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error',{}).get('message','Unknown')[:100])" 2>/dev/null)
        echo "✗ ERROR (${ELAPSED}s): $ERROR"
    else
        echo "✓ SUCCESS (${ELAPSED}s)"
        echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['choices'][0]['message']['content'])" 2>/dev/null
    fi
    
    sleep 2
done

echo ""
echo "=============================================="
echo "DONE"
echo "=============================================="
