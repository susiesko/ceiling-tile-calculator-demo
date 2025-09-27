import { useAppStore } from '../store/appStore';
import { RectangleForm } from './shapes/RectangleForm';
import { LShapeForm } from './shapes/LShapeForm';
import { getShapeTypeFromWalls } from '../utils/wallUtils';

interface WallLengthAdjustmentsProps {
  className?: string;
}

export function WallLengthAdjustments({ className = '' }: WallLengthAdjustmentsProps) {
  const walls = useAppStore((state) => state.walls);
  const updateWall = useAppStore((state) => state.updateWall);

  const shapeType = getShapeTypeFromWalls(walls);

  const renderShapeForm = () => {
    switch (shapeType) {
      case 'rectangle':
        return <RectangleForm walls={walls} onWallChange={updateWall} />;
      case 'l-shape':
        return <LShapeForm walls={walls} onWallChange={updateWall} />;
      default:
        return null;
    }
  };

  return <div className={className}>{renderShapeForm()}</div>;
}
