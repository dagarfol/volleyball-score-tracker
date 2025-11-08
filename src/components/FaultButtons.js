import React from 'react';
import styled from 'styled-components';

const FaultButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const FaultButton = styled.button`
  margin: 5px;
  padding: 10px 20px;
  background-color: ${({ disabled }) => {
    if (disabled) {
      return '#ccc'; // Gray for disabled buttons
    }
    return '#FF4500'; // OrangeRed for fault buttons
  }};
  color: white;
  border: none;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-size: 1em;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  border-radius: 5px;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
  &:hover:enabled { background-color: #df3b00ff; }
`;

function FaultButtons({ teams, currentServer, handleAction }) {
  return (
    <FaultButtonContainer>
      {Object.keys(teams).map((team) => (
        <FaultButton
          key={team}
          onClick={() => handleAction('fault', team)}
          disabled={!currentServer}
        >
          Fault {team}
        </FaultButton>
      ))}
    </FaultButtonContainer>
  );
}

export default FaultButtons;
