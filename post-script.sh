#!/usr/bin/env bash

API_URL="${API_URL:-http://localhost:4000/incidents}"
TOTAL="${TOTAL:-25000}"
CONCURRENCY="${CONCURRENCY:-50}"
DELAY="${DELAY:-0}"
PROGRESS_EVERY="${PROGRESS_EVERY:-100}"

SEVERITIES=("LOW" "MEDIUM" "HIGH" "CRITICAL")
SERVICES=("payments" "authentication" "notifications" "search" "database" "web-frontend" "billing" "deployments")
SCENARIOS=(
    "Elevated latency"
    "Intermittent errors"
    "Capacity threshold exceeded"
    "Health check failing"
    "Queue backlog growing"
    "Dependency unavailable"
    "Unexpected restart"
    "Error rate increased"
)

if [[ ! "$TOTAL" =~ ^[1-9][0-9]*$ ]]; then
    echo "TOTAL must be a positive integer." >&2
    exit 1
fi

if [[ ! "$CONCURRENCY" =~ ^[1-9][0-9]*$ ]]; then
    echo "CONCURRENCY must be a positive integer." >&2
    exit 1
fi

if [[ ! "$PROGRESS_EVERY" =~ ^[1-9][0-9]*$ ]]; then
    echo "PROGRESS_EVERY must be a positive integer." >&2
    exit 1
fi

if [[ ! "$DELAY" =~ ^[0-9]+([.][0-9]+)?$ ]]; then
    echo "DELAY must be a non-negative number of seconds." >&2
    exit 1
fi

post_incident() {
    local index="$1"
    local severity="$2"
    local service="$3"
    local scenario="$4"
    local description="$5"
    local payload response status body curl_status

    printf -v payload \
        '{"title":"%s","severity":"%s","description":"%s"}' \
        "$service: $scenario #$index" "$severity" "$description"

    if response=$(curl --silent --show-error --write-out $'\n%{http_code}' \
        --request POST "$API_URL" \
        --header "Content-Type: application/json" \
        --data-binary "$payload"); then
        curl_status=0
    else
        curl_status=$?
    fi

    status="${response##*$'\n'}"
    body="${response%$'\n'*}"

    if ((curl_status != 0)) || [[ "$status" != "201" ]]; then
        printf '[%s/%s] FAILED | HTTP %s | %s\n' "$index" "$TOTAL" "${status:-000}" "$severity" >&2
        if [[ -n "$body" ]]; then
            printf 'Response: %s\n' "$body" >&2
        fi
        return 1
    fi

    if ((index % PROGRESS_EVERY == 0 || index == TOTAL)); then
        printf '[%s/%s] HTTP %s | %s | %s\n' "$index" "$TOTAL" "$status" "$severity" "$service"
    fi
}

echo "Starting incident seeding..."
echo "API: $API_URL"
echo "Total requests: $TOTAL"
echo "Concurrency: $CONCURRENCY"
echo "Delay between launches: ${DELAY}s"
echo "--------------------------------"

active=0
failures=0

for ((i = 1; i <= TOTAL; i++)); do
    severity="${SEVERITIES[$((RANDOM % ${#SEVERITIES[@]}))]}"
    service="${SERVICES[$((RANDOM % ${#SERVICES[@]}))]}"
    scenario="${SCENARIOS[$((RANDOM % ${#SCENARIOS[@]}))]}"
    description="Automated sample incident for $service: $scenario. Reference #$i."

    post_incident "$i" "$severity" "$service" "$scenario" "$description" &
    ((active += 1))

    if ((active >= CONCURRENCY)); then
        if ! wait -n; then
            ((failures += 1))
        fi
        ((active -= 1))
    fi

    if [[ "$DELAY" != "0" && "$DELAY" != "0.0" ]]; then
        sleep "$DELAY"
    fi
done

while ((active > 0)); do
    if ! wait -n; then
        ((failures += 1))
    fi
    ((active -= 1))
done

echo "--------------------------------"
if ((failures > 0)); then
    printf 'Seeding completed with %s failed request(s).\n' "$failures" >&2
    exit 1
fi

echo "Seeding completed successfully!"
