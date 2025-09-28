import { describe, expect, it, vi, beforeEach } from 'vitest';
import { drawTiles, CANVAS_WIDTH, CANVAS_HEIGHT, PIXELS_PER_FOOT } from '../canvasDrawing';
import { Point, TileConfig, TileOrientation } from '../../types';

// Mock canvas context
const mockContext = {
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  clip: vi.fn(),
  strokeRect: vi.fn(),
  drawImage: vi.fn(),
  stroke: vi.fn(),
  strokeStyle: '',
  lineWidth: 0,
} as unknown as CanvasRenderingContext2D;

// Mock Image constructor
const mockImage = {
  complete: false,
  crossOrigin: '',
  src: '',
  onload: null as (() => void) | null,
  onerror: null as (() => void) | null,
};

global.Image = vi.fn(() => mockImage) as any;

describe('Canvas Drawing - Tile Rendering', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockImage.complete = false;
    mockImage.src = '';
  });

  const mockWorldToScreen = (point: Point): Point => ({
    x: point.x * PIXELS_PER_FOOT + CANVAS_WIDTH / 2,
    y: point.y * PIXELS_PER_FOOT + CANVAS_HEIGHT / 2,
  });

  const mockGetRoomBounds = (vertices: Point[]) => {
    if (vertices.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    let minX = vertices[0].x, maxX = vertices[0].x;
    let minY = vertices[0].y, maxY = vertices[0].y;

    for (const vertex of vertices) {
      minX = Math.min(minX, vertex.x);
      maxX = Math.max(maxX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxY = Math.max(maxY, vertex.y);
    }

    return { minX, maxX, minY, maxY };
  };

  it('should set up clipping path for room shape', () => {
    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 8 },
      { x: 0, y: 8 },
    ];

    const tileConfig: TileConfig = {
      size: '2x2',
      orientation: TileOrientation.Horizontal,
    };

    drawTiles(mockContext, vertices, tileConfig, mockWorldToScreen, mockGetRoomBounds);

    expect(mockContext.save).toHaveBeenCalled();
    expect(mockContext.beginPath).toHaveBeenCalled();
    expect(mockContext.moveTo).toHaveBeenCalled();
    expect(mockContext.lineTo).toHaveBeenCalledTimes(3); // 4 vertices - 1 for moveTo
    expect(mockContext.closePath).toHaveBeenCalled();
    expect(mockContext.clip).toHaveBeenCalled();
    expect(mockContext.restore).toHaveBeenCalled();
  });

  it('should draw tile outlines when no tile is selected', () => {
    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 8 },
      { x: 0, y: 8 },
    ];

    const tileConfig: TileConfig = {
      size: '2x2',
      orientation: TileOrientation.Horizontal,
    };

    drawTiles(mockContext, vertices, tileConfig, mockWorldToScreen, mockGetRoomBounds);

    expect(mockContext.strokeRect).toHaveBeenCalled();
    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });

  it('should draw tile outlines when image is not loaded', () => {
    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 8 },
      { x: 0, y: 8 },
    ];

    const tileConfig: TileConfig = {
      size: '2x2',
      orientation: TileOrientation.Horizontal,
      selectedTile: {
        id: 'test-tile',
        name: 'Test Tile',
        description: 'Test tile description',
        width: 24,
        height: 24,
        imageUrl: '/tiles/test.png',
        category: 'test',
      },
    };

    // Image is not complete
    mockImage.complete = false;

    drawTiles(mockContext, vertices, tileConfig, mockWorldToScreen, mockGetRoomBounds);

    expect(mockContext.strokeRect).toHaveBeenCalled();
    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });

  it('should draw tile images when image is loaded', () => {
    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 4, y: 4 },
      { x: 0, y: 4 },
    ];

    const tileConfig: TileConfig = {
      size: '2x2',
      orientation: TileOrientation.Horizontal,
      selectedTile: {
        id: 'test-tile',
        name: 'Test Tile',
        description: 'Test tile description',
        width: 24,
        height: 24,
        imageUrl: '/tiles/test.png',
        category: 'test',
      },
    };

    // Mock image as loaded
    mockImage.complete = true;

    drawTiles(mockContext, vertices, tileConfig, mockWorldToScreen, mockGetRoomBounds);

    expect(mockContext.drawImage).toHaveBeenCalled();
    expect(mockContext.strokeRect).toHaveBeenCalled(); // Should still draw borders
  });

  it('should handle 2x4 tile orientation correctly', () => {
    const vertices: Point[] = [
      { x: 0, y: 0 },
      { x: 8, y: 0 },
      { x: 8, y: 4 },
      { x: 0, y: 4 },
    ];

    const horizontalConfig: TileConfig = {
      size: '2x4',
      orientation: TileOrientation.Horizontal,
    };

    const verticalConfig: TileConfig = {
      size: '2x4',
      orientation: TileOrientation.Vertical,
    };

    // Test horizontal orientation
    drawTiles(mockContext, vertices, horizontalConfig, mockWorldToScreen, mockGetRoomBounds);
    expect(mockContext.strokeRect).toHaveBeenCalled();

    vi.clearAllMocks();

    // Test vertical orientation
    drawTiles(mockContext, vertices, verticalConfig, mockWorldToScreen, mockGetRoomBounds);
    expect(mockContext.strokeRect).toHaveBeenCalled();
  });

  it('should handle empty vertices array', () => {
    const vertices: Point[] = [];

    const tileConfig: TileConfig = {
      size: '2x2',
      orientation: TileOrientation.Horizontal,
    };

    drawTiles(mockContext, vertices, tileConfig, mockWorldToScreen, mockGetRoomBounds);

    // Should not do any drawing operations
    expect(mockContext.save).not.toHaveBeenCalled();
    expect(mockContext.strokeRect).not.toHaveBeenCalled();
    expect(mockContext.drawImage).not.toHaveBeenCalled();
  });
});