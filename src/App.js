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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PreMatch setMatchDetails={setMatchDetails} />} />
        <Route path="/match" element={<Match matchDetails={matchDetails} />} />
      </Routes>
    </Router>
  );
}

export default App;
