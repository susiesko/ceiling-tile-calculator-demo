import { describe, expect, it } from 'vitest';
import { TileDefinition, TileSize } from '../../types';

describe('TileDefinition', () => {
  it('should create a valid 2x2 tile definition', () => {
    const tile: TileDefinition = {
      id: 'test-2x2',
      name: 'Test 2×2',
      description: 'Test 2×2 ceiling tile',
      width: 24,
      height: 24,
      imageUrl: '/tiles/test-2x2.png',
      category: 'test'
    };

    expect(tile.id).toBe('test-2x2');
    expect(tile.width).toBe(24);
    expect(tile.height).toBe(24);
    expect(tile.imageUrl).toBe('/tiles/test-2x2.png');
  });

  it('should create a valid 2x4 tile definition', () => {
    const tile: TileDefinition = {
      id: 'test-2x4',
      name: 'Test 2×4',
      description: 'Test 2×4 ceiling tile',
      width: 24,
      height: 48,
      imageUrl: '/tiles/test-2x4.png',
      category: 'test'
    };

    expect(tile.id).toBe('test-2x4');
    expect(tile.width).toBe(24);
    expect(tile.height).toBe(48);
    expect(tile.imageUrl).toBe('/tiles/test-2x4.png');
  });

  it('should determine tile size from dimensions', () => {
    const tiles: TileDefinition[] = [
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

    // Function to determine tile size from dimensions
    const getTileSize = (tile: TileDefinition): TileSize => {
      if (tile.width === 24 && tile.height === 24) return '2x2';
      if (tile.width === 24 && tile.height === 48) return '2x4';
      throw new Error(`Unsupported tile dimensions: ${tile.width}x${tile.height}`);
    };

    expect(getTileSize(tiles[0])).toBe('2x2');
    expect(getTileSize(tiles[1])).toBe('2x4');
  });

  it('should filter tiles by size', () => {
    const tiles: TileDefinition[] = [
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

    const filter2x2 = (tiles: TileDefinition[]) =>
      tiles.filter(tile => tile.width === 24 && tile.height === 24);

    const filter2x4 = (tiles: TileDefinition[]) =>
      tiles.filter(tile => tile.width === 24 && tile.height === 48);

    const tiles2x2 = filter2x2(tiles);
    const tiles2x4 = filter2x4(tiles);

    expect(tiles2x2).toHaveLength(1);
    expect(tiles2x2[0].id).toBe('paw-2x2');

    expect(tiles2x4).toHaveLength(1);
    expect(tiles2x4[0].id).toBe('paw-2x4');
  });

  it('should validate tile definition structure', () => {
    const validTile: TileDefinition = {
      id: 'valid-tile',
      name: 'Valid Tile',
      description: 'A valid tile definition',
      width: 24,
      height: 24,
      imageUrl: '/tiles/valid-tile.png',
      category: 'test'
    };

    // Check all required properties exist
    expect(validTile).toHaveProperty('id');
    expect(validTile).toHaveProperty('name');
    expect(validTile).toHaveProperty('description');
    expect(validTile).toHaveProperty('width');
    expect(validTile).toHaveProperty('height');
    expect(validTile).toHaveProperty('imageUrl');
    expect(validTile).toHaveProperty('category');

    // Check types
    expect(typeof validTile.id).toBe('string');
    expect(typeof validTile.name).toBe('string');
    expect(typeof validTile.description).toBe('string');
    expect(typeof validTile.width).toBe('number');
    expect(typeof validTile.height).toBe('number');
    expect(typeof validTile.imageUrl).toBe('string');
    expect(typeof validTile.category).toBe('string');
  });
});