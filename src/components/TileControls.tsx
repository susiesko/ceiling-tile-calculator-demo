import { TileSize } from '../types';
import { useAppStore } from '../store/appStore';
import { TileSizeIcon } from './icons/TileSizeIcon';

interface TileControlsProps {
  className?: string;
}

export function TileControls({ className = '' }: TileControlsProps) {
  const tileConfig = useAppStore((state) => state.tileConfig);
  const updateTileConfig = useAppStore((state) => state.updateTileConfig);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
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
              onClick={() => updateTileConfig({ size, selectedTile: undefined })}
              className={`cursor-pointer group p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-soft ${
                tileConfig.size === size
                  ? 'border-primary-300 bg-primary-50/50'
                  : 'border-neutral-200 hover:border-primary-200 bg-white'
              }`}
            >
              <div className="flex flex-col items-center space-y-3">
                <TileSizeIcon size={size} isSelected={tileConfig.size === size} />
                <span
                  className={`text-sm font-semibold ${
                    tileConfig.size === size
                      ? 'text-primary-700'
                      : 'text-neutral-600 group-hover:text-primary-600'
                  }`}
                >
                  {size === '2x2' ? '2×2 Standard' : '2×4 Rectangular'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note about orientation for 2x4 tiles */}
      {tileConfig.size === '2x4' && (
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          Tile orientation can be adjusted in Step 3.
        </div>
      )}
    </div>
  );
}
