import { useState, useEffect } from 'react';
import { AppState, Shape, TileConfig, GridConfig, CalculationResult, Units } from '../types';
import { convertShapeToPolygon } from '../utils/geometry';
import { calculateTiles } from '../utils/tileCalculation';

const defaultAppState: AppState = {
  units: 'feet',
  shape: {
    type: 'rectangle',
    width: 12,
    height: 12
  },
  tileConfig: {
    size: '2x2',
    orientation: 0
  },
  gridConfig: {
    origin: 'top-left',
    offsetX: 0,
    offsetY: 0,
    snapGrid: 0.5
  },
  calculation: {
    totalTiles: 0,
    fullTiles: 0,
    partialTiles: 0,
    estimatedTotal: 0,
    area: 0,
    tileArea: 0,
    wasteFactor: 0
  }
};

export function useAppState() {
  const [state, setState] = useState<AppState>(defaultAppState);

  // Recalculate tiles whenever relevant state changes
  useEffect(() => {
    const roomVertices = convertShapeToPolygon(state.shape);
    if (roomVertices.length > 0) {
      const calculation = calculateTiles(
        roomVertices,
        [],
        state.tileConfig,
        state.gridConfig
      );

      if (state.pricePerTile) {
        calculation.costEstimate = calculation.estimatedTotal * state.pricePerTile;
      }

      setState(prev => ({ ...prev, calculation }));
    }
  }, [state.shape, state.tileConfig, state.gridConfig, state.pricePerTile]);



  const updateShape = (shape: Shape) => {
    setState(prev => ({ ...prev, shape }));
  };

  const updateTileConfig = (tileConfig: Partial<TileConfig>) => {
    setState(prev => ({
      ...prev,
      tileConfig: { ...prev.tileConfig, ...tileConfig }
    }));
  };

  const updateGridConfig = (gridConfig: Partial<GridConfig>) => {
    setState(prev => ({
      ...prev,
      gridConfig: { ...prev.gridConfig, ...gridConfig }
    }));
  };


  const updatePricePerTile = (price?: number) => {
    setState(prev => ({ ...prev, pricePerTile: price }));
  };

  const resetState = () => {
    setState(defaultAppState);
  };

  return {
    state,
    updateShape,
    updateTileConfig,
    updateGridConfig,
    updatePricePerTile,
    resetState
  };
}