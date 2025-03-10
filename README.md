# FootyAgent

[![Netlify Status](https://api.netlify.com/api/v1/badges/d963e9a9-77c3-4cf8-9c0c-3f3d918aec77/deploy-status)](https://app.netlify.com/sites/unrivaled-sunflower-c87ded/deploys)

A responsive web application providing intelligent, data-driven insights for Premier League betting enthusiasts.

Hosted at [footyagent.ai](https://www.footyagent.ai)

![Spurs vs Bournemouth](images/spurs_vs_bournemouth.png)

[Chelsea vs Leicester](images/chelsea_vs_leicester.png)

[Man United vs Arsenal](images/manu_vs_arsenal.png)

## Project Structure

```
footyagent/
├── frontend/         # TypeScript web application
├── backend/          # Python backend using LangChain
└── data/             # Generated content and fixtures data
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## Features

- Interactive fixture carousel for upcoming Premier League matches
- AI-generated betting insights for each fixture
- Asian handicap advantage analysis
- Historical match data and team form information
- Unique content generation powered by LangChain and Perplexity Sonar

## Development Status

This project is currently in active development.

## Deployment

### Deploying to Netlify and Render

This application is configured for deployment with:

- Frontend: Netlify ([https://www.footyagent.ai](https://www.footyagent.ai))
- Backend: Render ([https://api.footyagent.ai](https://api.footyagent.ai))

#### Frontend Deployment (Netlify)

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Configure the build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Environment variables: Add `VITE_API_URL=https://api.footyagent.ai`
4. Deploy your site
5. Configure your custom domain (footyagent.ai) in Netlify settings

#### Backend Deployment (Render)

1. Push your code to GitHub
2. Create a new Web Service in Render
3. Connect your GitHub repository
4. Configure the service:
   - Name: footyagent-api
   - Environment: Python
   - Build Command: `pip install -r backend/requirements.txt`
   - Start Command: `cd backend && gunicorn app:app`
   - Add environment variables (OPENAI_API_KEY, etc.)
5. Deploy the service
6. Configure a custom subdomain (api.footyagent.ai) in Render settings

#### Domain Configuration

1. Purchase the domain (footyagent.ai) from a domain registrar
2. Configure DNS settings:
   - Point the root domain (footyagent.ai) to Netlify using their DNS instructions
   - Create a CNAME record for the subdomain (api.footyagent.ai) pointing to your Render service
3. Verify DNS propagation (may take up to 48 hours)

#### TLS/SSL Certificates

Both Netlify and Render provide automatic TLS certificate management using Let's Encrypt:

1. **Netlify (Frontend)**
   - Automatically provisions and renews Let's Encrypt certificates
   - Enforces HTTPS by default
   - Handles all certificate management without any manual intervention
   - Includes CDN with edge certificates

2. **Render (Backend)**
   - Automatically provisions and renews Let's Encrypt certificates
   - All services are served over HTTPS by default
   - Handles all certificate management without any manual intervention
   - Includes DDoS protection and global CDN

No manual certificate management is required - both platforms handle everything automatically once you've configured your custom domains.
