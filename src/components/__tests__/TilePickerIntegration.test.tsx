import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAppStore } from '../../store/appStore';
import { TilePicker } from '../TilePicker';
import { TileDefinition } from '../../types';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTiles: TileDefinition[] = [
  {
    id: 'paw-2x2',
    name: 'Paw Pattern 2×2',
    description: '2×2 ceiling tile with paw pattern',
    width: 24,
    height: 24,
    imageUrl: '/tiles/paw-2x2.png',
    category: 'pattern'
  },
  {
    id: 'paw-2x4',
    name: 'Paw Pattern 2×4',
    description: '2×4 ceiling tile with paw pattern',
    width: 24,
    height: 48,
    imageUrl: '/tiles/paw-2x4.png',
    category: 'pattern'
  }
];

describe('TilePicker Integration', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    useAppStore.getState().resetState();

    // Mock successful fetch by default
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTiles)
    });
  });

  it('should integrate with app store correctly', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const tileConfig = useAppStore((state) => state.tileConfig);
      const updateSelectedTile = useAppStore((state) => state.updateSelectedTile);

      return (
        <div>
          <div data-testid="current-selected">
            {tileConfig.selectedTile?.id || 'none'}
          </div>
          <TilePicker
            selectedTileSize={tileConfig.size}
            selectedTileId={tileConfig.selectedTile?.id}
            onTileSelect={updateSelectedTile}
          />
        </div>
      );
    };

    render(<TestComponent />);

    // Initially no tile selected
    expect(screen.getByTestId('current-selected')).toHaveTextContent('none');

    // Wait for tiles to load
    await waitFor(() => {
      expect(screen.getByText('Paw Pattern 2×2')).toBeInTheDocument();
    });

    // Click on a tile
    const tileButton = screen.getByText('Paw Pattern 2×2').closest('button');
    await user.click(tileButton!);

    // Store should be updated
    expect(screen.getByTestId('current-selected')).toHaveTextContent('paw-2x2');
  });

  it('should update when tile size changes in store', async () => {
    const TestComponent = () => {
      const tileConfig = useAppStore((state) => state.tileConfig);
      const updateTileConfig = useAppStore((state) => state.updateTileConfig);
      const updateSelectedTile = useAppStore((state) => state.updateSelectedTile);

      return (
        <div>
          <button
            data-testid="change-size"
            onClick={() => updateTileConfig({ size: '2x4' })}
          >
            Change to 2x4
          </button>
          <TilePicker
            selectedTileSize={tileConfig.size}
            selectedTileId={tileConfig.selectedTile?.id}
            onTileSelect={updateSelectedTile}
          />
        </div>
      );
    };

    const user = userEvent.setup();
    render(<TestComponent />);

    // Initially shows 2x2 tiles
    await waitFor(() => {
      expect(screen.getByText('Paw Pattern 2×2')).toBeInTheDocument();
      expect(screen.queryByText('Paw Pattern 2×4')).not.toBeInTheDocument();
    });

    // Change size to 2x4
    await user.click(screen.getByTestId('change-size'));

    // Should now show 2x4 tiles
    await waitFor(() => {
      expect(screen.getByText('Paw Pattern 2×4')).toBeInTheDocument();
      expect(screen.queryByText('Paw Pattern 2×2')).not.toBeInTheDocument();
    });
  });

  it('should persist selected tile in store', async () => {
    const user = userEvent.setup();

    const TestComponent = () => {
      const tileConfig = useAppStore((state) => state.tileConfig);
      const updateSelectedTile = useAppStore((state) => state.updateSelectedTile);

      return (
        <TilePicker
          selectedTileSize={tileConfig.size}
          selectedTileId={tileConfig.selectedTile?.id}
          onTileSelect={updateSelectedTile}
        />
      );
    };

    render(<TestComponent />);

    // Wait for tiles to load and select one
    await waitFor(() => {
      expect(screen.getByText('Paw Pattern 2×2')).toBeInTheDocument();
    });

    const tileButton = screen.getByText('Paw Pattern 2×2').closest('button');
    await user.click(tileButton!);

    // Check that the store has the selected tile
    const state = useAppStore.getState();
    expect(state.tileConfig.selectedTile?.id).toBe('paw-2x2');
    expect(state.tileConfig.selectedTile?.name).toBe('Paw Pattern 2×2');
  });
});