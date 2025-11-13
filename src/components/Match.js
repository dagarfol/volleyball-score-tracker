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

const calculateComputedStats = (updatedStats, team) => {
  const opposingTeam = team === 'teamA' ? 'teamB' : 'teamA';
  return ({
    ...updatedStats,
    [team]: {
      ...updatedStats[team],
      serviceEffectiveness: calculatePercentage(updatedStats[team].ace - updatedStats[team].serveError, updatedStats[team].serve),
      receptionEffectiveness: calculatePercentage(updatedStats[team].reception - updatedStats[team].receptionError, updatedStats[opposingTeam].serve),
      attackEffectiveness: calculatePercentage(updatedStats[team].attackPoint - updatedStats[team].attackError, updatedStats[team].attack),
      defenseEffectiveness: calculatePercentage(updatedStats[team].dig - updatedStats[team].digError, updatedStats[opposingTeam].attack),
      selfErrors: (updatedStats[team].serveError + updatedStats[team].receptionError + updatedStats[team].digError + updatedStats[team].attackError + updatedStats[team].blockOut + updatedStats[team].fault)|| 0,
    }
  })
}

const updateStatsByTeam = (team, currentStats, statsUpdate) => ({
  serve: currentStats[team].serve + (statsUpdate[team]?.serve || 0),
  ace: currentStats[team].ace + (statsUpdate[team]?.ace || 0),
  serveError: currentStats[team].serveError + (statsUpdate[team]?.serveError || 0),
  reception: currentStats[team].reception + (statsUpdate[team]?.reception || 0),
  receptionError: currentStats[team].receptionError + (statsUpdate[team]?.receptionError || 0),
  dig: currentStats[team].dig + (statsUpdate[team]?.dig || 0),
  digError: currentStats[team].digError + (statsUpdate[team]?.digError || 0),
  attack: currentStats[team].attack + (statsUpdate[team]?.attack || 0),
  attackPoint: currentStats[team].attackPoint + (statsUpdate[team]?.attackPoint || 0),
  attackError: currentStats[team].attackError + (statsUpdate[team]?.attackError || 0),
  block: currentStats[team].block + (statsUpdate[team]?.block || 0),
  blockPoint: currentStats[team].blockPoint + (statsUpdate[team]?.blockPoint || 0),
  blockOut: currentStats[team].blockOut + (statsUpdate[team]?.blockOut || 0),
  fault: currentStats[team].fault + (statsUpdate[team]?.fault || 0),
});

const calculateUpdatedStatistics = (currentStats, statsUpdate) => {
  let updatedStats =
  {
    teamA: updateStatsByTeam('teamA', currentStats, statsUpdate),
    teamB: updateStatsByTeam('teamB', currentStats, statsUpdate),
  }
  updatedStats = calculateComputedStats(updatedStats, 'teamA');
  updatedStats = calculateComputedStats(updatedStats, 'teamB');
  return updatedStats;
};

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
    case 'UPDATE_SETS_WON':
      return {
        ...state,
        setsWon: {
          ...state.setsWon,
          [action.team]: action.newSetsWon,
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
        const winner = newSetsWon.teamA > newSetsWon.teamB ? "teamA" : "teamB";
        alert(`${teams[winner]} ha ganado el partido!`);
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

  const handleSetsWonChange = (team, newSetsWon) => {
    dispatch({
      type: 'UPDATE_SETS_WON',
      team,
      newSetsWon,
    });
  };

  return (
    <MatchContainer>
      <div>
        <TeamButton onClick={() => handleStartMatch()} disabled={localMatchData.matchStarted} >Iniciar partido</TeamButton>
      </div>
      <div>
        <TeamButton onClick={() => handleSetCurrentServer('teamA')} disabled={!localMatchData.matchStarted || rallyStage !== 'start'}>Saca Equipo A</TeamButton>
        <TeamButton onClick={() => handleSetCurrentServer('teamB')} disabled={!localMatchData.matchStarted || rallyStage !== 'start'}>Saca Equipo B</TeamButton>
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
        maxSets={maxSets}
        onSetsWonChange={handleSetsWonChange}
      />
      <TimeoutContainer>
        <TimeoutButton
          onClick={() => handleTimeout('teamA')}
          disabled={!localMatchData.matchStarted || localMatchData.timeouts.teamA >= 2 || rallyStage !== 'start'}
        >
          Tiempo Muerto (Equipo A)  ({localMatchData.timeouts.teamA}/2)
        </TimeoutButton>
        <TimeoutButton
          onClick={() => handleTimeout('teamB')}
          disabled={!localMatchData.matchStarted || localMatchData.timeouts.teamB >= 2 || rallyStage !== 'start'}
        >
          Tiempo Muerto (Equipo B) ({localMatchData.timeouts.teamB}/2)
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
        <h2>Marcadores por set</h2>
        {localMatchData.setScores.map((setScore, index) => (
          <p key={index}>Set {index + 1}: Team A {setScore.teamA} - Team B {setScore.teamB}</p>
        ))}
      </div>
    </MatchContainer>
  );
}

export default Match;
