#!/bin/bash

# SaaS Client Removal Script
# Usage: ./remove-client.sh CLIENT_NAME

set -e

CLIENT_NAME=$1

if [ -z "$CLIENT_NAME" ]; then
    echo "Usage: $0 CLIENT_NAME"
    echo "Example: $0 VDC"
    exit 1
fi

echo "🗑️  Removing HRMS deployment for client: $CLIENT_NAME"

CLIENT_DIR="deployments/$CLIENT_NAME"

if [ ! -d "$CLIENT_DIR" ]; then
    echo "❌ Client deployment directory not found: $CLIENT_DIR"
    exit 1
fi

# Stop and remove containers
cd "$CLIENT_DIR"
echo "🛑 Stopping Docker containers..."
docker-compose down --volumes --remove-orphans

# Remove Docker images
echo "🧹 Removing Docker images..."
docker rmi "${CLIENT_NAME,,}-hrms_${CLIENT_NAME,,}-hrms" 2>/dev/null || true

# Remove deployment directory
cd ../../
echo "📁 Removing deployment directory..."
rm -rf "$CLIENT_DIR"

echo "✅ Client $CLIENT_NAME HRMS deployment removed successfully!"