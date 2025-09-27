import { Wall } from '../types';
import { convertWallsToPolygon } from './geometry';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateWalls(walls: Wall[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  const unitLabel = 'feet';
  const minDimensionInches = 6; // 6 inches minimum

  // Validate each wall
  for (const wall of walls) {
    if (wall.lengthInches <= 0) {
      result.errors.push(`Wall ${wall.name} must have a length greater than 0`);
      result.isValid = false;
    }
    if (wall.lengthInches < minDimensionInches) {
      result.warnings.push(
        `Wall ${wall.name} is very small (minimum recommended: ${minDimensionInches / 12} ${unitLabel})`
      );
    }
  }

  // Check if room is too large
  const vertices = convertWallsToPolygon(walls);
  if (vertices.length > 0) {
    const bounds = getBounds(vertices);
    const area = Math.abs(bounds.maxX - bounds.minX) * Math.abs(bounds.maxY - bounds.minY);
    const maxArea = 2000; // 2000 sq ft

    if (area > maxArea) {
      result.warnings.push(
        `Room area is very large (${area.toFixed(1)} sq ft). Performance may be affected.`
      );
    }
  }

  return result;
}

function getBounds(vertices: { x: number; y: number }[]): {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
} {
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
