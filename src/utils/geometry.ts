import { Point, Wall } from '../types';

/**
 * Convert walls array to polygon vertices
 */
export function convertWallsToPolygon(walls: Wall[]): Point[] {
  switch (walls.length) {
    case 4:
      return convertRectangleWallsToPolygon(walls);
    case 6:
      return convertLShapeWallsToPolygon(walls);
    default:
      return [];
  }
}

function convertRectangleWallsToPolygon(walls: Wall[]): Point[] {
  // For rectangle: A=top, B=right, C=bottom, D=left
  const wallA = walls.find((w) => w.name === 'A');
  const wallB = walls.find((w) => w.name === 'B');

  if (!wallA || !wallB) return [];

  const width = wallA.lengthInches / 12;
  const height = wallB.lengthInches / 12;

  return [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: width, y: height },
    { x: 0, y: height },
  ];
}

function convertLShapeWallsToPolygon(walls: Wall[]): Point[] {
  // For L-shape: A=top, B=right1, C=inner, D=right2, E=bottom, F=left
  const wallA = walls.find((w) => w.name === 'A');
  const wallB = walls.find((w) => w.name === 'B');
  const wallC = walls.find((w) => w.name === 'C');
  const wallD = walls.find((w) => w.name === 'D');

  if (!wallA || !wallB || !wallC || !wallD) return [];

  const width1 = wallA.lengthInches / 12;
  const height1 = wallB.lengthInches / 12;
  const width2 = wallC.lengthInches / 12;
  const height2 = wallD.lengthInches / 12;

  return [
    { x: 0, y: 0 },
    { x: width1, y: 0 },
    { x: width1, y: height1 },
    { x: width1 + width2, y: height1 },
    { x: width1 + width2, y: height1 + height2 },
    { x: 0, y: height1 + height2 },
  ];
}

export function calculatePolygonArea(vertices: Point[]): number {
  if (vertices.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(area) / 2;
}

export function isPointInPolygon(point: Point, vertices: Point[]): boolean {
  // First check if point is on the boundary
  if (isPointOnBoundary(point, vertices)) {
    return false; // Exclude boundary points
  }

  let inside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    if (
      vertices[i].y > point.y !== vertices[j].y > point.y &&
      point.x <
        ((vertices[j].x - vertices[i].x) * (point.y - vertices[i].y)) /
          (vertices[j].y - vertices[i].y) +
          vertices[i].x
    ) {
      inside = !inside;
    }
  }

  return inside;
}

function isPointOnBoundary(point: Point, vertices: Point[]): boolean {
  const tolerance = 1e-10;

  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const v1 = vertices[i];
    const v2 = vertices[j];

    // Check if point is on the line segment between v1 and v2
    if (isPointOnLineSegment(point, v1, v2, tolerance)) {
      return true;
    }
  }

  return false;
}

function isPointOnLineSegment(point: Point, a: Point, b: Point, tolerance: number): boolean {
  // Check if point is on the line segment a-b
  const crossProduct = (point.y - a.y) * (b.x - a.x) - (point.x - a.x) * (b.y - a.y);

  // If cross product is not close to zero, point is not on the line
  if (Math.abs(crossProduct) > tolerance) {
    return false;
  }

  // Check if point is within the segment bounds
  const dotProduct = (point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y);
  const segmentLengthSquared = (b.x - a.x) * (b.x - a.x) + (b.y - a.y) * (b.y - a.y);

  return dotProduct >= 0 && dotProduct <= segmentLengthSquared;
}

export function validatePolygon(vertices: Point[]): { valid: boolean; error?: string } {
  if (vertices.length < 3) {
    return { valid: false, error: 'Polygon must have at least 3 vertices' };
  }

  if (hasSelfIntersection(vertices)) {
    return { valid: false, error: 'Polygon cannot have self-intersections' };
  }

  const minEdgeLength = 0.5; // minimum edge length
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    const distance = Math.sqrt(
      Math.pow(vertices[j].x - vertices[i].x, 2) + Math.pow(vertices[j].y - vertices[i].y, 2)
    );
    if (distance < minEdgeLength) {
      return { valid: false, error: `Edge ${i + 1} is too short (minimum ${minEdgeLength} units)` };
    }
  }

  return { valid: true };
}

function hasSelfIntersection(vertices: Point[]): boolean {
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 2; j < vertices.length; j++) {
      if (j === vertices.length - 1 && i === 0) continue; // skip adjacent edges

      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      const p3 = vertices[j];
      const p4 = vertices[(j + 1) % vertices.length];

      if (lineSegmentsIntersect(p1, p2, p3, p4)) {
        return true;
      }
    }
  }
  return false;
}

function lineSegmentsIntersect(p1: Point, p2: Point, p3: Point, p4: Point): boolean {
  const d1 = direction(p3, p4, p1);
  const d2 = direction(p3, p4, p2);
  const d3 = direction(p1, p2, p3);
  const d4 = direction(p1, p2, p4);

  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) {
    return true;
  }

  return false;
}

function direction(a: Point, b: Point, c: Point): number {
  return (c.x - a.x) * (b.y - a.y) - (b.x - a.x) * (c.y - a.y);
}

export function snapToGrid(point: Point, gridSize: number): Point {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
}
