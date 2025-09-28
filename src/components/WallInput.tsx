import { useFeetInchesInput } from '../hooks/useFeetInchesInput';
import { Wall } from '../types';

interface WallInputProps {
  wall: Wall;
  className?: string;
}

export function WallInput({ wall, className = '' }: WallInputProps) {
  const { feet, inches, setFeet, setInches, handleChange } = useFeetInchesInput(wall.wallIndex);

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-neutral-700 mb-3">Wall {wall.name}</label>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-2">Feet</label>
          <input
            type="number"
            min="0"
            step="1"
            value={feet}
            onChange={(e) => setFeet(e.target.value)}
            onBlur={handleChange}
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
            value={inches}
            onChange={(e) => setInches(e.target.value)}
            onBlur={handleChange}
            className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
            placeholder="0"
          />
        </div>
      </div>
    </div>
  );
}
