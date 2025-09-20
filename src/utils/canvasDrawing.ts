import { Point, TileConfig, TileOrientation, Units } from '../types';
import { formatFeetInches } from './units';

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const PIXELS_PER_FOOT = 40;

export interface WallLabel {
  midpoint: Point;
  length: number;
  angle: number;
  wallIndex: number;
}

export function drawGrid(ctx: CanvasRenderingContext2D, tileConfig: TileConfig) {
  ctx.strokeStyle = '#f3f4f6';
  ctx.lineWidth = 1;

  const baseTileSize = PIXELS_PER_FOOT;
  let xSpacing = baseTileSize;
  let ySpacing = baseTileSize;

  if (tileConfig.size === '2x4') {
    if (tileConfig.orientation === TileOrientation.Horizontal) {
      xSpacing = baseTileSize * 4;
      ySpacing = baseTileSize * 2;
    } else {
      xSpacing = baseTileSize * 2;
      ySpacing = baseTileSize * 4;
    }
  } else {
    xSpacing = baseTileSize * 2;
    ySpacing = baseTileSize * 2;
  }

  // Draw vertical lines
  for (let x = 0; x <= CANVAS_WIDTH; x += xSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y <= CANVAS_HEIGHT; y += ySpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_WIDTH, y);
    ctx.stroke();
  }
}

export function drawTiles(
  ctx: CanvasRenderingContext2D,
  vertices: Point[],
  tileConfig: TileConfig,
  worldToScreen: (point: Point) => Point,
  getRoomBounds: (vertices: Point[]) => { minX: number; maxX: number; minY: number; maxY: number }
) {
  if (vertices.length === 0) return;

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;

  const tileSize = tileConfig.size === '2x2' ? 2 : (tileConfig.orientation === TileOrientation.Horizontal ? {
    w: 4,
    h: 2
  } : { w: 2, h: 4 });

  const tileSizePixels = {
    width: (typeof tileSize === 'number' ? tileSize : tileSize.w) * PIXELS_PER_FOOT,
    height: (typeof tileSize === 'number' ? tileSize : tileSize.h) * PIXELS_PER_FOOT
  };

  const bounds = getRoomBounds(vertices);
  const topLeft = worldToScreen({ x: bounds.minX, y: bounds.minY });
  const bottomRight = worldToScreen({ x: bounds.maxX, y: bounds.maxY });

  // Draw tile grid within room bounds
  for (let x = topLeft.x; x < bottomRight.x; x += tileSizePixels.width) {
    for (let y = topLeft.y; y < bottomRight.y; y += tileSizePixels.height) {
      ctx.strokeRect(x, y, tileSizePixels.width, tileSizePixels.height);
    }
  }
}

export function drawRoomShape(
  ctx: CanvasRenderingContext2D,
  vertices: Point[],
  worldToScreen: (point: Point) => Point
) {
  if (vertices.length < 3) return;

  ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 3;

  ctx.beginPath();
  const firstPoint = worldToScreen(vertices[0]);
  ctx.moveTo(firstPoint.x, firstPoint.y);

  for (let i = 1; i < vertices.length; i++) {
    const point = worldToScreen(vertices[i]);
    ctx.lineTo(point.x, point.y);
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

export function drawWallLabels(
  ctx: CanvasRenderingContext2D,
  labels: WallLabel[],
  units: Units,
  isDraggingWall: boolean,
  worldToScreen: (point: Point) => Point
) {
  ctx.fillStyle = '#374151';
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.font = '14px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  labels.forEach((label) => {
    const screenPos = worldToScreen(label.midpoint);
    const labelText = units === 'feet' ? formatFeetInches(label.length) : `${label.length.toFixed(1)}m`;

    // Offset label from wall
    const offsetDistance = 25;
    const normalAngle = label.angle + Math.PI / 2;
    const offsetX = Math.cos(normalAngle) * offsetDistance;
    const offsetY = Math.sin(normalAngle) * offsetDistance;

    const labelX = screenPos.x + offsetX;
    const labelY = screenPos.y + offsetY;

    // Draw label background
    const metrics = ctx.measureText(labelText);
    const padding = 8;
    const bgWidth = metrics.width + padding * 2;
    const bgHeight = 24;

    const isActive = false;
    const isDragging = isActive && isDraggingWall;

    ctx.fillStyle = isDragging ? '#dcfce7' : (isActive ? '#fef3c7' : '#ffffff');
    ctx.strokeStyle = isDragging ? '#16a34a' : (isActive ? '#f59e0b' : '#d1d5db');
    ctx.lineWidth = isDragging ? 3 : 2;

    ctx.fillRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);
    ctx.strokeRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);

    // Draw label text
    ctx.fillStyle = isDragging ? '#166534' : (isActive ? '#92400e' : '#374151');
    ctx.fillText(labelText, labelX, labelY);
  });
}

export function calculateWallLabels(vertices: Point[]): WallLabel[] {
  const labels: WallLabel[] = [];

  for (let i = 0; i < vertices.length; i++) {
    const current = vertices[i];
    const next = vertices[(i + 1) % vertices.length];

    const midpoint: Point = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2
    };

    const length = Math.sqrt(
      Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
    );

    const angle = Math.atan2(next.y - current.y, next.x - current.x);

    labels.push({
      midpoint,
      length,
      angle,
      wallIndex: i
    });
  }

  return labels;
}

export function getRoomBounds(vertices: Point[]) {
  let minX = vertices[0].x, maxX = vertices[0].x;
  let minY = vertices[0].y, maxY = vertices[0].y;

  for (const vertex of vertices) {
    minX = Math.min(minX, vertex.x);
    maxX = Math.max(maxX, vertex.x);
    minY = Math.min(minY, vertex.y);
    maxY = Math.max(maxY, vertex.y);
  }

  return { minX, maxX, minY, maxY };
}