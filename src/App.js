import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PreMatch from './components/PreMatch';
import Match from './components/Match';

function App() {
  const [matchDetails, setMatchDetails] = useState({
    teams: { teamA: 'Team A', teamB: 'Team B' },
    teamLogos: { teamA: '', teamB: '' },
    matchHeader: '',
    stadium: '',
    extendedInfo: '',
    maxSets: 5,
  });

  const [matchData, setMatchData] = useState({
    scores: { teamA: 0, teamB: 0 },
    setsWon: { teamA: 0, teamB: 0 },
    currentServer: null,
    ballPossession: null,
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
    matchStarted: false,
    timeouts: { teamA: 0, teamB: 0 }, // Initialize timeouts here
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
