#!/bin/bash

# Portainer API Integration Script
# This script can duplicate containers in Portainer and modify their settings

PORTAINER_URL="http://your-portainer:9000"
PORTAINER_TOKEN="your-portainer-jwt-token"
TEMPLATE_STACK_NAME="vmis-hrms-template"

deploy_via_portainer() {
    local CLIENT_NAME=$1
    local SUBDOMAIN=$2
    local PORT=$3
    
    echo "🐳 Deploying via Portainer API..."
    
    # 1. Get template stack
    TEMPLATE_STACK=$(curl -s -H "Authorization: Bearer $PORTAINER_TOKEN" \
        "$PORTAINER_URL/api/stacks" | jq -r ".[] | select(.Name == \"$TEMPLATE_STACK_NAME\")")
    
    if [ "$TEMPLATE_STACK" == "null" ]; then
        echo "❌ Template stack not found: $TEMPLATE_STACK_NAME"
        exit 1
    fi
    
    # 2. Create new stack from template
    NEW_STACK_NAME="${CLIENT_NAME,,}-hrms"
    
    # 3. Prepare environment variables
    ENV_VARS=$(cat << EOF
[
    {
        "name": "NEXT_PUBLIC_APP_BRAND_PREFIX",
        "value": "$CLIENT_NAME"
    },
    {
        "name": "NEXT_PUBLIC_API_URL", 
        "value": "https://$SUBDOMAIN.yourdomain.com"
    },
    {
        "name": "CONTAINER_NAME",
        "value": "$NEW_STACK_NAME"
    },
    {
        "name": "PORT",
        "value": "$PORT"
    }
]
EOF
)
    
    # 4. Deploy new stack
    curl -X POST \
        -H "Authorization: Bearer $PORTAINER_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"Name\": \"$NEW_STACK_NAME\",
            \"SwarmID\": \"\",
            \"ComposeFile\": \"$(cat docker-compose.yml | sed 's/"/\\"/g' | tr '\n' ' ')\",
            \"Env\": $ENV_VARS
        }" \
        "$PORTAINER_URL/api/stacks?type=2&method=string&endpointId=1"
    
    echo "✅ Stack deployed: $NEW_STACK_NAME"
}

# Usage
if [ $# -eq 3 ]; then
    deploy_via_portainer "$1" "$2" "$3"
else
    echo "Usage: $0 CLIENT_NAME SUBDOMAIN PORT"
    echo "Example: $0 VDC vdc-hrms 3001"
fi