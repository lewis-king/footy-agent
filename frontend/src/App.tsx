import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FixtureCarousel from './components/FixtureCarousel';
import AnalysisContent from './components/AnalysisContent';
import GameweekCarousel from './components/GameweekCarousel';
import FplContent from './components/FplContent';
import Header from './components/Header';
import CompetitionSelector, { Competition } from './components/CompetitionSelector';
import { Fixture, Analysis, Gameweek, FplAnalysis } from './types/fixtures';
import { fetchFixtures, fetchFixtureAnalysis } from './services/fixtureService';
import { fetchGameweeks, fetchGameweekContent, generateGameweekContent } from './services/fplService';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(to bottom, var(--background-color) 0%, #ffffff 100%);
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: var(--card-background);
  border-radius: var(--card-radius);
  box-shadow: 0 8px 16px var(--shadow-color);
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 4px solid rgba(56, 0, 60, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--accent-color);
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  color: var(--primary-color);
  font-size: 1.1rem;
  font-weight: 500;
`;

const EmptyStateContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: var(--card-background);
  border-radius: var(--card-radius);
  box-shadow: 0 8px 16px var(--shadow-color);
`;

const EmptyStateText = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  background-color: #ffebee;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 1rem;
`;

const App: React.FC = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState<'preview' | 'fpl'>('preview');

  // Competition state
  const [competitions] = useState<Competition[]>([
    {
      id: 'premier-league',
      name: 'Premier League',
      logo: 'https://resources.premierleague.com/premierleague/competitions/competition_1_small.png'
    },
    {
      id: 'champions-league',
      name: 'Champions League',
      logo: 'https://img.uefa.com/imgml/uefacom/ucl/2021/logos/logo_dark.svg'
    }
  ]);
  const [selectedCompetition, setSelectedCompetition] = useState<string>('premier-league');

  // Preview tab state
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [fixtureAnalysis, setFixtureAnalysis] = useState<Analysis | null>(null);
  
  // FPL tab state
  const [gameweeks, setGameweeks] = useState<Gameweek[]>([]);
  const [selectedGameweek, setSelectedGameweek] = useState<Gameweek | null>(null);
  const [fplAnalysis, setFplAnalysis] = useState<FplAnalysis | null>(null);
  
  // Shared state
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Load data based on active tab
    if (activeTab === 'preview') {
      loadFixtures();
    } else {
      loadGameweeks();
    }
  }, [activeTab, selectedCompetition]);

  const loadFixtures = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const upcomingFixtures = await fetchFixtures(selectedCompetition);
      setFixtures(upcomingFixtures);
      
      // Find the next upcoming fixture based on current time
      const now = new Date();
      const nextFixture = upcomingFixtures
        .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime())
        .find(fixture => new Date(fixture.kickoff) > now);
      
      // Set next fixture as selected by default if available, otherwise use the first fixture
      if (nextFixture) {
        setSelectedFixture(nextFixture);
      } else if (upcomingFixtures.length > 0) {
        setSelectedFixture(upcomingFixtures[0]);
      } else {
        setSelectedFixture(null);
        setFixtureAnalysis(null);
      }
    } catch (error) {
      console.error('Error loading fixtures:', error);
      setErrorMessage('Failed to load fixtures. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadGameweeks = async () => {
    setLoading(true);
    try {
      // Fetch gameweeks from the API
      const upcomingGameweeks = await fetchGameweeks();
      setGameweeks(upcomingGameweeks);
      
      // Set the first gameweek as selected by default if available
      if (upcomingGameweeks.length > 0) {
        setSelectedGameweek(upcomingGameweeks[0]);
      }
    } catch (error) {
      console.error('Error loading gameweeks:', error);
      setErrorMessage('Failed to load gameweeks. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load content for selected fixture
    const loadFixtureContent = async () => {
      if (!selectedFixture) return;
      
      setLoading(true);
      try {
        // Also fetch analysis data
        try {
          const analysis = await fetchFixtureAnalysis(selectedFixture.id);
          setFixtureAnalysis(analysis);
        } catch (analysisError) {
          console.error('Error loading fixture analysis:', analysisError);
          setFixtureAnalysis(null);
        }
      } catch (error) {
        console.error('Error loading fixture content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'preview' && selectedFixture) {
      loadFixtureContent();
    }
  }, [selectedFixture, activeTab]);

  useEffect(() => {
    // Load content for selected gameweek
    const loadGameweekContent = async () => {
      if (!selectedGameweek) return;
      
      setLoading(true);
      try {
        // Try to fetch existing content first
        try {
          const content = await fetchGameweekContent(selectedGameweek.id);
          setFplAnalysis(content);
        } catch (error) {
          // If content doesn't exist and this is an upcoming gameweek, generate it automatically
          if (selectedGameweek.status === 'upcoming') {
            try {
              const content = await generateGameweekContent(selectedGameweek.id);
              setFplAnalysis(content);
              
              // Update the gameweek in the list to show it has content
              setGameweeks(gameweeks.map(gw => 
                gw.id === selectedGameweek.id ? { ...gw, content_generated: true } : gw
              ));
            } catch (genError) {
              console.error('Error generating gameweek content:', genError);
              setErrorMessage('Failed to generate FPL content. Please try again later.');
              setFplAnalysis(null);
            }
          } else {
            // For completed gameweeks without content, just set to null
            setFplAnalysis(null);
          }
        }
      } catch (error) {
        console.error('Error loading gameweek content:', error);
        setFplAnalysis(null);
      } finally {
        setLoading(false);
      }
    };
    
    if (activeTab === 'fpl' && selectedGameweek) {
      loadGameweekContent();
    }
  }, [selectedGameweek, activeTab, gameweeks]);

  const handleFixtureSelect = (fixture: Fixture) => {
    setSelectedFixture(fixture);
  };

  const handleGameweekSelect = (gameweek: Gameweek) => {
    setSelectedGameweek(gameweek);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as 'preview' | 'fpl');
  };
  
  const handleCompetitionSelect = (competitionId: string) => {
    if (competitionId !== selectedCompetition) {
      setSelectedCompetition(competitionId);
      setSelectedFixture(null);
      setFixtureAnalysis(null);
    }
  };

  return (
    <AppContainer>
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <MainContent className="container">
        {activeTab === 'preview' ? (
          // Preview Tab Content
          <>
            <CompetitionSelector 
              competitions={competitions} 
              selectedCompetition={selectedCompetition}
              onSelectCompetition={handleCompetitionSelect}
            />
            
            <FixtureCarousel 
              fixtures={fixtures} 
              selectedFixture={selectedFixture}
              onSelectFixture={handleFixtureSelect}
            />
            
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading football insights...</LoadingText>
              </LoadingContainer>
            ) : (
              selectedFixture && fixtureAnalysis && (
                <AnalysisContent
                  analysis={fixtureAnalysis}
                />
              )
            )}
          </>
        ) : (
          // FPL Tab Content
          <>
            <GameweekCarousel 
              gameweeks={gameweeks} 
              selectedGameweek={selectedGameweek}
              onSelectGameweek={handleGameweekSelect}
            />
            
            {loading ? (
              <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading FPL content...</LoadingText>
              </LoadingContainer>
            ) : (
              selectedGameweek && fplAnalysis ? (
                <FplContent 
                  gameweek={selectedGameweek}
                  analysis={fplAnalysis}
                />
              ) : (
                <EmptyStateContainer>
                  {selectedGameweek ? (
                    <>
                      <EmptyStateText>No FPL content available for this gameweek.</EmptyStateText>
                    </>
                  ) : (
                    <EmptyStateText>Select a gameweek to view FPL insights</EmptyStateText>
                  )}
                </EmptyStateContainer>
              )
            )}
          </>
        )}
        {errorMessage && (
          <ErrorMessage>
            {errorMessage}
          </ErrorMessage>
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;
