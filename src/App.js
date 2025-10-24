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
  const [teams, setTeams] = useState({ teamA: '', teamB: '' });
  const [currentServer, setCurrentServer] = useState(null);
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
      fault: 0, // Initialize fault
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
      fault: 0, // Initialize fault
    },
  });
  const [ballPossession, setBallPossession] = useState(null);
  const [matchStarted, setMatchStarted] = useState(false);

  const handleTeamNames = (teamA, teamB) => {
    setTeams({ teamA, teamB });
  };

  const handleStartMatch = (server) => {
    setCurrentServer(server);
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
        fault: prevStats.teamA.fault + (statsUpdate.teamA.fault || 0), // Update fault
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
        fault: prevStats.teamB.fault + (statsUpdate.teamB.fault || 0), // Update fault
      },
    }));

    setCurrentServer(winner);
    setBallPossession(winner);

    checkSetWin(newScores);
  };

  const checkSetWin = (updatedScores) => {
    const scoreDifference = Math.abs(updatedScores.teamA - updatedScores.teamB);

    if (updatedScores.teamA >= 25 && scoreDifference >= 2) {
      setSetsWon((prevSets) => ({ ...prevSets, teamA: prevSets.teamA + 1 }));
      resetScores();
    } else if (updatedScores.teamB >= 25 && scoreDifference >= 2) {
      setSetsWon((prevSets) => ({ ...prevSets, teamB: prevSets.teamB + 1 }));
      resetScores();
    }

    checkMatchWin();
  };

  const checkMatchWin = () => {
    const maxSets = 5; // Change this to 3 if needed
    if (setsWon.teamA === Math.ceil(maxSets / 2)) {
      alert(`${teams.teamA} wins the match!`);
      resetMatch();
    } else if (setsWon.teamB === Math.ceil(maxSets / 2)) {
      alert(`${teams.teamB} wins the match!`);
      resetMatch();
    }
  };

  const resetScores = () => {
    setScores({ teamA: 0, teamB: 0 });
    setBallPossession(currentServer);
  };

  const resetMatch = () => {
    setScores({ teamA: 0, teamB: 0 });
    setSetsWon({ teamA: 0, teamB: 0 });
    setCurrentServer(null);
    setBallPossession(null);
    setMatchStarted(false);
  };

  return (
    <AppContainer>
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
