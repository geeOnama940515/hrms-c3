#!/bin/bash

# Deploy HRMS instance via Portainer API
# Usage: ./deploy-via-portainer.sh CLIENT_NAME SUBDOMAIN PORT

set -e

CLIENT_NAME=$1
SUBDOMAIN=$2
PORT=${3:-3001}
PORTAINER_URL=${PORTAINER_URL:-"http://localhost:9000"}
PORTAINER_TOKEN=${PORTAINER_TOKEN:-""}

if [ -z "$CLIENT_NAME" ] || [ -z "$SUBDOMAIN" ] || [ -z "$PORTAINER_TOKEN" ]; then
    echo "Usage: $0 CLIENT_NAME SUBDOMAIN PORT"
    echo "Environment variables required:"
    echo "  PORTAINER_URL (default: http://localhost:9000)"
    echo "  PORTAINER_TOKEN (required)"
    echo ""
    echo "Example:"
    echo "  export PORTAINER_TOKEN='your-jwt-token'"
    echo "  $0 VDC vdc-hrms 3001"
    exit 1
fi

STACK_NAME="${CLIENT_NAME,,}-hrms"
DOMAIN="$SUBDOMAIN.yourdomain.com"

echo "🚀 Deploying HRMS for client: $CLIENT_NAME"
echo "📦 Stack name: $STACK_NAME"
echo "🌐 Domain: $DOMAIN"
echo "🔌 Port: $PORT"

# Get endpoint ID
ENDPOINTS=$(curl -s -H "Authorization: Bearer $PORTAINER_TOKEN" "$PORTAINER_URL/api/endpoints")
ENDPOINT_ID=$(echo $ENDPOINTS | jq -r '.[0].Id')

# Prepare docker-compose content
COMPOSE_CONTENT=$(cat << EOF
version: '3.8'

services:
  hrms:
    build: 
      context: .
      args:
        NEXT_PUBLIC_APP_BRAND_PREFIX: $CLIENT_NAME
        NEXT_PUBLIC_API_URL: https://$DOMAIN
    container_name: $STACK_NAME
    ports:
      - "$PORT:3000"
    environment:
      - NEXT_PUBLIC_APP_BRAND_PREFIX=$CLIENT_NAME
      - NEXT_PUBLIC_API_URL=https://$DOMAIN
    restart: unless-stopped
    networks:
      - hrms-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.$STACK_NAME.rule=Host(\`$DOMAIN\`)"
      - "traefik.http.services.$STACK_NAME.loadbalancer.server.port=3000"
      - "hrms.client=$CLIENT_NAME"
      - "hrms.type=saas-instance"

networks:
  hrms-network:
    driver: bridge
EOF
)

# Deploy stack
STACK_PAYLOAD=$(cat << EOF
{
  "Name": "$STACK_NAME",
  "ComposeFile": "$(echo "$COMPOSE_CONTENT" | sed 's/"/\\"/g' | tr '\n' ' ')",
  "Env": [
    {
      "name": "NEXT_PUBLIC_APP_BRAND_PREFIX",
      "value": "$CLIENT_NAME"
    },
    {
      "name": "NEXT_PUBLIC_API_URL",
      "value": "https://$DOMAIN"
    },
    {
      "name": "CONTAINER_NAME", 
      "value": "$STACK_NAME"
    },
    {
      "name": "DOMAIN",
      "value": "$DOMAIN"
    },
    {
      "name": "PORT",
      "value": "$PORT"
    }
  ]
}
EOF
)

echo "📤 Deploying stack to Portainer..."

DEPLOY_RESPONSE=$(curl -s -X POST "$PORTAINER_URL/api/stacks?type=2&method=string&endpointId=$ENDPOINT_ID" \
    -H "Authorization: Bearer $PORTAINER_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$STACK_PAYLOAD")

STACK_ID=$(echo $DEPLOY_RESPONSE | jq -r '.Id')

if [ "$STACK_ID" != "null" ] && [ -n "$STACK_ID" ]; then
    echo "✅ Stack deployed successfully!"
    echo "📊 Stack ID: $STACK_ID"
    echo "🌐 URL: https://$DOMAIN"
    echo "🔌 Port: $PORT"
    echo "📦 Container: $STACK_NAME"
else
    echo "❌ Failed to deploy stack"
    echo "Response: $DEPLOY_RESPONSE"
    exit 1
fi

echo ""
echo "🎉 $CLIENT_NAME HRMS instance deployed successfully!"
echo "🔗 Access it at: https://$DOMAIN"