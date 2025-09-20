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
  // Wall 0: bottom edge of first section (0,0) -> (width1,0)
  // Wall 1: right edge of first section (width1,0) -> (width1,height1)
  // Wall 2: bottom edge of second section (width1,height1) -> (width1+width2,height1)
  // Wall 3: right edge of second section (width1+width2,height1) -> (width1+width2,height1+height2)
  // Wall 4: top edge (width1+width2,height1+height2) -> (0,height1+height2)
  // Wall 5: left edge (0,height1+height2) -> (0,0)

  switch (wallIndex) {
    case 0: // Bottom edge of first section - move horizontally affects width1
      if (!isVertical && deltaY !== 0) {
        // Can't move this wall vertically as it would break L-shape
        return;
      }
      if (isVertical && deltaX !== 0) {
        newShape.width1 = Math.max(0.5, currentShape.width1 + deltaX);
      }
      break;

    case 1: // Right edge of first section - move vertically affects height1
      if (isVertical && deltaX !== 0) {
        newShape.width1 = Math.max(0.5, currentShape.width1 + deltaX);
      }
      if (!isVertical && deltaY !== 0) {
        newShape.height1 = Math.max(0.5, currentShape.height1 + deltaY);
      }
      break;

    case 2: // Bottom edge of second section - move horizontally affects width2
      if (!isVertical && deltaY !== 0) {
        newShape.height1 = Math.max(0.5, currentShape.height1 + deltaY);
      }
      if (isVertical && deltaX !== 0) {
        newShape.width2 = Math.max(0.5, currentShape.width2 + deltaX);
      }
      break;

    case 3: // Right edge of second section - move vertically affects height2
      if (isVertical && deltaX !== 0) {
        newShape.width2 = Math.max(0.5, currentShape.width2 + deltaX);
      }
      if (!isVertical && deltaY !== 0) {
        newShape.height2 = Math.max(0.5, currentShape.height2 + deltaY);
      }
      break;

    case 4: // Top edge - move vertically affects both heights
      if (!isVertical && deltaY !== 0) {
        newShape.height2 = Math.max(0.5, currentShape.height2 + deltaY);
      }
      break;

    case 5: // Left edge - move horizontally would break L-shape
      if (!isVertical && deltaY !== 0) {
        newShape.height2 = Math.max(0.5, currentShape.height2 + deltaY);
      }
      break;
  }

  onShapeChange(newShape);
}