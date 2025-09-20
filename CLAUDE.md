# Claude Instructions for Ceiling Tile Calculator

## Your role.

You are an expert frontend and React + HTML5 canvas software engineer and expert web designer.

## Project Overview

This is a **React + TypeScript** ceiling tile calculator application that helps users calculate tile requirements for
room layouts. The app features an interactive canvas for visualization and step-by-step configuration through an
accordion interface.

### Key Features

- **Room Shape Configuration**: Rectangle and L-shape presets with customizable dimensions
- **Tile Configuration**: 2×2 and 2×4 tiles with orientation support (90° rotation for 2×4)
- **Interactive Canvas**: Real-time visualization with draggable wall labels for dimension adjustment
- **Accurate Calculations**: Full vs partial tile counting with waste factor calculation
- **Responsive Design**: Accordion-style interface optimized for desktop and mobile

## Architecture & Tech Stack

### Core Technologies

- **React 19.1.1** with **TypeScript** for type-safe component development
- **Tailwind CSS** for utility-first styling with neutral design system
- **Canvas API** for high-performance 2D graphics rendering
- **Vite** for fast development and optimized builds
- **Vitest** for unit testing with React Testing Library

### Build & Development Tools

- **ESLint** for code linting with React hooks and refresh plugins
- **PostCSS + Autoprefixer** for CSS processing
- **GitHub Pages** deployment configured for main branch auto-deploy
- **LocalStorage** for automatic state persistence

## File Structure & Organization

```
src/
├── components/           # React components organized by feature
│   ├── canvas/          # Canvas rendering and interaction
│   ├── shapes/          # Shape configuration forms
│   ├── icons/           # SVG icon components for tiles
│   └── __tests__/       # Component tests
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
├── utils/               # Core algorithms and utilities
│   ├── geometry.ts      # Polygon operations and conversions
│   ├── tileCalculation.ts # Tile counting algorithms
│   ├── validation.ts    # Input validation logic
│   ├── canvasDrawing.ts # Canvas rendering utilities
│   ├── wallManipulation.ts # Interactive wall editing
│   ├── units.ts         # Unit conversion utilities
│   └── __tests__/       # Utility function tests
└── App.tsx              # Main application component
```

## Key Algorithms & Logic

### Tile Calculation (`src/utils/tileCalculation.ts`)

- **Grid Generation**: Creates tile grid covering room bounds with configurable offset
- **Coverage Sampling**: Uses 10×10 sample grid per tile for precise intersection calculation
- **Threshold Logic**: Tiles with ≥95% coverage are considered "full", ≥10% minimum for inclusion
- **Waste Factor**: Calculates material waste as percentage over actual room area

### Geometry Operations (`src/utils/geometry.ts`)

- **Shape-to-Polygon Conversion**: Converts rectangle/L-shape definitions to polygon vertices
- **Point-in-Polygon Testing**: Ray casting algorithm for spatial intersection tests
- **Area Calculation**: Shoelace formula for accurate polygon area computation

### Canvas Rendering (`src/utils/canvasDrawing.ts`)

- **Interactive Labels**: Draggable wall dimension labels with hover/active states
- **Grid Overlay**: Visual tile grid aligned with calculation grid
- **Real-time Updates**: Canvas redraws on state changes with optimized rendering

## Code Conventions & Patterns

### TypeScript Usage

- **Strict Typing**: All components and utilities fully typed with comprehensive interfaces
- **Union Types**: Shape types (`'rectangle' | 'l-shape'`), tile sizes (`'2x2' | '2x4'`)
- **Enums**: TileOrientation enum for rotation values (0°, 90°)
- **Interface Composition**: Nested interfaces for complex state objects

### React Patterns

- **Custom Hooks**: `useAppState` for centralized state management with localStorage persistence
- **Component Composition**: Accordion sections with reusable `AccordionSection` wrapper
- **Controlled Components**: All form inputs controlled with validation feedback
- **Effect Management**: Automatic calculation updates on relevant state changes

### State Management

- **Centralized State**: Single `AppState` object managed by `useAppState` hook
- **Immutable Updates**: All state changes use spread operators for immutability
- **Persistence**: Automatic save/restore from localStorage with error handling
- **Validation**: Real-time validation with error/warning messages

### Styling & UI

- **Tailwind Classes**: Utility-first styling with consistent spacing and colors
- **Responsive Design**: Mobile-first approach with `lg:` breakpoints for desktop layout
- **Neutral Palette**: Grays, blues, and subtle colors for professional appearance
- **Interactive States**: Hover, focus, and active states for all interactive elements

## Development Guidelines

### When Making Changes

1. **Follow Existing Patterns**: Match the established code style and component structure
2. **Type Safety**: Ensure all new code is fully typed with proper interfaces
3. **Testing**: Add tests for new algorithms or complex logic in `__tests__` directories
4. **Validation**: Add appropriate validation for new input fields or configuration options
5. **Canvas Updates**: If modifying calculations, ensure canvas visualization stays in sync

### Testing Strategy

- **Unit Tests**: Algorithm testing for geometry, tile calculation, and validation utilities
- **Component Tests**: React Testing Library for component behavior and user interactions
- **Test Commands**:
    - `npm test` - Interactive test runner
    - `npm run test:run` - Single test run for CI
    - `npm run test:ui` - Vitest UI for debugging

### Build & Deployment

- **Development**: `npm run dev` - Vite dev server on localhost:5173
- **Production**: `npm run build` - Optimized build to `dist/` directory
- **Linting**: `npm run lint` - ESLint with React-specific rules
- **Auto-Deploy**: GitHub Pages deployment configured for main branch

## Current Limitations & Constraints

### Supported Features

- **Room Shapes**: Rectangle and L-shape only (no custom polygons, T-shape, or U-shape)
- **Units**: Feet/inches only (metric support removed)
- **Tile Sizes**: 2×2 and 2×4 standard ceiling tiles only
- **No Advanced Features**: Borders, cutouts, and file exports have been removed for simplicity

### Performance Considerations

- **Room Size**: Optimized for typical residential/commercial spaces
- **Canvas Rendering**: Fixed zoom level for consistent UX
- **State Persistence**: Automatic localStorage save may impact performance with very frequent updates

## Integration Points

### Adding New Room Shapes

1. Add new shape type to `ShapeType` union in `types/index.ts`
2. Create interface for shape parameters
3. Add conversion logic in `geometry.ts` `convertShapeToPolygon`
4. Create form component in `components/shapes/`
5. Update `ShapeConfig` component to include new option

### Extending Tile Configurations

1. Add new size to `TileSize` type in `types/index.ts`
2. Update tile size mapping in `tileCalculation.ts` `getTileSize`
3. Create icon component in `components/icons/`
4. Update `TileControls` component with new option

### Canvas Enhancements

1. Modify rendering logic in `canvasDrawing.ts`
2. Update interaction handlers in `CanvasRenderer` component
3. Ensure state synchronization in `useAppState` hook
4. Add appropriate validation in `validation.ts`

This documentation should help you understand the codebase structure and make informed decisions when implementing new
features or modifications.
Please keep this document updated.