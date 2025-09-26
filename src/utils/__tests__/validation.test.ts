import {describe, expect, it} from 'vitest'
import {validateShape} from '../validation'
import {LShape, RectangleShape} from '../../types'

describe('validateShape', () => {
    describe('Rectangle validation', () => {
        it('should validate correct rectangle', () => {
            const rectangle: RectangleShape = {
                type: 'rectangle',
                width: 10,
                height: 8
            }

            const result = validateShape(rectangle)

            expect(result.isValid).toBe(true)
            expect(result.errors).toHaveLength(0)
        })

        it('should reject rectangle with zero or negative dimensions', () => {
            const invalidRectangle: RectangleShape = {
                type: 'rectangle',
                width: 0,
                height: 8
            }

            const result = validateShape(invalidRectangle)

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('Width must be greater than 0')
        })

        it('should warn about very small dimensions in feet', () => {
            const smallRectangle: RectangleShape = {
                type: 'rectangle',
                width: 0.3, // Less than 0.5 ft
                height: 8
            }

            const result = validateShape(smallRectangle)

            expect(result.isValid).toBe(true) // Valid but with warnings
            expect(result.warnings).toContain('Width is very small (minimum recommended: 0.5 feet)')
        })

    })

    describe('L-shape validation', () => {
        it('should validate correct L-shape', () => {
            const lShape: LShape = {
                type: 'l-shape',
                width1: 10,
                height1: 6,
                width2: 4,
                height2: 3
            }

            const result = validateShape(lShape)

            expect(result.isValid).toBe(true)
            expect(result.errors).toHaveLength(0)
        })

        it('should reject L-shape with zero or negative dimensions', () => {
            const invalidLShape: LShape = {
                type: 'l-shape',
                width1: 0,
                height1: 6,
                width2: 4,
                height2: 3
            }

            const result = validateShape(invalidLShape)

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('All widths must be greater than 0')
        })

        it('should reject L-shape with negative height', () => {
            const invalidLShape: LShape = {
                type: 'l-shape',
                width1: 10,
                height1: -2,
                width2: 4,
                height2: 3
            }

            const result = validateShape(invalidLShape)

            expect(result.isValid).toBe(false)
            expect(result.errors).toContain('All heights must be greater than 0')
        })
    })

    describe('Large room warnings', () => {
        it('should warn about very large rooms in feet', () => {
            const largeRectangle: RectangleShape = {
                type: 'rectangle',
                width: 50, // 50x50 = 2500 sq ft (over 2000 limit)
                height: 50
            }

            const result = validateShape(largeRectangle)

            expect(result.isValid).toBe(true)
            expect(result.warnings.some(w => w.includes('Room area is very large'))).toBe(true)
            expect(result.warnings.some(w => w.includes('Performance may be affected'))).toBe(true)
        })


        it('should not warn about normal-sized rooms', () => {
            const normalRectangle: RectangleShape = {
                type: 'rectangle',
                width: 12,
                height: 10
            }

            const result = validateShape(normalRectangle)

            expect(result.isValid).toBe(true)
            expect(result.warnings.filter(w => w.includes('large')).length).toBe(0)
        })
    })


    describe('Multiple validation issues', () => {
        it('should report multiple errors and warnings', () => {
            const problematicShape: RectangleShape = {
                type: 'rectangle',
                width: 0, // Error: zero width
                height: 0.2 // Warning: very small height
            }

            const result = validateShape(problematicShape)

            expect(result.isValid).toBe(false)
            expect(result.errors.length).toBeGreaterThan(0)
            expect(result.warnings.length).toBeGreaterThan(0)
        })
    })

    describe('Edge cases', () => {
        it('should handle floating point precision', () => {
            const preciseRectangle: RectangleShape = {
                type: 'rectangle',
                width: 10.000001,
                height: 8.999999
            }

            const result = validateShape(preciseRectangle)

            expect(result.isValid).toBe(true)
        })

        it('should handle very precise small values', () => {
            const preciseSmallRectangle: RectangleShape = {
                type: 'rectangle',
                width: 0.500001, // Just over threshold
                height: 8
            }

            const result = validateShape(preciseSmallRectangle)

            // Should not warn since it's just over the 0.5 threshold
            expect(result.warnings.filter(w => w.includes('Width')).length).toBe(0)
        })
    })
})