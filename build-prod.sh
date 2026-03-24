#!/bin/bash
set -e

echo "Building application..."
npm run build

echo "Pushing database schema..."
npm run db:push

echo "Build complete!"
