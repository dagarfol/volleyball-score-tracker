import React from 'react';
import styled from 'styled-components';

const FaultButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const TeamFaultButton = styled.div`
  flex: 1;
  text-align: center;
`;

const ActionButton = styled.button`
  margin: 5px;
`;

function FaultButtons({ teams, currentServer, handleAction }) {
  return (
    <FaultButtonsContainer>
      <TeamFaultButton>
        <ActionButton onClick={() => handleAction('fault', 'teamA')} disabled={!currentServer}>
          Fault {teams.teamA}
        </ActionButton>
      </TeamFaultButton>
      <TeamFaultButton>
        <ActionButton onClick={() => handleAction('fault', 'teamB')} disabled={!currentServer}>
          Fault {teams.teamB}
        </ActionButton>
      </TeamFaultButton>
    </FaultButtonsContainer>
  );
}

export default FaultButtons;
