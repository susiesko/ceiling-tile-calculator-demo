import { TileOrientation } from '../../types';

interface TileOrientationIconProps {
  orientation: TileOrientation;
  isSelected: boolean;
}

export function TileOrientationIcon({ orientation, isSelected }: TileOrientationIconProps) {
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
        <svg width="100" height="80" viewBox="0 0 100 80" className="mx-auto drop-shadow-sm">
          <defs>
            <linearGradient id={`gradient-v-${isSelected}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isSelected ? '#60a5fa' : '#f8fafc'} />
              <stop offset="100%" stopColor={fillColor} />
            </linearGradient>
          </defs>
          <rect
            x="30"
            y="10"
            width="40"
            height="60"
            fill={`url(#gradient-v-${isSelected})`}
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
  }
}