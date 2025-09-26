import {useEffect} from 'react';
import {useAppStore} from '../store/appStore';
import {convertShapeToPolygon} from '../utils/geometry';
import {calculateTiles} from '../utils/tileCalculation';

export function useAppState() {
    const store = useAppStore();

    // Recalculate tiles whenever relevant state changes
    useEffect(() => {
        const roomVertices = convertShapeToPolygon(store.shape);
        if (roomVertices.length > 0) {
            const calculation = calculateTiles(
                roomVertices,
                store.tileConfig,
                store.gridConfig
            );


            // Update the store with new calculation
            useAppStore.setState({calculation});
        }
    }, [store.shape, store.tileConfig, store.gridConfig]);

    return {
        state: {
            units: store.units,
            shape: store.shape,
            tileConfig: store.tileConfig,
            gridConfig: store.gridConfig,
            calculation: store.calculation
        },
        updateShape: store.updateShape,
        updateTileConfig: store.updateTileConfig,
        updateGridConfig: store.updateGridConfig,
        resetState: store.resetState
    };
}