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
  background-color: #FF5733; /* Orange for Team B */
  color: white;
  border: none;
  cursor: pointer;
  &:disabled {
    background-color: #ccc;
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

  const handleRallyEnd = (winner, statsUpdate) => {
    setMatchData((prevData) => {
      const newScores = {
        ...prevData.scores,
        [winner]: prevData.scores[winner] + 1,
      };

      const updatedStatistics = {
        teamA: {
          serve: prevData.statistics.teamA.serve + (statsUpdate.teamA.serve || 0),
          ace: prevData.statistics.teamA.ace + (statsUpdate.teamA.ace || 0),
          serveError: prevData.statistics.teamA.serveError + (statsUpdate.teamA.serveError || 0),
          reception: prevData.statistics.teamA.reception + (statsUpdate.teamA.reception || 0),
          receptionError: prevData.statistics.teamA.receptionError + (statsUpdate.teamA.receptionError || 0),
          dig: prevData.statistics.teamA.dig + (statsUpdate.teamA.dig || 0),
          digError: prevData.statistics.teamA.digError + (statsUpdate.teamA.digError || 0),
          attack: prevData.statistics.teamA.attack + (statsUpdate.teamA.attack || 0),
          attackPoint: prevData.statistics.teamA.attackPoint + (statsUpdate.teamA.attackPoint || 0),
          attackError: prevData.statistics.teamA.attackError + (statsUpdate.teamA.attackError || 0),
          block: prevData.statistics.teamA.block + (statsUpdate.teamA.block || 0),
          blockPoint: prevData.statistics.teamA.blockPoint + (statsUpdate.teamA.blockPoint || 0),
          blockOut: prevData.statistics.teamA.blockOut + (statsUpdate.teamA.blockOut || 0),
          fault: prevData.statistics.teamA.fault + (statsUpdate.teamA.fault || 0),
        },
        teamB: {
          serve: prevData.statistics.teamB.serve + (statsUpdate.teamB.serve || 0),
          ace: prevData.statistics.teamB.ace + (statsUpdate.teamB.ace || 0),
          serveError: prevData.statistics.teamB.serveError + (statsUpdate.teamB.serveError || 0),
          reception: prevData.statistics.teamB.reception + (statsUpdate.teamB.reception || 0),
          receptionError: prevData.statistics.teamB.receptionError + (statsUpdate.teamB.receptionError || 0),
          dig: prevData.statistics.teamB.dig + (statsUpdate.teamB.dig || 0),
          digError: prevData.statistics.teamB.digError + (statsUpdate.teamB.digError || 0),
          attack: prevData.statistics.teamB.attack + (statsUpdate.teamB.attack || 0),
          attackPoint: prevData.statistics.teamB.attackPoint + (statsUpdate.teamB.attackPoint || 0),
          attackError: prevData.statistics.teamB.attackError + (statsUpdate.teamB.attackError || 0),
          block: prevData.statistics.teamB.block + (statsUpdate.teamB.block || 0),
          blockPoint: prevData.statistics.teamB.blockPoint + (statsUpdate.teamB.blockPoint || 0),
          blockOut: prevData.statistics.teamB.blockOut + (statsUpdate.teamB.blockOut || 0),
          fault: prevData.statistics.teamB.fault + (statsUpdate.teamB.fault || 0),
        },
      };

      const newSetsWon = { ...prevData.setsWon };

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
          return {
            ...prevData,
            scores: newScores,
            setsWon: newSetsWon,
            currentServer: null,
            ballPossession: null,
            matchStarted: false,
            statistics: updatedStatistics,
            timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts when match ends
          };
        }
        newScores.teamA = 0;
        newScores.teamB = 0;
        return {
          ...prevData,
          scores: newScores,
          setsWon: newSetsWon,
          currentServer: winner,
          ballPossession: winner,
          statistics: updatedStatistics,
          timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts at the start of a new set
        };
      } else if (newScores.teamB >= requiredPoints && scoreDifference >= 2) {
        newSetsWon.teamB += 1;
        if (newSetsWon.teamB === Math.ceil(maxSets / 2)) {
          alert(`${teams.teamB} wins the match!`);
          newScores.teamA = 0;
          newScores.teamB = 0;
          newSetsWon.teamA = 0;
          newSetsWon.teamB = 0;
          return {
            ...prevData,
            scores: newScores,
            setsWon: newSetsWon,
            currentServer: null,
            ballPossession: null,
            matchStarted: false,
            statistics: updatedStatistics,
            timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts when match ends
          };
        }
        newScores.teamA = 0;
        newScores.teamB = 0;
        return {
          ...prevData,
          scores: newScores,
          setsWon: newSetsWon,
          currentServer: winner,
          ballPossession: winner,
          statistics: updatedStatistics,
          timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts at the start of a new set
        };
      }

      return {
        ...prevData,
        scores: newScores,
        setsWon: newSetsWon,
        currentServer: winner,
        ballPossession: winner,
        statistics: updatedStatistics,
      };
    });
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
