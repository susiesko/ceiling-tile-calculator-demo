import {ShapeType} from '../../types';

interface ShapeSelectorProps {
    selectedShape: ShapeType;
    onShapeChange: (shapeType: ShapeType) => void;
    className?: string;
}

const shapeOptions = [
    {type: 'rectangle' as const, label: 'Rectangle', icon: '▢'},
    {type: 'l-shape' as const, label: 'L-Shape', icon: '⌐'}
];

export function ShapeSelector({selectedShape, onShapeChange, className = ''}: ShapeSelectorProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            <label className="block text-sm font-bold text-gray-700">Choose Room Shape</label>
            <div className="grid grid-cols-2 gap-4">
                {shapeOptions.map((option) => (
                    <button
                        key={option.type}
                        onClick={() => onShapeChange(option.type)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-center hover:shadow-md ${
                            selectedShape === option.type
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600'
                        }`}
                    >
                        {selectedShape === option.type && (
                            <div
                                className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"/>
                                </svg>
                            </div>
                        )}
                        <div className="text-3xl mb-2">{option.icon}</div>
                        <div className="text-sm font-semibold">{option.label}</div>
                    </button>
                ))}
            </div>
        </div>
    );
}