import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreMatch from './components/PreMatch';
import Match from './components/Match';

function App() {
  const [matchDetails, setMatchDetails] = useState({
    teams: { teamA: 'Team A', teamB: 'Team B' },
    teamLogos: { 
      teamA: 'https://www.todovoleibol.com/images/escudos/cv-alcala.jpg', 
      teamB: 'https://www.todovoleibol.com/images/escudos/cv-fuenlabrada.jpg' 
    },
    matchHeader: 'CADETE - 1ª División Aut. Preferente',
    extendedInfo: 'Liga regular - Jornada 5',
    stadium: 'Pabellón Demetrio Lozano, Alcalá de Henares',
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
    setScores: [],
    currentServer: null,
    ballPossession: null,
    matchStarted: false,
    timeouts: { teamA: 0, teamB: 0 }, // Initialize timeouts here
    statistics: {
      teamA: {
        serve: 0,
        ace: 0,
        serveError: 0,
        reception: 0,
        receptionError: 0,
        dig: 0,
        digError: 0,
        attack: 0,
        attackPoint: 0,
        attackError: 0,
        block: 0,
        blockPoint: 0,
        blockOut: 0,
        fault: 0,
      },
      teamB: {
        serve: 0,
        ace: 0,
        serveError: 0,
        reception: 0,
        receptionError: 0,
        dig: 0,
        digError: 0,
        attack: 0,
        attackPoint: 0,
        attackError: 0,
        block: 0,
        blockPoint: 0,
        blockOut: 0,
        fault: 0,
      },
    },
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<PreMatch setMatchDetails={setMatchDetails} matchDetails={matchDetails} />}
        />
        <Route
          path="/match"
          element={
            <Match
              matchDetails={matchDetails}
              matchData={matchData}
              setMatchData={setMatchData}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
