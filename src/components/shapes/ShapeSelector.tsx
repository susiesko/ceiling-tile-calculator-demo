import React from 'react';
import { ShapeType, Shape } from '../../types';

interface ShapeSelectorProps {
  selectedShape: ShapeType;
  onShapeChange: (shapeType: ShapeType) => void;
  className?: string;
}

const shapeOptions = [
  { type: 'rectangle' as const, label: 'Rectangle', icon: '▢' },
  { type: 'l-shape' as const, label: 'L-Shape', icon: '⌐' }
];

export function ShapeSelector({ selectedShape, onShapeChange, className = '' }: ShapeSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800">Room Shape</h3>
      <div className="grid grid-cols-2 gap-2">
        {shapeOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onShapeChange(option.type)}
            className={`
              p-3 rounded-lg border-2 transition-all duration-200 text-center
              ${selectedShape === option.type
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <div className="text-2xl mb-1">{option.icon}</div>
            <div className="text-sm font-medium">{option.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}