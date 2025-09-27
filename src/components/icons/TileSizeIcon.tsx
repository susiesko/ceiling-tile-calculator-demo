import { TileSize } from '../../types';

interface TileSizeIconProps {
  size: TileSize;
  isSelected: boolean;
}

export function TileSizeIcon({ size, isSelected }: TileSizeIconProps) {
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
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
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
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    );
  }
}
