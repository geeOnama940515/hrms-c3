#!/bin/bash

# Portainer Template Setup Script
# This script helps you set up the HRMS template in Portainer

set -e

PORTAINER_URL=${1:-"http://localhost:9000"}
PORTAINER_USERNAME=${2:-"admin"}
PORTAINER_PASSWORD=${3:-""}

if [ -z "$PORTAINER_PASSWORD" ]; then
    echo "Usage: $0 PORTAINER_URL PORTAINER_USERNAME PORTAINER_PASSWORD"
    echo "Example: $0 http://localhost:9000 admin mypassword"
    exit 1
fi

echo "🐳 Setting up HRMS template in Portainer..."

# 1. Login to Portainer and get JWT token
echo "🔐 Authenticating with Portainer..."
TOKEN_RESPONSE=$(curl -s -X POST "$PORTAINER_URL/api/auth" \
    -H "Content-Type: application/json" \
    -d "{\"Username\":\"$PORTAINER_USERNAME\",\"Password\":\"$PORTAINER_PASSWORD\"}")

JWT_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.jwt')

if [ "$JWT_TOKEN" == "null" ] || [ -z "$JWT_TOKEN" ]; then
    echo "❌ Failed to authenticate with Portainer"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo "✅ Authentication successful"

# 2. Get endpoint ID (usually 1 for local Docker)
ENDPOINTS=$(curl -s -H "Authorization: Bearer $JWT_TOKEN" "$PORTAINER_URL/api/endpoints")
ENDPOINT_ID=$(echo $ENDPOINTS | jq -r '.[0].Id')

echo "📍 Using endpoint ID: $ENDPOINT_ID"

# 3. Create custom template
echo "📋 Creating HRMS template..."

TEMPLATE_PAYLOAD=$(cat << 'EOF'
{
  "type": 3,
  "title": "VMIS-HRMS SaaS Instance",
  "description": "Dynamic HRMS system with vendor management capabilities. Perfect for SaaS deployment with custom branding per client.",
  "note": "⚠️ Make sure to customize the environment variables for each client deployment. Each instance should have a unique container name and port.",
  "categories": ["SaaS", "HRMS", "Business", "Management"],
  "platform": "linux",
  "logo": "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/building-2.svg",
  "repository": {
    "url": "https://github.com/your-username/hrms-template",
    "stackfile": "docker-compose.portainer.yml"
  },
  "env": [
    {
      "name": "NEXT_PUBLIC_APP_BRAND_PREFIX",
      "label": "🏢 Company Brand Prefix",
      "description": "Company name/code that will appear throughout the UI (e.g., VDC, ABC, XYZ). This creates the branded experience.",
      "default": "VMIS",
      "preset": false
    },
    {
      "name": "NEXT_PUBLIC_API_URL", 
      "label": "🌐 API URL",
      "description": "Full URL where the application will be accessible (e.g., https://vdc-hrms.yourdomain.com)",
      "default": "http://localhost:3000",
      "preset": false
    },
    {
      "name": "CONTAINER_NAME",
      "label": "📦 Container Name",
      "description": "Unique name for this container instance (e.g., vdc-hrms, abc-hrms)",
      "default": "vmis-hrms",
      "preset": false
    },
    {
      "name": "DOMAIN",
      "label": "🔗 Domain Name", 
      "description": "Domain where the application will be accessible (for Traefik routing)",
      "default": "localhost",
      "preset": false
    },
    {
      "name": "PORT",
      "label": "🔌 External Port",
      "description": "Port to expose the application on (must be unique per instance)",
      "default": "3000",
      "preset": false
    }
  ]
}
EOF
)

TEMPLATE_RESPONSE=$(curl -s -X POST "$PORTAINER_URL/api/templates" \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d "$TEMPLATE_PAYLOAD")

TEMPLATE_ID=$(echo $TEMPLATE_RESPONSE | jq -r '.Id')

if [ "$TEMPLATE_ID" != "null" ] && [ -n "$TEMPLATE_ID" ]; then
    echo "✅ Template created successfully with ID: $TEMPLATE_ID"
else
    echo "❌ Failed to create template"
    echo "Response: $TEMPLATE_RESPONSE"
    exit 1
fi

echo ""
echo "🎉 HRMS template setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Go to Portainer → App Templates"
echo "2. Find 'VMIS-HRMS SaaS Instance' template"
echo "3. Click 'Deploy the stack'"
echo "4. Customize environment variables for each client:"
echo "   - NEXT_PUBLIC_APP_BRAND_PREFIX: Client company code (e.g., VDC)"
echo "   - CONTAINER_NAME: Unique name (e.g., vdc-hrms)"
echo "   - PORT: Unique port (e.g., 3001)"
echo "   - DOMAIN: Client subdomain (e.g., vdc-hrms.yourdomain.com)"
echo ""
echo "🚀 Each deployment will create a fully branded HRMS instance!"