import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CalculationResults } from '../CalculationResults';
import { useAppStore } from '../../store/appStore';
import { TileDefinition } from '../../types';

describe('CalculationResults', () => {
  beforeEach(() => {
    useAppStore.getState().resetState();
  });

  it('should display basic calculation results', () => {
    // Set up some test data
    useAppStore.setState({
      calculation: {
        totalTiles: 100,
        fullTiles: 80,
        partialTiles: 20,
        estimatedTotal: 100,
        area: 144, // 12x12 room = 144 sq ft
        tileArea: 4, // 2x2 tile = 4 sq ft
        wasteFactor: 0,
      },
      walls: [
        { name: 'A', lengthInches: 144, orientation: 'horizontal', wallIndex: 0 },
        { name: 'B', lengthInches: 144, orientation: 'vertical', wallIndex: 1 },
        { name: 'C', lengthInches: 144, orientation: 'horizontal', wallIndex: 2 },
        { name: 'D', lengthInches: 144, orientation: 'vertical', wallIndex: 3 },
      ],
      tileConfig: {
        size: '2x2',
        orientation: 0,
      },
    });

    render(<CalculationResults />);

    expect(screen.getByText('Calculation Results')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument(); // Full tiles
    expect(screen.getByText('20')).toBeInTheDocument(); // Partial tiles
    expect(screen.getByText('100')).toBeInTheDocument(); // Total tiles
    expect(screen.getByText('144.0 sq ft')).toBeInTheDocument(); // Area
    expect(screen.getByText('Rectangle')).toBeInTheDocument(); // Shape
    expect(screen.getByText('2x2')).toBeInTheDocument(); // Tile size
  });

  it('should display selected tile information when tile is selected', () => {
    const mockTile: TileDefinition = {
      id: 'paw-2x2',
      name: 'Paw Pattern 2×2',
      description: '2×2 ceiling tile with paw pattern',
      width: 24,
      height: 24,
      imageUrl: '/tiles/paw-2x2.png',
      category: 'pattern'
    };

    useAppStore.setState({
      calculation: {
        totalTiles: 50,
        fullTiles: 40,
        partialTiles: 10,
        estimatedTotal: 50,
        area: 100,
        tileArea: 4,
        wasteFactor: 0,
      },
      tileConfig: {
        size: '2x2',
        orientation: 0,
        selectedTile: mockTile,
      },
      walls: [
        { name: 'A', lengthInches: 120, orientation: 'horizontal', wallIndex: 0 },
        { name: 'B', lengthInches: 120, orientation: 'vertical', wallIndex: 1 },
        { name: 'C', lengthInches: 120, orientation: 'horizontal', wallIndex: 2 },
        { name: 'D', lengthInches: 120, orientation: 'vertical', wallIndex: 3 },
      ],
    });

    render(<CalculationResults />);

    expect(screen.getByText('Selected Tile')).toBeInTheDocument();
    expect(screen.getByText('Paw Pattern 2×2')).toBeInTheDocument();
    expect(screen.getByText('24" × 24"')).toBeInTheDocument();
    expect(screen.getByText('pattern')).toBeInTheDocument();
  });

  it('should detect L-shape rooms correctly', () => {
    useAppStore.setState({
      calculation: {
        totalTiles: 75,
        fullTiles: 60,
        partialTiles: 15,
        estimatedTotal: 75,
        area: 120,
        tileArea: 4,
        wasteFactor: 0,
      },
      walls: [
        { name: 'A', lengthInches: 72, orientation: 'horizontal', wallIndex: 0 },
        { name: 'B', lengthInches: 72, orientation: 'vertical', wallIndex: 1 },
        { name: 'C', lengthInches: 48, orientation: 'horizontal', wallIndex: 2 },
        { name: 'D', lengthInches: 36, orientation: 'vertical', wallIndex: 3 },
        { name: 'E', lengthInches: 120, orientation: 'horizontal', wallIndex: 4 },
        { name: 'F', lengthInches: 108, orientation: 'vertical', wallIndex: 5 },
      ],
      tileConfig: {
        size: '2x2',
        orientation: 0,
      },
    });

    render(<CalculationResults />);

    expect(screen.getByText('L-Shape')).toBeInTheDocument();
  });

  it('should format numbers with proper localization', () => {
    useAppStore.setState({
      calculation: {
        totalTiles: 1500,
        fullTiles: 1200,
        partialTiles: 300,
        estimatedTotal: 1500,
        area: 600,
        tileArea: 4,
        wasteFactor: 0,
      },
      walls: [
        { name: 'A', lengthInches: 288, orientation: 'horizontal', wallIndex: 0 },
        { name: 'B', lengthInches: 300, orientation: 'vertical', wallIndex: 1 },
        { name: 'C', lengthInches: 288, orientation: 'horizontal', wallIndex: 2 },
        { name: 'D', lengthInches: 300, orientation: 'vertical', wallIndex: 3 },
      ],
      tileConfig: {
        size: '2x2',
        orientation: 0,
      },
    });

    render(<CalculationResults />);

    // Check that large numbers are formatted with commas
    expect(screen.getByText('1,200')).toBeInTheDocument(); // Full tiles
    expect(screen.getByText('1,500')).toBeInTheDocument(); // Total tiles
  });

  it('should not show selected tile section when no tile is selected', () => {
    useAppStore.setState({
      calculation: {
        totalTiles: 50,
        fullTiles: 40,
        partialTiles: 10,
        estimatedTotal: 50,
        area: 100,
        tileArea: 4,
        wasteFactor: 0,
      },
      tileConfig: {
        size: '2x2',
        orientation: 0,
        // selectedTile is undefined
      },
      walls: [
        { name: 'A', lengthInches: 120, orientation: 'horizontal', wallIndex: 0 },
        { name: 'B', lengthInches: 120, orientation: 'vertical', wallIndex: 1 },
        { name: 'C', lengthInches: 120, orientation: 'horizontal', wallIndex: 2 },
        { name: 'D', lengthInches: 120, orientation: 'vertical', wallIndex: 3 },
      ],
    });

    render(<CalculationResults />);

    expect(screen.queryByText('Selected Tile')).not.toBeInTheDocument();
  });
});