import { Point, Shape } from '../types';
import { convertShapeToPolygon } from './geometry';
import { getRoomBounds } from './canvasDrawing';

export function isWallVertical(wallIndex: number, vertices: Point[]): boolean {
  if (vertices.length === 0) return false;

  const current = vertices[wallIndex];
  const next = vertices[(wallIndex + 1) % vertices.length];

  // Check if the wall is more vertical than horizontal
  const deltaX = Math.abs(next.x - current.x);
  const deltaY = Math.abs(next.y - current.y);

  return deltaY > deltaX;
}

export function findWallLabelAt(
  screenPos: Point,
  wallLabels: any[],
  worldToScreen: (point: Point) => Point
): number {
  for (let i = 0; i < wallLabels.length; i++) {
    const label = wallLabels[i];
    const labelScreenPos = worldToScreen(label.midpoint);

    const offsetDistance = 25;
    const normalAngle = label.angle + Math.PI / 2;
    const offsetX = Math.cos(normalAngle) * offsetDistance;
    const offsetY = Math.sin(normalAngle) * offsetDistance;

    const labelX = labelScreenPos.x + offsetX;
    const labelY = labelScreenPos.y + offsetY;

    const distance = Math.sqrt(
      Math.pow(screenPos.x - labelX, 2) + Math.pow(screenPos.y - labelY, 2)
    );

    if (distance <= 30) {
      return i;
    }
  }
  return -1;
}

export function moveWall(
  wallIndex: number,
  deltaX: number,
  deltaY: number,
  shape: Shape,
  onShapeChange: (shape: Shape) => void
) {
  if (shape.type === 'rectangle') {
    moveRectangleWall(wallIndex, deltaX, deltaY, shape, onShapeChange);
  } else if (shape.type === 'l-shape') {
    moveLShapeWall(wallIndex, deltaX, deltaY, shape, onShapeChange);
  }
}

export function moveRectangleWall(
  wallIndex: number,
  deltaX: number,
  deltaY: number,
  shape: Shape,
  onShapeChange: (shape: Shape) => void
) {
  const vertices = convertShapeToPolygon(shape);
  if (vertices.length === 0) return;

  const isVertical = isWallVertical(wallIndex, vertices);
  const newVertices = [...vertices];

  if (isVertical) {
    // For vertical walls, only allow horizontal movement
    const current = vertices[wallIndex];
    const next = vertices[(wallIndex + 1) % vertices.length];

    newVertices[wallIndex] = { ...current, x: current.x + deltaX };
    newVertices[(wallIndex + 1) % vertices.length] = { ...next, x: next.x + deltaX };
  } else {
    // For horizontal walls, only allow vertical movement
    const current = vertices[wallIndex];
    const next = vertices[(wallIndex + 1) % vertices.length];

    newVertices[wallIndex] = { ...current, y: current.y + deltaY };
    newVertices[(wallIndex + 1) % vertices.length] = { ...next, y: next.y + deltaY };
  }

  const bounds = getRoomBounds(newVertices);
  const newShape = {
    type: 'rectangle' as const,
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY
  };
  onShapeChange(newShape);
}

export function moveLShapeWall(
  wallIndex: number,
  deltaX: number,
  deltaY: number,
  shape: Shape,
  onShapeChange: (shape: Shape) => void
) {
  if (shape.type !== 'l-shape') return;

  const vertices = convertShapeToPolygon(shape);
  const isVertical = isWallVertical(wallIndex, vertices);
  const currentShape = shape;
  let newShape = { ...currentShape };

  // L-shape wall mapping (based on lShapeToPolygon):
  // Wall 0 (A): top edge (0,0) -> (width1,0) - horizontal wall, move vertically affects position
  // Wall 1 (B): right edge of first section (width1,0) -> (width1,height1) - vertical wall
  // Wall 2 (C): inner horizontal edge (width1,height1) -> (width1+width2,height1) - horizontal wall
  // Wall 3 (D): right edge of second section (width1+width2,height1) -> (width1+width2,height1+height2) - vertical wall
  // Wall 4 (E): bottom edge (width1+width2,height1+height2) -> (0,height1+height2) - horizontal wall
  // Wall 5 (F): left edge (0,height1+height2) -> (0,0) - vertical wall

  switch (wallIndex) {
    case 0: // Wall A: Top edge - horizontal wall
      if (!isVertical && deltaY !== 0) {
        // Moving top edge down increases height1, moving up decreases it
        newShape.height1 = Math.max(0.5, currentShape.height1 - deltaY);
        newShape.height2 = Math.max(0.5, currentShape.height2 - deltaY);
      }
      break;

    case 1: // Wall B: Right edge of first section - vertical wall
      if (isVertical && deltaX !== 0) {
        newShape.width1 = Math.max(0.5, currentShape.width1 + deltaX);
      }
      break;

    case 2: // Wall C: Inner horizontal edge - horizontal wall
      if (!isVertical && deltaY !== 0) {
        newShape.height1 = Math.max(0.5, currentShape.height1 + deltaY);
      }
      break;

    case 3: // Wall D: Right edge of second section - vertical wall
      if (isVertical && deltaX !== 0) {
        newShape.width2 = Math.max(0.5, currentShape.width2 + deltaX);
      }
      break;

    case 4: // Wall E: Bottom edge - horizontal wall
      if (!isVertical && deltaY !== 0) {
        newShape.height1 = Math.max(0.5, currentShape.height1 + deltaY);
        newShape.height2 = Math.max(0.5, currentShape.height2 + deltaY);
      }
      break;

    case 5: // Wall F: Left edge - vertical wall
      if (isVertical && deltaX !== 0) {
        // Moving left edge right decreases width1, moving left increases it
        newShape.width1 = Math.max(0.5, currentShape.width1 - deltaX);
      }
      break;
  }

  onShapeChange(newShape);
}