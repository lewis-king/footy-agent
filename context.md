# FootyAgent - Premier League Betting Intelligence Platform

## Project Overview

FootyAgent is a responsive web application focused on providing intelligent, data-driven insights for football (soccer) betting enthusiasts. The platform aggregates, analyzes, and presents comprehensive fixture-specific content to empower users with informed betting decisions, particularly for Premier League matches.

## Target Audience

- Sports betting enthusiasts
- Football analytics fans
- Premier League followers
- Casual and serious bettors looking for an edge

## Core Features

### Home Page
- Modern, responsive design optimized for all devices
- Interactive fixture carousel for upcoming Premier League matches
- Real-time match selection with dynamic content loading
- Visually appealing UI with team colors and branding

### Fixture Analysis
- Comprehensive match analysis for each upcoming fixture
- Custom-generated fixture imagery
- Asian handicap advantage analysis
- Form guides and team news
- Historical head-to-head statistics
- Key player matchups and impact assessments
- Injury reports and expected lineup implications
- Betting market trends and movement analysis

### Content Generation
- AI-powered content creation using LangChain and Perplexity Sonar
- Web scraping of reliable sources for the latest information
- Unique, engaging content differing from traditional betting sites
- Natural language generation focused on betting insights
- Dynamic content refresh for the latest information

## Technical Architecture

### Frontend
- TypeScript-based SPA (Single Page Application)
- Modern UI framework (React/Vue/Angular TBD)
- Responsive design using CSS frameworks
- Interactive fixture carousel component
- Dynamic content loading

### Backend
- Python-based API service
- LangChain framework for orchestrating LLM operations
- Integration with Perplexity Sonar and potentially other LLMs
- Web scraping tools for gathering fixture data
- Content generation pipeline
- Caching system for generated content

### Data Management
- Initial implementation: Local JSON storage
  - Structured data for fixtures
  - Generated content and images
  - Betting insights and statistics
- Future implementation: Database storage
  - Migration path from JSON to persistent database
  - Improved query capabilities
  - Historical data retention

## Development Phases

### Phase 1: MVP
- Basic frontend with fixture carousel
- Initial backend implementation with LangChain
- Content generation for Premier League fixtures
- Local JSON storage
- Fundamental betting insights

### Phase 2: Enhanced Features
- Improved UI/UX with advanced visualizations
- Extended content generation capability
- More sophisticated betting insights
- Additional statistics and analysis

### Phase 3: Expansion
- Support for additional football leagues
- Database implementation
- User accounts and preferences
- Additional LLM integrations

## Content Generation Pipeline

1. **Fixture Identification**
   - Determine upcoming fixtures
   - Check if content already exists in local storage

2. **Data Collection**
   - Web scraping for team news, injuries, form
   - Historical match data collection
   - Current betting odds aggregation

3. **Analysis Generation**
   - LangChain orchestration of multiple tools
   - Perplexity Sonar queries for insights
   - Asian handicap advantage calculation
   - Formation and tactical analysis

4. **Content Creation**
   - Natural language generation of engaging content
   - Fixture-specific imagery generation
   - Formatting and structuring for presentation

5. **Storage and Presentation**
   - JSON storage of generated content
   - Efficient retrieval for frontend display
   - Caching strategy for performance

## Unique Value Proposition

FootyAgent differentiates itself through:

1. **Focus on Asian Handicap** - Specialized analysis often overlooked by mainstream sites
2. **AI-Generated Insights** - Leveraging cutting-edge LLMs for unique perspectives
3. **Comprehensive Data Integration** - Combining multiple data sources for holistic analysis
4. **User-Centric Design** - Intuitive interface focused on quick information access
5. **Engaging Content Style** - Moving beyond dry statistics to compelling narratives

## Initial Implementation Scope

For the MVP, we will focus exclusively on Premier League fixtures with:
- 10 most recent fixtures displayed in carousel
- Generation of ~1000 words of content per fixture
- 3-5 key betting insights highlighted per match
- Basic team statistics and form guide
- Simple JSON data structure for storage
