import { describe, it, expect } from 'vitest'
import { calculateTiles } from '../tileCalculation'
import { TileConfig, GridConfig } from '../../types'

describe('calculateTiles', () => {
  const defaultTileConfig: TileConfig = {
    size: '2x2',
    orientation: 0
  }

  const defaultGridConfig: GridConfig = {
    origin: 'top-left',
    offsetX: 0,
    offsetY: 0,
    snapGrid: 0.5
  }

  describe('Rectangle calculations', () => {
    it('should calculate tiles for simple 10x8 rectangle with 2x2 tiles', () => {
      const roomVertices = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 8 },
        { x: 0, y: 8 }
      ]

      const result = calculateTiles(roomVertices, [], defaultTileConfig, defaultGridConfig)

      expect(result.area).toBe(80)
      expect(result.tileArea).toBe(4) // 2x2 = 4
      expect(result.estimatedTotal).toBe(20) // 80 / 4 = 20
      expect(result.wasteFactor).toBe(0) // Perfect fit
    })

    it('should calculate tiles for rectangle with 2x4 tiles', () => {
      const roomVertices = [
        { x: 0, y: 0 },
        { x: 12, y: 0 },
        { x: 12, y: 8 },
        { x: 0, y: 8 }
      ]

      const tileConfig: TileConfig = {
        ...defaultTileConfig,
        size: '2x4'
      }

      const result = calculateTiles(roomVertices, [], tileConfig, defaultGridConfig)

      expect(result.area).toBe(96)
      expect(result.tileArea).toBe(8) // 2x4 = 8
      expect(result.estimatedTotal).toBe(12) // 96 / 8 = 12
    })

    it('should calculate tiles with 90-degree rotation', () => {
      const roomVertices = [
        { x: 0, y: 0 },
        { x: 8, y: 0 },
        { x: 8, y: 12 },
        { x: 0, y: 12 }
      ]

      const tileConfig: TileConfig = {
        ...defaultTileConfig,
        size: '2x4',
        orientation: 90 // 4x2 when rotated
      }

      const result = calculateTiles(roomVertices, [], tileConfig, defaultGridConfig)

      expect(result.area).toBe(96)
      expect(result.tileArea).toBe(8) // Still 8 sq ft
      expect(result.estimatedTotal).toBe(12)
    })

    it('should handle partial tiles correctly', () => {
      // 9x7 room with 2x2 tiles = some partial tiles
      const roomVertices = [
        { x: 0, y: 0 },
        { x: 9, y: 0 },
        { x: 9, y: 7 },
        { x: 0, y: 7 }
      ]

      const result = calculateTiles(roomVertices, [], defaultTileConfig, defaultGridConfig)

      expect(result.area).toBe(63)
      expect(result.fullTiles).toBeLessThan(result.estimatedTotal)
      expect(result.partialTiles).toBeGreaterThan(0)
      expect(result.wasteFactor).toBeGreaterThan(0)
    })
  })

  describe('L-shape calculations', () => {
    it('should calculate tiles for L-shaped room', () => {
      // L-shape: 14x9 bounding box minus 4x6 cutout = 126 - 24 = 102 sq ft
      const lShapeVertices = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 6 },
        { x: 14, y: 6 },
        { x: 14, y: 9 },
        { x: 0, y: 9 }
      ]

      const result = calculateTiles(lShapeVertices, [], defaultTileConfig, defaultGridConfig)

      expect(result.area).toBe(102)
      expect(result.estimatedTotal).toBeGreaterThan(0)
      expect(result.totalTiles).toBe(result.fullTiles + result.partialTiles)
    })
  })


  describe('Cutout calculations', () => {
    it('should account for rectangular cutouts', () => {
      const roomVertices = [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 8 },
        { x: 0, y: 8 }
      ]

      const cutouts = [{
        id: '1',
        type: 'rectangle' as const,
        position: { x: 2, y: 2 },
        dimensions: { width: 4, height: 4 }  // Larger cutout to definitely exclude tiles
      }]

      const result = calculateTiles(roomVertices, cutouts, defaultTileConfig, defaultGridConfig)
      const resultNoCutout = calculateTiles(roomVertices, [], defaultTileConfig, defaultGridConfig)

      // With cutout, effective area should be less
      expect(result.totalTiles).toBeLessThan(resultNoCutout.totalTiles)
    })
  })

  describe('Edge cases', () => {
    it('should handle very small rooms', () => {
      const smallRoom = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 }
      ]

      const result = calculateTiles(smallRoom, [], defaultTileConfig, defaultGridConfig)

      expect(result.area).toBe(1)
      expect(result.estimatedTotal).toBeGreaterThan(0)
      expect(result.wasteFactor).toBeGreaterThan(0) // Small room = high waste
    })

    it('should handle empty room gracefully', () => {
      const emptyRoom: { x: number; y: number }[] = []

      const result = calculateTiles(emptyRoom, [], defaultTileConfig, defaultGridConfig)

      expect(result.area).toBe(0)
      expect(result.totalTiles).toBe(0)
      expect(result.wasteFactor).toBe(0)
    })

    it('should validate tile calculations are reasonable', () => {
      const roomVertices = [
        { x: 0, y: 0 },
        { x: 20, y: 0 },
        { x: 20, y: 15 },
        { x: 0, y: 15 }
      ]

      const result = calculateTiles(roomVertices, [], defaultTileConfig, defaultGridConfig)

      // Sanity checks
      expect(result.area).toBe(300)
      expect(result.totalTiles).toBeGreaterThan(0)
      expect(result.estimatedTotal).toBeGreaterThanOrEqual(result.totalTiles)
      expect(result.wasteFactor).toBeGreaterThanOrEqual(0)
      expect(result.wasteFactor).toBeLessThan(100) // Should be reasonable
    })
  })
})