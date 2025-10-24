import React from 'react';
import styled from 'styled-components';

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

const ActionButton = styled.button`
  margin: 5px;
`;

function ConfirmationDialog({ message, onConfirm, onCancel }) {
  return (
    <Overlay>
      <ConfirmationContainer>
        <p>{message}</p>
        <ActionButton onClick={onConfirm}>Confirm</ActionButton>
        <ActionButton onClick={onCancel}>Cancel</ActionButton>
      </ConfirmationContainer>
    </Overlay>
  );
}

export default ConfirmationDialog;
