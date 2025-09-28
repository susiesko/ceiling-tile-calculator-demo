import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { Wall } from '../types';

function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

function updateRelatedWalls(
  wallIndex: number,
  newLengthInches: number,
  walls: Wall[],
  updateWall: (wallIndex: number, wall: Partial<Wall>) => void
) {
  if (walls.length === 4) {
    // Rectangle: update opposite walls
    const wall = walls[wallIndex];
    if (!wall) return;

    // For rectangle: A=top, B=right, C=bottom, D=left
    switch (wall.name) {
      case 'A': // Top wall changed → update bottom wall (C)
        const wallC = walls.find(w => w.name === 'C');
        if (wallC) {
          updateWall(wallC.wallIndex, { lengthInches: newLengthInches });
        }
        break;
      case 'B': // Right wall changed → update left wall (D)
        const wallD = walls.find(w => w.name === 'D');
        if (wallD) {
          updateWall(wallD.wallIndex, { lengthInches: newLengthInches });
        }
        break;
      case 'C': // Bottom wall changed → update top wall (A)
        const wallA = walls.find(w => w.name === 'A');
        if (wallA) {
          updateWall(wallA.wallIndex, { lengthInches: newLengthInches });
        }
        break;
      case 'D': // Left wall changed → update right wall (B)
        const wallB = walls.find(w => w.name === 'B');
        if (wallB) {
          updateWall(wallB.wallIndex, { lengthInches: newLengthInches });
        }
        break;
    }
  } else if (walls.length === 6) {
    // L-shape: update related walls based on complex relationships
    const wall = walls[wallIndex];
    if (!wall) return;

    const wallA = walls.find(w => w.name === 'A');
    const wallB = walls.find(w => w.name === 'B');
    const wallC = walls.find(w => w.name === 'C');
    const wallD = walls.find(w => w.name === 'D');
    const wallE = walls.find(w => w.name === 'E');
    const wallF = walls.find(w => w.name === 'F');

    switch (wall.name) {
      case 'A': // Top wall changed → update total width (E)
        if (wallC && wallE) {
          const width2 = wallC.lengthInches;
          updateWall(wallE.wallIndex, { lengthInches: newLengthInches + width2 });
        }
        break;
      case 'B': // Right wall 1 changed → update total height (F)
        if (wallD && wallF) {
          const height2 = wallD.lengthInches;
          updateWall(wallF.wallIndex, { lengthInches: newLengthInches + height2 });
        }
        break;
      case 'C': // Inner wall changed → update total width (E)
        if (wallA && wallE) {
          const width1 = wallA.lengthInches;
          updateWall(wallE.wallIndex, { lengthInches: width1 + newLengthInches });
        }
        break;
      case 'D': // Right wall 2 changed → update total height (F)
        if (wallB && wallF) {
          const height1 = wallB.lengthInches;
          updateWall(wallF.wallIndex, { lengthInches: height1 + newLengthInches });
        }
        break;
      case 'E': // Total width changed → maintain ratio for A and C
        if (wallA && wallC) {
          const currentWidth1 = wallA.lengthInches;
          const currentWidth2 = wallC.lengthInches;
          const totalCurrent = currentWidth1 + currentWidth2;
          if (totalCurrent > 0) {
            const ratio = currentWidth1 / totalCurrent;
            const newWidth1 = Math.max(6, newLengthInches * ratio); // Min 6 inches
            const newWidth2 = Math.max(6, newLengthInches - newWidth1);
            updateWall(wallA.wallIndex, { lengthInches: newWidth1 });
            updateWall(wallC.wallIndex, { lengthInches: newWidth2 });
          }
        }
        break;
      case 'F': // Total height changed → maintain ratio for B and D
        if (wallB && wallD) {
          const currentHeight1 = wallB.lengthInches;
          const currentHeight2 = wallD.lengthInches;
          const totalCurrent = currentHeight1 + currentHeight2;
          if (totalCurrent > 0) {
            const ratio = currentHeight1 / totalCurrent;
            const newHeight1 = Math.max(6, newLengthInches * ratio); // Min 6 inches
            const newHeight2 = Math.max(6, newLengthInches - newHeight1);
            updateWall(wallB.wallIndex, { lengthInches: newHeight1 });
            updateWall(wallD.wallIndex, { lengthInches: newHeight2 });
          }
        }
        break;
    }
  }
}

export interface FeetInchesInputReturn {
  feet: string;
  inches: string;
  setFeet: (value: string) => void;
  setInches: (value: string) => void;
  handleChange: () => void;
}

export function useFeetInchesInput(wallIndex: number): FeetInchesInputReturn {
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingFromStore = useRef(false);

  const walls = useAppStore((state) => state.walls);
  const updateWall = useAppStore((state) => state.updateWall);
  const currentWall = useMemo(() => walls[wallIndex], [walls, wallIndex]);

  // Convert inches to feet + inches for display
  useEffect(() => {
    if (isUpdatingFromStore.current) return;

    const totalInches = currentWall?.lengthInches || 0;
    const feetPart = Math.floor(totalInches / 12);
    const inchesPart = roundToNearestHalf(totalInches % 12);

    isUpdatingFromStore.current = true;
    setFeet(feetPart.toString());
    setInches(inchesPart % 1 === 0 ? inchesPart.toString() : inchesPart.toFixed(1));
    isUpdatingFromStore.current = false;
  }, [currentWall]);

  const updateTotalInches = useCallback(() => {
    // Get the current values from state at execution time
    setFeet(currentFeet => {
      setInches(currentInches => {
        const feetValue = parseFloat(currentFeet) || 0;
        const inchesValue = parseFloat(currentInches) || 0;
        const roundedInches = roundToNearestHalf(inchesValue);
        const totalInches = feetValue * 12 + roundedInches;

        // Update display with rounded inches
        const roundedInchesDisplay = roundedInches % 1 === 0 ? roundedInches.toString() : roundedInches.toFixed(1);

        // Update the wall and handle related wall updates
        updateWall(wallIndex, { lengthInches: totalInches });
        updateRelatedWalls(wallIndex, totalInches, walls, updateWall);

        // Return the rounded inches to update the display
        return roundedInchesDisplay;
      });

      // Return the feet value unchanged
      return currentFeet;
    });
  }, [wallIndex, updateWall, walls]);

  const debouncedUpdate = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(updateTotalInches, 1000);
  }, [updateTotalInches]);

  const handleSetFeet = useCallback((value: string) => {
    setFeet(value);
    debouncedUpdate();
  }, [debouncedUpdate]);

  const handleSetInches = useCallback((value: string) => {
    setInches(value);
    debouncedUpdate();
  }, [debouncedUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    feet,
    inches,
    setFeet: handleSetFeet,
    setInches: handleSetInches,
    handleChange: updateTotalInches,
  };
}
