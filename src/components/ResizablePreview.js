// ResizablePreview.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';

// Styled components for the resizable box and iframe
const PreviewContainer = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
`;

const IframeWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  border: 1px solid gray;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  background-color: white;
`;

const NATIVE_WIDTH = 1280;
const NATIVE_HEIGHT = 720;

const ResizablePreview = ({ src }) => {
  const [size, setSize] = useState({ width: 400, height: 225 });
  const scale = size.width / NATIVE_WIDTH;

  const onResize = (event, { size }) => {
    setSize(size);
  };

  return (
    <PreviewContainer>
      <ResizableBox
        width={size.width}
        height={size.height}
        minConstraints={[128, 72]}
        maxConstraints={[1280, 720]}
        lockAspectRatio={true}
        resizeHandles={['se']}
        onResizeStop={onResize}
        style={{ margin: '5px' }}
      >
        <IframeWrapper>
          <iframe
            src={src}
            title="External website preview (Scaled)"
            width={NATIVE_WIDTH}
            height={NATIVE_HEIGHT}
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              border: 'none',
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
            }}
          />
        </IframeWrapper>
      </ResizableBox>
    </PreviewContainer>
  );
};

export default ResizablePreview;
