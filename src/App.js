import React, { useState } from 'react';
import ScoreBoard from './components/ScoreBoard';
import RallyControl from './components/RallyControl';
import Statistics from './components/Statistics';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

function App() {
  const [teams, setTeams] = useState({ teamA: 'Team A', teamB: 'Team B' });
  const [currentServer, setCurrentServer] = useState(null);
  const [initialServer, setInitialServer] = useState(null); // Track the initial server for each set
  const [scores, setScores] = useState({ teamA: 0, teamB: 0 });
  const [setsWon, setSetsWon] = useState({ teamA: 0, teamB: 0 });
  const [statistics, setStatistics] = useState({
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
  });
  const [ballPossession, setBallPossession] = useState(null);
  const [matchStarted, setMatchStarted] = useState(false);
  const [maxSets, setMaxSets] = useState(5); // Default to 5 sets

  const handleTeamNames = (teamA, teamB) => {
    setTeams({ teamA, teamB });
  };

  const handleStartMatch = (server) => {
    setCurrentServer(server);
    setInitialServer(server); // Set initial server for the first set
    setBallPossession(server);
    setMatchStarted(true); // Mark the match as started
  };

  const updateBallPossession = (newPossession) => {
    setBallPossession(newPossession);
  };

  const handleRallyEnd = (winner, statsUpdate) => {
    const newScores = {
      ...scores,
      [winner]: scores[winner] + 1,
    };
    setScores(newScores);

    setStatistics((prevStats) => ({
      teamA: {
        serve: prevStats.teamA.serve + (statsUpdate.teamA.serve || 0),
        ace: prevStats.teamA.ace + (statsUpdate.teamA.ace || 0),
        serveError: prevStats.teamA.serveError + (statsUpdate.teamA.serveError || 0),
        reception: prevStats.teamA.reception + (statsUpdate.teamA.reception || 0),
        receptionError: prevStats.teamA.receptionError + (statsUpdate.teamA.receptionError || 0),
        dig: prevStats.teamA.dig + (statsUpdate.teamA.dig || 0),
        digError: prevStats.teamA.digError + (statsUpdate.teamA.digError || 0),
        attack: prevStats.teamA.attack + (statsUpdate.teamA.attack || 0),
        attackPoint: prevStats.teamA.attackPoint + (statsUpdate.teamA.attackPoint || 0),
        attackError: prevStats.teamA.attackError + (statsUpdate.teamA.attackError || 0),
        block: prevStats.teamA.block + (statsUpdate.teamA.block || 0),
        blockPoint: prevStats.teamA.blockPoint + (statsUpdate.teamA.blockPoint || 0),
        blockOut: prevStats.teamA.blockOut + (statsUpdate.teamA.blockOut || 0),
        fault: prevStats.teamA.fault + (statsUpdate.teamA.fault || 0),
      },
      teamB: {
        serve: prevStats.teamB.serve + (statsUpdate.teamB.serve || 0),
        ace: prevStats.teamB.ace + (statsUpdate.teamB.ace || 0),
        serveError: prevStats.teamB.serveError + (statsUpdate.teamB.serveError || 0),
        reception: prevStats.teamB.reception + (statsUpdate.teamB.reception || 0),
        receptionError: prevStats.teamB.receptionError + (statsUpdate.teamB.receptionError || 0),
        dig: prevStats.teamB.dig + (statsUpdate.teamB.dig || 0),
        digError: prevStats.teamB.digError + (statsUpdate.teamB.digError || 0),
        attack: prevStats.teamB.attack + (statsUpdate.teamB.attack || 0),
        attackPoint: prevStats.teamB.attackPoint + (statsUpdate.teamB.attackPoint || 0),
        attackError: prevStats.teamB.attackError + (statsUpdate.teamB.attackError || 0),
        block: prevStats.teamB.block + (statsUpdate.teamB.block || 0),
        blockPoint: prevStats.teamB.blockPoint + (statsUpdate.teamB.blockPoint || 0),
        blockOut: prevStats.teamB.blockOut + (statsUpdate.teamB.blockOut || 0),
        fault: prevStats.teamB.fault + (statsUpdate.teamB.fault || 0),
      },
    }));

    setCurrentServer(winner);
    setBallPossession(winner);

    checkSetWin(newScores);
  };

  const checkSetWin = (updatedScores) => {
    const scoreDifference = Math.abs(updatedScores.teamA - updatedScores.teamB);

    if (updatedScores.teamA >= 25 && scoreDifference >= 2) {
      setSetsWon((prevSets) => {
        const updatedSets = { ...prevSets, teamA: prevSets.teamA + 1 };
        checkMatchWin(updatedSets); // Check match win after updating sets
        return updatedSets;
      });
      resetScores();
    } else if (updatedScores.teamB >= 25 && scoreDifference >= 2) {
      setSetsWon((prevSets) => {
        const updatedSets = { ...prevSets, teamB: prevSets.teamB + 1 };
        checkMatchWin(updatedSets); // Check match win after updating sets
        return updatedSets;
      });
      resetScores();
    }
  };

  const checkMatchWin = (updatedSets) => {
    if (updatedSets.teamA === Math.ceil(maxSets / 2)) {
      alert(`${teams.teamA} wins the match!`);
      resetMatch();
    } else if (updatedSets.teamB === Math.ceil(maxSets / 2)) {
      alert(`${teams.teamB} wins the match!`);
      resetMatch();
    }
  };

  const resetScores = () => {
    setScores({ teamA: 0, teamB: 0 });
    // Switch the initial server for the new set
    const newInitialServer = initialServer === 'teamA' ? 'teamB' : 'teamA';
    setInitialServer(newInitialServer);
    setCurrentServer(newInitialServer);
    setBallPossession(newInitialServer);
  };

  const resetMatch = () => {
    setScores({ teamA: 0, teamB: 0 });
    setSetsWon({ teamA: 0, teamB: 0 });
    setCurrentServer(null);
    setBallPossession(null);
    setMatchStarted(false);
  };

  const handleSetSelection = (event) => {
    setMaxSets(parseInt(event.target.value, 10));
  };

  return (
    <AppContainer>
      {!matchStarted && (
        <div>
          <label htmlFor="setSelection">Select Number of Sets:</label>
          <select id="setSelection" onChange={handleSetSelection} value={maxSets}>
            <option value={3}>3</option>
            <option value={5}>5</option>
          </select>
        </div>
      )}
      <ScoreBoard
        teams={teams}
        scores={scores}
        setsWon={setsWon}
        currentServer={currentServer}
        ballPossession={ballPossession}
        onStartMatch={handleStartMatch}
        onSetTeamNames={handleTeamNames}
        matchStarted={matchStarted}
      />
      <RallyControl
        teams={teams}
        currentServer={currentServer}
        ballPossession={ballPossession}
        onRallyEnd={handleRallyEnd}
        updateBallPossession={updateBallPossession}
        matchStarted={matchStarted}
      />
      <Statistics teams={teams} statistics={statistics} />
    </AppContainer>
  );
}

export default App;
