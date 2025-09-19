import * as React from 'react';
import { TileConfig, Units, TileSize, TileOrientation } from '../types';

interface TileControlsProps {
  tileConfig: TileConfig;
  units: Units;
  onTileConfigChange: (config: Partial<TileConfig>) => void;
  pricePerTile?: number;
  onPriceChange: (price?: number) => void;
  className?: string;
}

const TileSizeIcon = ({ size, isSelected }: { size: TileSize; isSelected: boolean }) => {
  const fillColor = isSelected ? '#3b82f6' : '#e5e7eb';

  if (size === '2x2') {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
        <rect
          x="15"
          y="15"
          width="90"
          height="90"
          fill={fillColor}
          rx="8"
        />
        <text
          x="60"
          y="67"
          textAnchor="middle"
          className="text-lg font-bold"
          fill={isSelected ? '#ffffff' : '#6b7280'}
        >
          2×2
        </text>
      </svg>
    );
  } else {
    return (
      <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
        <rect
          x="37.5"
          y="15"
          width="45"
          height="90"
          fill={fillColor}
          rx="8"
        />
        <text
          x="60"
          y="67"
          textAnchor="middle"
          className="text-lg font-bold"
          fill={isSelected ? '#ffffff' : '#6b7280'}
        >
          2×4
        </text>
      </svg>
    );
  }
};

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
        <div className="grid grid-cols-2 gap-6">
          {(['2x2', '2x4'] as TileSize[]).map((size) => (
            <div
              key={size}
              onClick={() => onTileConfigChange({ size })}
              className="cursor-pointer flex flex-col items-center space-y-3 transition-all hover:scale-105"
            >
              <TileSizeIcon size={size} isSelected={tileConfig.size === size} />
              <span className={`text-sm font-medium ${
                tileConfig.size === size ? 'text-primary-700' : 'text-gray-600'
              }`}/>
            </div>
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