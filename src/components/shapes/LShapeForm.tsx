import {LShape} from '../../types';
import {useFeetInchesInput} from '../../hooks/useFeetInchesInput';

interface LShapeFormProps {
    shape: LShape;
    onChange: (shape: LShape) => void;
    className?: string;
}

export function LShapeForm({shape, onChange, className = ''}: LShapeFormProps) {
    const width1 = useFeetInchesInput(shape.width1, (value) => {
        onChange({...shape, width1: value});
    });

    const height1 = useFeetInchesInput(shape.height1, (value) => {
        onChange({...shape, height1: value});
    });

    const width2 = useFeetInchesInput(shape.width2, (value) => {
        onChange({...shape, width2: value});
    });

    const height2 = useFeetInchesInput(shape.height2, (value) => {
        onChange({...shape, height2: value});
    });

    // Wall E controls the total width (width1 + width2)
    const wallE = useFeetInchesInput(shape.width1 + shape.width2, (value) => {
        // When Wall E (total width) changes, adjust width2 to maintain width1
        const newWidth2 = Math.max(0.5, value - shape.width1);
        onChange({...shape, width2: newWidth2});
    });

    // Wall F controls the total height (height1 + height2)
    const wallF = useFeetInchesInput(shape.height1 + shape.height2, (value) => {
        // When Wall F (total height) changes, adjust height2 to maintain height1
        const newHeight2 = Math.max(0.5, value - shape.height1);
        onChange({...shape, height2: newHeight2});
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
                                value={wallE.feet}
                                onChange={(e) => wallE.setFeet(e.target.value)}
                                onBlur={wallE.handleChange}
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
                                value={wallE.inches}
                                onChange={(e) => wallE.setInches(e.target.value)}
                                onBlur={wallE.handleChange}
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
                                value={wallF.feet}
                                onChange={(e) => wallF.setFeet(e.target.value)}
                                onBlur={wallF.handleChange}
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
                                value={wallF.inches}
                                onChange={(e) => wallF.setInches(e.target.value)}
                                onBlur={wallF.handleChange}
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