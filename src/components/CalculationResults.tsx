import { CalculationResult, Units, AppState } from '../types';
import { exportConfiguration, generateShoppingList, downloadTextFile } from '../utils/export';

interface CalculationResultsProps {
  calculation: CalculationResult;
  units: Units;
  appState: AppState;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  className?: string;
}

export function CalculationResults({ calculation, units, appState, canvasRef, className = '' }: CalculationResultsProps) {
  const unitLabel = 'sq ft';

  const handleExportPNG = () => {
    if (canvasRef?.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `ceiling-tile-layout-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExportConfig = () => {
    exportConfiguration(appState);
  };

  const handleExportShoppingList = () => {
    const shoppingList = generateShoppingList(appState);
    downloadTextFile(shoppingList, `ceiling-tile-shopping-list-${new Date().toISOString().split('T')[0]}.txt`);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800">Calculation Results</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tile Counts */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Tile Count</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Full tiles:</span>
              <span className="font-medium">{calculation.fullTiles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Partial tiles:</span>
              <span className="font-medium">{calculation.partialTiles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-600">Total tiles needed:</span>
              <span className="font-semibold text-primary-600">
                {calculation.estimatedTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Area Information */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-3">Area Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Room area:</span>
              <span className="font-medium">{calculation.area.toFixed(1)} {unitLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tile coverage:</span>
              <span className="font-medium">
                {(calculation.estimatedTotal * calculation.tileArea).toFixed(1)} {unitLabel}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-600">Waste factor:</span>
              <span className="font-semibold text-orange-600">
                {calculation.wasteFactor.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Cost Estimate */}
        {calculation.costEstimate !== undefined && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 md:col-span-2">
            <h4 className="font-medium text-gray-800 mb-3">Cost Estimate</h4>
            <div className="text-2xl font-bold text-green-600">
              ${calculation.costEstimate.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Based on {calculation.estimatedTotal} tiles
            </div>
          </div>
        )}
      </div>

      {/* Export Actions */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800">Export</h4>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={handleExportPNG}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            Export PNG Image
          </button>
          <button
            onClick={handleExportConfig}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Export Configuration
          </button>
          <button
            onClick={handleExportShoppingList}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Export Shopping List
          </button>
        </div>
      </div>
    </div>
  );
}