// app.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PreMatch from './components/PreMatch';
import Match from './components/Match';
import Controls from './components/Controls';
import ResizablePreview from './components/ResizablePreview';
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import ShortUUID from 'short-uuid';

// --- Styled Components ---

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  margin: 0 5px;
  background-color: ${({ active }) => (active ? '#007bff' : '#ccc')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${({ active }) => (active ? '#0056b3' : '#bbb')};
  }
`;

const OpenLinkButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #45a049;
  }
`;

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3005';
const OVERLAY_URL = process.env.REACT_APP_OVERLAY_URL || 'http://localhost:3001';

const initialConfig = {
  scoreboard: {
    enabled: false,
    type: 'classic',
    position: 'top',
  },
  matchup: {
    enabled: false,
  },
  lowerThird: {
    enabled: false,
  },
  teamComparison: {
    enabled: false,
  },
  afterMatch: {
    enabled: false,
    showStats: true,
  },
};

const initialMatchDetails = {
    teams: { teamA: 'CV Alcala Glauka Viajes', teamB: 'CVLEGANES.COM B' },
    teamLogos: {
      teamA: 'https://www.todovoleibol.com/images/escudos/cv-alcala.jpg',
      teamB: 'https://www.todovoleibol.com/images/escudos/cv-leganes.jpg'
    },
    matchHeader: 'CADETE - 1ª División Aut. Preferente',
    extendedInfo: 'Liga regular - Jornada 5',
    stadium: 'Pabellón EMILIA PARDO BAZAN, Leganés',
    competitionLogo: 'https://fmvoley.com/images/logo.svg',
    maxSets: 5,
    stats: {
      teamA: {
        ranking: 9,
        competitionPoints: 4,
        matchesPlayed: 5,
        totalMatchesWon: 1,
        won3Points: 1,
        won2Points: 0,
        totalMatchesLost: 4,
        lost1Point: 1,
        lost0Points: 3,
        totalPointsScored: 377,
        totalPointsReceived: 408,
      },
      teamB: {
        ranking: 12,
        competitionPoints: 0,
        matchesPlayed: 5,
        totalMatchesWon: 0,
        won3Points: 0,
        won2Points: 0,
        totalMatchesLost: 5,
        lost1Point: 0,
        lost0Points: 5,
        totalPointsScored: 275,
        totalPointsReceived: 397,
      }
    },
  };

  const initialMatchData = {
    scores: { teamA: 0, teamB: 0 },
    setsWon: { teamA: 0, teamB: 0 },
    setScores: [],//{ teamA: 25, teamB: 0 },{ teamA: 25, teamB: 0 },],
    currentServer: '',
    ballPossession: '',
    matchStarted: false,
    timeouts: { teamA: 0, teamB: 0 },
    statistics: {
      teamA: { serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0, serviceEffectiveness: 0,attackEffectiveness: 0, defenseEffectiveness: 0 },
      teamB: { serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0, serviceEffectiveness: 0,attackEffectiveness: 0, defenseEffectiveness: 0 },
    },
    winner: null,
    matchEvent: {
      type: null,
      details: null,
    },
  };

function App() {
  const [matchDetails, setMatchDetails] = useState(initialMatchDetails);
  const [matchData, setMatchData] = useState(initialMatchData);
  const [config, setConfig] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('prematch');
  const [socket, setSocket] = useState(null);

  const [key] = useState(() => {
    // Load the key from a cookie or generate a new short UUID
    const existingKey = Cookies.get('websocket-key');
    if (existingKey) {
      return existingKey;
    } else {
      const translator = ShortUUID();
      const newKey = translator.new();
      Cookies.set('websocket-key', newKey, { expires: 365 }); // Store the key in a cookie for 1 year
      return newKey;
    }
  });

  const overlayUrl = `${OVERLAY_URL}?key=${key}`;

  useEffect(() => {
    // Connect to the Socket.io server using the key
    const socketInstance = io(SOCKET_SERVER_URL, {
      query: { key },
    });

    socketInstance.on('connect', () => {
      console.log('Socket.io connection established');
    });

    socketInstance.on('message', (data) => {
      console.log('Message received:', data);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket.io connection closed');
    });

    socketInstance.on('error', (error) => {
      console.error('Socket.io error:', error);
    });

    setSocket(socketInstance);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [key]);

  const openOtherApp = () => {
    // window.open(overlayUrl, '_blank');
    navigator.clipboard.writeText(overlayUrl);

  // Alert the copied text
  alert("Output URL copied to clipboard");
  };

  return (
    <AppContainer>
      <h2>Preview</h2>
      <ResizablePreview src={overlayUrl} />
      <TabContainer>
        <TabButton active={activeTab === 'prematch'} onClick={() => setActiveTab('prematch')}>
          Pre-Match Setup
        </TabButton>
        <TabButton active={activeTab === 'match'} onClick={() => setActiveTab('match')}>
          Match
        </TabButton>
        <TabButton active={activeTab === 'controls'} onClick={() => setActiveTab('controls')}>
          Controls
        </TabButton>
        <OpenLinkButton onClick={openOtherApp}>
          Copy output URL
        </OpenLinkButton>
      </TabContainer>

      {activeTab === 'prematch' && <PreMatch setMatchDetails={setMatchDetails} matchDetails={matchDetails} socket={socket} />}
      {activeTab === 'match' && <Match matchDetails={matchDetails} matchData={matchData} setMatchData={setMatchData} socket={socket} />}
      {activeTab === 'controls' && <Controls socket={socket} config={config} setConfig={setConfig} />}
    </AppContainer>
  );
}

export default App;
