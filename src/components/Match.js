import React from 'react';
import ScoreBoard from './ScoreBoard';
import RallyControl from './RallyControl';
import Statistics from './Statistics';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const MatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 600px;
  margin: auto;
`;

const NavigationButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
`;

const TimeoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const TimeoutButton = styled.button`
  flex: 1;
  margin: 5px;
  padding: 10px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 1;
  &:disabled {
    // background-color: #ccc;
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

function Match({ matchDetails, matchData, setMatchData }) {
  const { teams, teamLogos, matchHeader, stadium, extendedInfo, maxSets } = matchDetails;
  const navigate = useNavigate();

  const handleStartMatch = (server) => {
    setMatchData((prevData) => ({
      ...prevData,
      currentServer: server,
      ballPossession: server,
      matchStarted: true,
    }));
  };

  const updateBallPossession = (newPossession) => {
    setMatchData((prevData) => ({
      ...prevData,
      ballPossession: newPossession,
    }));
  };

  const checkSetWinningConditions = (newScores, updatedStatistics) => {
    const newSetsWon = { ...matchData.setsWon };

    const scoreDifference = Math.abs(newScores.teamA - newScores.teamB);
    const isTiebreakerSet = newSetsWon.teamA + newSetsWon.teamB === maxSets - 1;
    const requiredPoints = isTiebreakerSet ? 15 : 25;

    if (newScores.teamA >= requiredPoints && scoreDifference >= 2) {
      newSetsWon.teamA += 1;
      if (newSetsWon.teamA === Math.ceil(maxSets / 2)) {
        alert(`${teams.teamA} wins the match!`);
        newScores.teamA = 0;
        newScores.teamB = 0;
        newSetsWon.teamA = 0;
        newSetsWon.teamB = 0;
        setMatchData({
          ...matchData,
          scores: newScores,
          setsWon: newSetsWon,
          currentServer: null,
          ballPossession: null,
          matchStarted: false,
          statistics: updatedStatistics,
          timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts when match ends
        });
        return;
      }
      newScores.teamA = 0;
      newScores.teamB = 0;
      setMatchData({
        ...matchData,
        scores: newScores,
        setsWon: newSetsWon,
        currentServer: matchData.currentServer,
        ballPossession: matchData.ballPossession,
        statistics: updatedStatistics,
        timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts at the start of a new set
      });
      return;
    } else if (newScores.teamB >= requiredPoints && scoreDifference >= 2) {
      newSetsWon.teamB += 1;
      if (newSetsWon.teamB === Math.ceil(maxSets / 2)) {
        alert(`${teams.teamB} wins the match!`);
        newScores.teamA = 0;
        newScores.teamB = 0;
        newSetsWon.teamA = 0;
        newSetsWon.teamB = 0;
        setMatchData({
          ...matchData,
          scores: newScores,
          setsWon: newSetsWon,
          currentServer: null,
          ballPossession: null,
          matchStarted: false,
          statistics: updatedStatistics,
          timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts when match ends
        });
        return;
      }
      newScores.teamA = 0;
      newScores.teamB = 0;
      setMatchData({
        ...matchData,
        scores: newScores,
        setsWon: newSetsWon,
        currentServer: matchData.currentServer,
        ballPossession: matchData.ballPossession,
        statistics: updatedStatistics,
        timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts at the start of a new set
      });
      return;
    }

    setMatchData({
      ...matchData,
      scores: newScores,
      setsWon: newSetsWon,
      currentServer: matchData.currentServer,
      ballPossession: matchData.ballPossession,
      statistics: updatedStatistics,
    });
  };

  const handleRallyEnd = (winner, statsUpdate = {}) => {
    const newScores = {
      ...matchData.scores,
      [winner]: matchData.scores[winner] + 1,
    };

    const updatedStatistics = {
      teamA: {
        serve: matchData.statistics.teamA.serve + (statsUpdate.teamA?.serve || 0),
        ace: matchData.statistics.teamA.ace + (statsUpdate.teamA?.ace || 0),
        serveError: matchData.statistics.teamA.serveError + (statsUpdate.teamA?.serveError || 0),
        reception: matchData.statistics.teamA.reception + (statsUpdate.teamA?.reception || 0),
        receptionError: matchData.statistics.teamA.receptionError + (statsUpdate.teamA?.receptionError || 0),
        dig: matchData.statistics.teamA.dig + (statsUpdate.teamA?.dig || 0),
        digError: matchData.statistics.teamA.digError + (statsUpdate.teamA?.digError || 0),
        attack: matchData.statistics.teamA.attack + (statsUpdate.teamA?.attack || 0),
        attackPoint: matchData.statistics.teamA.attackPoint + (statsUpdate.teamA?.attackPoint || 0),
        attackError: matchData.statistics.teamA.attackError + (statsUpdate.teamA?.attackError || 0),
        block: matchData.statistics.teamA.block + (statsUpdate.teamA?.block || 0),
        blockPoint: matchData.statistics.teamA.blockPoint + (statsUpdate.teamA?.blockPoint || 0),
        blockOut: matchData.statistics.teamA.blockOut + (statsUpdate.teamA?.blockOut || 0),
        fault: matchData.statistics.teamA.fault + (statsUpdate.teamA?.fault || 0),
      },
      teamB: {
        serve: matchData.statistics.teamB.serve + (statsUpdate.teamB?.serve || 0),
        ace: matchData.statistics.teamB.ace + (statsUpdate.teamB?.ace || 0),
        serveError: matchData.statistics.teamB.serveError + (statsUpdate.teamB?.serveError || 0),
        reception: matchData.statistics.teamB.reception + (statsUpdate.teamB?.reception || 0),
        receptionError: matchData.statistics.teamB.receptionError + (statsUpdate.teamB?.receptionError || 0),
        dig: matchData.statistics.teamB.dig + (statsUpdate.teamB?.dig || 0),
        digError: matchData.statistics.teamB.digError + (statsUpdate.teamB?.digError || 0),
        attack: matchData.statistics.teamB.attack + (statsUpdate.teamB?.attack || 0),
        attackPoint: matchData.statistics.teamB.attackPoint + (statsUpdate.teamB?.attackPoint || 0),
        attackError: matchData.statistics.teamB.attackError + (statsUpdate.teamB?.attackError || 0),
        block: matchData.statistics.teamB.block + (statsUpdate.teamB?.block || 0),
        blockPoint: matchData.statistics.teamB.blockPoint + (statsUpdate.teamB?.blockPoint || 0),
        blockOut: matchData.statistics.teamB.blockOut + (statsUpdate.teamB?.blockOut || 0),
        fault: matchData.statistics.teamB.fault + (statsUpdate.teamB?.fault || 0),
      },
    };

    checkSetWinningConditions(newScores, updatedStatistics);
  };

  const handleTimeout = (team) => {
    setMatchData((prevData) => {
      const newTimeouts = { ...prevData.timeouts, [team]: prevData.timeouts[team] + 1 };
      return {
        ...prevData,
        timeouts: newTimeouts,
      };
    });
  };

  const handleAdjustScore = (team, adjustment) => {
    const newScores = {
      ...matchData.scores,
      [team]: Math.max(0, matchData.scores[team] + adjustment), // Prevent negative scores
    };

    checkSetWinningConditions(newScores, matchData.statistics);
  };

  return (
    <MatchContainer>
      <NavigationButton onClick={() => navigate('/')}>Back to Pre-Match Setup</NavigationButton>
      <h1>{matchHeader}</h1>
      <p>Stadium: {stadium}</p>
      <p>Info: {extendedInfo}</p>
      <ScoreBoard
        teams={teams}
        teamLogos={teamLogos}
        scores={matchData.scores}
        setsWon={matchData.setsWon}
        currentServer={matchData.currentServer}
        ballPossession={matchData.ballPossession}
        onStartMatch={handleStartMatch}
        matchStarted={matchData.matchStarted}
        onAdjustScore={handleAdjustScore}
      />
      <TimeoutContainer>
        <TimeoutButton
          onClick={() => handleTimeout('teamA')}
          disabled={matchData.timeouts.teamA >= 2}
        >
          Team A Timeout ({matchData.timeouts.teamA}/2)
        </TimeoutButton>
        <TimeoutButton
          onClick={() => handleTimeout('teamB')}
          disabled={matchData.timeouts.teamB >= 2}
        >
          Team B Timeout ({matchData.timeouts.teamB}/2)
        </TimeoutButton>
      </TimeoutContainer>
      <RallyControl
        teams={teams}
        currentServer={matchData.currentServer}
        ballPossession={matchData.ballPossession}
        onRallyEnd={handleRallyEnd}
        updateBallPossession={updateBallPossession}
        matchStarted={matchData.matchStarted}
      />
      <Statistics teams={teams} statistics={matchData.statistics} />
    </MatchContainer>
  );
}

export default Match;
