import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {AppState, GridConfig, Shape, TileConfig} from '../types';

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

interface AppStore extends AppState {
    updateShape: (shape: Shape) => void;
    updateTileConfig: (tileConfig: Partial<TileConfig>) => void;
    updateGridConfig: (gridConfig: Partial<GridConfig>) => void;
    resetState: () => void;
}

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            ...defaultAppState,

            updateShape: (shape: Shape) => {
                console.log('UPDATING SHAPE')
                console.log('new shape', shape)
                set({shape});
            },

            updateTileConfig: (tileConfig: Partial<TileConfig>) => {
                set((state) => ({
                    tileConfig: {...state.tileConfig, ...tileConfig}
                }));
            },

            updateGridConfig: (gridConfig: Partial<GridConfig>) => {
                set((state) => ({
                    gridConfig: {...state.gridConfig, ...gridConfig}
                }));
            },

            resetState: () => {
                set(defaultAppState);
            }
        }),
        {
            name: 'ceiling-tile-calculator-state',
            // Only persist the state, not the actions or calculations
            partialize: (state) => ({
                units: state.units,
                shape: state.shape,
                tileConfig: state.tileConfig,
                gridConfig: state.gridConfig,
                // Don't persist calculation as it's derived and will be recalculated
            })
        }
    )
);