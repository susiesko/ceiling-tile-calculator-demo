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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full mx-4 shadow-soft-lg border border-neutral-200/50 animate-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-neutral-800">
            Edit {getWallDescription()}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-4">
              New Length
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Feet</label>
                <input
                  type="number"
                  value={feet}
                  onChange={(e) => setFeet(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
                  placeholder="0"
                  min="0"
                  step="1"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-2">Inches</label>
                <input
                  type="number"
                  value={inches}
                  onChange={(e) => setInches(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
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
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 font-semibold shadow-soft hover:shadow-soft-lg transform hover:scale-105"
            >
              Update Wall
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl hover:bg-neutral-200 transition-all duration-200 font-semibold border-2 border-neutral-200 hover:border-neutral-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}