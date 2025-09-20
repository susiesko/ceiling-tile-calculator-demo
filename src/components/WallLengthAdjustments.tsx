import React from 'react';
import { Shape, Units } from '../types';
import { RectangleForm } from './shapes/RectangleForm';
import { LShapeForm } from './shapes/LShapeForm';

interface WallLengthAdjustmentsProps {
  shape: Shape;
  units: Units;
  onShapeChange: (shape: Shape) => void;
  className?: string;
}

export function WallLengthAdjustments({ shape, units, onShapeChange, className = '' }: WallLengthAdjustmentsProps) {
  const renderShapeForm = () => {
    switch (shape.type) {
      case 'rectangle':
        return (
          <RectangleForm
            shape={shape}
            units={units}
            onChange={onShapeChange}
          />
        );
      case 'l-shape':
        return (
          <LShapeForm
            shape={shape}
            units={units}
            onChange={onShapeChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {renderShapeForm()}
    </div>
  );
}