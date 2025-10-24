import React from 'react';
import styled from 'styled-components';

const ActionButton = styled.button`
  margin: 5px;
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

function ActionButtons({ rallyStage, currentServer, handleAction }) {
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
      case 'afterDig':
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

  return (
    <ActionButtonsContainer>
      {renderActionButtons()}
    </ActionButtonsContainer>
  );
}

export default ActionButtons;
