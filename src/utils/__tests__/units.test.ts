import { describe, it, expect } from 'vitest'
import { formatFeetInches, parseFeetInches } from '../units'

describe('formatFeetInches', () => {
  it('should format whole feet correctly', () => {
    expect(formatFeetInches(10)).toBe("10'")
    expect(formatFeetInches(1)).toBe("1'")
    expect(formatFeetInches(0)).toBe("0'")
  })

  it('should format feet and inches correctly', () => {
    expect(formatFeetInches(10.5)).toBe("10' 6\"")
    expect(formatFeetInches(5.25)).toBe("5' 3\"")
    expect(formatFeetInches(12.75)).toBe("12' 9\"")
  })

  it('should handle edge cases near 12 inches', () => {
    expect(formatFeetInches(10.99)).toBe("11'") // 10.99 feet = 10' 11.88" → rounds to 12" = 11'
    expect(formatFeetInches(10.9999)).toBe("11'") // 10.9999 feet → rounds to 11'
    expect(formatFeetInches(10.83)).toBe("10' 10\"") // 10.83 feet = 10' 9.96" → rounds to 10' 10"
  })

  it('should handle small decimal values', () => {
    expect(formatFeetInches(0.5)).toBe("0' 6\"")
    expect(formatFeetInches(0.25)).toBe("0' 3\"")
    expect(formatFeetInches(0.08)).toBe("0' 1\"") // 0.08 feet ≈ 1 inch
  })

  it('should handle fractional inches correctly', () => {
    expect(formatFeetInches(1.042)).toBe("1' 1\"") // 1.042 feet = 1' 0.5" → rounds to 1' 1"
    expect(formatFeetInches(2.125)).toBe("2' 2\"") // 2.125 feet = 2' 1.5" → rounds to 2' 2"
  })

  it('should handle large values', () => {
    expect(formatFeetInches(100)).toBe("100'")
    expect(formatFeetInches(50.5)).toBe("50' 6\"")
  })
})

describe('parseFeetInches', () => {
  describe('feet and inches formats', () => {
    it('should parse standard feet and inches', () => {
      expect(parseFeetInches("10' 6\"")).toBeCloseTo(10.5, 3)
      expect(parseFeetInches("5' 3\"")).toBeCloseTo(5.25, 3)
      expect(parseFeetInches("12' 9\"")).toBeCloseTo(12.75, 3)
    })

    it('should parse without quotes', () => {
      expect(parseFeetInches("10 6")).toBeCloseTo(10.5, 3)
      expect(parseFeetInches("5 3")).toBeCloseTo(5.25, 3)
    })

    it('should parse with words', () => {
      expect(parseFeetInches("10 ft 6 in")).toBeCloseTo(10.5, 3)
      expect(parseFeetInches("5 feet 3 inches")).toBeCloseTo(5.25, 3)
    })

    it('should parse mixed formats', () => {
      expect(parseFeetInches("10' 6in")).toBeCloseTo(10.5, 3)
      expect(parseFeetInches("5ft 3\"")).toBeCloseTo(5.25, 3)
    })
  })

  describe('feet only formats', () => {
    it('should parse feet with apostrophe', () => {
      expect(parseFeetInches("10'")).toBe(10)
      expect(parseFeetInches("5'")).toBe(5)
      expect(parseFeetInches("0'")).toBe(0)
    })

    it('should parse feet with words', () => {
      expect(parseFeetInches("10 ft")).toBe(10)
      expect(parseFeetInches("5 feet")).toBe(5)
    })

    it('should parse decimal feet', () => {
      expect(parseFeetInches("10.5")).toBe(10.5)
      expect(parseFeetInches("5.25")).toBe(5.25)
      expect(parseFeetInches("12.75")).toBe(12.75)
    })
  })

  describe('inches only formats', () => {
    it('should parse inches with quotes', () => {
      expect(parseFeetInches("6\"")).toBeCloseTo(0.5, 3)
      expect(parseFeetInches("12\"")).toBe(1)
      expect(parseFeetInches("24\"")).toBe(2)
    })

    it('should parse inches with words', () => {
      expect(parseFeetInches("6 in")).toBeCloseTo(0.5, 3)
      expect(parseFeetInches("12 inches")).toBe(1)
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle whitespace', () => {
      expect(parseFeetInches("  10'  6\"  ")).toBeCloseTo(10.5, 3)
      expect(parseFeetInches(" 5.5 ")).toBe(5.5)
    })

    it('should handle empty or invalid input', () => {
      expect(parseFeetInches("")).toBe(0)
      expect(parseFeetInches("abc")).toBe(0)
      expect(parseFeetInches("invalid")).toBe(0)
    })

    it('should handle partial invalid input', () => {
      expect(parseFeetInches("10'abc")).toBe(10) // Should parse the feet part
      expect(parseFeetInches("10")).toBe(10) // Plain number
    })

    it('should handle decimal inches', () => {
      expect(parseFeetInches("10' 6.5\"")).toBeCloseTo(10.542, 3) // 10 + 6.5/12
      expect(parseFeetInches("5' 3.25\"")).toBeCloseTo(5.271, 3) // 5 + 3.25/12
    })

    it('should handle zero values', () => {
      expect(parseFeetInches("0' 0\"")).toBe(0)
      expect(parseFeetInches("0'")).toBe(0)
      expect(parseFeetInches("0\"")).toBe(0)
      expect(parseFeetInches("0")).toBe(0)
    })

    it('should handle large values', () => {
      expect(parseFeetInches("100' 11\"")).toBeCloseTo(100.917, 3)
      expect(parseFeetInches("50.5")).toBe(50.5)
    })
  })

  describe('round-trip consistency', () => {
    it('should be consistent with formatFeetInches for common values', () => {
      const testValues = [10, 10.5, 5.25, 12.75, 0.5, 1.042]

      testValues.forEach(value => {
        const formatted = formatFeetInches(value)
        const parsed = parseFeetInches(formatted)
        // Allow small rounding differences due to inch precision
        expect(parsed).toBeCloseTo(value, 1)
      })
    })

    it('should handle extreme precision correctly', () => {
      // Test that we don't lose too much precision in conversion
      const formatted = formatFeetInches(10.4583) // 10' 5.5"
      const parsed = parseFeetInches(formatted)
      expect(parsed).toBeCloseTo(10.458, 1) // Should be close to original (allow for rounding)
    })
  })
})