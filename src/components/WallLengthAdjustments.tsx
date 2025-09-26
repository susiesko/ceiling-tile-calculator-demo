import {useAppStore} from '../store/appStore';
import {RectangleForm} from './shapes/RectangleForm';
import {LShapeForm} from './shapes/LShapeForm';

interface WallLengthAdjustmentsProps {
    className?: string;
}

export function WallLengthAdjustments({className = ''}: WallLengthAdjustmentsProps) {
    const shape = useAppStore((state) => state.shape);
    const updateShape = useAppStore((state) => state.updateShape);
    const renderShapeForm = () => {
        switch (shape.type) {
            case 'rectangle':
                return (
                    <RectangleForm
                        shape={shape}
                        onChange={updateShape}
                    />
                );
            case 'l-shape':
                return (
                    <LShapeForm
                        shape={shape}
                        onChange={updateShape}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className={className}>
            {renderShapeForm()}
        </div>
    );
}