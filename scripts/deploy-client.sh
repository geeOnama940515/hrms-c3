#!/bin/bash

# SaaS Client Deployment Script
# Usage: ./deploy-client.sh CLIENT_NAME SUBDOMAIN [PORT]

set -e

CLIENT_NAME=$1
SUBDOMAIN=$2
PORT=${3:-3000}

if [ -z "$CLIENT_NAME" ] || [ -z "$SUBDOMAIN" ]; then
    echo "Usage: $0 CLIENT_NAME SUBDOMAIN [PORT]"
    echo "Example: $0 VDC vdc-hrms 3001"
    exit 1
fi

echo "🚀 Deploying HRMS for client: $CLIENT_NAME"
echo "📍 Subdomain: $SUBDOMAIN"
echo "🔌 Port: $PORT"

# Create client-specific directory
CLIENT_DIR="deployments/$CLIENT_NAME"
mkdir -p "$CLIENT_DIR"

# Generate client-specific docker-compose file
cat > "$CLIENT_DIR/docker-compose.yml" << EOF
version: '3.8'

services:
  ${CLIENT_NAME,,}-hrms:
    build: 
      context: ../../
      args:
        NEXT_PUBLIC_APP_BRAND_PREFIX: $CLIENT_NAME
        NEXT_PUBLIC_API_URL: https://$SUBDOMAIN.yourdomain.com
    container_name: ${CLIENT_NAME,,}-hrms
    ports:
      - "$PORT:3000"
    environment:
      - NEXT_PUBLIC_APP_BRAND_PREFIX=$CLIENT_NAME
      - NEXT_PUBLIC_API_URL=https://$SUBDOMAIN.yourdomain.com
    restart: unless-stopped
    networks:
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${CLIENT_NAME,,}-hrms.rule=Host(\`$SUBDOMAIN.yourdomain.com\`)"
      - "traefik.http.routers.${CLIENT_NAME,,}-hrms.tls=true"
      - "traefik.http.routers.${CLIENT_NAME,,}-hrms.tls.certresolver=letsencrypt"
      - "traefik.http.services.${CLIENT_NAME,,}-hrms.loadbalancer.server.port=3000"

networks:
  proxy:
    external: true
EOF

# Generate client-specific environment file
cat > "$CLIENT_DIR/.env" << EOF
NEXT_PUBLIC_APP_BRAND_PREFIX=$CLIENT_NAME
NEXT_PUBLIC_API_URL=https://$SUBDOMAIN.yourdomain.com
CONTAINER_NAME=${CLIENT_NAME,,}-hrms
DOMAIN=$SUBDOMAIN.yourdomain.com
PORT=$PORT
EOF

echo "📁 Created deployment files in $CLIENT_DIR"

# Deploy the container
cd "$CLIENT_DIR"
echo "🐳 Building and starting Docker container..."
docker-compose up -d --build

echo "✅ Deployment completed!"
echo "🌐 Application will be available at: https://$SUBDOMAIN.yourdomain.com"
echo "📊 Container name: ${CLIENT_NAME,,}-hrms"
echo "🔧 Port: $PORT"

# Optional: Add DNS record via Cloudflare API
if [ ! -z "$CLOUDFLARE_TOKEN" ] && [ ! -z "$CLOUDFLARE_ZONE_ID" ]; then
    echo "🌍 Adding DNS record to Cloudflare..."
    curl -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
        -H "Content-Type: application/json" \
        --data "{
            \"type\": \"CNAME\",
            \"name\": \"$SUBDOMAIN\",
            \"content\": \"your-server.yourdomain.com\",
            \"ttl\": 1
        }" > /dev/null
    echo "✅ DNS record added"
fi

echo ""
echo "🎉 Client $CLIENT_NAME HRMS deployment completed successfully!"