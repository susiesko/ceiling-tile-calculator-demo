import { useEffect, useState } from 'react';
import { TileDefinition, TileSize } from '../types';

interface TilePickerProps {
  selectedTileSize: TileSize;
  selectedTileId?: string;
  onTileSelect: (tile: TileDefinition) => void;
  className?: string;
}

export function TilePicker({
  selectedTileSize,
  selectedTileId,
  onTileSelect,
  className = ''
}: TilePickerProps) {
  const [tiles, setTiles] = useState<TileDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTiles = async () => {
      try {
        const response = await fetch('./tiles.json');
        if (!response.ok) {
          throw new Error('Failed to load tiles');
        }
        const tilesData: TileDefinition[] = await response.json();
        setTiles(tilesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tiles');
      } finally {
        setLoading(false);
      }
    };

    loadTiles();
  }, []);

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h4 className="text-lg font-semibold text-neutral-700">Choose Tile</h4>
        <div className="text-center py-8 text-neutral-500">Loading tiles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h4 className="text-lg font-semibold text-neutral-700">Choose Tile</h4>
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      </div>
    );
  }

  // Filter tiles by the selected size
  const filteredTiles = tiles.filter(tile => {
    if (selectedTileSize === '2x2') {
      return tile.width === 24 && tile.height === 24;
    } else if (selectedTileSize === '2x4') {
      return tile.width === 24 && tile.height === 48;
    }
    return false;
  });

  if (filteredTiles.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h4 className="text-lg font-semibold text-neutral-700">Choose Tile</h4>
        <div className="text-center py-8 text-neutral-500">
          No tiles available for {selectedTileSize} size
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <h4 className="text-lg font-semibold text-neutral-700">Choose Tile</h4>
      <p className="text-sm text-neutral-600">
        Select a {selectedTileSize} tile pattern:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredTiles.map(tile => (
          <button
            key={tile.id}
            onClick={() => onTileSelect(tile)}
            className={`
              relative p-4 border-2 rounded-xl transition-all duration-200
              hover:border-primary-400 hover:shadow-md group
              ${selectedTileId === tile.id
                ? 'border-primary-500 bg-primary-50 shadow-md'
                : 'border-neutral-200 bg-white hover:bg-neutral-50'
              }
            `}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className={`
                  ${tile.width === 24 && tile.height === 24 ? 'w-20 h-20' : 'w-16 h-32'}
                  border border-neutral-300 rounded overflow-hidden bg-white
                `}>
                  <img
                    src={tile.imageUrl}
                    alt={tile.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to a simple rectangle if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full bg-neutral-100 border border-neutral-300 flex items-center justify-center text-xs text-neutral-500">
                          ${tile.width}"×${tile.height}"
                        </div>
                      `;
                    }}
                  />
                </div>
              </div>

              <div className="text-center">
                <div className="font-medium text-neutral-700 text-sm">
                  {tile.name}
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  {tile.width}" × {tile.height}"
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {tile.description}
                </div>
              </div>
            </div>

            {selectedTileId === tile.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}