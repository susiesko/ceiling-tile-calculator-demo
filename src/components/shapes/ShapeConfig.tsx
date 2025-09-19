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
  rectangle: { type: 'rectangle' as const, width: 12, height: 10 },
  'l-shape': { type: 'l-shape' as const, width1: 12, height1: 8, width2: 6, height2: 6 }
};

export function ShapeConfig({ shape, units, onShapeChange, className = '' }: ShapeConfigProps) {
  const handleShapeTypeChange = (shapeType: ShapeType) => {
    if (shape.type !== shapeType) {
      onShapeChange(defaultShapes[shapeType]);
    }
  };

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
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800">Room Shape</h3>
      </div>

      <ShapeSelector
        selectedShape={shape.type}
        onShapeChange={handleShapeTypeChange}
      />

      <div>
        {renderShapeForm()}
      </div>
    </div>
  );
}