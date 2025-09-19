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

const TileOrientationIcon = ({ orientation, isSelected }: { orientation: TileOrientation; isSelected: boolean }) => {
  const fillColor = isSelected ? '#3b82f6' : '#e5e7eb';

  if (orientation === 0) {
    // Horizontal 2x4 tile
    return (
      <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto">
        <rect
          x="10"
          y="20"
          width="80"
          height="40"
          fill={fillColor}
          rx="6"
        />
        <text
          x="50"
          y="43"
          textAnchor="middle"
          className="text-sm font-bold"
          fill={isSelected ? '#ffffff' : '#6b7280'}
        >
          2×4
        </text>
      </svg>
    );
  } else {
    // Vertical 2x4 tile
    return (
      <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto">
        <rect
          x="20"
          y="10"
          width="40"
          height="80"
          fill={fillColor}
          rx="6"
        />
        <text
          x="40"
          y="53"
          textAnchor="middle"
          className="text-sm font-bold"
          fill={isSelected ? '#ffffff' : '#6b7280'}
        >
          2×4
        </text>
      </svg>
    );
  }
};

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

      {/* Tile Orientation - Only show for 2x4 tiles */}
      {tileConfig.size === '2x4' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tile Orientation
          </label>
          <div className="grid grid-cols-2 gap-6">
            {([0, 90] as TileOrientation[]).map((orientation) => (
              <div
                key={orientation}
                onClick={() => onTileConfigChange({ orientation })}
                className="cursor-pointer flex flex-col items-center space-y-3 transition-all hover:scale-105"
              >
                <TileOrientationIcon orientation={orientation} isSelected={tileConfig.orientation === orientation} />
                <span className={`text-sm font-medium ${
                  tileConfig.orientation === orientation ? 'text-primary-700' : 'text-gray-600'
                }`}>
                  {orientation === 0 ? 'Horizontal' : 'Vertical'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}


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