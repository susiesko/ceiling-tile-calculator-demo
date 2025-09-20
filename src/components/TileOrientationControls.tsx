import React from 'react';
import { TileConfig, TileOrientation } from '../types';
import { TileOrientationIcon } from './icons/TileOrientationIcon';

interface TileOrientationControlsProps {
  tileConfig: TileConfig;
  onTileConfigChange: (config: Partial<TileConfig>) => void;
  className?: string;
}

export function TileOrientationControls({
  tileConfig,
  onTileConfigChange,
  className = ''
}: TileOrientationControlsProps) {
  if (tileConfig.size !== '2x4') {
    return (
      <div className={`text-sm text-gray-600 ${className}`}>
        Tile orientation is only available for 2×4 tiles. Please select 2×4 tiles in Step 2.
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-semibold text-neutral-700 mb-4">
        Choose Orientation
      </label>
      <div className="grid grid-cols-2 gap-6">
        {([0, 90] as TileOrientation[]).map((orientation) => (
          <div
            key={orientation}
            onClick={() => onTileConfigChange({ orientation })}
            className={`cursor-pointer group p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-soft ${
              tileConfig.orientation === orientation
                ? 'border-primary-300 bg-primary-50/50'
                : 'border-neutral-200 hover:border-primary-200 bg-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-3">
              <TileOrientationIcon orientation={orientation} isSelected={tileConfig.orientation === orientation} />
              <span className={`text-sm font-semibold ${
                tileConfig.orientation === orientation ? 'text-primary-700' : 'text-neutral-600 group-hover:text-primary-600'
              }`}>
                {orientation === 0 ? 'Horizontal' : 'Vertical'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}