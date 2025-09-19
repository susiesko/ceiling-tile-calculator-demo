import {FormEvent, useEffect, useState} from 'react';
import {Shape, Units} from '../../types';

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
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  useEffect(() => {
    if (units === 'feet') {
      const totalInches = currentLength * 12;
      const feetPart = Math.floor(totalInches / 12);
      const inchesPart = totalInches % 12;

      setFeet(feetPart.toString());
      setInches(inchesPart.toFixed(1));
    } else {
      setFeet(Math.floor(currentLength).toString());
      setInches('0');
    }
  }, [currentLength, units]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const feetValue = parseFloat(feet) || 0;
    const inchesValue = parseFloat(inches) || 0;

    if (feetValue < 0 || inchesValue < 0 || inchesValue >= 12) {
      alert('Please enter valid measurements (inches must be less than 12)');
      return;
    }

    const newLength = feetValue + (inchesValue / 12);

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
      const newShape = {...shape};
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

    const newShape = {...shape};

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
              New Length
            </label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Feet</label>
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  step="1"
                  autoFocus
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Inches</label>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                  max="11.9"
                  step="0.1"
                />
              </div>
            </div>
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