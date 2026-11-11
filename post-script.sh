
#!/bin/bash

API_URL="http://localhost:4000/incidents"
TOTAL=10000
DELAY=0.01

SEVERITIES=("LOW" "MEDIUM" "HIGH" "CRITICAL")

echo "Starting incident seeding..."
echo "Total requests: $TOTAL"
echo "Delay: ${DELAY}s"
echo "--------------------------------"

for ((i=1; i<=TOTAL; i++)); do

    SEVERITY=${SEVERITIES[$((RANDOM % ${#SEVERITIES[@]}))]}
    TIMESTAMP=$(date +%s%N)
    TITLE="Test Incident #$i - $TIMESTAMP"
    DESCRIPTION="Automatically generated test incident number $i. Reference: $TIMESTAMP"

    RESPONSE=$(curl -sS -w "\n%{http_code}" \
        -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"title\": \"$TITLE\",
            \"severity\": \"$SEVERITY\",
            \"description\": \"$DESCRIPTION\"
        }")

    STATUS=$(echo "$RESPONSE" | tail -n 1)
    BODY=$(echo "$RESPONSE" | sed '$d')

    echo "[$i/$TOTAL] HTTP $STATUS | $SEVERITY"

    if [[ "$STATUS" != "201" ]]; then
        echo "Response: $BODY"
    fi

    if ((i < TOTAL)); then
        sleep "$DELAY"
    fi

done

echo "--------------------------------"
echo "Seeding completed!"

