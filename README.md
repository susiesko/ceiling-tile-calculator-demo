# Ceiling Tile Calculator

A comprehensive web application for calculating ceiling tile requirements with support for multiple room shapes, custom polygons, and precise tile visualization.

## Features

### Shape Support
- **Presets**: Rectangle, L-shape, T-shape, U-shape with parametrized dimensions
- **Custom Polygons**: Free-draw polygons with vertex manipulation
- **Cutouts**: Rectangular and rounded cutouts for columns, stairwells, etc.
- **Units**: Toggle between feet/inches and meters/centimeters

### Tile Configuration
- **Tile Sizes**: 2×2 and 2×4 tiles
- **Orientation**: 0° and 90° rotation
- **Border Support**: Optional uniform border width
- **Grid Control**: Adjustable origin and offset

### Visualization
- **Interactive Canvas**: Real-time polygon and tile visualization
- **Custom Drawing**: Click to add vertices, drag to move them
- **Zoom & Pan**: Mouse wheel zoom, Shift+click to pan
- **Grid Overlay**: Snapping grid for precise placement

### Calculations
- **Accurate Counting**: Full vs partial tiles with intersection algorithms
- **Waste Factor**: Automatic calculation of material waste
- **Cost Estimation**: Optional price per tile for budget planning
- **Performance**: Handles rooms up to 2000 sq ft smoothly

### Data Management
- **Auto-save**: State persisted to localStorage
- **Export Options**:
  - PNG image of room layout
  - JSON configuration file
  - Shopping list with material requirements
- **Validation**: Real-time error checking and warnings

## Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ceiling-tile-calculator-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Usage

### Basic Room Setup
1. Select a room shape from the presets (Rectangle, L, T, U) or choose Custom
2. Enter dimensions in your preferred units (feet or meters)
3. Configure tile size and orientation
4. View real-time calculations and visualization

### Custom Polygon Drawing
1. Select "Custom" shape type
2. Click on the canvas to add vertices
3. Drag vertices to adjust the shape
4. Use Shift+click to pan the view
5. Scroll to zoom in/out

### Adding Cutouts
1. Navigate to the Cutouts section
2. Choose rectangle or rounded cutout type
3. Set position and dimensions
4. Click "Add Cutout" to place it

### Exporting Results
- **PNG Image**: Download a visual representation of the room layout
- **Configuration**: Save current settings as a JSON file
- **Shopping List**: Generate a text file with material requirements

## Technical Architecture

### Core Technologies
- **React** + **TypeScript**: Component-based UI with type safety
- **Tailwind CSS**: Utility-first styling with neutral design
- **Canvas API**: High-performance 2D graphics rendering
- **Vite**: Fast development and build tooling

### Key Algorithms
- **Polygon Clipping**: Uses martinez-polygon-clipping for accurate tile-room intersections
- **Tile Grid Generation**: Efficient spatial indexing for large room support
- **Validation**: Real-time polygon validation preventing self-intersections

### File Structure
```
src/
├── components/           # React components
│   ├── canvas/          # Canvas rendering components
│   ├── shapes/          # Shape configuration forms
│   └── ...              # Other UI components
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Core algorithms and utilities
│   ├── geometry.ts      # Polygon operations
│   ├── tileCalculation.ts # Tile counting algorithms
│   ├── validation.ts    # Input validation
│   └── export.ts        # Data export utilities
└── App.tsx              # Main application component
```

## Browser Compatibility

- Modern browsers with Canvas API support
- Responsive design for desktop and mobile
- Accessible keyboard navigation for custom shapes

## Limitations

- Maximum recommended room size: 2000 sq ft / 186 sq m
- Custom polygons: Maximum ~50 vertices for optimal performance
- Canvas export: Limited by browser memory for very large rooms

## Contributing

1. Follow the existing code style and TypeScript conventions
2. Add tests for new algorithms or utilities
3. Ensure responsive design works on mobile devices
4. Run `npm run lint` before submitting changes

## License

This project is created as a demonstration and contains original code only. No third-party branding or proprietary algorithms are included.