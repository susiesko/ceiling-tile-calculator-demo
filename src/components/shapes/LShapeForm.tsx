import React from 'react';
import { LShape, Units } from '../../types';

interface LShapeFormProps {
  shape: LShape;
  units: Units;
  onChange: (shape: LShape) => void;
  className?: string;
}

export function LShapeForm({ shape, units, onChange, className = '' }: LShapeFormProps) {
  const unitLabel = 'ft';

  const handleChange = (field: keyof Omit<LShape, 'type'>) => (
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
      <h4 className="text-md font-medium text-gray-700">L-Shape Dimensions</h4>

      <div className="space-y-3">
        <div className="text-sm text-gray-600">
          Bottom horizontal section:
        </div>
        <div className="grid grid-cols-2 gap-4 pl-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Width ({unitLabel})
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={shape.width1 || ''}
              onChange={handleChange('width1')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Bottom width"
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
              value={shape.height1 || ''}
              onChange={handleChange('height1')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Bottom height"
            />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Top horizontal section:
        </div>
        <div className="grid grid-cols-2 gap-4 pl-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Width ({unitLabel})
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={shape.width2 || ''}
              onChange={handleChange('width2')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Top width"
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
              value={shape.height2 || ''}
              onChange={handleChange('height2')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Top height"
            />
          </div>
        </div>
      </div>
    </div>
  );
}