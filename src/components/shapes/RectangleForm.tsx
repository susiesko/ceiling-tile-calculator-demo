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
        <div className={`space-y-6 ${className}`}>
            <h4 className="text-lg font-semibold text-neutral-700">Rectangle Dimensions</h4>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-neutral-700 mb-3">Width</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-2">Feet</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={widthFeet}
                                onChange={(e) => setWidthFeet(e.target.value)}
                                onBlur={handleWidthChange}
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
                                step="0.1"
                                value={widthInches}
                                onChange={(e) => setWidthInches(e.target.value)}
                                onBlur={handleWidthChange}
                                className="w-full px-4 py-3 border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-200 bg-white hover:border-neutral-300 text-lg font-medium"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="block text-sm font-bold text-neutral-700 mb-3">Height</label>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-neutral-500 mb-2">Feet</label>
                            <input
                                type="number"
                                min="0"
                                step="1"
                                value={heightFeet}
                                onChange={(e) => setHeightFeet(e.target.value)}
                                onBlur={handleHeightChange}
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
                                step="0.1"
                                value={heightInches}
                                onChange={(e) => setHeightInches(e.target.value)}
                                onBlur={handleHeightChange}
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