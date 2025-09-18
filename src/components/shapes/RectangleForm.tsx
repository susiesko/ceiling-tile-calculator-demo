import React from 'react';
import { RectangleShape, Units } from '../../types';

interface RectangleFormProps {
  shape: RectangleShape;
  units: Units;
  onChange: (shape: RectangleShape) => void;
  className?: string;
}

export function RectangleForm({ shape, units, onChange, className = '' }: RectangleFormProps) {
  const unitLabel = 'ft';

  const handleChange = (field: keyof Omit<RectangleShape, 'type'>) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value) || 0;
    onChange({
      ...shape,
      [field]: value
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-md font-medium text-gray-700">Rectangle Dimensions</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Width ({unitLabel})
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={shape.width || ''}
            onChange={handleChange('width')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter width"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Height ({unitLabel})
          </label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={shape.height || ''}
            onChange={handleChange('height')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Enter height"
          />
        </div>
      </div>
    </div>
  );
}