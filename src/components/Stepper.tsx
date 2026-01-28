import React from 'react';
import './Stepper.css';

interface Step {
  title: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  orientation = 'horizontal',
  className = '',
}: StepperProps) {
  const isVertical = orientation === 'vertical';

  return (
    <div className={`stepper ${isVertical ? 'stepper--vertical' : ''} ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <React.Fragment key={step.title}>
            <div
              className={`stepper__step ${
                isCompleted ? 'stepper__step--completed' : isActive ? 'stepper__step--active' : ''
              }`}
            >
              <span
                className={`stepper__circle ${
                  isCompleted ? 'stepper__circle--completed' : isActive ? 'stepper__circle--active' : ''
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </span>
              <span className="stepper__label">
                <span className="stepper__title">{step.title}</span>
                {step.description && (
                  <span className="stepper__description">{step.description}</span>
                )}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span
                className={`stepper__connector ${isCompleted ? 'stepper__connector--completed' : ''}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
