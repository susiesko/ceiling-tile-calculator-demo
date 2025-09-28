import { describe, expect, it, beforeEach } from 'vitest';
import { useAppStore } from '../appStore';
import { TileDefinition } from '../../types';

// Helper to reset store before each test
const resetStore = () => {
  useAppStore.getState().resetState();
};

describe('AppStore - Tile Selection', () => {
  beforeEach(() => {
    resetStore();
  });

  it('should initialize with default tile config', () => {
    const state = useAppStore.getState();

    expect(state.tileConfig.size).toBe('2x2');
    expect(state.tileConfig.orientation).toBe(0);
    expect(state.tileConfig.selectedTile).toBeUndefined();
  });

  it('should update selected tile', () => {
    const mockTile: TileDefinition = {
      id: 'paw-2x2',
      name: 'Paw Pattern 2×2',
      description: '2×2 ceiling tile with paw pattern',
      width: 24,
      height: 24,
      imageUrl: '/tiles/paw-2x2.png',
      category: 'pattern'
    };

    const { updateSelectedTile } = useAppStore.getState();
    updateSelectedTile(mockTile);

    const state = useAppStore.getState();
    expect(state.tileConfig.selectedTile).toEqual(mockTile);
  });

  it('should preserve existing tile config when updating selected tile', () => {
    const { updateTileConfig, updateSelectedTile } = useAppStore.getState();

    // First update tile config
    updateTileConfig({ size: '2x4', orientation: 90 });

    const mockTile: TileDefinition = {
      id: 'paw-2x4',
      name: 'Paw Pattern 2×4',
      description: '2×4 ceiling tile with paw pattern',
      width: 24,
      height: 48,
      imageUrl: '/tiles/paw-2x4.png',
      category: 'pattern'
    };

    // Then update selected tile
    updateSelectedTile(mockTile);

    const state = useAppStore.getState();
    expect(state.tileConfig.size).toBe('2x4');
    expect(state.tileConfig.orientation).toBe(90);
    expect(state.tileConfig.selectedTile).toEqual(mockTile);
  });

  it('should replace selected tile when updating', () => {
    const firstTile: TileDefinition = {
      id: 'paw-2x2',
      name: 'Paw Pattern 2×2',
      description: '2×2 ceiling tile with paw pattern',
      width: 24,
      height: 24,
      imageUrl: '/tiles/paw-2x2.png',
      category: 'pattern'
    };

    const secondTile: TileDefinition = {
      id: 'paw-2x4',
      name: 'Paw Pattern 2×4',
      description: '2×4 ceiling tile with paw pattern',
      width: 24,
      height: 48,
      imageUrl: '/tiles/paw-2x4.png',
      category: 'pattern'
    };

    const { updateSelectedTile } = useAppStore.getState();

    // Select first tile
    updateSelectedTile(firstTile);
    expect(useAppStore.getState().tileConfig.selectedTile).toEqual(firstTile);

    // Select second tile
    updateSelectedTile(secondTile);
    expect(useAppStore.getState().tileConfig.selectedTile).toEqual(secondTile);
  });

  it('should persist selected tile through resetState', () => {
    const mockTile: TileDefinition = {
      id: 'paw-2x2',
      name: 'Paw Pattern 2×2',
      description: '2×2 ceiling tile with paw pattern',
      width: 24,
      height: 24,
      imageUrl: '/tiles/paw-2x2.png',
      category: 'pattern'
    };

    const { updateSelectedTile, resetState } = useAppStore.getState();
    updateSelectedTile(mockTile);

    // Reset should clear the selected tile
    resetState();

    const state = useAppStore.getState();
    expect(state.tileConfig.selectedTile).toBeUndefined();
    expect(state.tileConfig.size).toBe('2x2');
    expect(state.tileConfig.orientation).toBe(0);
  });
});