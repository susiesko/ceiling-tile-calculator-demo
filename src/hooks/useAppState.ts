import { useState, useEffect } from 'react';
import { AppState, Shape, TileConfig, GridConfig, CalculationResult, Units, Cutout } from '../types';
import { convertShapeToPolygon } from '../utils/geometry';
import { calculateTiles } from '../utils/tileCalculation';

const defaultAppState: AppState = {
  units: 'feet',
  shape: {
    type: 'rectangle',
    width: 12,
    height: 10
  },
  cutouts: [],
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

const STORAGE_KEY = 'ceiling-tile-calculator-state';

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...defaultAppState, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load saved state:', error);
    }
    return defaultAppState;
  });

  // Recalculate tiles whenever relevant state changes
  useEffect(() => {
    const roomVertices = convertShapeToPolygon(state.shape);
    if (roomVertices.length > 0) {
      const calculation = calculateTiles(
        roomVertices,
        state.cutouts,
        state.tileConfig,
        state.gridConfig
      );

      if (state.pricePerTile) {
        calculation.costEstimate = calculation.estimatedTotal * state.pricePerTile;
      }

      setState(prev => ({ ...prev, calculation }));
    }
  }, [state.shape, state.cutouts, state.tileConfig, state.gridConfig, state.pricePerTile]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save state:', error);
    }
  }, [state]);


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

  const addCutout = (cutout: Cutout) => {
    setState(prev => ({
      ...prev,
      cutouts: [...prev.cutouts, cutout]
    }));
  };

  const updateCutout = (id: string, cutout: Partial<Cutout>) => {
    setState(prev => ({
      ...prev,
      cutouts: prev.cutouts.map(c => c.id === id ? { ...c, ...cutout } : c)
    }));
  };

  const removeCutout = (id: string) => {
    setState(prev => ({
      ...prev,
      cutouts: prev.cutouts.filter(c => c.id !== id)
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
    addCutout,
    updateCutout,
    removeCutout,
    updatePricePerTile,
    resetState
  };
}