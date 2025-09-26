import {ShapeType} from '../../types';
import {useAppStore} from '../../store/appStore';
import {ShapeSelector} from './ShapeSelector';

interface ShapeConfigProps {
    className?: string;
}

const defaultShapes = {
    rectangle: {type: 'rectangle' as const, width: 12, height: 12},
    'l-shape': {type: 'l-shape' as const, width1: 6, height1: 6, width2: 6, height2: 6}
};

export function ShapeConfig({className = ''}: ShapeConfigProps) {
    const shape = useAppStore((state) => state.shape);
    const updateShape = useAppStore((state) => state.updateShape);

    const handleShapeTypeChange = (shapeType: ShapeType) => {
        if (shape.type !== shapeType) {
            updateShape(defaultShapes[shapeType]);
        }
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <ShapeSelector
                selectedShape={shape.type}
                onShapeChange={handleShapeTypeChange}
            />
        </div>
    );
}