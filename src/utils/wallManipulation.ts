import { Point, Wall } from '../types';
import { convertWallsToPolygon } from './geometry';

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
  walls: Wall[],
  onWallChange: (wallIndex: number, wall: Partial<Wall>) => void
) {
  if (walls.length === 4) {
    moveRectangleWall(wallIndex, deltaX, deltaY, walls, onWallChange);
  } else if (walls.length === 6) {
    moveLShapeWall(wallIndex, deltaX, deltaY, walls, onWallChange);
  }
}

export function moveRectangleWall(
  wallIndex: number,
  deltaX: number,
  deltaY: number,
  walls: Wall[],
  onWallChange: (wallIndex: number, wall: Partial<Wall>) => void
) {
  const vertices = convertWallsToPolygon(walls);
  if (vertices.length === 0) return;

  const isVertical = isWallVertical(wallIndex, vertices);

  // Snap movement to 0.5 inch increments (1/24 feet)
  const snapSize = 1 / 24; // 0.5 inches in feet
  const snappedDeltaX = Math.round(deltaX / snapSize) * snapSize;
  const snappedDeltaY = Math.round(deltaY / snapSize) * snapSize;

  // For rectangle: A=top, B=right, C=bottom, D=left
  if (isVertical) {
    // Moving vertical walls (B or D) affects width
    const movement = snappedDeltaX;
    if (wallIndex === 1) {
      // Wall B (right) - increase width
      const wallA = walls.find((w) => w.name === 'A');
      const wallC = walls.find((w) => w.name === 'C');
      if (wallA && wallC) {
        const newWidth = Math.max(0.5, wallA.lengthInches / 12 + movement);
        onWallChange(wallA.wallIndex, { lengthInches: newWidth * 12 });
        onWallChange(wallC.wallIndex, { lengthInches: newWidth * 12 });
      }
    } else if (wallIndex === 3) {
      // Wall D (left) - decrease width
      const wallA = walls.find((w) => w.name === 'A');
      const wallC = walls.find((w) => w.name === 'C');
      if (wallA && wallC) {
        const newWidth = Math.max(0.5, wallA.lengthInches / 12 - movement);
        onWallChange(wallA.wallIndex, { lengthInches: newWidth * 12 });
        onWallChange(wallC.wallIndex, { lengthInches: newWidth * 12 });
      }
    }
  } else {
    // Moving horizontal walls (A or C) affects height
    const movement = snappedDeltaY;
    if (wallIndex === 0) {
      // Wall A (top) - decrease height
      const wallB = walls.find((w) => w.name === 'B');
      const wallD = walls.find((w) => w.name === 'D');
      if (wallB && wallD) {
        const newHeight = Math.max(0.5, wallB.lengthInches / 12 - movement);
        onWallChange(wallB.wallIndex, { lengthInches: newHeight * 12 });
        onWallChange(wallD.wallIndex, { lengthInches: newHeight * 12 });
      }
    } else if (wallIndex === 2) {
      // Wall C (bottom) - increase height
      const wallB = walls.find((w) => w.name === 'B');
      const wallD = walls.find((w) => w.name === 'D');
      if (wallB && wallD) {
        const newHeight = Math.max(0.5, wallB.lengthInches / 12 + movement);
        onWallChange(wallB.wallIndex, { lengthInches: newHeight * 12 });
        onWallChange(wallD.wallIndex, { lengthInches: newHeight * 12 });
      }
    }
  }
}

export function moveLShapeWall(
  wallIndex: number,
  deltaX: number,
  deltaY: number,
  walls: Wall[],
  onWallChange: (wallIndex: number, wall: Partial<Wall>) => void
) {
  const vertices = convertWallsToPolygon(walls);
  if (vertices.length === 0) return;

  const isVertical = isWallVertical(wallIndex, vertices);

  // Snap movement to 0.5 inch increments (1/24 feet)
  const snapSize = 1 / 24; // 0.5 inches in feet
  const snappedDeltaX = Math.round(deltaX / snapSize) * snapSize;
  const snappedDeltaY = Math.round(deltaY / snapSize) * snapSize;

  // For L-shape: A=top, B=right1, C=inner, D=right2, E=bottom, F=left
  const wallA = walls.find((w) => w.name === 'A');
  const wallB = walls.find((w) => w.name === 'B');
  const wallC = walls.find((w) => w.name === 'C');
  const wallD = walls.find((w) => w.name === 'D');
  const wallE = walls.find((w) => w.name === 'E');
  const wallF = walls.find((w) => w.name === 'F');

  switch (wallIndex) {
    case 0: // Wall A: Top edge - affects total height
      if (!isVertical && snappedDeltaY !== 0) {
        const movement = -snappedDeltaY; // Invert because moving up decreases height
        if (wallB && wallD && wallF) {
          const currentTotalHeight = wallF.lengthInches / 12;
          const newTotalHeight = Math.max(1, currentTotalHeight + movement);
          const currentHeight1 = wallB.lengthInches / 12;
          const currentHeight2 = wallD.lengthInches / 12;

          // Maintain the ratio between height1 and height2
          const ratio = currentHeight1 / (currentHeight1 + currentHeight2);
          const newHeight1 = Math.max(0.5, newTotalHeight * ratio);
          const newHeight2 = Math.max(0.5, newTotalHeight - newHeight1);

          onWallChange(wallB.wallIndex, { lengthInches: newHeight1 * 12 });
          onWallChange(wallD.wallIndex, { lengthInches: newHeight2 * 12 });
          onWallChange(wallF.wallIndex, { lengthInches: newTotalHeight * 12 });
        }
      }
      break;

    case 1: // Wall B: Right edge of first section - affects width1
      if (isVertical && snappedDeltaX !== 0) {
        if (wallA) {
          const newWidth1 = Math.max(0.5, wallA.lengthInches / 12 + snappedDeltaX);
          onWallChange(wallA.wallIndex, { lengthInches: newWidth1 * 12 });

          // Update total width (wallE)
          if (wallC && wallE) {
            const width2 = wallC.lengthInches / 12;
            onWallChange(wallE.wallIndex, { lengthInches: (newWidth1 + width2) * 12 });
          }
        }
      }
      break;

    case 2: // Wall C: Inner horizontal edge - affects height1
      if (!isVertical && snappedDeltaY !== 0) {
        if (wallB) {
          const newHeight1 = Math.max(0.5, wallB.lengthInches / 12 + snappedDeltaY);
          onWallChange(wallB.wallIndex, { lengthInches: newHeight1 * 12 });

          // Update total height (wallF)
          if (wallD && wallF) {
            const height2 = wallD.lengthInches / 12;
            onWallChange(wallF.wallIndex, { lengthInches: (newHeight1 + height2) * 12 });
          }
        }
      }
      break;

    case 3: // Wall D: Right edge of second section - affects width2
      if (isVertical && snappedDeltaX !== 0) {
        if (wallC) {
          const newWidth2 = Math.max(0.5, wallC.lengthInches / 12 + snappedDeltaX);
          onWallChange(wallC.wallIndex, { lengthInches: newWidth2 * 12 });

          // Update total width (wallE)
          if (wallA && wallE) {
            const width1 = wallA.lengthInches / 12;
            onWallChange(wallE.wallIndex, { lengthInches: (width1 + newWidth2) * 12 });
          }
        }
      }
      break;

    case 4: // Wall E: Bottom edge - affects total height
      if (!isVertical && snappedDeltaY !== 0) {
        if (wallB && wallD && wallF) {
          const currentTotalHeight = wallF.lengthInches / 12;
          const newTotalHeight = Math.max(1, currentTotalHeight + snappedDeltaY);
          const currentHeight1 = wallB.lengthInches / 12;
          const currentHeight2 = wallD.lengthInches / 12;

          // Maintain the ratio between height1 and height2
          const ratio = currentHeight1 / (currentHeight1 + currentHeight2);
          const newHeight1 = Math.max(0.5, newTotalHeight * ratio);
          const newHeight2 = Math.max(0.5, newTotalHeight - newHeight1);

          onWallChange(wallB.wallIndex, { lengthInches: newHeight1 * 12 });
          onWallChange(wallD.wallIndex, { lengthInches: newHeight2 * 12 });
          onWallChange(wallF.wallIndex, { lengthInches: newTotalHeight * 12 });
        }
      }
      break;

    case 5: // Wall F: Left edge - affects total width
      if (isVertical && snappedDeltaX !== 0) {
        const movement = -snappedDeltaX; // Invert because moving left increases width
        if (wallA && wallC && wallE) {
          const currentTotalWidth = wallE.lengthInches / 12;
          const newTotalWidth = Math.max(1, currentTotalWidth + movement);
          const currentWidth1 = wallA.lengthInches / 12;
          const currentWidth2 = wallC.lengthInches / 12;

          // Maintain the ratio between width1 and width2
          const ratio = currentWidth1 / (currentWidth1 + currentWidth2);
          const newWidth1 = Math.max(0.5, newTotalWidth * ratio);
          const newWidth2 = Math.max(0.5, newTotalWidth - newWidth1);

          onWallChange(wallA.wallIndex, { lengthInches: newWidth1 * 12 });
          onWallChange(wallC.wallIndex, { lengthInches: newWidth2 * 12 });
          onWallChange(wallE.wallIndex, { lengthInches: newTotalWidth * 12 });
        }
      }
      break;
  }
}
