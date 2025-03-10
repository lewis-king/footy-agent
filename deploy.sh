#!/bin/bash

# FootyAgent Deployment Script
# This script helps prepare the application for deployment to Netlify and Render

echo "🚀 Preparing FootyAgent for deployment..."

# Build the frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "✅ Frontend build complete!"

# Create a deployment package for the backend
echo "📦 Creating backend deployment package..."
cd backend

# Ensure all dependencies are in requirements.txt
pip freeze > requirements.txt.new
echo "📋 Checking for missing dependencies..."
diff requirements.txt requirements.txt.new
mv requirements.txt.new requirements.txt

echo "✅ Backend preparation complete!"
cd ..

echo "🔍 Deployment preparation finished!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Set up Netlify for the frontend:"
echo "   - Connect your GitHub repository"
echo "   - Build command: cd frontend && npm install && npm run build"
echo "   - Publish directory: frontend/dist"
echo "   - Add environment variable: VITE_API_URL=https://api.footyagent.ai"
echo ""
echo "3. Set up Render for the backend:"
echo "   - Create a new Web Service"
echo "   - Connect your GitHub repository"
echo "   - Build command: pip install -r backend/requirements.txt"
echo "   - Start command: cd backend && gunicorn app:app"
echo "   - Add your environment variables (OPENAI_API_KEY, etc.)"
echo ""
echo "4. Configure your domain (footyagent.ai):"
echo "   - Point the root domain to Netlify"
echo "   - Create a CNAME record for 'api' subdomain pointing to Render"
echo ""
echo "For detailed instructions, refer to the README.md"
