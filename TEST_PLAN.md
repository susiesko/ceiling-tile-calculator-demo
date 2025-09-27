# Ceiling Tile Calculator - Test Plan

## Overview

This document outlines the most critical tests for the ceiling tile calculator application. The tests are prioritized by risk and importance to ensure core functionality works correctly.

## Test Categories by Priority

### 1. **CRITICAL** - Core Calculation Tests

These tests ensure the fundamental math is correct, which is the primary value of the application.

#### Geometry Calculations

- [ ] `convertShapeToPolygon()` - Rectangle conversion
- [ ] `convertShapeToPolygon()` - L-shape conversion
- [ ] `calculatePolygonArea()` - Various polygon shapes
- [ ] Polygon validation (no self-intersections)

#### Tile Calculations

- [ ] `calculateTiles()` - Simple rectangular room
- [ ] `calculateTiles()` - L-shaped room
- [ ] `calculateTiles()` - Different tile sizes (2x2, 2x4)
- [ ] `calculateTiles()` - Different tile orientations (0°, 90°)
- [ ] `calculateTiles()` - Rooms with cutouts
- [ ] `calculateTiles()` - Border calculations
- [ ] Partial vs full tile detection
- [ ] Waste factor calculations

### 2. **HIGH** - Units and Formatting

These tests ensure user input/output is handled correctly.

#### Units Conversion

- [ ] `formatFeetInches()` - Various decimal values
- [ ] `formatFeetInches()` - Edge cases (0, 0.5, 11.99 feet)
- [ ] `parseFeetInches()` - Multiple input formats
- [ ] `parseFeetInches()` - Error handling for invalid input

#### Data Validation

- [ ] `validateShape()` - Rectangle validation
- [ ] `validateShape()` - L-shape validation
- [ ] `validateShape()` - Minimum dimension checks
- [ ] `validateShape()` - Maximum room size warnings

### 3. **MEDIUM** - Component Integration

These tests ensure UI components work together correctly.

#### Shape Configuration

- [ ] Shape type switching updates form correctly
- [ ] Form input validation and error display
- [ ] Default values are reasonable
- [ ] State persistence in localStorage

#### Wall Editing

- [ ] Wall label click detection
- [ ] Wall length updates affect correct dimensions
- [ ] Adjacent wall relationships maintained
- [ ] Input parsing in wall editor modal

### 4. **LOW** - UI and Edge Cases

These tests catch usability issues and corner cases.

#### Canvas Rendering

- [ ] Room scales and centers correctly
- [ ] Wall labels positioned properly
- [ ] Zoom and pan functionality
- [ ] Export functionality works

#### Error Handling

- [ ] Invalid shape configurations
- [ ] Extremely large/small rooms
- [ ] Network/storage failures

## Test Implementation Strategy

### Phase 1: Core Algorithm Tests (Highest ROI)

Focus on pure functions with complex logic:

- Geometry calculations
- Tile counting algorithms
- Units conversion

### Phase 2: Integration Tests

Test component interactions:

- Shape form to calculation updates
- Wall editing to shape changes
- State management

### Phase 3: UI Tests

Visual and interaction testing:

- Canvas rendering
- Modal interactions
- Export features

## Risk Areas Requiring Extra Testing

1. **Floating Point Precision**: Tile calculations with decimal dimensions
2. **L-Shape Complexity**: Wall editing for L-shapes has complex dimension relationships
3. **Units Conversion**: Feet/inches parsing has many edge cases
4. **Large Rooms**: Performance and accuracy with 2000+ sq ft rooms
5. **Edge Cases**: Very small dimensions, zero values, extreme ratios

## Success Criteria

- **100% pass rate** on core calculation tests
- **95% pass rate** on integration tests
- **No critical bugs** in wall editing functionality
- **Performance**: Calculations complete in <100ms for typical rooms
- **Accuracy**: Tile counts within 1% of manual calculation verification
