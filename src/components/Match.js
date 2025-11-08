import React, { useReducer, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import ScoreBoard from './ScoreBoard';
import RallyControl from './RallyControl';
import Statistics from './Statistics';

// --- Styled Components ---

const MatchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  max-width: 600px;
  margin: auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TeamButton = styled.button`
  margin: 5px;
`;

const TimeoutContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

const TimeoutButton = styled.button`
  flex: 1;
  margin: 0 5px;
  padding: 10px;
  background-color: #ff9800;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:enabled { background-color: #e68900; }
`;
// --- Helper Functions ---
const calculatePercentage = (value, total) => {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(2)}%`;
};

const calculateUpdatedStatistics = (currentStats, statsUpdate) => ({
  teamA: {
    serve: currentStats.teamA.serve + (statsUpdate.teamA?.serve || 0),
    ace: currentStats.teamA.ace + (statsUpdate.teamA?.ace || 0),
    serveError: currentStats.teamA.serveError + (statsUpdate.teamA?.serveError || 0),
    reception: currentStats.teamA.reception + (statsUpdate.teamA?.reception || 0),
    receptionError: currentStats.teamA.receptionError + (statsUpdate.teamA?.receptionError || 0),
    dig: currentStats.teamA.dig + (statsUpdate.teamA?.dig || 0),
    digError: currentStats.teamA.digError + (statsUpdate.teamA?.digError || 0),
    attack: currentStats.teamA.attack + (statsUpdate.teamA?.attack || 0),
    attackPoint: currentStats.teamA.attackPoint + (statsUpdate.teamA?.attackPoint || 0),
    attackError: currentStats.teamA.attackError + (statsUpdate.teamA?.attackError || 0),
    block: currentStats.teamA.block + (statsUpdate.teamA?.block || 0),
    blockPoint: currentStats.teamA.blockPoint + (statsUpdate.teamA?.blockPoint || 0),
    blockOut: currentStats.teamA.blockOut + (statsUpdate.teamA?.blockOut || 0),
    fault: currentStats.teamA.fault + (statsUpdate.teamA?.fault || 0),
    serviceEffectiveness: calculatePercentage(currentStats.teamA.ace - currentStats.teamA.serveError, currentStats.teamA.serve),
    attackEffectiveness: calculatePercentage(currentStats.teamA.attackPoint - currentStats.teamA.attackError, currentStats.teamA.attack),
    defenseEffectiveness: calculatePercentage(currentStats.teamA.dig - currentStats.teamA.digError, currentStats.teamB.attack),
  },
  teamB: {
    serve: currentStats.teamB.serve + (statsUpdate.teamB?.serve || 0),
    ace: currentStats.teamB.ace + (statsUpdate.teamB?.ace || 0),
    serveError: currentStats.teamB.serveError + (statsUpdate.teamB?.serveError || 0),
    reception: currentStats.teamB.reception + (statsUpdate.teamB?.reception || 0),
    receptionError: currentStats.teamB.receptionError + (statsUpdate.teamB?.receptionError || 0),
    dig: currentStats.teamB.dig + (statsUpdate.teamB?.dig || 0),
    digError: currentStats.teamB.digError + (statsUpdate.teamB?.digError || 0),
    attack: currentStats.teamB.attack + (statsUpdate.teamB?.attack || 0),
    attackPoint: currentStats.teamB.attackPoint + (statsUpdate.teamB?.attackPoint || 0),
    attackError: currentStats.teamB.attackError + (statsUpdate.teamB?.attackError || 0),
    block: currentStats.teamB.block + (statsUpdate.teamB?.block || 0),
    blockPoint: currentStats.teamB.blockPoint + (statsUpdate.teamB?.blockPoint || 0),
    blockOut: currentStats.teamB.blockOut + (statsUpdate.teamB?.blockOut || 0),
    fault: currentStats.teamB.fault + (statsUpdate.teamB?.fault || 0),
    serviceEffectiveness: calculatePercentage(currentStats.teamB.ace - currentStats.teamA.serveError, currentStats.teamA.serve),
    attackEffectiveness: calculatePercentage(currentStats.teamB.attackPoint - currentStats.teamA.attackError, currentStats.teamA.attack),
    defenseEffectiveness: calculatePercentage(currentStats.teamB.dig - currentStats.teamA.digError, currentStats.teamB.attack),
  },
});

// --- Reducer and Initial State ---

const initialState = {
  scores: { teamA: 0, teamB: 0 },
  setsWon: { teamA: 0, teamB: 0 },
  setScores: [], // New state property to store scores at the end of each set
  currentServer: null,
  ballPossession: null,
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
};

const matchReducer = (state, action) => {
  switch (action.type) {
    case 'START_MATCH':
      return {
        ...state,
        matchStarted: true,
      };
    case 'SET_CURRENT_SERVER':
      return {
        ...state,
        currentServer: action.server,
        ballPossession: action.server,
      };
    case 'UPDATE_BALL_POSSESSION':
      const matchEvent = action.rallyDiscarded ? { type: 'referee-call', details: { text: 'Se repite el punto' } } : state.matchEvent;
      return { ...state, ballPossession: action.newPossession, matchEvent };
    case 'RALLY_END': {
      const { winner, statsUpdate, faultingTeam, teams } = action;
      const newScores = {
        ...state.scores,
        [winner]: state.scores[winner] + 1,
      };
      const updatedStatistics = calculateUpdatedStatistics(state.statistics, statsUpdate);
      const matchEvent = faultingTeam ? { type: 'referee-call', details: { text: 'Falta', team: teams[faultingTeam] } } : state.matchEvent;
      return {
        ...state,
        scores: newScores,
        statistics: updatedStatistics,
        currentServer: winner,
        matchEvent,
      };
    }
    case 'TIMEOUT':
      const { teams } = action;
      return {
        ...state,
        timeouts: {
          ...state.timeouts,
          [action.team]: state.timeouts[action.team] + 1,
        },
        matchEvent: { type: 'timeout', details: { text: 'Tiempo muerto', team: teams[action.team] } }
      };
    case 'ADJUST_SCORE':
      return {
        ...state,
        scores: {
          ...state.scores,
          [action.team]: Math.max(0, state.scores[action.team] + action.adjustment),
        },
      };
    case 'PROCESS_GAME_END': {
      const { maxSets, teams, setParentMatchDataCallback } = action;
      const scoreDifference = Math.abs(state.scores.teamA - state.scores.teamB);
      const isTiebreakerSet = state.setsWon.teamA + state.setsWon.teamB === maxSets - 1;
      const requiredPoints = isTiebreakerSet ? 15 : 25;

      let newSetsWon = { ...state.setsWon };
      let newScores = { ...state.scores };
      let matchEnded = false;
      let setEnded = false;
      const newSetScores = [...state.setScores, { teamA: state.scores.teamA, teamB: state.scores.teamB }];

      // let matchWinner = {...};
      if (state.winner) {
        return state;
      }

      if (state.scores.teamA >= requiredPoints && scoreDifference >= 2) {
        newSetsWon.teamA += 1;
        setEnded = true;
      } else if (state.scores.teamB >= requiredPoints && scoreDifference >= 2) {
        newSetsWon.teamB += 1;
        setEnded = true;
      }

      if (setEnded) {
        if (newSetsWon.teamA === Math.ceil(maxSets / 2) || newSetsWon.teamB === Math.ceil(maxSets / 2)) {
          matchEnded = true;
        }
        newScores = { teamA: 0, teamB: 0 };
      }

      if (matchEnded) {
        const winner = newSetsWon.teamA > newSetsWon.teamB ? teams.teamA : teams.teamB
        alert(`${winner} ha ganado el partido!`);
        const newState = {
          ...state,
          // scores: newScores,
          setsWon: newSetsWon,
          setScores: newSetScores, // Update setScores with the scores of the completed set
          matchStarted: false, // disable action buttons
          timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts at the start of a new set
          winner,
          currentServer: null,
          ballPossession: null,
        };
        setParentMatchDataCallback(newState); // Sync with parent state
        return newState;
      } else if (setEnded) {
        const newState = {
          ...state,
          scores: newScores,
          setsWon: newSetsWon,
          setScores: newSetScores, // Update setScores with the scores of the completed set
          timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts at the start of a new set
        };
        setParentMatchDataCallback(newState); // Sync with parent state
        return newState;
      } else {
        setParentMatchDataCallback(state);
        return state;
      }
    }
    case 'RESET_MATCH':
      return initialState;
    default:
      return state;
  }
};

// --- Main Match Component ---

function Match({ matchDetails, matchData, setMatchData, socket }) {
  const { teams, teamLogos, maxSets } = matchDetails;
  const [localMatchData, dispatch] = useReducer(matchReducer, matchData || initialState);
  const [rallyStage, setRallyStage] = useState('start'); // Track rally stage


  const setParentMatchDataCallback = useCallback((data) => {
    // Emit the updated match details to the server via the socket
    if (socket) {
      socket.emit('matchData', data);
    }
    data.matchEvent = {
      type: null,
      details: null,
    }
    setMatchData(data);
  }, [setMatchData, socket]);

  useEffect(() => {
    dispatch({
      type: 'PROCESS_GAME_END',
      maxSets,
      teams,
      setParentMatchDataCallback,
    });
  }, [maxSets, teams, setParentMatchDataCallback, localMatchData.scores, localMatchData.currentServer, localMatchData.matchEvent]);
  // }, [localMatchData.scores, localMatchData.setsWon, maxSets, teams, setParentMatchDataCallback, localMatchData.currentServer, localMatchData.timeouts, localMatchData.winner, localMatchData.matchEvent]);

  const handleStartMatch = () => {
    dispatch({ type: 'START_MATCH' });
  };

  const handleSetCurrentServer = (server) => {
    dispatch({ type: 'SET_CURRENT_SERVER', server });
  };

  const updateBallPossession = (newPossession, rallyDiscarded = null) => {
    dispatch({ type: 'UPDATE_BALL_POSSESSION', newPossession, rallyDiscarded });
  };

  const handleRallyEnd = (winner, statsUpdate = {}, faultingTeam = null) => {
    dispatch({ type: 'RALLY_END', winner, statsUpdate, faultingTeam, teams });
  };

  const handleTimeout = (team) => {
    dispatch({ type: 'TIMEOUT', team, teams });
  };

  const handleAdjustScore = (team, adjustment) => {
    dispatch({ type: 'ADJUST_SCORE', team, adjustment });
  };

  const handleRallyStageChange = (stage) => {
    setRallyStage(stage);
  };

  return (
    <MatchContainer>
      <div>
        <TeamButton onClick={() => handleStartMatch()} disabled={localMatchData.matchStarted} >Start match</TeamButton>
      </div>
      <div>
        <TeamButton onClick={() => handleSetCurrentServer('teamA')} disabled={!localMatchData.matchStarted || rallyStage !== 'start'}>Team A Serves</TeamButton>
        <TeamButton onClick={() => handleSetCurrentServer('teamB')} disabled={!localMatchData.matchStarted || rallyStage !== 'start'} >Team B Serves</TeamButton>
      </div>

      <ScoreBoard
        teams={teams}
        teamLogos={teamLogos}
        scores={localMatchData.scores}
        setsWon={localMatchData.setsWon}
        currentServer={localMatchData.currentServer}
        ballPossession={localMatchData.ballPossession}
        matchStarted={localMatchData.matchStarted}
        onAdjustScore={handleAdjustScore}
      />
      <TimeoutContainer>
        <TimeoutButton
          onClick={() => handleTimeout('teamA')}
          disabled={!localMatchData.matchStarted || localMatchData.timeouts.teamA >= 2 || rallyStage !== 'start'}
        >
          Team A Timeout ({localMatchData.timeouts.teamA}/2)
        </TimeoutButton>
        <TimeoutButton
          onClick={() => handleTimeout('teamB')}
          disabled={!localMatchData.matchStarted || localMatchData.timeouts.teamB >= 2 || rallyStage !== 'start'}
        >
          Team B Timeout ({localMatchData.timeouts.teamB}/2)
        </TimeoutButton>
      </TimeoutContainer>

      <RallyControl
        teams={teams}
        currentServer={localMatchData.currentServer}
        ballPossession={localMatchData.ballPossession}
        onRallyEnd={handleRallyEnd}
        updateBallPossession={updateBallPossession}
        matchStarted={localMatchData.matchStarted}
        onSetCurrentServer={handleSetCurrentServer}
        onRallyStageChange={handleRallyStageChange}
      />
      <Statistics teams={teams} statistics={localMatchData.statistics} />
      <div>
        <h2>Set Scores</h2>
        {localMatchData.setScores.map((setScore, index) => (
          <p key={index}>Set {index + 1}: Team A {setScore.teamA} - Team B {setScore.teamB}</p>
        ))}
      </div>
    </MatchContainer>
  );
}

export default Match;
