import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PreMatch from './components/PreMatch';
import Match from './components/Match';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import io from 'socket.io-client';


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

function App() {
  const [matchDetails, setMatchDetails] = useState({
    teams: { teamA: 'CV Alcala Glauka Viajes', teamB: 'CV el otro con patrocinador' },
    teamLogos: {
      teamA: 'https://www.todovoleibol.com/images/escudos/cv-alcala.jpg',
      teamB: 'https://www.todovoleibol.com/images/escudos/cv-fuenlabrada.jpg'
    },
    matchHeader: 'CADETE - 1ª División Aut. Preferente',
    extendedInfo: 'Liga regular - Jornada 5',
    stadium: 'Pabellón Demetrio Lozano, Alcalá de Henares',
    competitionLogo: 'https://fmvoley.com/images/logo.svg',
    maxSets: 5,
    stats: {
      teamA: {
        ranking: 2,
        matchesPlayed: 15,
        totalMatchesWon: 12,
        won3Points: 8,
        won2Points: 4,
        totalMatchesLost: 3,
        lost1Point: 2,
        lost0Points: 1,
        totalPointsScored: 345,
        totalPointsReceived: 298,
      },
      teamB: {
        ranking: 5,
        matchesPlayed: 15,
        totalMatchesWon: 10,
        won3Points: 7,
        won2Points: 3,
        totalMatchesLost: 5,
        lost1Point: 3,
        lost0Points: 2,
        totalPointsScored: 320,
        totalPointsReceived: 310,
      }
    },
  });

  const [matchData, setMatchData] = useState({
    scores: { teamA: 0, teamB: 0 },
    setsWon: { teamA: 0, teamB: 0 },
    setScores: [],//{ teamA: 0, teamB: 0 },],
    currentServer: '',
    ballPossession: '',
    matchStarted: false,
    timeouts: { teamA: 0, teamB: 0 },
    statistics: {
      teamA: { serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0 },
      teamB: { serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0 },
    },
    winner: '',
    matchEvent: {
      type: null,
      details: null,
    },
  });

  const [activeTab, setActiveTab] = useState('prematch');
  const [socket, setSocket] = useState(null);
  const [key] = useState(() => {
    // Load the key from a cookie or generate a new UUID
    const existingKey = Cookies.get('websocket-key');
    if (existingKey) {
      return existingKey;
    } else {
      const newKey = uuidv4();
      Cookies.set('websocket-key', newKey, { expires: 365 }); // Store the key in a cookie for 1 year
      return newKey;
    }
  });

  useEffect(() => {
    // Connect to the Socket.io server using the key
    const socketInstance = io('http://localhost:3005', {
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
    const otherAppUrl = `http://localhost:3001?key=${key}`;
    window.open(otherAppUrl, '_blank');
  };

  return (
    <AppContainer>
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
        Open Other App
      </OpenLinkButton>
      </TabContainer>

      {activeTab === 'prematch' && <PreMatch setMatchDetails={setMatchDetails} matchDetails={matchDetails} socket={socket} />}
      {activeTab === 'match' && <Match matchDetails={matchDetails} matchData={matchData} setMatchData={setMatchData} socket={socket} />}
      {/* {activeTab === 'controls' && <Controls matchDetails={matchDetails} matchData={matchData} setMatchData={setMatchData} />} */}
    </AppContainer>
  );
}

export default App;
