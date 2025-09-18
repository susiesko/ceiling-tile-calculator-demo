import React, { useState, useEffect } from 'react';
import { Shape, Units } from '../../types';
import { formatFeetInches, parseFeetInches } from '../../utils/units';

interface WallEditorProps {
  wallIndex: number;
  currentLength: number;
  shape: Shape;
  units: Units;
  onShapeChange: (shape: Shape) => void;
  onClose: () => void;
}

export function WallEditor({
  wallIndex,
  currentLength,
  shape,
  units,
  onShapeChange,
  onClose
}: WallEditorProps) {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (units === 'feet') {
      setInputValue(formatFeetInches(currentLength));
    } else {
      setInputValue(currentLength.toFixed(1));
    }
  }, [currentLength, units]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newLength: number;
    if (units === 'feet') {
      newLength = parseFeetInches(inputValue);
    } else {
      newLength = parseFloat(inputValue) || 0;
    }

    if (newLength <= 0) {
      alert('Wall length must be greater than 0');
      return;
    }

    updateWallLength(newLength);
    onClose();
  };

  const updateWallLength = (newLength: number) => {
    if (shape.type === 'rectangle') {
      // For rectangle, walls are: top, right, bottom, left
      const newShape = { ...shape };
      if (wallIndex === 0 || wallIndex === 2) {
        // Top or bottom wall - change width
        newShape.width = newLength;
      } else {
        // Left or right wall - change height
        newShape.height = newLength;
      }
      onShapeChange(newShape);
    } else if (shape.type === 'l-shape') {
      // For L-shape, we need to determine which wall was clicked and update accordingly
      updateLShapeWall(newLength);
    }
  };

  const updateLShapeWall = (newLength: number) => {
    if (shape.type !== 'l-shape') return;

    const newShape = { ...shape };

    // L-shape walls in order: bottom-left to bottom-right, up, right, down, left, up-left
    switch (wallIndex) {
      case 0: // Bottom horizontal (width1)
        newShape.width1 = newLength;
        break;
      case 1: // Right vertical going up (height1)
        newShape.height1 = newLength;
        break;
      case 2: // Top horizontal going right (width2)
        newShape.width2 = newLength;
        break;
      case 3: // Right vertical going down (height2)
        newShape.height2 = newLength;
        break;
      case 4: // Left vertical going down (height1 + height2)
        // This is a composite wall, we need to adjust proportionally
        const totalHeight = newShape.height1 + newShape.height2;
        const ratio = newLength / totalHeight;
        newShape.height1 *= ratio;
        newShape.height2 *= ratio;
        break;
      case 5: // Top horizontal going left (width1 - width2)
        // This affects the relationship between width1 and width2
        const currentDiff = newShape.width1 - newShape.width2;
        if (newLength !== currentDiff) {
          newShape.width1 = newShape.width2 + newLength;
        }
        break;
    }

    onShapeChange(newShape);
  };

  const getWallDescription = () => {
    if (shape.type === 'rectangle') {
      const descriptions = ['Top wall', 'Right wall', 'Bottom wall', 'Left wall'];
      return descriptions[wallIndex] || `Wall ${wallIndex + 1}`;
    } else if (shape.type === 'l-shape') {
      const descriptions = [
        'Bottom horizontal wall',
        'Right vertical wall (bottom)',
        'Top horizontal wall (right)',
        'Right vertical wall (top)',
        'Left vertical wall',
        'Top horizontal wall (left)'
      ];
      return descriptions[wallIndex] || `Wall ${wallIndex + 1}`;
    }
    return `Wall ${wallIndex + 1}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit {getWallDescription()}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              New Length (feet & inches)
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={units === 'feet' ? "e.g., 10' 6\"" : "e.g., 3.2"}
              autoFocus
            />
            {units === 'feet' && (
              <p className="text-xs text-gray-500 mt-1">
                Format examples: 10', 10' 6", 10.5
              </p>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Update Wall
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}