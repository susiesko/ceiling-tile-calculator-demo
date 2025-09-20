import React from 'react';
import { LShape, Units } from '../../types';
import { useFeetInchesInput } from '../../hooks/useFeetInchesInput';

interface LShapeFormProps {
  shape: LShape;
  units: Units;
  onChange: (shape: LShape) => void;
  className?: string;
}

export function LShapeForm({ shape, units, onChange, className = '' }: LShapeFormProps) {
  const width1 = useFeetInchesInput(shape.width1, (value) => {
    onChange({ ...shape, width1: value });
  });

  const height1 = useFeetInchesInput(shape.height1, (value) => {
    onChange({ ...shape, height1: value });
  });

  const width2 = useFeetInchesInput(shape.width2, (value) => {
    onChange({ ...shape, width2: value });
  });

  const height2 = useFeetInchesInput(shape.height2, (value) => {
    onChange({ ...shape, height2: value });
  });


  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-md font-medium text-gray-700">L-Shape Dimensions</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall A</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={width1.feet}
                onChange={(e) => width1.setFeet(e.target.value)}
                onBlur={width1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.1"
                value={width1.inches}
                onChange={(e) => width1.setInches(e.target.value)}
                onBlur={width1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall B</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={height1.feet}
                onChange={(e) => height1.setFeet(e.target.value)}
                onBlur={height1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.1"
                value={height1.inches}
                onChange={(e) => height1.setInches(e.target.value)}
                onBlur={height1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall C</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={width2.feet}
                onChange={(e) => width2.setFeet(e.target.value)}
                onBlur={width2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.1"
                value={width2.inches}
                onChange={(e) => width2.setInches(e.target.value)}
                onBlur={width2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall D</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={height2.feet}
                onChange={(e) => height2.setFeet(e.target.value)}
                onBlur={height2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.1"
                value={height2.inches}
                onChange={(e) => height2.setInches(e.target.value)}
                onBlur={height2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}