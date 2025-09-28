import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, GridConfig, TileConfig, TileDefinition, Wall } from '../types';
import { generateWallsFromRectangle } from '../utils/wallUtils';

const defaultAppState: AppState = {
  units: 'feet',
  walls: generateWallsFromRectangle(12, 12),
  tileConfig: {
    size: '2x2',
    orientation: 0,
  },
  gridConfig: {
    origin: 'top-left',
    offsetX: 0,
    offsetY: 0,
    snapGrid: 0.5,
  },
  calculation: {
    totalTiles: 0,
    fullTiles: 0,
    partialTiles: 0,
    estimatedTotal: 0,
    area: 0,
    tileArea: 0,
    wasteFactor: 0,
  },
};

interface AppStore extends AppState {
  updateWalls: (walls: Wall[]) => void;
  updateWall: (wallIndex: number, wall: Partial<Wall>) => void;
  updateTileConfig: (tileConfig: Partial<TileConfig>) => void;
  updateSelectedTile: (tile: TileDefinition) => void;
  updateGridConfig: (gridConfig: Partial<GridConfig>) => void;
  resetState: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...defaultAppState,

      updateWalls: (walls: Wall[]) => {
        set({ walls });
      },

      updateWall: (wallIndex: number, wallUpdate: Partial<Wall>) => {
        set((state) => {
          const newWalls = [...state.walls];
          if (newWalls[wallIndex]) {
            newWalls[wallIndex] = { ...newWalls[wallIndex], ...wallUpdate };
          }
          return { walls: newWalls };
        });
      },

      updateTileConfig: (tileConfig: Partial<TileConfig>) => {
        set((state) => ({
          tileConfig: { ...state.tileConfig, ...tileConfig },
        }));
      },

      updateSelectedTile: (tile: TileDefinition) => {
        set((state) => ({
          tileConfig: { ...state.tileConfig, selectedTile: tile },
        }));
      },

      updateGridConfig: (gridConfig: Partial<GridConfig>) => {
        set((state) => ({
          gridConfig: { ...state.gridConfig, ...gridConfig },
        }));
      },

      resetState: () => {
        set(defaultAppState);
      },
    }),
    {
      name: 'ceiling-tile-calculator-state',
      // Only persist the state, not the actions or calculations
      partialize: (state) => ({
        units: state.units,
        walls: state.walls,
        tileConfig: state.tileConfig,
        gridConfig: state.gridConfig,
        // Don't persist calculation as it's derived and will be recalculated
      }),
    }
  )
);
