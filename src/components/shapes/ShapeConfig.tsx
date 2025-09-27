import {ShapeType} from '../../types';
import {useAppStore} from '../../store/appStore';
import {ShapeSelector} from './ShapeSelector';
import {getShapeTypeFromWalls} from '../../utils/wallUtils';
import {generateWallsFromRectangle, generateWallsFromLShape} from '../../utils/wallUtils';

interface ShapeConfigProps {
    className?: string;
}

export function ShapeConfig({className = ''}: ShapeConfigProps) {
    const walls = useAppStore((state) => state.walls);
    const updateWalls = useAppStore((state) => state.updateWalls);

    const currentShapeType = getShapeTypeFromWalls(walls);

    const handleShapeTypeChange = (shapeType: ShapeType) => {
        if (currentShapeType !== shapeType) {
            if (shapeType === 'rectangle') {
                updateWalls(generateWallsFromRectangle(12, 12));
            } else if (shapeType === 'l-shape') {
                updateWalls(generateWallsFromLShape(6, 6, 6, 6));
            }
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <ShapeSelector
                selectedShape={currentShapeType}
                onShapeChange={handleShapeTypeChange}
            />
        </div>
    );
}