import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const RallyControlContainer = styled.div`
  width: 100%;
  margin-top: 20px;
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

const ServingIndicator = styled.div`
  text-align: center;
  font-weight: bold;
  color: #007BFF; /* Blue color for serving indicator */
  margin-bottom: 10px;
`;

function RallyControl({ teams, currentServer, ballPossession, onRallyEnd }) {
  const [rallyStage, setRallyStage] = useState('start');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentPossession, setCurrentPossession] = useState(ballPossession);
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
  }, [ballPossession]);

  const handleAction = (action) => {
    const currentTeam = currentPossession;
    const opposingTeam = currentPossession === 'teamA' ? 'teamB' : 'teamA';
    let newStatsUpdate = { ...statsUpdate };

    switch (action) {
      case 'serve':
        newStatsUpdate[currentTeam].serve += 1;
        setRallyStage('afterServe');
        break;
      case 'reception':
        newStatsUpdate[opposingTeam].reception += 1;
        setCurrentPossession(opposingTeam);
        setRallyStage('afterReception');
        break;
      case 'attack':
        newStatsUpdate[currentTeam].attack += 1;
        setRallyStage('afterAttack');
        break;
      case 'block':
        newStatsUpdate[opposingTeam].block += 1;
        setCurrentPossession(opposingTeam);
        setRallyStage('afterBlock');
        break;
      case 'continue':
        setRallyStage('afterReception');
        break;
      case 'dig':
        newStatsUpdate[opposingTeam].dig += 1;
        setCurrentPossession(opposingTeam);
        setRallyStage('afterReception');
        break;
      case 'error':
        if (rallyStage === 'afterServe') {
          newStatsUpdate[currentTeam].serveError += 1;
        } else if (rallyStage === 'afterReception') {
          newStatsUpdate[currentTeam].receptionError += 1;
        } else if (rallyStage === 'afterAttack') {
          newStatsUpdate[currentTeam].attackError += 1;
        }
        setCurrentPossession(opposingTeam);
        setShowConfirmation(true);
        break;
      case 'fault':
        setCurrentPossession(opposingTeam);
        setShowConfirmation(true);
        break;
      case 'point':
        if (rallyStage === 'afterServe') {
          newStatsUpdate[currentTeam].ace += 1;
        } else if (rallyStage === 'afterBlock') {
          newStatsUpdate[currentTeam].blockPoint += 1;
        }
        setShowConfirmation(true);
        break;
      default:
        break;
    }

    setStatsUpdate(newStatsUpdate);
  };

  const handleEndRally = () => {
    onRallyEnd(currentPossession, statsUpdate);

    // Reset statsUpdate after determining possession change
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

    setRallyStage('start');
    setShowConfirmation(false);
  };

  const renderActionButtons = () => {
    switch (rallyStage) {
      case 'start':
        return (
          <CenterButtons>
            <ActionButton onClick={() => handleAction('serve')}>Serve</ActionButton>
          </CenterButtons>
        );
      case 'afterServe':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('reception')}>Reception</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')}>Point</ActionButton>
            </RightButton>
          </>
        );
      case 'afterReception':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('attack')}>Attack</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')}>Point</ActionButton>
            </RightButton>
          </>
        );
      case 'afterAttack':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('block')}>Block</ActionButton>
              <ActionButton onClick={() => handleAction('dig')}>Dig</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')}>Point</ActionButton>
            </RightButton>
          </>
        );
      case 'afterBlock':
        return (
          <>
            <LeftButton>
              <ActionButton onClick={() => handleAction('error')}>Error</ActionButton>
            </LeftButton>
            <CenterButtons>
              <ActionButton onClick={() => handleAction('continue')}>Continue</ActionButton>
              <ActionButton onClick={() => handleAction('dig')}>Dig</ActionButton>
            </CenterButtons>
            <RightButton>
              <ActionButton onClick={() => handleAction('point')}>Point</ActionButton>
            </RightButton>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <RallyControlContainer>
      <ServingIndicator>
        Serving: {currentServer ? teams[currentServer] : 'None'}
      </ServingIndicator>
      <h3>Ball Possession: {currentPossession ? teams[currentPossession] : 'None'}</h3>
      <FaultButtonsContainer>
        <TeamFaultButton>
          <ActionButton onClick={() => handleAction('fault', 'teamA')}>Fault {teams.teamA}</ActionButton>
        </TeamFaultButton>
        <TeamFaultButton>
          <ActionButton onClick={() => handleAction('fault', 'teamB')}>Fault {teams.teamB}</ActionButton>
        </TeamFaultButton>
      </FaultButtonsContainer>
      <ActionButtonsContainer>{renderActionButtons()}</ActionButtonsContainer>
      {showConfirmation && (
        <div>
          <p>Confirm end of rally?</p>
          <ActionButton onClick={handleEndRally}>Confirm</ActionButton>
          <ActionButton onClick={() => setShowConfirmation(false)}>Cancel</ActionButton>
        </div>
      )}
    </RallyControlContainer>
  );
}

export default RallyControl;
