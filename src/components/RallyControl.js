import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const RallyControlContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  position: relative;
`;

const ActionButton = styled.button`
  margin: 5px;
`;

const FaultButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const TeamFaultButton = styled.div`
  flex: 1;
  text-align: center;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const LeftButton = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
`;

const CenterButtons = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
`;

const RightButton = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;

const ConfirmationContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
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

function RallyControl({ teams, currentServer, ballPossession, onRallyEnd, updateBallPossession, matchStarted }) {
  const [rallyStage, setRallyStage] = useState('start');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDiscardConfirmation, setShowDiscardConfirmation] = useState(false);
  const [currentPossession, setCurrentPossession] = useState(ballPossession);
  const initialPossession = useRef(ballPossession); // Use useRef to store initial possession
  const [actionHistory, setActionHistory] = useState([]);
  const [statsUpdate, setStatsUpdate] = useState({
    teamA: {
      serve: 0,
      ace: 0,
      serveError: 0,
      reception: 0,
      receptionError: 0,
      dig: 0,
      attack: 0,
      attackError: 0,
      block: 0,
      blockPoint: 0,
    },
    teamB: {
      serve: 0,
      ace: 0,
      serveError: 0,
      reception: 0,
      receptionError: 0,
      dig: 0,
      attack: 0,
      attackError: 0,
      block: 0,
      blockPoint: 0,
    },
  });

  useEffect(() => {
    setCurrentPossession(ballPossession);
    if (!initialPossession.current) {
      initialPossession.current = ballPossession; // Set initial possession once
    }
  }, [ballPossession]);

  const handleAction = (action) => {
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
        updateBallPossession(opposingTeam); // Update possession
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
        updateBallPossession(opposingTeam); // Update possession
        setRallyStage('afterBlock');
        setActionHistory([...actionHistory, { action, team: opposingTeam, rallyStage }]);
        break;
      case 'continue':
        setRallyStage('afterReception');
        setActionHistory([...actionHistory, { action, team, rallyStage }]);
        break;
      case 'dig':
        newStatsUpdate[opposingTeam].dig += 1;
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam); // Update possession
        setRallyStage('afterReception');
        setActionHistory([...actionHistory, { action, team: opposingTeam, rallyStage }]);
        break;
      case 'error':
        if (rallyStage === 'afterServe') {
          newStatsUpdate[team].serveError += 1;
        } else if (rallyStage === 'afterReception') {
          newStatsUpdate[team].receptionError += 1;
        } else if (rallyStage === 'afterAttack') {
          newStatsUpdate[team].attackError += 1;
        }
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam); // Update possession
        setShowConfirmation(true);
        setActionHistory([...actionHistory, { action, team, rallyStage }]);
        break;
      case 'fault':
        // Award point and possession to the opposing team
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam); // Update possession
        setShowConfirmation(true);
        setActionHistory([...actionHistory, { action, team, rallyStage }]);
        break;
      case 'point':
        if (rallyStage === 'afterServe') {
          newStatsUpdate[team].ace += 1;
        } else if (rallyStage === 'afterBlock') {
          newStatsUpdate[team].blockPoint += 1;
        }
        setShowConfirmation(true);
        setActionHistory([...actionHistory, { action, team, rallyStage }]);
        break;
      default:
        break;
    }

    setStatsUpdate(newStatsUpdate);
  };

  const handleUndo = () => {
    if (actionHistory.length === 0) return;

    const lastAction = actionHistory[actionHistory.length - 1];
    const { action, team, rallyStage: previousStage } = lastAction;
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
        }
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        break;
      case 'fault':
        setCurrentPossession(opposingTeam);
        updateBallPossession(opposingTeam);
        break;
      case 'point':
        if (previousStage === 'afterServe') {
          newStatsUpdate[team].ace -= 1;
        } else if (previousStage === 'afterBlock') {
          newStatsUpdate[team].blockPoint -= 1;
        }
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
        attack: 0,
        attackError: 0,
        block: 0,
        blockPoint: 0,
      },
      teamB: {
        serve: 0,
        ace: 0,
        serveError: 0,
        reception: 0,
        receptionError: 0,
        dig: 0,
        attack: 0,
        attackError: 0,
        block: 0,
        blockPoint: 0,
      },
    });

    setActionHistory([]);
    setRallyStage('start');
    setShowConfirmation(false);
  };

  const handleCancelConfirmation = () => {
    handleUndo();
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
        attack: 0,
        attackError: 0,
        block: 0,
        blockPoint: 0,
      },
      teamB: {
        serve: 0,
        ace: 0,
        serveError: 0,
        reception: 0,
        receptionError: 0,
        dig: 0,
        attack: 0,
        attackError: 0,
        block: 0,
        blockPoint: 0,
      },
    });

    setActionHistory([]);
    setRallyStage('start');
    setCurrentPossession(initialPossession.current); // Reset possession to initial state
    updateBallPossession(initialPossession.current); // Update possession
    setShowDiscardConfirmation(false);
  };

  const renderActionButtons = () => {
    switch (rallyStage) {
      case 'start':
        return (
          <CenterButtons>
            <ActionButton onClick={() => handleAction('serve')} disabled={!currentServer}>Serve</ActionButton>
          </CenterButtons>
        );
      case 'afterServe':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')} disabled={!currentServer}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('reception')} disabled={!currentServer}>Reception</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')} disabled={!currentServer}>Point</ActionButton>
            </RightButton>
          </>
        );
      case 'afterReception':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')} disabled={!currentServer}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('attack')} disabled={!currentServer}>Attack</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')} disabled={!currentServer}>Point</ActionButton>
            </RightButton>
          </>
        );
      case 'afterAttack':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')} disabled={!currentServer}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('block')} disabled={!currentServer}>Block</ActionButton>
              <ActionButton onClick={() => handleAction('dig')} disabled={!currentServer}>Dig</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')} disabled={!currentServer}>Point</ActionButton>
            </RightButton>
          </>
        );
      case 'afterBlock':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')} disabled={!currentServer}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('continue')} disabled={!currentServer}>Continue</ActionButton>
              <ActionButton onClick={() => handleAction('dig')} disabled={!currentServer}>Dig</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')} disabled={!currentServer}>Point</ActionButton>
            </RightButton>
          </>
        );
      default:
        return null;
    }
  };

  const renderPreviousActionText = () => {
    if (actionHistory.length === 0) return 'No actions to undo';

    const lastAction = actionHistory[actionHistory.length - 1];
    const { action, team } = lastAction;
    const teamName = teams[team] || team; // Fallback to team key if name is not set
    return `Previous action: ${action} by ${teamName}`;
  };

  return (
    <RallyControlContainer>
      <UndoContainer>
        <PreviousActionText>{renderPreviousActionText()}</PreviousActionText>
        <ActionButton onClick={handleUndo} disabled={actionHistory.length === 0}>Go Back</ActionButton>
        <ActionButton onClick={handleDiscardRally}>Discard Rally</ActionButton>
      </UndoContainer>
      <FaultButtonsContainer>
        <TeamFaultButton>
          <ActionButton onClick={() => handleAction('fault')} disabled={!currentServer}>Fault {teams.teamA}</ActionButton>
        </TeamFaultButton>
        <TeamFaultButton>
          <ActionButton onClick={() => handleAction('fault')} disabled={!currentServer}>Fault {teams.teamB}</ActionButton>
        </TeamFaultButton>
      </FaultButtonsContainer>
      <ActionButtonsContainer>
        {renderActionButtons()}
      </ActionButtonsContainer>
      {showConfirmation && (
        <Overlay>
          <ConfirmationContainer>
            <p>Confirm end of rally?</p>
            <ActionButton onClick={handleEndRally}>Confirm</ActionButton>
            <ActionButton onClick={handleCancelConfirmation}>Cancel</ActionButton>
          </ConfirmationContainer>
        </Overlay>
      )}
      {showDiscardConfirmation && (
        <Overlay>
          <ConfirmationContainer>
            <p>Are you sure you want to discard the entire rally?</p>
            <ActionButton onClick={confirmDiscardRally}>Yes, Discard</ActionButton>
            <ActionButton onClick={() => setShowDiscardConfirmation(false)}>Cancel</ActionButton>
          </ConfirmationContainer>
        </Overlay>
      )}
    </RallyControlContainer>
  );
}

export default RallyControl;
