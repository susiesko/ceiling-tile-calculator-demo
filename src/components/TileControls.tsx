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
  const fillColor = isSelected ? '#3b82f6' : '#f1f5f9';
  const strokeColor = isSelected ? '#2563eb' : '#cbd5e1';

  if (orientation === 0) {
    // Horizontal 2x4 tile
    return (
      <div className="relative">
        <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto drop-shadow-sm">
          <defs>
            <linearGradient id={`gradient-h-${isSelected}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isSelected ? '#60a5fa' : '#f8fafc'} />
              <stop offset="100%" stopColor={fillColor} />
            </linearGradient>
          </defs>
          <rect
            x="10"
            y="20"
            width="80"
            height="40"
            fill={`url(#gradient-h-${isSelected})`}
            stroke={strokeColor}
            strokeWidth="2"
            rx="8"
          />
          <text
            x="50"
            y="43"
            textAnchor="middle"
            className="text-sm font-bold"
            fill={isSelected ? '#ffffff' : '#64748b'}
          >
            2×4
          </text>
        </svg>
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    );
  } else {
    // Vertical 2x4 tile
    return (
      <div className="relative">
        <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto drop-shadow-sm">
          <defs>
            <linearGradient id={`gradient-v-${isSelected}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isSelected ? '#60a5fa' : '#f8fafc'} />
              <stop offset="100%" stopColor={fillColor} />
            </linearGradient>
          </defs>
          <rect
            x="20"
            y="10"
            width="40"
            height="80"
            fill={`url(#gradient-v-${isSelected})`}
            stroke={strokeColor}
            strokeWidth="2"
            rx="8"
          />
          <text
            x="40"
            y="53"
            textAnchor="middle"
            className="text-sm font-bold"
            fill={isSelected ? '#ffffff' : '#64748b'}
          >
            2×4
          </text>
        </svg>
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    );
  }
};

const TileSizeIcon = ({ size, isSelected }: { size: TileSize; isSelected: boolean }) => {
  const fillColor = isSelected ? '#3b82f6' : '#f1f5f9';
  const strokeColor = isSelected ? '#2563eb' : '#cbd5e1';

  if (size === '2x2') {
    return (
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto drop-shadow-sm">
          <defs>
            <linearGradient id={`gradient-2x2-${isSelected}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isSelected ? '#60a5fa' : '#f8fafc'} />
              <stop offset="100%" stopColor={fillColor} />
            </linearGradient>
          </defs>
          <rect
            x="15"
            y="15"
            width="90"
            height="90"
            fill={`url(#gradient-2x2-${isSelected})`}
            stroke={strokeColor}
            strokeWidth="2"
            rx="12"
          />
          <text
            x="60"
            y="67"
            textAnchor="middle"
            className="text-lg font-bold"
            fill={isSelected ? '#ffffff' : '#64748b'}
          >
            2×2
          </text>
        </svg>
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto drop-shadow-sm">
          <defs>
            <linearGradient id={`gradient-2x4-${isSelected}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isSelected ? '#60a5fa' : '#f8fafc'} />
              <stop offset="100%" stopColor={fillColor} />
            </linearGradient>
          </defs>
          <rect
            x="37.5"
            y="15"
            width="45"
            height="90"
            fill={`url(#gradient-2x4-${isSelected})`}
            stroke={strokeColor}
            strokeWidth="2"
            rx="12"
          />
          <text
            x="60"
            y="67"
            textAnchor="middle"
            className="text-lg font-bold"
            fill={isSelected ? '#ffffff' : '#64748b'}
          >
            2×4
          </text>
        </svg>
        {isSelected && (
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
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
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-neutral-800">Tile Configuration</h3>
      </div>

      {/* Tile Size */}
      <div className="space-y-4">
        <label className="block text-sm font-semibold text-neutral-700 mb-4">
          Choose Tile Size
        </label>
        <div className="grid grid-cols-2 gap-6">
          {(['2x2', '2x4'] as TileSize[]).map((size) => (
            <div
              key={size}
              onClick={() => onTileConfigChange({ size })}
              className={`cursor-pointer group p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-soft ${
                tileConfig.size === size
                  ? 'border-primary-300 bg-primary-50/50'
                  : 'border-neutral-200 hover:border-primary-200 bg-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <TileSizeIcon size={size} isSelected={tileConfig.size === size} />
                <span className={`text-sm font-semibold ${
                  tileConfig.size === size ? 'text-primary-700' : 'text-neutral-600 group-hover:text-primary-600'
                }`}>
                  {size === '2x2' ? '2×2 Standard' : '2×4 Rectangular'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tile Orientation - Only show for 2x4 tiles */}
      {tileConfig.size === '2x4' && (
        <div className="space-y-4 animate-fade-in">
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
      )}

      {/* Price per Tile */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-neutral-700">
          Price per Tile (optional)
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500 font-medium">
            $
          </div>
          <input
            type="number"
            min="0"
            step="0.01"
            value={pricePerTile || ''}
            onChange={(e) => onPriceChange(parseFloat(e.target.value) || undefined)}
            className="w-full pl-8 pr-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300"
            placeholder="0.00"
          />
        </div>
        <p className="text-xs text-neutral-500">
          Enter the cost per tile for budget estimation
        </p>
      </div>
    </div>
  );
}