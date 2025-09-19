import React, { useState, useEffect } from 'react';
import { LShape, Units } from '../../types';

interface LShapeFormProps {
  shape: LShape;
  units: Units;
  onChange: (shape: LShape) => void;
  className?: string;
}

export function LShapeForm({ shape, units, onChange, className = '' }: LShapeFormProps) {
  const [width1Feet, setWidth1Feet] = useState('');
  const [width1Inches, setWidth1Inches] = useState('');
  const [height1Feet, setHeight1Feet] = useState('');
  const [height1Inches, setHeight1Inches] = useState('');
  const [width2Feet, setWidth2Feet] = useState('');
  const [width2Inches, setWidth2Inches] = useState('');
  const [height2Feet, setHeight2Feet] = useState('');
  const [height2Inches, setHeight2Inches] = useState('');

  useEffect(() => {
    // Convert width1 to feet and inches
    const width1TotalInches = shape.width1 * 12;
    const width1FeetPart = Math.floor(width1TotalInches / 12);
    const width1InchesPart = width1TotalInches % 12;
    setWidth1Feet(width1FeetPart.toString());
    setWidth1Inches(width1InchesPart.toFixed(1));

    // Convert height1 to feet and inches
    const height1TotalInches = shape.height1 * 12;
    const height1FeetPart = Math.floor(height1TotalInches / 12);
    const height1InchesPart = height1TotalInches % 12;
    setHeight1Feet(height1FeetPart.toString());
    setHeight1Inches(height1InchesPart.toFixed(1));

    // Convert width2 to feet and inches
    const width2TotalInches = shape.width2 * 12;
    const width2FeetPart = Math.floor(width2TotalInches / 12);
    const width2InchesPart = width2TotalInches % 12;
    setWidth2Feet(width2FeetPart.toString());
    setWidth2Inches(width2InchesPart.toFixed(1));

    // Convert height2 to feet and inches
    const height2TotalInches = shape.height2 * 12;
    const height2FeetPart = Math.floor(height2TotalInches / 12);
    const height2InchesPart = height2TotalInches % 12;
    setHeight2Feet(height2FeetPart.toString());
    setHeight2Inches(height2InchesPart.toFixed(1));
  }, [shape.width1, shape.height1, shape.width2, shape.height2]);

  const handleWidth1Change = () => {
    const feet = parseFloat(width1Feet) || 0;
    const inches = parseFloat(width1Inches) || 0;
    const totalFeet = feet + (inches / 12);
    onChange({ ...shape, width1: totalFeet });
  };

  const handleHeight1Change = () => {
    const feet = parseFloat(height1Feet) || 0;
    const inches = parseFloat(height1Inches) || 0;
    const totalFeet = feet + (inches / 12);
    onChange({ ...shape, height1: totalFeet });
  };

  const handleWidth2Change = () => {
    const feet = parseFloat(width2Feet) || 0;
    const inches = parseFloat(width2Inches) || 0;
    const totalFeet = feet + (inches / 12);
    onChange({ ...shape, width2: totalFeet });
  };

  const handleHeight2Change = () => {
    const feet = parseFloat(height2Feet) || 0;
    const inches = parseFloat(height2Inches) || 0;
    const totalFeet = feet + (inches / 12);
    onChange({ ...shape, height2: totalFeet });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-md font-medium text-gray-700">L-Shape Dimensions</h4>

      <div className="space-y-4">
        <div className="text-sm text-gray-600">
          Bottom horizontal section:
        </div>
        <div className="space-y-4 pl-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Width</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Feet</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={width1Feet}
                  onChange={(e) => setWidth1Feet(e.target.value)}
                  onBlur={handleWidth1Change}
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
                  value={width1Inches}
                  onChange={(e) => setWidth1Inches(e.target.value)}
                  onBlur={handleWidth1Change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Height</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Feet</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={height1Feet}
                  onChange={(e) => setHeight1Feet(e.target.value)}
                  onBlur={handleHeight1Change}
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
                  value={height1Inches}
                  onChange={(e) => setHeight1Inches(e.target.value)}
                  onBlur={handleHeight1Change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Top horizontal section:
        </div>
        <div className="space-y-4 pl-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Width</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Feet</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={width2Feet}
                  onChange={(e) => setWidth2Feet(e.target.value)}
                  onBlur={handleWidth2Change}
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
                  value={width2Inches}
                  onChange={(e) => setWidth2Inches(e.target.value)}
                  onBlur={handleWidth2Change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Height</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Feet</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={height2Feet}
                  onChange={(e) => setHeight2Feet(e.target.value)}
                  onBlur={handleHeight2Change}
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
                  value={height2Inches}
                  onChange={(e) => setHeight2Inches(e.target.value)}
                  onBlur={handleHeight2Change}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}