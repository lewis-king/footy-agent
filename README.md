# FootyAgent

A responsive web application providing intelligent, data-driven insights for Premier League betting enthusiasts.

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
