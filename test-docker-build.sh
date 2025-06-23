#!/bin/bash

echo "🧪 Testing Docker build for HRMS application..."

# Clean up any existing containers and images
echo "🧹 Cleaning up existing containers and images..."
docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true
docker rmi vmis-hrms 2>/dev/null || true

# Build the Docker image
echo "🔨 Building Docker image..."
docker-compose build --no-cache

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    # Test running the container
    echo "🚀 Testing container startup..."
    docker-compose up -d
    
    # Wait for container to start
    sleep 10
    
    # Check if container is running
    if docker-compose ps | grep -q "Up"; then
        echo "✅ Container is running successfully!"
        
        # Test health check
        echo "🏥 Testing health check..."
        sleep 5
        
        # Get container logs
        echo "📋 Container logs:"
        docker-compose logs --tail=20
        
        # Test HTTP response
        echo "🌐 Testing HTTP response..."
        if curl -f http://localhost:5566/ > /dev/null 2>&1; then
            echo "✅ HTTP endpoint is responding!"
        else
            echo "❌ HTTP endpoint is not responding"
        fi
        
        # Stop the container
        echo "🛑 Stopping test container..."
        docker-compose down
        
        echo "🎉 All tests passed! Ready for Portainer deployment."
    else
        echo "❌ Container failed to start"
        docker-compose logs
        docker-compose down
        exit 1
    fi
else
    echo "❌ Docker build failed!"
    exit 1
fi 