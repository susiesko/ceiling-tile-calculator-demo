import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WallLengthAdjustments } from '../WallLengthAdjustments'
import { RectangleShape, LShape } from '../../types'

describe('WallLengthAdjustments', () => {
  const mockOnShapeChange = vi.fn()

  beforeEach(() => {
    mockOnShapeChange.mockClear()
  })

  describe('Rectangle form', () => {
    it('should render width and height inputs for rectangle', () => {
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
      expect(screen.getByDisplayValue('8')).toBeInTheDocument()
    })

    it('should show correct unit labels', () => {
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      expect(screen.getByText('Width (Walls A & C)')).toBeInTheDocument()
      expect(screen.getByText('Height (Walls B & D)')).toBeInTheDocument()
      expect(screen.getAllByText('Feet')).toHaveLength(2)
      expect(screen.getAllByText('Inches')).toHaveLength(2)
    })

    it('should update shape when width input changes', async () => {
      const user = userEvent.setup()
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      // Find the width feet input (first input with value '10')
      const widthFeetInputs = screen.getAllByDisplayValue('10')
      const widthFeetInput = widthFeetInputs[0] // First one should be width feet
      await user.clear(widthFeetInput)
      await user.type(widthFeetInput, '12')

      // Trigger the onBlur event to save the change
      fireEvent.blur(widthFeetInput)

      // Check that onShapeChange was called
      expect(mockOnShapeChange).toHaveBeenCalled()
      const lastCall = mockOnShapeChange.mock.calls[mockOnShapeChange.mock.calls.length - 1][0]
      expect(lastCall.type).toBe('rectangle')
      expect(lastCall.width).toBe(12)
      expect(lastCall.height).toBe(8)
    })
  })

  describe('L-shape form', () => {
    it('should render all L-shape dimension inputs', () => {
      const shape: LShape = {
        type: 'l-shape',
        width1: 10,
        height1: 6,
        width2: 4,
        height2: 3
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      expect(screen.getByDisplayValue('10')).toBeInTheDocument()
      expect(screen.getByDisplayValue('6')).toBeInTheDocument()
      expect(screen.getByDisplayValue('4')).toBeInTheDocument()
      expect(screen.getByDisplayValue('3')).toBeInTheDocument()
    })

    it('should have wall labels for L-shape', () => {
      const shape: LShape = {
        type: 'l-shape',
        width1: 10,
        height1: 6,
        width2: 4,
        height2: 3
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      expect(screen.getByText('Wall A')).toBeInTheDocument()
      expect(screen.getByText('Wall B')).toBeInTheDocument()
      expect(screen.getByText('Wall C')).toBeInTheDocument()
      expect(screen.getByText('Wall D')).toBeInTheDocument()
    })

    it('should update L-shape when dimension changes', async () => {
      const user = userEvent.setup()
      const shape: LShape = {
        type: 'l-shape',
        width1: 10,
        height1: 6,
        width2: 4,
        height2: 3
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      // Find the width1 feet input (first input with value '10')
      const width1FeetInputs = screen.getAllByDisplayValue('10')
      const width1FeetInput = width1FeetInputs[0] // First one should be width1 feet
      await user.clear(width1FeetInput)
      await user.type(width1FeetInput, '12')

      // Trigger the onBlur event to save the change
      fireEvent.blur(width1FeetInput)

      // Check that onShapeChange was called
      expect(mockOnShapeChange).toHaveBeenCalled()
      const lastCall = mockOnShapeChange.mock.calls[mockOnShapeChange.mock.calls.length - 1][0]
      expect(lastCall.type).toBe('l-shape')
      expect(lastCall.width1).toBe(12)
      expect(lastCall.height1).toBe(6)
      expect(lastCall.width2).toBe(4)
      expect(lastCall.height2).toBe(3)
    })
  })

  describe('Input validation', () => {
    it('should handle empty input gracefully', async () => {
      const user = userEvent.setup()
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      // Find the width feet input (first input with value '10')
      const widthFeetInputs = screen.getAllByDisplayValue('10')
      const widthFeetInput = widthFeetInputs[0]
      await user.clear(widthFeetInput)

      // Trigger the onBlur event to save the change
      fireEvent.blur(widthFeetInput)

      // Should call with 0 when empty
      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'rectangle',
        width: 0,
        height: 8
      })
    })

    it('should handle decimal inputs', async () => {
      const user = userEvent.setup()
      const shape: RectangleShape = {
        type: 'rectangle',
        width: 10,
        height: 8
      }

      render(
        <WallLengthAdjustments
          shape={shape}
          units="feet"
          onShapeChange={mockOnShapeChange}
        />
      )

      // Find all inches inputs and get the first one (width inches)
      const widthInchesInputs = screen.getAllByDisplayValue('0.0')
      const widthInchesInput = widthInchesInputs[0] // First one should be width inches
      await user.clear(widthInchesInput)
      await user.type(widthInchesInput, '6')

      // Trigger the onBlur event to save the change
      fireEvent.blur(widthInchesInput)

      // Should convert 10 feet + 6 inches = 10.5 feet
      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'rectangle',
        width: 10.5,
        height: 8
      })
    })
  })
})