import {useState} from 'react';
import {useAppStore} from './store/appStore';
import {ShapeConfig} from './components/shapes/ShapeConfig';
import {CanvasRenderer} from './components/canvas/CanvasRenderer';
import {TileControls} from './components/TileControls';
import {CalculationResults} from './components/CalculationResults';
import {AccordionSection} from './components/AccordionSection';
import {WallLengthAdjustments} from './components/WallLengthAdjustments';
import {TileOrientationControls} from './components/TileOrientationControls';
import {validateWalls} from './utils/validation';

function App() {
    const [openSections, setOpenSections] = useState({
        step1: true,
        step2: false,
        step3: false,
        step4: false
    });

    const walls = useAppStore((state) => state.walls);
    const tileConfig = useAppStore((state) => state.tileConfig);
    const resetState = useAppStore((state) => state.resetState);

    const validation = validateWalls(walls);

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => {
            const isCurrentlyOpen = prev[section];
            // Close all sections first
            const allClosed = {
                step1: false,
                step2: false,
                step3: false,
                step4: false
            };
            // If the clicked section was closed, open it; if it was open, leave all closed
            return isCurrentlyOpen ? allClosed : {...allClosed, [section]: true};
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <h1 className="text-2xl font-bold text-blue-600">
                                Ceiling Tile Calculator
                            </h1>
                            <p className="text-sm text-gray-600">
                                Plan your ceiling tile installation with precision
                            </p>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={resetState}
                                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 border border-gray-200"
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
                    {/* Left Panel - Accordion Steps */}
                    <div className="lg:col-span-1 space-y-4">
                        {/* Step 1: Choose room shape */}
                        <AccordionSection
                            title="Choose room shape"
                            stepNumber={1}
                            isOpen={openSections.step1}
                            onToggle={() => toggleSection('step1')}
                        >
                            <ShapeConfig/>

                            {/* Validation Messages */}
                            {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                                <div className="mt-6 space-y-3">
                                    {validation.errors.map((error, index) => (
                                        <div key={index}
                                             className="flex items-start space-x-3 text-sm text-red-700 bg-red-50 border border-red-200 p-4 rounded-lg">
                                            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"
                                                 fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            <span>{error}</span>
                                        </div>
                                    ))}
                                    {validation.warnings.map((warning, index) => (
                                        <div key={index}
                                             className="flex items-start space-x-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 p-4 rounded-lg">
                                            <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0"
                                                 fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd"
                                                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                      clipRule="evenodd"/>
                                            </svg>
                                            <span>{warning}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </AccordionSection>

                        {/* Step 2: Choose tile size */}
                        <AccordionSection
                            title="Choose tile size"
                            stepNumber={2}
                            isOpen={openSections.step2}
                            onToggle={() => toggleSection('step2')}
                        >
                            <TileControls/>
                        </AccordionSection>

                        {/* Step 3: Choose tile orientation (if 2x4) */}
                        <AccordionSection
                            title="Choose tile orientation"
                            stepNumber={3}
                            isOpen={openSections.step3}
                            onToggle={() => toggleSection('step3')}
                            isDisabled={tileConfig.size !== '2x4'}
                        >
                            <TileOrientationControls/>
                        </AccordionSection>

                        {/* Step 4: Adjust wall lengths */}
                        <AccordionSection
                            title="Adjust wall lengths"
                            stepNumber={4}
                            isOpen={openSections.step4}
                            onToggle={() => toggleSection('step4')}
                        >
                            <WallLengthAdjustments/>
                            <div className="text-sm text-gray-600 mt-4">
                                You can also drag the wall labels on the canvas to adjust dimensions.
                            </div>
                        </AccordionSection>

                        {/* Results */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mt-6">
                            <CalculationResults/>
                        </div>
                    </div>

                    {/* Right Panel - Visualization */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Room Visualization
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span>Interactive Canvas</span>
                                </div>
                            </div>
                            <div className="relative">
                                <CanvasRenderer/>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;