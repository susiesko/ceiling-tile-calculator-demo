import React, { useRef } from 'react';
import { useAppState } from './hooks/useAppState';
import { ShapeConfig } from './components/shapes/ShapeConfig';
import { CanvasRenderer } from './components/canvas/CanvasRenderer';
import { TileControls } from './components/TileControls';
import { CutoutControls } from './components/CutoutControls';
import { CalculationResults } from './components/CalculationResults';
import { validateShape } from './utils/validation';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    state,
    updateShape,
    updateTileConfig,
    updateGridConfig,
    addCutout,
    updateCutout,
    removeCutout,
    updatePricePerTile,
    resetState
  } = useAppState();

  const validation = validateShape(state.shape, state.units);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Ceiling Tile Calculator
              </h1>
              <p className="text-sm text-gray-600">
                Plan your ceiling tile installation with precision
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={resetState}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shape Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ShapeConfig
                shape={state.shape}
                units={state.units}
                onShapeChange={updateShape}
              />

              {/* Validation Messages */}
              {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                <div className="mt-4 space-y-2">
                  {validation.errors.map((error, index) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      ⚠️ {error}
                    </div>
                  ))}
                  {validation.warnings.map((warning, index) => (
                    <div key={index} className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
                      ⚡ {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tile Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <TileControls
                tileConfig={state.tileConfig}
                units={state.units}
                onTileConfigChange={updateTileConfig}
                pricePerTile={state.pricePerTile}
                onPriceChange={updatePricePerTile}
              />
            </div>

            {/* Cutout Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CutoutControls
                cutouts={state.cutouts}
                units={state.units}
                onAddCutout={addCutout}
                onUpdateCutout={updateCutout}
                onRemoveCutout={removeCutout}
              />
            </div>

            {/* Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CalculationResults
                calculation={state.calculation}
                units={state.units}
                appState={state}
                canvasRef={canvasRef}
              />
            </div>
          </div>

          {/* Right Panel - Visualization */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Room Visualization
              </h3>
              <CanvasRenderer
                shape={state.shape}
                cutouts={state.cutouts}
                tileConfig={state.tileConfig}
                gridConfig={state.gridConfig}
                units={state.units}
                onShapeChange={updateShape}
                canvasRef={canvasRef}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;