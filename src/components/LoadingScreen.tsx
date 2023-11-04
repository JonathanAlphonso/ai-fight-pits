// src/components/Loading.tsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Loading: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', backgroundColor: '#2e026d' }}>
      <LoadingSpinner/>
    </div>
  );
};

export default Loading;