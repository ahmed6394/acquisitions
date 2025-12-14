#!/bin/bash

# Development startup script for Acquisition App with Neon Local
# This script starts the application in development mode with Neon Local

echo "🚀 Starting Acquisition App in Development Mode"
echo "================================================"

# Check if .env.development exists
if [ ! -f .env.development ]; then
    echo "❌ Error: .env.development file not found!"
    echo "   Please copy .env.development from the template and update with your Neon credentials."
    exit 1
fi

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    echo "   Please start Docker Desktop and try again."
    exit 1
fi

# Create .neon_local directory if it doesn't exist
mkdir -p .neon_local

# Add .neon_local to .gitignore if not already present
if ! grep -q ".neon_local/" .gitignore 2>/dev/null; then
    echo ".neon_local/" >> .gitignore
fi

# Stop and remove acquisitions-neon-local container if exists
if docker ps -a --format '{{.Names}}' | grep -q "^acquisitions-neon-local$"; then
    echo "   Removing acquisitions-neon-local container..."
    docker stop acquisitions-neon-local 2>/dev/null
    docker rm acquisitions-neon-local 2>/dev/null
fi

# Stop and remove acquisitions-app-dev container if exists
if docker ps -a --format '{{.Names}}' | grep -q "^acquisitions-app-dev$"; then
    echo "   Removing acquisitions-app-dev container..."
    docker stop acquisitions-app-dev 2>/dev/null
    docker rm acquisitions-app-dev 2>/dev/null
fi

# Clean up any existing compose containers (with orphans)
docker compose -f docker-compose.dev.yml down --remove-orphans 2>/dev/null

# Check if acquisitions-neon-local image exists
if docker images -q acquisitions-neon-local 2>/dev/null | grep -q .; then
    echo "✅ acquisitions-neon-local image found."
    
    # Check if acquisitions-app-dev image exists
    if docker images --format '{{.Repository}}' | grep -q "acquisitions-app-dev"; then
        echo "✅ acquisitions-app-dev image found. Starting containers..."
        docker compose -f docker-compose.dev.yml up -d
    else
        echo "📦 acquisitions-app-dev image not found. Building app and starting..."
        docker compose -f docker-compose.dev.yml up --build -d
    fi
else
    echo "📦 acquisitions-neon-local image not found. Building all images..."
    docker compose -f docker-compose.dev.yml up --build -d
fi
