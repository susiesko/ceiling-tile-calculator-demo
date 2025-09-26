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
  letter: string;
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  tileConfig: TileConfig
) {
  ctx.strokeStyle = '#f3f4f6';
  ctx.lineWidth = 1;

  // Calculate tile size in pixels - fixed to canvas
  let tileWidthPixels = 2 * PIXELS_PER_FOOT;  // default 2x2
  let tileHeightPixels = 2 * PIXELS_PER_FOOT;

  if (tileConfig.size === '2x4') {
    if (tileConfig.orientation === TileOrientation.Horizontal) {
      tileWidthPixels = 4 * PIXELS_PER_FOOT;
      tileHeightPixels = 2 * PIXELS_PER_FOOT;
    } else {
      tileWidthPixels = 2 * PIXELS_PER_FOOT;
      tileHeightPixels = 4 * PIXELS_PER_FOOT;
    }
  }

  // Draw vertical lines across entire canvas
  for (let x = 0; x <= CANVAS_WIDTH; x += tileWidthPixels) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Draw horizontal lines across entire canvas
  for (let y = 0; y <= CANVAS_HEIGHT; y += tileHeightPixels) {
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

  // Calculate tile size in pixels - same as fixed grid
  let tileWidthPixels = 2 * PIXELS_PER_FOOT;  // default 2x2
  let tileHeightPixels = 2 * PIXELS_PER_FOOT;

  if (tileConfig.size === '2x4') {
    if (tileConfig.orientation === TileOrientation.Horizontal) {
      tileWidthPixels = 4 * PIXELS_PER_FOOT;
      tileHeightPixels = 2 * PIXELS_PER_FOOT;
    } else {
      tileWidthPixels = 2 * PIXELS_PER_FOOT;
      tileHeightPixels = 4 * PIXELS_PER_FOOT;
    }
  }

  // Get room bounds in screen coordinates
  const bounds = getRoomBounds(vertices);
  const topLeftScreen = worldToScreen({ x: bounds.minX, y: bounds.minY });
  const bottomRightScreen = worldToScreen({ x: bounds.maxX, y: bounds.maxY });

  // Find the range of canvas grid cells that intersect with the room
  const startGridX = Math.floor(topLeftScreen.x / tileWidthPixels) * tileWidthPixels;
  const startGridY = Math.floor(topLeftScreen.y / tileHeightPixels) * tileHeightPixels;
  const endGridX = Math.ceil(bottomRightScreen.x / tileWidthPixels) * tileWidthPixels;
  const endGridY = Math.ceil(bottomRightScreen.y / tileHeightPixels) * tileHeightPixels;

  // Draw tiles aligned with the fixed canvas grid
  for (let x = startGridX; x < endGridX; x += tileWidthPixels) {
    for (let y = startGridY; y < endGridY; y += tileHeightPixels) {
      // Only draw tiles that are within canvas bounds
      if (x >= 0 && y >= 0 && x < CANVAS_WIDTH && y < CANVAS_HEIGHT) {
        ctx.strokeRect(x, y, tileWidthPixels, tileHeightPixels);
      }
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
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.textAlign = 'center';

  labels.forEach((label) => {
    const screenPos = worldToScreen(label.midpoint);
    const lengthText = units === 'feet' ? formatFeetInches(label.length) : `${label.length.toFixed(1)}m`;

    // Offset label from wall
    const offsetDistance = 35;
    const normalAngle = label.angle + Math.PI / 2;
    const offsetX = Math.cos(normalAngle) * offsetDistance;
    const offsetY = Math.sin(normalAngle) * offsetDistance;

    const labelX = screenPos.x + offsetX;
    const labelY = screenPos.y + offsetY;

    // Measure text for background sizing
    ctx.font = '16px system-ui, sans-serif';
    const letterMetrics = ctx.measureText(label.letter);
    ctx.font = '12px system-ui, sans-serif';
    const lengthMetrics = ctx.measureText(lengthText);

    const padding = 8;
    const bgWidth = Math.max(letterMetrics.width, lengthMetrics.width) + padding * 2;
    const bgHeight = 40; // Taller to accommodate both letter and length

    const isActive = false;
    const isDragging = isActive && isDraggingWall;

    // Draw label background
    ctx.fillStyle = isDragging ? '#dcfce7' : (isActive ? '#fef3c7' : '#ffffff');
    ctx.strokeStyle = isDragging ? '#16a34a' : (isActive ? '#f59e0b' : '#d1d5db');
    ctx.lineWidth = isDragging ? 3 : 2;

    ctx.fillRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);
    ctx.strokeRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);

    // Draw letter (larger, prominent)
    ctx.fillStyle = isDragging ? '#166534' : (isActive ? '#92400e' : '#1f2937');
    ctx.font = '16px system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(label.letter, labelX, labelY - 8);

    // Draw length measurement (smaller, below letter)
    ctx.fillStyle = isDragging ? '#166534' : (isActive ? '#92400e' : '#6b7280');
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(lengthText, labelX, labelY + 8);
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

    // Generate alphabetical letter starting from A
    const letter = String.fromCharCode(65 + i); // A=65, B=66, etc.

    labels.push({
      midpoint,
      length,
      angle,
      wallIndex: i,
      letter
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