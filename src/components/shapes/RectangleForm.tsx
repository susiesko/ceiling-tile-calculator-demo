import {RectangleShape} from '../../types';
import {useFeetInchesInput} from '../../hooks/useFeetInchesInput';

interface RectangleFormProps {
    shape: RectangleShape;
    onChange: (shape: RectangleShape) => void;
    className?: string;
}

export function RectangleForm({shape, onChange, className = ''}: RectangleFormProps) {
    const width = useFeetInchesInput(shape.width, (value) => {
        onChange({...shape, width: value});
    });

    const height = useFeetInchesInput(shape.height, (value) => {
        onChange({...shape, height: value});
    });

    return (
        <div className={`space-y-6 ${className}`}>
            <h4 className="text-lg font-semibold text-neutral-700">Rectangle Dimensions</h4>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-neutral-700 mb-3">Width (Walls A & C)</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-2">Feet</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={width.feet}
                                onChange={(e) => width.setFeet(e.target.value)}
                                onBlur={width.handleChange}
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
                                value={width.inches}
                                onChange={(e) => width.setInches(e.target.value)}
                                onBlur={width.handleChange}
                                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-neutral-700 mb-3">Height (Walls B & D)</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-2">Feet</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={height.feet}
                                onChange={(e) => height.setFeet(e.target.value)}
                                onBlur={height.handleChange}
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
                                value={height.inches}
                                onChange={(e) => height.setInches(e.target.value)}
                                onBlur={height.handleChange}
                                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}