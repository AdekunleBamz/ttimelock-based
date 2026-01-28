import React from 'react';
import './Container.css';

interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export const Container: React.FC<ContainerProps> = ({ children, size = 'md', center = true }) => {
  return (
    <div className={`container container-${size} ${center ? 'container-center' : ''}`}>
      {children}
    </div>
  );
};
