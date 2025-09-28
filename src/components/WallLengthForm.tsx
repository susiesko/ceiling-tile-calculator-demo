import { useAppStore } from '../store/appStore';
import { getShapeTypeFromWalls } from '../utils/wallUtils';
import { WallInput } from './WallInput';

interface WallLengthFormProps {
  className?: string;
}

export function WallLengthForm({ className = '' }: WallLengthFormProps) {
  const walls = useAppStore((state) => state.walls);
  const shapeType = getShapeTypeFromWalls(walls);

  const getFormTitle = (shapeType: string): string => {
    switch (shapeType) {
      case 'rectangle':
        return 'Rectangle Dimensions';
      case 'l-shape':
        return 'L-Shape Dimensions';
      default:
        return 'Room Dimensions';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h4 className="text-lg font-semibold text-neutral-700">{getFormTitle(shapeType)}</h4>
      <div className="space-y-6">
        {walls.map((wall) => (
          <WallInput key={wall.name} wall={wall} />
        ))}
      </div>
    </div>
  );
}