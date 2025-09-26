import {useAppStore} from '../store/appStore';

interface CalculationResultsProps {
    className?: string;
}

export function CalculationResults({className = ''}: CalculationResultsProps) {
    const calculation = useAppStore((state) => state.calculation);
    const unitLabel = 'sq ft';

    return (
        <div className={`space-y-8 ${className}`}>
            <div className="flex items-center space-x-3">
                <div
                    className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-neutral-800">Calculation Results</h3>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Tile Counts */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                            </svg>
                        </div>
                        <h4 className="font-bold text-blue-900">Tile Count</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700 font-medium">Full tiles:</span>
                            <span
                                className="font-bold text-blue-900 text-lg">{calculation.fullTiles.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-blue-700 font-medium">Partial tiles:</span>
                            <span
                                className="font-bold text-blue-900 text-lg">{calculation.partialTiles.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-blue-200 pt-3">
                            <span className="text-blue-700 font-semibold">Total tiles needed:</span>
                            <span
                                className="font-bold text-primary-600 text-xl bg-white px-3 py-1 rounded-lg shadow-sm">
                {calculation.estimatedTotal.toLocaleString()}
              </span>
                        </div>
                    </div>
                </div>

                {/* Area Information */}
                <div
                    className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4 8V4a1 1 0 011-1h14a1 1 0 011 1v4M4 8h16M4 8v8a1 1 0 001 1h4m10-9v9a1 1 0 01-1 1H9"/>
                            </svg>
                        </div>
                        <h4 className="font-bold text-purple-900">Area Information</h4>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-purple-700 font-medium">Room area:</span>
                            <span
                                className="font-bold text-purple-900 text-lg">{calculation.area.toFixed(1)} {unitLabel}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-purple-700 font-medium">Tile coverage:</span>
                            <span className="font-bold text-purple-900 text-lg">
                {(calculation.estimatedTotal * calculation.tileArea).toFixed(1)} {unitLabel}
              </span>
                        </div>
                        <div className="flex justify-between items-center border-t border-purple-200 pt-3">
                            <span className="text-purple-700 font-semibold">Waste factor:</span>
                            <span className="font-bold text-amber-600 text-xl bg-white px-3 py-1 rounded-lg shadow-sm">
                {calculation.wasteFactor.toFixed(1)}%
              </span>
                        </div>
                    </div>
                </div>

                {/* Cost Estimate */}
                {calculation.costEstimate !== undefined && (
                    <div
                        className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                                </svg>
                            </div>
                            <h4 className="font-bold text-green-900">Cost Estimate</h4>
                        </div>
                        <div className="space-y-3">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-green-600 mb-2">
                                    ${calculation.costEstimate.toFixed(2)}
                                </div>
                                <div
                                    className="text-green-700 font-medium bg-white px-4 py-2 rounded-lg shadow-sm inline-block">
                                    Based on {calculation.estimatedTotal.toLocaleString()} tiles
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}