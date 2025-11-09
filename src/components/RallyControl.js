import React, { useReducer, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ActionButtons from './ActionButtons';
import ConfirmationDialog from './ConfirmationDialog';
import FaultButtons from './FaultButtons';

const RallyControlContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  position: relative;
`;

const UndoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PreviousActionText = styled.p`
  margin: 0;
  font-size: 0.9em;
  color: #555;
  width: 45%;
`;

const StyledButton = styled.button`
  margin: 5px;
  padding: 10px 20px;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#3f382eff')};
  color: white;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 1em;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  border-radius: 5px;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:enabled { background-color: #302414ff; }
`;

const initialState = {
  rallyStage: 'start',
  showConfirmation: false,
  showDiscardConfirmation: false,
  currentPossession: null,
  actionHistory: [],
  statsUpdate: {
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
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_POSSESSION':
      return { ...state, currentPossession: action.payload };
    case 'UPDATE_STATS':
      return { ...state, statsUpdate: action.payload };
    case 'ADD_ACTION':
      return { ...state, actionHistory: [...state.actionHistory, action.payload] };
    case 'UNDO_ACTION':
      return { ...state, actionHistory: state.actionHistory.slice(0, -1) };
    case 'SET_RALLY_STAGE':
      return { ...state, rallyStage: action.payload };
    case 'TOGGLE_CONFIRMATION':
      return { ...state, showConfirmation: action.payload };
    case 'TOGGLE_DISCARD_CONFIRMATION':
      return { ...state, showDiscardConfirmation: action.payload };
    case 'RESET_STATS':
      return {
        ...state,
        statsUpdate: {
          teamA: {
            serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0,
          },
          teamB: {
            serve: 0, ace: 0, serveError: 0, reception: 0, receptionError: 0, dig: 0, digError: 0, attack: 0, attackPoint: 0, attackError: 0, block: 0, blockPoint: 0, blockOut: 0, fault: 0,
          },
        },
        actionHistory: [],
        rallyStage: 'start'
      };
    default:
      return state;
  }
}

function RallyControl({ teams, currentServer, ballPossession, onRallyEnd, updateBallPossession, onRallyStageChange }) {
  const [state, dispatch] = useReducer(reducer, { ...initialState, currentPossession: currentServer });
  const initialPossession = useRef(currentServer);

  useEffect(() => {
    dispatch({ type: 'SET_POSSESSION', payload: ballPossession });
  }, [ballPossession]);

    useEffect(() => {
    // Update initial possession whenever currentServer changes
    initialPossession.current = currentServer;
  }, [currentServer]);

  useEffect(() => {
    onRallyStageChange(state.rallyStage);
  }, [state.rallyStage, onRallyStageChange]);

  const handleAction = (action, faultingTeam = null) => {
    const team = state.currentPossession;
    const opposingTeam = team === 'teamA' ? 'teamB' : 'teamA';
    let newStatsUpdate = { ...state.statsUpdate };

    switch (action) {
      case 'serve':
        newStatsUpdate[team].serve += 1;
        dispatch({ type: 'ADD_ACTION', payload: { action, team, rallyStage: state.rallyStage } });
        dispatch({ type: 'SET_RALLY_STAGE', payload: 'afterServe' });
        break;
      case 'reception':
        newStatsUpdate[opposingTeam].reception += 1;
        dispatch({ type: 'ADD_ACTION', payload: { action, team: opposingTeam, rallyStage: state.rallyStage } });
        dispatch({ type: 'SET_POSSESSION', payload: opposingTeam });
        updateBallPossession(opposingTeam);
        dispatch({ type: 'SET_RALLY_STAGE', payload: 'afterReception' });
        break;
      case 'attack':
        newStatsUpdate[team].attack += 1;
        dispatch({ type: 'ADD_ACTION', payload: { action, team, rallyStage: state.rallyStage } });
        dispatch({ type: 'SET_RALLY_STAGE', payload: 'afterAttack' });
        break;
      case 'block':
        newStatsUpdate[opposingTeam].block += 1;
        dispatch({ type: 'ADD_ACTION', payload: { action, team: opposingTeam, rallyStage: state.rallyStage } });
        dispatch({ type: 'SET_POSSESSION', payload: opposingTeam });
        updateBallPossession(opposingTeam);
        dispatch({ type: 'SET_RALLY_STAGE', payload: 'afterBlock' });
        break;
      case 'continue':
        newStatsUpdate[team].dig += 1;
        dispatch({ type: 'ADD_ACTION', payload: { action, team, rallyStage: state.rallyStage } });
        dispatch({ type: 'SET_RALLY_STAGE', payload: 'afterDig' });
        break;
      case 'dig':
        newStatsUpdate[opposingTeam].dig += 1;
        if (state.rallyStage === 'afterBlock') {
          newStatsUpdate[team].attack += 1;
        }
        dispatch({ type: 'ADD_ACTION', payload: { action, team: opposingTeam, rallyStage: state.rallyStage } });
        dispatch({ type: 'SET_POSSESSION', payload: opposingTeam });
        updateBallPossession(opposingTeam);
        dispatch({ type: 'SET_RALLY_STAGE', payload: 'afterDig' });
        break;
      case 'error':
        if (state.rallyStage === 'afterServe') {
          newStatsUpdate[team].serveError += 1;
        } else if (state.rallyStage === 'afterReception') {
          newStatsUpdate[team].receptionError += 1;
        } else if (state.rallyStage === 'afterAttack') {
          newStatsUpdate[team].attackError += 1;
        } else if (state.rallyStage === 'afterDig') {
          newStatsUpdate[team].digError += 1;
        } else if (state.rallyStage === 'afterBlock') {
          newStatsUpdate[team].blockOut += 1;
        }
        dispatch({ type: 'ADD_ACTION', payload: { action, team, rallyStage: state.rallyStage, previousPossession: state.currentPossession } });
        dispatch({ type: 'SET_POSSESSION', payload: opposingTeam });
        updateBallPossession(opposingTeam);
        dispatch({ type: 'TOGGLE_CONFIRMATION', payload: true });
        break;
      case 'fault':
        newStatsUpdate[faultingTeam].fault += 1;
        const teamAwarded = faultingTeam === 'teamA' ? 'teamB' : 'teamA';
        dispatch({ type: 'ADD_ACTION', payload: { action, team: faultingTeam, rallyStage: state.rallyStage, previousPossession: state.currentPossession } });
        dispatch({ type: 'SET_POSSESSION', payload: teamAwarded });
        updateBallPossession(teamAwarded);
        dispatch({ type: 'TOGGLE_CONFIRMATION', payload: true });
        break;
      case 'point':
        if (state.rallyStage === 'afterServe') {
          newStatsUpdate[team].ace += 1;
        } else if (state.rallyStage === 'afterBlock') {
          newStatsUpdate[team].blockPoint += 1;
        } else if (state.rallyStage === 'afterAttack') {
          newStatsUpdate[team].attackPoint += 1;
        }
        dispatch({ type: 'TOGGLE_CONFIRMATION', payload: true });
        dispatch({ type: 'ADD_ACTION', payload: { action, team, rallyStage: state.rallyStage, previousPossession: state.currentPossession } });
        break;
      default:
        break;
    }

    dispatch({ type: 'UPDATE_STATS', payload: newStatsUpdate });
  };

  const handleUndo = () => {
    if (state.actionHistory.length === 0) return;

    const lastAction = state.actionHistory[state.actionHistory.length - 1];
    const { action, team, rallyStage: previousStage, previousPossession } = lastAction;
    const opposingTeam = team === 'teamA' ? 'teamB' : 'teamA';
    let newStatsUpdate = { ...state.statsUpdate };

    switch (action) {
      case 'serve':
        newStatsUpdate[team].serve -= 1;
        break;
      case 'reception':
        newStatsUpdate[team].reception -= 1;
        dispatch({ type: 'SET_POSSESSION', payload: opposingTeam });
        updateBallPossession(opposingTeam);
        break;
      case 'attack':
        newStatsUpdate[team].attack -= 1;
        break;
      case 'block':
        newStatsUpdate[team].block -= 1;
        dispatch({ type: 'SET_POSSESSION', payload: opposingTeam });
        updateBallPossession(opposingTeam);
        break;
      case 'dig':
        newStatsUpdate[team].dig -= 1;
        dispatch({ type: 'SET_POSSESSION', payload: opposingTeam });
        updateBallPossession(opposingTeam);
        break;
      case 'error':
        if (previousStage === 'afterServe') {
          newStatsUpdate[team].serveError -= 1;
        } else if (previousStage === 'afterReception') {
          newStatsUpdate[team].receptionError -= 1;
        } else if (previousStage === 'afterAttack') {
          newStatsUpdate[team].attackError -= 1;
        } else if (previousStage === 'afterDig') {
          newStatsUpdate[team].digError -= 1;
        } else if (previousStage === 'afterBlock') {
          newStatsUpdate[team].blockOut -= 1;
        }
        dispatch({ type: 'SET_POSSESSION', payload: previousPossession || opposingTeam });
        updateBallPossession(previousPossession || opposingTeam);
        break;
      case 'fault':
        newStatsUpdate[team].fault -= 1;
        dispatch({ type: 'SET_POSSESSION', payload: previousPossession });
        updateBallPossession(previousPossession);
        break;
      case 'point':
        if (previousStage === 'afterServe') {
          newStatsUpdate[team].ace -= 1;
        } else if (previousStage === 'afterBlock') {
          newStatsUpdate[team].blockPoint -= 1;
        } else if (previousStage === 'afterAttack') {
          newStatsUpdate[team].attackPoint -= 1;
        }
        dispatch({ type: 'SET_POSSESSION', payload: previousPossession || team });
        updateBallPossession(previousPossession || team);
        break;
      default:
        break;
    }

    dispatch({ type: 'UPDATE_STATS', payload: newStatsUpdate });
    dispatch({ type: 'UNDO_ACTION' });
    dispatch({ type: 'SET_RALLY_STAGE', payload: previousStage });
  };

  const handleEndRally = () => {
    const lastAction = state.actionHistory[state.actionHistory.length - 1];
    const faultingTeam = lastAction?.action === 'fault' ? lastAction.team : null;
    onRallyEnd(state.currentPossession, state.statsUpdate, faultingTeam);
    dispatch({ type: 'RESET_STATS' });
    dispatch({ type: 'TOGGLE_CONFIRMATION', payload: false });
  };

  const handleCancelConfirmation = () => {
    handleUndo();
    dispatch({ type: 'TOGGLE_CONFIRMATION', payload: false });
  };

  const handleDiscardRally = () => {
    dispatch({ type: 'TOGGLE_DISCARD_CONFIRMATION', payload: true });
  };

  const confirmDiscardRally = () => {
    dispatch({ type: 'RESET_STATS' });
    dispatch({ type: 'SET_POSSESSION', payload: initialPossession.current });
    updateBallPossession(initialPossession.current, true);
    dispatch({ type: 'TOGGLE_DISCARD_CONFIRMATION', payload: false });
  };

  const renderPreviousActionText = () => {
    if (state.actionHistory.length === 0) return 'No actions to undo';

    const lastAction = state.actionHistory[state.actionHistory.length - 1];
    const { action, team } = lastAction;
    const teamName = teams[team] || team;
    return `Previous action: ${action} by ${teamName}`;
  };

  return (
    <RallyControlContainer>
      <UndoContainer>
        <PreviousActionText>{renderPreviousActionText()}</PreviousActionText>
        <StyledButton onClick={handleUndo} disabled={state.actionHistory.length === 0}>Go Back</StyledButton>
        <StyledButton onClick={handleDiscardRally} disabled={!currentServer}>Discard Rally</StyledButton>
      </UndoContainer>
      <FaultButtons teams={teams} currentServer={currentServer} handleAction={handleAction} />
      <ActionButtons
        rallyStage={state.rallyStage}
        currentServer={currentServer}
        currentPossession={ballPossession}
        handleAction={handleAction}
      />
      {state.showConfirmation && (
        <ConfirmationDialog
          message="Confirm end of rally?"
          onConfirm={handleEndRally}
          onCancel={handleCancelConfirmation}
        />
      )}
      {state.showDiscardConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to discard the entire rally?"
          onConfirm={confirmDiscardRally}
          onCancel={() => dispatch({ type: 'TOGGLE_DISCARD_CONFIRMATION', payload: false })}
        />
      )}
    </RallyControlContainer>
  );
}

export default RallyControl;
