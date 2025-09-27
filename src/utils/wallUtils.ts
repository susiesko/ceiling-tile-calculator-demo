import { Wall, ShapeType } from '../types';

/**
 * Generate wall objects for a rectangle with given dimensions
 */
export function generateWallsFromRectangle(widthFeet: number, heightFeet: number): Wall[] {
  return [
    { name: 'A', lengthInches: widthFeet * 12, orientation: 'horizontal', wallIndex: 0 },
    { name: 'B', lengthInches: heightFeet * 12, orientation: 'vertical', wallIndex: 1 },
    { name: 'C', lengthInches: widthFeet * 12, orientation: 'horizontal', wallIndex: 2 },
    { name: 'D', lengthInches: heightFeet * 12, orientation: 'vertical', wallIndex: 3 }
  ];
}

/**
 * Generate wall objects for an L-shape with given dimensions
 */
export function generateWallsFromLShape(width1: number, height1: number, width2: number, height2: number): Wall[] {
  return [
    { name: 'A', lengthInches: width1 * 12, orientation: 'horizontal', wallIndex: 0 },
    { name: 'B', lengthInches: height1 * 12, orientation: 'vertical', wallIndex: 1 },
    { name: 'C', lengthInches: width2 * 12, orientation: 'horizontal', wallIndex: 2 },
    { name: 'D', lengthInches: height2 * 12, orientation: 'vertical', wallIndex: 3 },
    { name: 'E', lengthInches: (width1 + width2) * 12, orientation: 'horizontal', wallIndex: 4 },
    { name: 'F', lengthInches: (height1 + height2) * 12, orientation: 'vertical', wallIndex: 5 }
  ];
}

/**
 * Determine shape type from walls array
 */
export function getShapeTypeFromWalls(walls: Wall[]): ShapeType {
  switch (walls.length) {
    case 4:
      return 'rectangle';
    case 6:
      return 'l-shape';
    default:
      return 'rectangle'; // fallback
  }
}


