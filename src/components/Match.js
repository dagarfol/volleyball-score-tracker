import React, { useReducer, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ScoreBoard from './ScoreBoard';
import RallyControl from './RallyControl';
import Statistics from './Statistics';

// --- Styled Components ---

const MatchContainer = styled.div`
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

const NavigationButton = styled.button`
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover { background-color: #0056b3; }
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
  },
});

// --- Reducer and Initial State ---

// Define the initial state structure clearly
const initialState = {
  scores: { teamA: 0, teamB: 0 },
  setsWon: { teamA: 0, teamB: 0 },
  currentServer: null,
  ballPossession: null,
  matchStarted: false,
  timeouts: { teamA: 0, teamB: 0 },
  statistics: {
    teamA: { serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0 },
    teamB: { serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0 },
  },
};

const matchReducer = (state, action) => {
  switch (action.type) {
    case 'START_MATCH':
      return {
        ...state,
        currentServer: action.server,
        ballPossession: action.server,
        matchStarted: true,
      };
    case 'UPDATE_BALL_POSSESSION':
      return { ...state, ballPossession: action.newPossession };
    case 'RALLY_END': {
      const { winner, statsUpdate } = action;
      const newScores = {
        ...state.scores,
        [winner]: state.scores[winner] + 1,
      };
      const updatedStatistics = calculateUpdatedStatistics(state.statistics, statsUpdate);
      return {
        ...state,
        scores: newScores,
        statistics: updatedStatistics,
      };
    }
    case 'TIMEOUT':
      return {
        ...state,
        timeouts: {
          ...state.timeouts,
          [action.team]: state.timeouts[action.team] + 1,
        },
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
        // This action handles all the complex set/match win logic within the reducer flow
        const { maxSets, teams, navigateCallback, setParentMatchDataCallback } = action;
        const scoreDifference = Math.abs(state.scores.teamA - state.scores.teamB);
        const isTiebreakerSet = state.setsWon.teamA + state.setsWon.teamB === maxSets - 1;
        const requiredPoints = isTiebreakerSet ? 15 : 25;

        let newSetsWon = { ...state.setsWon };
        let newScores = { ...state.scores };
        let matchEnded = false;
        let setEnded = false;

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
        
        // This is a side effect within the reducer action (not ideal React practice but necessary for navigation/external state sync)
        if (matchEnded) {
            alert(`${newSetsWon.teamA > newSetsWon.teamB ? teams.teamA : teams.teamB} wins the match!`);
            navigateCallback('/');
            // We return the initial state for clean up internally, but the navigation handles flow
            setParentMatchDataCallback(initialState); // Ensure parent state is also cleared
            return initialState;
        } else if (setEnded) {
            // Update internal state for new set
            const newState = {
                ...state,
                scores: newScores,
                setsWon: newSetsWon,
                timeouts: { teamA: 0, teamB: 0 }, // Reset timeouts at the start of a new set
            };
            setParentMatchDataCallback(newState); // Sync with parent state
            return newState;
        } else {
            // No set/match end, just sync the current score changes to the parent state if needed
            setParentMatchDataCallback(state);
            return state; // Return current state unchanged
        }
    }
    case 'RESET_MATCH':
      return initialState;
    default:
      return state;
  }
};

// --- Main Match Component ---

function Match({ matchDetails, matchData, setMatchData }) {
  const { teams, teamLogos, matchHeader, stadium, extendedInfo, maxSets } = matchDetails;
  const navigate = useNavigate();
  // Using a local reducer for the active match state
  const [localMatchData, dispatch] = useReducer(matchReducer, matchData || initialState);

  // Define callbacks that never change to pass to the reducer action without breaking rules
  const navigateCallback = useCallback((path) => navigate(path), [navigate]);
  const setParentMatchDataCallback = useCallback((data) => setMatchData(data), [setMatchData]);


  // Effect hook to run the game end logic after a score update happens via the reducer
  useEffect(() => {
    // This effect runs whenever scores change in localMatchData
    dispatch({
      type: 'PROCESS_GAME_END',
      maxSets,
      teams,
      navigateCallback,
      setParentMatchDataCallback
    });
    // The dependency array now includes all variables used inside the effect, satisfying the linter.
    // We *must* use localMatchData.scores and .setsWon here to ensure the effect runs only when points are scored/sets won.
  }, [localMatchData.scores, localMatchData.setsWon, maxSets, teams, navigateCallback, setParentMatchDataCallback]);


  const handleStartMatch = (server) => {
    dispatch({ type: 'START_MATCH', server });
  };

  const updateBallPossession = (newPossession) => {
    dispatch({ type: 'UPDATE_BALL_POSSESSION', newPossession });
  };

  const handleRallyEnd = (winner, statsUpdate = {}) => {
    dispatch({ type: 'RALLY_END', winner, statsUpdate });
    // The useEffect will pick up the score change from RALLY_END and process the set/match logic
  };

  const handleTimeout = (team) => {
    dispatch({ type: 'TIMEOUT', team });
    // Timeouts don't trigger set end logic, so no need to rely on the effect here.
    setParentMatchDataCallback(localMatchData); // Sync parent state immediately for timeouts
  };

  const handleAdjustScore = (team, adjustment) => {
    dispatch({ type: 'ADJUST_SCORE', team, adjustment });
    // The useEffect will pick up the score change from ADJUST_SCORE and process the set/match logic
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
        scores={localMatchData.scores}
        setsWon={localMatchData.setsWon}
        currentServer={localMatchData.currentServer}
        ballPossession={localMatchData.ballPossession}
        onStartMatch={handleStartMatch}
        matchStarted={localMatchData.matchStarted}
        onAdjustScore={handleAdjustScore}
      />
      <TimeoutContainer>
        <TimeoutButton
          onClick={() => handleTimeout('teamA')}
          disabled={localMatchData.timeouts.teamA >= 2}
        >
          Team A Timeout ({localMatchData.timeouts.teamA}/2)
        </TimeoutButton>
        <TimeoutButton
          onClick={() => handleTimeout('teamB')}
          disabled={localMatchData.timeouts.teamB >= 2}
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
      />
      <Statistics teams={teams} statistics={localMatchData.statistics} />
    </MatchContainer>
  );
}

export default Match;
