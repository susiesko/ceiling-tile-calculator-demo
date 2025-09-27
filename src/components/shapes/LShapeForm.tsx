import { Wall } from '../../types';
import { useFeetInchesInput } from '../../hooks/useFeetInchesInput';

interface LShapeFormProps {
  walls: Wall[];
  onWallChange: (wallIndex: number, wall: Partial<Wall>) => void;
  className?: string;
}

export function LShapeForm({ walls, onWallChange, className = '' }: LShapeFormProps) {
  // Find walls by name for L-shape: A=top, B=right1, C=inner, D=right2, E=bottom, F=left
  const wallA = walls.find((w) => w.name === 'A');
  const wallB = walls.find((w) => w.name === 'B');
  const wallC = walls.find((w) => w.name === 'C');
  const wallD = walls.find((w) => w.name === 'D');
  const wallE = walls.find((w) => w.name === 'E');
  const wallF = walls.find((w) => w.name === 'F');

  const width1 = useFeetInchesInput(wallA ? wallA.lengthInches / 12 : 0, (value) => {
    if (wallA) {
      onWallChange(wallA.wallIndex, { lengthInches: value * 12 });
    }
  });

  const height1 = useFeetInchesInput(wallB ? wallB.lengthInches / 12 : 0, (value) => {
    if (wallB) {
      onWallChange(wallB.wallIndex, { lengthInches: value * 12 });
    }
  });

  const width2 = useFeetInchesInput(wallC ? wallC.lengthInches / 12 : 0, (value) => {
    if (wallC) {
      onWallChange(wallC.wallIndex, { lengthInches: value * 12 });
    }
  });

  const height2 = useFeetInchesInput(wallD ? wallD.lengthInches / 12 : 0, (value) => {
    if (wallD) {
      onWallChange(wallD.wallIndex, { lengthInches: value * 12 });
    }
  });

  // Wall E controls the total width (width1 + width2)
  const wallEInput = useFeetInchesInput(wallE ? wallE.lengthInches / 12 : 0, (value) => {
    if (wallE) {
      onWallChange(wallE.wallIndex, { lengthInches: value * 12 });
    }
  });

  // Wall F controls the total height (height1 + height2)
  const wallFInput = useFeetInchesInput(wallF ? wallF.lengthInches / 12 : 0, (value) => {
    if (wallF) {
      onWallChange(wallF.wallIndex, { lengthInches: value * 12 });
    }
  });

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-md font-medium text-gray-700">L-Shape Dimensions</h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall A</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={width1.feet}
                onChange={(e) => width1.setFeet(e.target.value)}
                onBlur={width1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.5"
                value={width1.inches}
                onChange={(e) => width1.setInches(e.target.value)}
                onBlur={width1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall B</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={height1.feet}
                onChange={(e) => height1.setFeet(e.target.value)}
                onBlur={height1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.5"
                value={height1.inches}
                onChange={(e) => height1.setInches(e.target.value)}
                onBlur={height1.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall C</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={width2.feet}
                onChange={(e) => width2.setFeet(e.target.value)}
                onBlur={width2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.5"
                value={width2.inches}
                onChange={(e) => width2.setInches(e.target.value)}
                onBlur={width2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall D</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={height2.feet}
                onChange={(e) => height2.setFeet(e.target.value)}
                onBlur={height2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.5"
                value={height2.inches}
                onChange={(e) => height2.setInches(e.target.value)}
                onBlur={height2.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall E</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={wallEInput.feet}
                onChange={(e) => wallEInput.setFeet(e.target.value)}
                onBlur={wallEInput.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.5"
                value={wallEInput.inches}
                onChange={(e) => wallEInput.setInches(e.target.value)}
                onBlur={wallEInput.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Wall F</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Feet</label>
              <input
                type="number"
                min="0"
                step="1"
                value={wallFInput.feet}
                onChange={(e) => wallFInput.setFeet(e.target.value)}
                onBlur={wallFInput.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Inches</label>
              <input
                type="number"
                min="0"
                max="11.9"
                step="0.5"
                value={wallFInput.inches}
                onChange={(e) => wallFInput.setInches(e.target.value)}
                onBlur={wallFInput.handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
