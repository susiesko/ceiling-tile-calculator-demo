import {useEffect} from 'react';
import {useAppStore} from '../store/appStore';
import {convertWallsToPolygon} from '../utils/geometry';
import {calculateTiles} from '../utils/tileCalculation';

export function useAppState() {
    const store = useAppStore();

    // Recalculate tiles whenever relevant state changes
    useEffect(() => {
        const roomVertices = convertWallsToPolygon(store.walls);
        if (roomVertices.length > 0) {
            const calculation = calculateTiles(
                roomVertices,
                store.tileConfig,
                store.gridConfig
            );


            // Update the store with new calculation
            useAppStore.setState({calculation});
        }
    }, [store.walls, store.tileConfig, store.gridConfig]);

    return {
        state: {
            units: store.units,
            walls: store.walls,
            tileConfig: store.tileConfig,
            gridConfig: store.gridConfig,
            calculation: store.calculation
        },
        updateWalls: store.updateWalls,
        updateWall: store.updateWall,
        updateTileConfig: store.updateTileConfig,
        updateGridConfig: store.updateGridConfig,
        resetState: store.resetState
    };
}