import {useAppStore} from '../store/appStore';

interface CalculationResultsProps {
    className?: string;
}

export function CalculationResults({className = ''}: CalculationResultsProps) {
    const calculation = useAppStore((state) => state.calculation);

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


            </div>
        </div>
    );
}