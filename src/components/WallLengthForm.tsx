import { useAppStore } from '../store/appStore';
import { useFeetInchesInput } from '../hooks/useFeetInchesInput';
import { getShapeTypeFromWalls } from '../utils/wallUtils';

interface WallLengthFormProps {
  className?: string;
}

export function WallLengthForm({ className = '' }: WallLengthFormProps) {
  const walls = useAppStore((state) => state.walls);
  const updateWall = useAppStore((state) => state.updateWall);
  const shapeType = getShapeTypeFromWalls(walls);

  // Create input handlers for each wall
  const wallInputs = walls.map((wall) => {
    return useFeetInchesInput(wall.lengthInches / 12, (value) => {
      updateWall(wall.wallIndex, { lengthInches: value * 12 });
    });
  });

  const getWallDescription = (wallName: string): string => {
    return `Wall ${wallName}`;
  };

  const renderWallInput = (wall: typeof walls[0], index: number) => {
    const input = wallInputs[index];
    const description = getWallDescription(wall.name);

    return (
      <div key={wall.name} className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          {description}
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-2">Feet</label>
            <input
              type="number"
              min="0"
              step="1"
              value={input.feet}
              onChange={(e) => input.setFeet(e.target.value)}
              onBlur={input.handleChange}
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-2">Inches</label>
            <input
              type="number"
              min="0"
              max="11.9"
              step="0.5"
              value={input.inches}
              onChange={(e) => input.setInches(e.target.value)}
              onBlur={input.handleChange}
              className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    );
  };

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
        {walls.map((wall, index) => renderWallInput(wall, index))}
      </div>
    </div>
  );
}