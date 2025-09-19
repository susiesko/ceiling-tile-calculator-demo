import {useEffect, useState} from 'react';
import {RectangleShape, Units} from '../../types';

interface RectangleFormProps {
    shape: RectangleShape;
    units: Units;
    onChange: (shape: RectangleShape) => void;
    className?: string;
}

export function RectangleForm({shape, units, onChange, className = ''}: RectangleFormProps) {
    const [widthFeet, setWidthFeet] = useState('');
    const [widthInches, setWidthInches] = useState('');
    const [heightFeet, setHeightFeet] = useState('');
    const [heightInches, setHeightInches] = useState('');

    useEffect(() => {
        // Convert current width to feet and inches
        const widthTotalInches = shape.width * 12;
        const widthFeetPart = Math.floor(widthTotalInches / 12);
        const widthInchesPart = widthTotalInches % 12;

        setWidthFeet(widthFeetPart.toString());
        setWidthInches(widthInchesPart.toFixed(1));

        // Convert current height to feet and inches
        const heightTotalInches = shape.height * 12;
        const heightFeetPart = Math.floor(heightTotalInches / 12);
        const heightInchesPart = heightTotalInches % 12;

        setHeightFeet(heightFeetPart.toString());
        setHeightInches(heightInchesPart.toFixed(1));
    }, [shape.width, shape.height]);

    const handleWidthChange = () => {
        const feet = parseFloat(widthFeet) || 0;
        const inches = parseFloat(widthInches) || 0;
        const totalFeet = feet + (inches / 12);
        onChange({
            ...shape,
            width: totalFeet
        });
    };

    const handleHeightChange = () => {
        const feet = parseFloat(heightFeet) || 0;
        const inches = parseFloat(heightInches) || 0;
        const totalFeet = feet + (inches / 12);
        onChange({
            ...shape,
            height: totalFeet
        });
    };

    return (
        <div className={`space-y-4 ${className}`}>
            <h4 className="text-md font-medium text-gray-700">Rectangle Dimensions</h4>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Width</label>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Feet</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={widthFeet}
                                onChange={(e) => setWidthFeet(e.target.value)}
                                onBlur={handleWidthChange}
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
                                step="0.1"
                                value={widthInches}
                                onChange={(e) => setWidthInches(e.target.value)}
                                onBlur={handleWidthChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Height</label>
                    <div className="flex space-x-2">
                        <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Feet</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={heightFeet}
                                onChange={(e) => setHeightFeet(e.target.value)}
                                onBlur={handleHeightChange}
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
                                step="0.1"
                                value={heightInches}
                                onChange={(e) => setHeightInches(e.target.value)}
                                onBlur={handleHeightChange}
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