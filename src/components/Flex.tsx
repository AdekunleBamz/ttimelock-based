import React from 'react';
import './Flex.css';

interface FlexProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'sm' | 'md' | 'lg';
  wrap?: boolean;
  className?: string;
}

export const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'start',
  gap = 'md',
  wrap = false,
  className = ''
}) => {
  const classes = [
    'flex',
    `flex-${direction}`,
    `align-${align}`,
    `justify-${justify}`,
    `gap-${gap}`,
    wrap ? 'flex-wrap' : '',
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};
