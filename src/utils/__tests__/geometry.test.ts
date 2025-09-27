import { describe, it, expect } from 'vitest'
import {
  convertWallsToPolygon,
  calculatePolygonArea,
  isPointInPolygon,
  validatePolygon,
  snapToGrid
} from '../geometry'
import { generateWallsFromRectangle, generateWallsFromLShape } from '../wallUtils'

describe('convertWallsToPolygon', () => {
  it('should convert rectangle walls to correct polygon', () => {
    const walls = generateWallsFromRectangle(10, 8)
    const result = convertWallsToPolygon(walls)

    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 8 },
      { x: 0, y: 8 }
    ])
  })

  it('should convert L-shape walls to correct polygon', () => {
    const walls = generateWallsFromLShape(10, 6, 4, 3)
    const result = convertWallsToPolygon(walls)

    expect(result).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 6 },
      { x: 14, y: 6 },
      { x: 14, y: 9 },
      { x: 0, y: 9 }
    ])
  })

  it('should handle empty walls array gracefully', () => {
    const result = convertWallsToPolygon([])
    expect(result).toEqual([])
  })
})

describe('calculatePolygonArea', () => {
  it('should calculate rectangle area correctly', () => {
    const rectangle = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 8 },
      { x: 0, y: 8 }
    ]

    const area = calculatePolygonArea(rectangle)
    expect(area).toBe(80)
  })

  it('should calculate L-shape area correctly', () => {
    // L-shape: 14x9 bounding box minus 4x6 cutout = 126 - 24 = 102
    const lShape = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 6 },
      { x: 14, y: 6 },
      { x: 14, y: 9 },
      { x: 0, y: 9 }
    ]

    const area = calculatePolygonArea(lShape)
    expect(area).toBe(102)
  })

  it('should return 0 for invalid polygons', () => {
    const invalidPolygon = [{ x: 0, y: 0 }, { x: 1, y: 1 }]
    const area = calculatePolygonArea(invalidPolygon)
    expect(area).toBe(0)
  })

  it('should handle floating point dimensions', () => {
    const rectangle = [
      { x: 0, y: 0 },
      { x: 10.5, y: 0 },
      { x: 10.5, y: 8.25 },
      { x: 0, y: 8.25 }
    ]

    const area = calculatePolygonArea(rectangle)
    expect(area).toBeCloseTo(86.625, 3)
  })
})

describe('isPointInPolygon', () => {
  const rectangle = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 8 },
    { x: 0, y: 8 }
  ]

  it('should return true for point inside rectangle', () => {
    expect(isPointInPolygon({ x: 5, y: 4 }, rectangle)).toBe(true)
  })

  it('should return false for point outside rectangle', () => {
    expect(isPointInPolygon({ x: 15, y: 4 }, rectangle)).toBe(false)
    expect(isPointInPolygon({ x: 5, y: 15 }, rectangle)).toBe(false)
  })

  it('should handle edge cases correctly', () => {
    expect(isPointInPolygon({ x: 0, y: 0 }, rectangle)).toBe(false) // Corner
    expect(isPointInPolygon({ x: 5, y: 0 }, rectangle)).toBe(false) // Edge
  })
})

describe('validatePolygon', () => {
  it('should validate correct polygon', () => {
    const validPolygon = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 8 },
      { x: 0, y: 8 }
    ]

    const result = validatePolygon(validPolygon)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('should reject polygon with too few vertices', () => {
    const invalidPolygon = [
      { x: 0, y: 0 },
      { x: 10, y: 0 }
    ]

    const result = validatePolygon(invalidPolygon)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Polygon must have at least 3 vertices')
  })

  it('should reject polygon with edges too short', () => {
    const invalidPolygon = [
      { x: 0, y: 0 },
      { x: 0.1, y: 0 }, // Very short edge
      { x: 0.1, y: 1 }
    ]

    const result = validatePolygon(invalidPolygon)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too short')
  })

  it('should detect self-intersecting polygons', () => {
    const selfIntersecting = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 10 },
      { x: 10, y: 10 } // Creates intersection
    ]

    const result = validatePolygon(selfIntersecting)
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Polygon cannot have self-intersections')
  })
})

describe('snapToGrid', () => {
  it('should snap point to grid correctly', () => {
    expect(snapToGrid({ x: 1.2, y: 2.7 }, 0.5)).toEqual({ x: 1, y: 2.5 })
    expect(snapToGrid({ x: 1.7, y: 2.3 }, 0.5)).toEqual({ x: 1.5, y: 2.5 })
  })

  it('should handle exact grid points', () => {
    expect(snapToGrid({ x: 2, y: 3 }, 0.5)).toEqual({ x: 2, y: 3 })
  })

  it('should work with different grid sizes', () => {
    expect(snapToGrid({ x: 1.7, y: 2.3 }, 1)).toEqual({ x: 2, y: 2 })
    expect(snapToGrid({ x: 1.7, y: 2.3 }, 0.25)).toEqual({ x: 1.75, y: 2.25 })
  })
})