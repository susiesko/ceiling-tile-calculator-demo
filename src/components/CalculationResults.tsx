import { useAppStore } from '../store/appStore';

interface CalculationResultsProps {
  className?: string;
}

export function CalculationResults({ className = '' }: CalculationResultsProps) {
  const calculation = useAppStore((state) => state.calculation);
  const tileConfig = useAppStore((state) => state.tileConfig);
  const walls = useAppStore((state) => state.walls);

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-neutral-800">Calculation Results</h3>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Selected Tile Info */}
        {tileConfig.selectedTile && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-6 h-6 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-bold text-purple-900">Selected Tile</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-700 font-medium">Name:</span>
                <span className="font-bold text-purple-900">{tileConfig.selectedTile.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-700 font-medium">Size:</span>
                <span className="font-bold text-purple-900">
                  {tileConfig.selectedTile.width}" × {tileConfig.selectedTile.height}"
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-700 font-medium">Category:</span>
                <span className="font-bold text-purple-900 capitalize">{tileConfig.selectedTile.category}</span>
              </div>
            </div>
          </div>
        )}

        {/* Room Information */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v0" />
              </svg>
            </div>
            <h4 className="font-bold text-green-900">Room Details</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Shape:</span>
              <span className="font-bold text-green-900 capitalize">
                {walls.length === 4 ? 'Rectangle' : 'L-Shape'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Area:</span>
              <span className="font-bold text-green-900">
                {calculation.area.toFixed(1)} sq ft
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-green-700 font-medium">Tile size:</span>
              <span className="font-bold text-green-900">{tileConfig.size}</span>
            </div>
          </div>
        </div>

        {/* Tile Counts */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <h4 className="font-bold text-blue-900">Tile Count</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">Full tiles:</span>
              <span className="font-bold text-blue-900 text-lg">
                {calculation.fullTiles.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700 font-medium">Partial tiles:</span>
              <span className="font-bold text-blue-900 text-lg">
                {calculation.partialTiles.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-blue-200 pt-3">
              <span className="text-blue-700 font-semibold">Total tiles needed:</span>
              <span className="font-bold text-primary-600 text-xl bg-white px-3 py-1 rounded-lg shadow-sm">
                {calculation.estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
