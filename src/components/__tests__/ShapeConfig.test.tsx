import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShapeConfig } from '../shapes/ShapeConfig'
import { RectangleShape, LShape } from '../../types'

describe('ShapeConfig', () => {
  const mockOnShapeChange = vi.fn()

  beforeEach(() => {
    mockOnShapeChange.mockClear()
  })

  describe('Shape selector', () => {
    it('should render shape type buttons', () => {
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <ShapeConfig
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      expect(screen.getByText('Rectangle')).toBeInTheDocument()
      expect(screen.getByText('L-Shape')).toBeInTheDocument()
    })

    it('should highlight selected shape type', () => {
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <ShapeConfig
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      const rectangleButton = screen.getByText('Rectangle').closest('button')
      expect(rectangleButton).toHaveClass('border-blue-500')
    })

    it('should switch shape types when clicked', async () => {
      const user = userEvent.setup()
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <ShapeConfig
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      const lShapeButton = screen.getByText('L-Shape')
      await user.click(lShapeButton)

      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'l-shape',
        width1: 12,
        height1: 8,
        width2: 6,
        height2: 6
      })
    })
  })

  describe('Default values', () => {
    it('should not change shape if same type is selected', async () => {
      const user = userEvent.setup()
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 15, // Custom value
        height: 12  // Custom value
      }

      render(
        <ShapeConfig
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      const rectangleButton = screen.getByText('Rectangle')
      await user.click(rectangleButton)

      // Should not call onShapeChange if same type
      expect(mockOnShapeChange).not.toHaveBeenCalled()
    })
  })
})