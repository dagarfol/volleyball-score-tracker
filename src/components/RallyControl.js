import React, { useState, useEffect, useRef } from 'react';
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
`;

const ActionButton = styled.button`
  margin: 5px;
`;

function RallyControl({ teams, currentServer, ballPossession, onRallyEnd, updateBallPossession, matchStarted }) {
  const [rallyStage, setRallyStage] = useState('start');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [currentPossession, setCurrentPossession] = useState(ballPossession);
  const initialPossession = useRef(ballPossession);
  const [actionHistory, setActionHistory] = useState([]);
  const [statsUpdate, setStatsUpdate] = useState({
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
      fault: 0, // New stat for faults
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
      fault: 0, // New stat for faults
    },
  });

  useEffect(() => {
    setCurrentPossession(ballPossession);
    if (!initialPossession.current) {
      initialPossession.current = ballPossession;
    }
  }, [ballPossession]);

  const handleAction = (action, faultingTeam = null) => {
    const team = currentPossession;
    const opposingTeam = team === 'teamA' ? 'teamB' : 'teamA';
    let newStatsUpdate = { ...statsUpdate };

    switch (action) {
      case 'serve':
        newStatsUpdate[team].serve += 1;
        setRallyStage('afterServe');
        setActionHistory([...actionHistory, { action, team, rallyStage }]);
        break;
      case 'reception':
        newStatsUpdate[opposingTeam].reception += 1;
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        setRallyStage('afterReception');
        setActionHistory([...actionHistory, { action, team: opposingTeam, rallyStage }]);
        break;
      case 'attack':
        newStatsUpdate[team].attack += 1;
        setRallyStage('afterAttack');
        setActionHistory([...actionHistory, { action, team, rallyStage }]);
        break;
      case 'block':
        newStatsUpdate[opposingTeam].block += 1;
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        setRallyStage('afterBlock');
        setActionHistory([...actionHistory, { action, team: opposingTeam, rallyStage }]);
        break;
      case 'continue':
        setRallyStage('afterReception');
        setActionHistory([...actionHistory, { action, team, rallyStage }]);
        break;
      case 'dig':
        newStatsUpdate[opposingTeam].dig += 1;
        if (rallyStage === 'afterBlock') {
          newStatsUpdate[team].attack +=1;
        }
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        setRallyStage('afterDig');
        setActionHistory([...actionHistory, { action, team: opposingTeam, rallyStage }]);
        break;
      case 'error':
        if (rallyStage === 'afterServe') {
          newStatsUpdate[team].serveError += 1;
        } else if (rallyStage === 'afterReception') {
          newStatsUpdate[team].receptionError += 1;
        } else if (rallyStage === 'afterAttack') {
          newStatsUpdate[team].attackError += 1;
        } else if (rallyStage === 'afterDig') {
          newStatsUpdate[team].digError += 1;
        } else if (rallyStage === 'afterBlock') {
          newStatsUpdate[team].blockOut += 1;
        }
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        setShowConfirmation(true);
        setActionHistory([...actionHistory, { action, team, rallyStage, previousPossession: currentPossession }]);
        break;
      case 'fault':
        newStatsUpdate[faultingTeam].fault += 1; // Increment fault count
        const teamAwarded = faultingTeam === 'teamA' ? 'teamB' : 'teamA';
        setCurrentPossession(teamAwarded);
        updateBallPossession(teamAwarded);
        setShowConfirmation(true);
        setActionHistory([...actionHistory, { action, team: teamAwarded, rallyStage, previousPossession: currentPossession }]);
        break;
      case 'point':
        if (rallyStage === 'afterServe') {
          newStatsUpdate[team].ace += 1;
        } else if (rallyStage === 'afterBlock') {
          newStatsUpdate[team].blockPoint += 1;
        } else if (rallyStage === 'afterAttack') {
          newStatsUpdate[team].attackPoint += 1;
        }
        setShowConfirmation(true);
        setActionHistory([...actionHistory, { action, team, rallyStage, previousPossession: currentPossession }]);
        break;
      default:
        break;
    }

    setStatsUpdate(newStatsUpdate);
  };

  const handleUndo = () => {
    if (actionHistory.length === 0) return;

    const lastAction = actionHistory[actionHistory.length - 1];
    const { action, team, rallyStage: previousStage, previousPossession } = lastAction;
    const opposingTeam = team === 'teamA' ? 'teamB' : 'teamA';
    let newStatsUpdate = { ...statsUpdate };

    switch (action) {
      case 'serve':
        newStatsUpdate[team].serve -= 1;
        break;
      case 'reception':
        newStatsUpdate[team].reception -= 1;
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        break;
      case 'attack':
        newStatsUpdate[team].attack -= 1;
        break;
      case 'block':
        newStatsUpdate[team].block -= 1;
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        break;
      case 'dig':
        newStatsUpdate[team].dig -= 1;
        setCurrentPossession(opposingTeam);
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
        setCurrentPossession(previousPossession || opposingTeam);
        updateBallPossession(previousPossession || opposingTeam);
        break;
      case 'fault':
        newStatsUpdate[team].fault -= 1; // Decrement fault count
        setCurrentPossession(previousPossession);
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
        setCurrentPossession(previousPossession || team);
        updateBallPossession(previousPossession || team);
        break;
      default:
        break;
    }

    setStatsUpdate(newStatsUpdate);
    setActionHistory(actionHistory.slice(0, -1));
    setRallyStage(previousStage);
  };

  const handleEndRally = () => {
    onRallyEnd(currentPossession, statsUpdate);

    setStatsUpdate({
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

    setActionHistory([]);
    setRallyStage('start');
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    handleUndo(); // Undo the last action
    setShowConfirmation(false);
  };

  const handleDiscardRally = () => {
    setShowDiscardConfirmation(true);
  };

  const confirmDiscardRally = () => {
    setStatsUpdate({
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

    setActionHistory([]);
    setRallyStage('start');
    setCurrentPossession(initialPossession.current);
    updateBallPossession(initialPossession.current);
    setShowDiscardConfirmation(false);
  };

  const renderPreviousActionText = () => {
    if (actionHistory.length === 0) return 'No actions to undo';

    const lastAction = actionHistory[actionHistory.length - 1];
    const { action, team } = lastAction;
    const teamName = teams[team] || team;
    return `Previous action: ${action} by ${teamName}`;
  };

  return (
    <RallyControlContainer>
      <UndoContainer>
        <PreviousActionText>{renderPreviousActionText()}</PreviousActionText>
        <ActionButton onClick={handleUndo} disabled={actionHistory.length === 0}>Go Back</ActionButton>
        <ActionButton onClick={handleDiscardRally} disabled={!currentServer}>Discard Rally</ActionButton>
      </UndoContainer>
      <FaultButtons teams={teams} currentServer={currentServer} handleAction={handleAction} />
      <ActionButtons
        rallyStage={rallyStage}
        currentServer={currentServer}
        handleAction={handleAction}
      />
      {showConfirmation && (
        <ConfirmationDialog
          message="Confirm end of rally?"
          onConfirm={handleEndRally}
          onCancel={handleCancelConfirmation}
        />
      )}
      {showDiscardConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to discard the entire rally?"
          onConfirm={confirmDiscardRally}
          onCancel={() => setShowDiscardConfirmation(false)}
        />
      )}
    </RallyControlContainer>
  );
}

export default RallyControl;
