import React, { useState } from 'react';
import { Cutout, Units, Dimensions, Point } from '../types';

interface CutoutControlsProps {
  cutouts: Cutout[];
  units: Units;
  onAddCutout: (cutout: Cutout) => void;
  onUpdateCutout: (id: string, cutout: Partial<Cutout>) => void;
  onRemoveCutout: (id: string) => void;
  className?: string;
}

export function CutoutControls({
  cutouts,
  units,
  onAddCutout,
  onUpdateCutout,
  onRemoveCutout,
  className = ''
}: CutoutControlsProps) {
  const [newCutout, setNewCutout] = useState({
    type: 'rectangle' as const,
    x: 0,
    y: 0,
    width: 2,
    height: 2,
    cornerRadius: 0
  });

  const unitLabel = units === 'feet' ? 'ft' : 'm';

  const handleAddCutout = () => {
    const cutout: Cutout = {
      id: Date.now().toString(),
      type: newCutout.type,
      position: { x: newCutout.x, y: newCutout.y },
      dimensions: { width: newCutout.width, height: newCutout.height },
      ...(newCutout.type === 'rounded' && { cornerRadius: newCutout.cornerRadius })
    };
    onAddCutout(cutout);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800">Cutouts</h3>

      {/* Add New Cutout */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <h4 className="font-medium text-gray-700">Add New Cutout</h4>

        {/* Cutout Type */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['rectangle', 'rounded'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setNewCutout(prev => ({ ...prev, type }))}
                className={`
                  p-2 rounded border-2 text-sm transition-all capitalize
                  ${newCutout.type === type
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Position */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Position ({unitLabel})
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              step="0.5"
              value={newCutout.x}
              onChange={(e) => setNewCutout(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="X position"
            />
            <input
              type="number"
              step="0.5"
              value={newCutout.y}
              onChange={(e) => setNewCutout(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Y position"
            />
          </div>
        </div>

        {/* Dimensions */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Dimensions ({unitLabel})
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="0"
              step="0.5"
              value={newCutout.width}
              onChange={(e) => setNewCutout(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Width"
            />
            <input
              type="number"
              min="0"
              step="0.5"
              value={newCutout.height}
              onChange={(e) => setNewCutout(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
              className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Height"
            />
          </div>
        </div>

        {/* Corner Radius for Rounded */}
        {newCutout.type === 'rounded' && (
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Corner Radius ({unitLabel})
            </label>
            <input
              type="number"
              min="0"
              step="0.25"
              value={newCutout.cornerRadius}
              onChange={(e) => setNewCutout(prev => ({ ...prev, cornerRadius: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Corner radius"
            />
          </div>
        )}

        <button
          onClick={handleAddCutout}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors text-sm"
        >
          Add Cutout
        </button>
      </div>

      {/* Existing Cutouts */}
      {cutouts.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Existing Cutouts</h4>
          {cutouts.map((cutout, index) => (
            <div key={cutout.id} className="bg-white p-3 rounded border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Cutout {index + 1} ({cutout.type})
                </span>
                <button
                  onClick={() => onRemoveCutout(cutout.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Position: ({cutout.position.x}, {cutout.position.y}) {unitLabel}</div>
                <div>Size: {cutout.dimensions.width} × {cutout.dimensions.height} {unitLabel}</div>
                {cutout.cornerRadius && (
                  <div>Radius: {cutout.cornerRadius} {unitLabel}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}