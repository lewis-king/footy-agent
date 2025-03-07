# FootyAgent Backend

This is the backend service for FootyAgent, a Premier League betting intelligence platform. It provides APIs for fixture data and AI-generated betting analysis.

## Directory Structure

```
backend/
├── app/                 # Main application code
│   ├── app.py           # Flask application
│   └── routes/          # API route definitions
│       ├── fixtures.py  # Fixture data endpoints
│       └── analysis.py  # Analysis generation endpoints
├── data/                # Data storage
│   └── analysis/        # Generated analysis JSON files
├── tools/               # LLM and content generation tools
│   └── content_generator.py  # LangChain integration
├── utils/               # Utility functions
│   └── data_utils.py    # Data handling utilities
├── app.py               # Application entry point
├── requirements.txt     # Python dependencies
└── .env.example         # Environment variables template
```

## Setup Instructions

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` to add your Perplexity API key.

4. Run the application:
   ```bash
   python app.py
   ```

## API Endpoints

### Fixtures

- `GET /api/fixtures/` - Get all upcoming fixtures
- `GET /api/fixtures/?limit=5` - Get the next 5 upcoming fixtures
- `GET /api/fixtures/<fixture_id>` - Get a specific fixture by ID
- `POST /api/fixtures/refresh` - Refresh fixtures data (placeholder for MVP)

### Analysis

- `GET /api/analysis/<fixture_id>` - Get analysis for a specific fixture
- `POST /api/analysis/generate/<fixture_id>` - Generate analysis for a specific fixture
- `POST /api/analysis/batch-generate` - Generate analysis for multiple fixtures

## Development

For the MVP, sample fixture data is automatically created when running the application. In a production environment, this would be replaced with real data from external sources.

The content generation uses LangChain with Perplexity Sonar to create betting insights and analysis. Make sure you have a valid API key set in your `.env` file.
