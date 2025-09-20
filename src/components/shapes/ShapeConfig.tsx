import React from 'react';
import { Shape, Units, ShapeType } from '../../types';
import { ShapeSelector } from './ShapeSelector';
import { RectangleForm } from './RectangleForm';
import { LShapeForm } from './LShapeForm';

interface ShapeConfigProps {
  shape: Shape;
  units: Units;
  onShapeChange: (shape: Shape) => void;
  className?: string;
}

const defaultShapes = {
  rectangle: { type: 'rectangle' as const, width: 12, height: 12 },
  'l-shape': { type: 'l-shape' as const, width1: 6, height1: 6, width2: 6, height2: 6 }
};

export function ShapeConfig({ shape, units, onShapeChange, className = '' }: ShapeConfigProps) {
  const handleShapeTypeChange = (shapeType: ShapeType) => {
    if (shape.type !== shapeType) {
      onShapeChange(defaultShapes[shapeType]);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <ShapeSelector
        selectedShape={shape.type}
        onShapeChange={handleShapeTypeChange}
      />
    </div>
  );
}