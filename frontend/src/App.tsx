import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FixtureCarousel from './components/FixtureCarousel';
import FixtureContent from './components/FixtureContent';
import AnalysisContent from './components/AnalysisContent';
import Header from './components/Header';
import { Fixture, Analysis } from './types/fixtures';
import { fetchFixtures, fetchFixtureContent, fetchFixtureAnalysis } from './services/fixtureService';

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

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(to right, var(--primary-color), var(--accent-color));
    opacity: 0.5;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? 'var(--primary-color)' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all var(--transition-speed) ease;
  position: relative;
  z-index: 1;
  
  &:hover {
    color: var(--primary-color);
  }
  
  &:after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 3px;
    background-color: var(--accent-color);
    transition: width var(--transition-speed) ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const ContentContainer = styled.div`
  background-color: var(--card-background);
  border-radius: var(--card-radius);
  box-shadow: 0 8px 16px var(--shadow-color);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: all var(--transition-speed) ease;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
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

const App: React.FC = () => {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [fixtureContent, setFixtureContent] = useState<any>(null);
  const [fixtureAnalysis, setFixtureAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'analysis'>('preview');

  useEffect(() => {
    // Load upcoming fixtures on component mount
    const loadFixtures = async () => {
      try {
        const upcomingFixtures = await fetchFixtures();
        setFixtures(upcomingFixtures);
        
        // Set first fixture as selected by default if available
        if (upcomingFixtures.length > 0) {
          setSelectedFixture(upcomingFixtures[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading fixtures:', error);
        setLoading(false);
      }
    };
    
    loadFixtures();
  }, []);

  useEffect(() => {
    // Load content for selected fixture
    const loadFixtureContent = async () => {
      if (!selectedFixture) return;
      
      setLoading(true);
      try {
        const content = await fetchFixtureContent(selectedFixture.id);
        setFixtureContent(content);
        
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
        setFixtureContent(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadFixtureContent();
  }, [selectedFixture]);

  const handleFixtureSelect = (fixture: Fixture) => {
    setSelectedFixture(fixture);
  };

  return (
    <AppContainer>
      <Header />
      <MainContent className="container">
        <FixtureCarousel 
          fixtures={fixtures} 
          selectedFixture={selectedFixture}
          onSelectFixture={handleFixtureSelect}
        />
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <LoadingText>Loading fixture content...</LoadingText>
          </LoadingContainer>
        ) : (
          selectedFixture && (fixtureContent || fixtureAnalysis) ? (
            <>
              <TabContainer>
                <Tab 
                  active={activeTab === 'preview'} 
                  onClick={() => setActiveTab('preview')}
                >
                  Preview
                </Tab>
                <Tab 
                  active={activeTab === 'analysis'} 
                  onClick={() => setActiveTab('analysis')}
                >
                  Analysis
                </Tab>
              </TabContainer>
              
              <ContentContainer>
                {activeTab === 'preview' && fixtureContent ? (
                  <FixtureContent 
                    fixture={selectedFixture}
                    content={fixtureContent}
                  />
                ) : activeTab === 'analysis' && fixtureAnalysis ? (
                  <AnalysisContent 
                    fixture={selectedFixture}
                    analysis={fixtureAnalysis}
                  />
                ) : (
                  <EmptyStateText>Content not available for the selected tab</EmptyStateText>
                )}
              </ContentContainer>
            </>
          ) : (
            <EmptyStateContainer>
              <EmptyStateText>Select a fixture to view detailed betting insights</EmptyStateText>
            </EmptyStateContainer>
          )
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;
