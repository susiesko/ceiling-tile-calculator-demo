import { Point, TileConfig, GridConfig, CalculationResult, Cutout, Dimensions } from '../types';
import { calculatePolygonArea, isPointInPolygon } from './geometry';

export interface TileCell {
  x: number;
  y: number;
  width: number;
  height: number;
  coverage: number; // 0-1, how much of the tile is covered by the room
  isFull: boolean;
}

export function calculateTiles(
  roomVertices: Point[],
  cutouts: Cutout[],
  tileConfig: TileConfig,
  gridConfig: GridConfig
): CalculationResult {
  const tileSize = getTileSize(tileConfig.size, tileConfig.orientation);
  const roomArea = calculatePolygonArea(roomVertices);
  const tileArea = tileSize.width * tileSize.height;

  const tiles = generateTileGrid(roomVertices, tileSize, gridConfig);
  const validTiles = filterTilesByCoverage(tiles, roomVertices, cutouts, tileConfig);

  const fullTiles = validTiles.filter(tile => tile.isFull).length;
  const partialTiles = validTiles.filter(tile => !tile.isFull).length;
  const totalTiles = fullTiles + partialTiles;
  const estimatedTotal = fullTiles + Math.ceil(partialTiles);

  return {
    totalTiles,
    fullTiles,
    partialTiles,
    estimatedTotal,
    area: roomArea,
    tileArea,
    wasteFactor: calculateWasteFactor(estimatedTotal * tileArea, roomArea),
    costEstimate: undefined
  };
}

function getTileSize(size: string, orientation: number): Dimensions {
  const baseSizes = {
    '2x2': { width: 2, height: 2 },
    '2x4': { width: 2, height: 4 }
  };

  const baseSize = baseSizes[size as keyof typeof baseSizes];

  if (orientation === 90) {
    return { width: baseSize.height, height: baseSize.width };
  }

  return baseSize;
}

function generateTileGrid(
  roomVertices: Point[],
  tileSize: Dimensions,
  gridConfig: GridConfig
): TileCell[] {
  const bounds = getBounds(roomVertices);
  const tiles: TileCell[] = [];

  // Extend bounds to ensure we cover the entire room
  const startX = Math.floor((bounds.minX - tileSize.width) / tileSize.width) * tileSize.width;
  const startY = Math.floor((bounds.minY - tileSize.height) / tileSize.height) * tileSize.height;
  const endX = Math.ceil((bounds.maxX + tileSize.width) / tileSize.width) * tileSize.width;
  const endY = Math.ceil((bounds.maxY + tileSize.height) / tileSize.height) * tileSize.height;

  // Apply grid offset
  const offsetX = gridConfig.offsetX;
  const offsetY = gridConfig.offsetY;

  for (let x = startX + offsetX; x < endX; x += tileSize.width) {
    for (let y = startY + offsetY; y < endY; y += tileSize.height) {
      tiles.push({
        x,
        y,
        width: tileSize.width,
        height: tileSize.height,
        coverage: 0,
        isFull: false
      });
    }
  }

  return tiles;
}

function filterTilesByCoverage(
  tiles: TileCell[],
  roomVertices: Point[],
  cutouts: Cutout[],
  tileConfig: TileConfig
): TileCell[] {
  const validTiles: TileCell[] = [];
  const minCoverage = 0.1; // Minimum coverage to include a tile

  for (const tile of tiles) {
    const coverage = calculateTileCoverage(tile, roomVertices, cutouts, tileConfig);

    if (coverage >= minCoverage) {
      tile.coverage = coverage;
      tile.isFull = coverage >= 0.95; // Consider full if 95% or more is covered
      validTiles.push(tile);
    }
  }

  return validTiles;
}

function calculateTileCoverage(
  tile: TileCell,
  roomVertices: Point[],
  cutouts: Cutout[],
  tileConfig: TileConfig
): number {
  const sampleSize = 10; // Grid resolution for sampling
  const totalSamples = sampleSize * sampleSize;
  let coveredSamples = 0;

  const stepX = tile.width / sampleSize;
  const stepY = tile.height / sampleSize;

  for (let i = 0; i < sampleSize; i++) {
    for (let j = 0; j < sampleSize; j++) {
      const samplePoint: Point = {
        x: tile.x + (i + 0.5) * stepX,
        y: tile.y + (j + 0.5) * stepY
      };

      if (isPointInRoom(samplePoint, roomVertices, cutouts, tileConfig)) {
        coveredSamples++;
      }
    }
  }

  return coveredSamples / totalSamples;
}

function isPointInRoom(point: Point, roomVertices: Point[], cutouts: Cutout[], tileConfig: TileConfig): boolean {
  // Check if point is inside the room
  if (!isPointInPolygon(point, roomVertices)) {
    return false;
  }

  // Check if point is in any cutout
  for (const cutout of cutouts) {
    if (isPointInCutout(point, cutout)) {
      return false;
    }
  }


  return true;
}

function isPointInCutout(point: Point, cutout: Cutout): boolean {
  const left = cutout.position.x;
  const right = cutout.position.x + cutout.dimensions.width;
  const top = cutout.position.y;
  const bottom = cutout.position.y + cutout.dimensions.height;

  if (cutout.type === 'rectangle') {
    return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
  }

  // For rounded cutouts, check if point is within rounded rectangle
  const radius = cutout.cornerRadius || 0;

  // Check if point is in the main rectangle (excluding corners)
  if ((point.x >= left + radius && point.x <= right - radius) ||
      (point.y >= top + radius && point.y <= bottom - radius)) {
    return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
  }

  // Check rounded corners
  const corners = [
    { cx: left + radius, cy: top + radius },
    { cx: right - radius, cy: top + radius },
    { cx: right - radius, cy: bottom - radius },
    { cx: left + radius, cy: bottom - radius }
  ];

  for (const corner of corners) {
    const dx = point.x - corner.cx;
    const dy = point.y - corner.cy;
    if (dx * dx + dy * dy <= radius * radius) {
      return true;
    }
  }

  return false;
}

function getBounds(vertices: Point[]): { minX: number; maxX: number; minY: number; maxY: number } {
  if (vertices.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  }

  let minX = vertices[0].x;
  let maxX = vertices[0].x;
  let minY = vertices[0].y;
  let maxY = vertices[0].y;

  for (const vertex of vertices) {
    minX = Math.min(minX, vertex.x);
    maxX = Math.max(maxX, vertex.x);
    minY = Math.min(minY, vertex.y);
    maxY = Math.max(maxY, vertex.y);
  }

  return { minX, maxX, minY, maxY };
}

function calculateWasteFactor(totalTileArea: number, roomArea: number): number {
  if (roomArea === 0) return 0;
  return Math.max(0, (totalTileArea - roomArea) / roomArea * 100);
}