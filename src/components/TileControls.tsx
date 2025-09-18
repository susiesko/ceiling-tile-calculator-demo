import React from 'react';
import { TileConfig, Units, TileSize, TileOrientation } from '../types';

interface TileControlsProps {
  tileConfig: TileConfig;
  units: Units;
  onTileConfigChange: (config: Partial<TileConfig>) => void;
  pricePerTile?: number;
  onPriceChange: (price?: number) => void;
  className?: string;
}

export function TileControls({
  tileConfig,
  units,
  onTileConfigChange,
  pricePerTile,
  onPriceChange,
  className = ''
}: TileControlsProps) {
  const unitLabel = 'ft';

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800">Tile Configuration</h3>

      {/* Tile Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tile Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['2x2', '2x4'] as TileSize[]).map((size) => (
            <button
              key={size}
              onClick={() => onTileConfigChange({ size })}
              className={`
                p-3 rounded-lg border-2 transition-all text-center
                ${tileConfig.size === size
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              {size} {unitLabel}
            </button>
          ))}
        </div>
      </div>

      {/* Tile Orientation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tile Orientation
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([0, 90] as TileOrientation[]).map((orientation) => (
            <button
              key={orientation}
              onClick={() => onTileConfigChange({ orientation })}
              className={`
                p-3 rounded-lg border-2 transition-all text-center
                ${tileConfig.orientation === orientation
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
              `}
            >
              {orientation}°
            </button>
          ))}
        </div>
      </div>


      {/* Price per Tile */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price per Tile (optional)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-2 text-gray-500">$</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricePerTile || ''}
            onChange={(e) => onPriceChange(parseFloat(e.target.value) || undefined)}
            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>
    </div>
  );
}