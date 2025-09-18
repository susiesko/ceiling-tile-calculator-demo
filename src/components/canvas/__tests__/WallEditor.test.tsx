import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WallEditor } from '../WallEditor'
import { RectangleShape, LShape } from '../../../types'

describe('WallEditor', () => {
  const mockOnShapeChange = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    mockOnShapeChange.mockClear()
    mockOnClose.mockClear()
  })

  describe('Rectangle wall editing', () => {
    const rectangleShape: RectangleShape = {
      type: 'rectangle',
      width: 10,
      height: 8
    }

    it('should show correct wall description for rectangle walls', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('Edit Top wall')).toBeInTheDocument()
    })

    it('should show wall descriptions for all rectangle walls', () => {
      const wallDescriptions = ['Top wall', 'Right wall', 'Bottom wall', 'Left wall']

      wallDescriptions.forEach((description, index) => {
        const { unmount } = render(
          <WallEditor
            wallIndex={index}
            currentLength={10}
            shape={rectangleShape}
            units="feet"
            onShapeChange={mockOnShapeChange}
            onClose={mockOnClose}
          />
        )

        expect(screen.getByText(`Edit ${description}`)).toBeInTheDocument()

        // Clean up for next iteration
        unmount()
      })
    })

    it('should pre-populate with current length in feet format', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={10.5}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByDisplayValue("10' 6\"")).toBeInTheDocument()
    })

    it('should pre-populate with current length in metric format', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={3.2}
          shape={rectangleShape}
          units="meters"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByDisplayValue("3.2")).toBeInTheDocument()
    })

    it('should update rectangle width for top/bottom walls', async () => {
      const user = userEvent.setup()

      render(
        <WallEditor
          wallIndex={0} // Top wall
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const input = screen.getByDisplayValue("10'")
      await user.clear(input)
      await user.type(input, "12'")

      const updateButton = screen.getByText('Update Wall')
      await user.click(updateButton)

      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'rectangle',
        width: 12,
        height: 8
      })
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('should update rectangle height for left/right walls', async () => {
      const user = userEvent.setup()

      render(
        <WallEditor
          wallIndex={1} // Right wall
          currentLength={8}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const input = screen.getByDisplayValue("8'")
      await user.clear(input)
      await user.type(input, "10'")

      const updateButton = screen.getByText('Update Wall')
      await user.click(updateButton)

      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'rectangle',
        width: 10,
        height: 10
      })
    })
  })

  describe('L-shape wall editing', () => {
    const lShape: LShape = {
      type: 'l-shape',
      width1: 10,
      height1: 6,
      width2: 4,
      height2: 3
    }

    it('should show correct wall descriptions for L-shape', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={lShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText('Edit Bottom horizontal wall')).toBeInTheDocument()
    })

    it('should update width1 for bottom horizontal wall', async () => {
      const user = userEvent.setup()

      render(
        <WallEditor
          wallIndex={0} // Bottom horizontal wall
          currentLength={10}
          shape={lShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const input = screen.getByDisplayValue("10'")
      await user.clear(input)
      await user.type(input, "12'")

      const updateButton = screen.getByText('Update Wall')
      await user.click(updateButton)

      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'l-shape',
        width1: 12,
        height1: 6,
        width2: 4,
        height2: 3
      })
    })

    it('should update height1 for right vertical wall (bottom)', async () => {
      const user = userEvent.setup()

      render(
        <WallEditor
          wallIndex={1} // Right vertical wall (bottom)
          currentLength={6}
          shape={lShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const input = screen.getByDisplayValue("6'")
      await user.clear(input)
      await user.type(input, "8'")

      const updateButton = screen.getByText('Update Wall')
      await user.click(updateButton)

      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'l-shape',
        width1: 10,
        height1: 8,
        width2: 4,
        height2: 3
      })
    })
  })

  describe('Input validation', () => {
    const rectangleShape: RectangleShape = {
      type: 'rectangle',
      width: 10,
      height: 8
    }

    it('should reject zero or negative values', async () => {
      const user = userEvent.setup()
      // Mock alert to prevent actual alert in tests
      window.alert = vi.fn()

      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const input = screen.getByDisplayValue("10'")
      await user.clear(input)
      await user.type(input, "0")

      const updateButton = screen.getByText('Update Wall')
      await user.click(updateButton)

      expect(window.alert).toHaveBeenCalledWith('Wall length must be greater than 0')
      expect(mockOnShapeChange).not.toHaveBeenCalled()
      expect(mockOnClose).not.toHaveBeenCalled()
    })

    it('should handle various input formats', async () => {
      const user = userEvent.setup()

      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const input = screen.getByDisplayValue("10'")
      await user.clear(input)
      await user.type(input, "10' 6\"")

      const updateButton = screen.getByText('Update Wall')
      await user.click(updateButton)

      expect(mockOnShapeChange).toHaveBeenCalledWith({
        type: 'rectangle',
        width: 10.5, // 10' 6" = 10.5 feet
        height: 8
      })
    })
  })

  describe('Modal behavior', () => {
    const rectangleShape: RectangleShape = {
      type: 'rectangle',
      width: 10,
      height: 8
    }

    it('should call onClose when cancel is clicked', async () => {
      const user = userEvent.setup()

      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const cancelButton = screen.getByText('Cancel')
      await user.click(cancelButton)

      expect(mockOnClose).toHaveBeenCalled()
      expect(mockOnShapeChange).not.toHaveBeenCalled()
    })

    it('should focus input on mount', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      const input = screen.getByDisplayValue("10'")
      expect(input).toHaveFocus()
    })

    it('should show appropriate placeholder text', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByPlaceholderText("e.g., 10' 6\"")).toBeInTheDocument()
    })

    it('should show metric placeholder for meters', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={3}
          shape={rectangleShape}
          units="meters"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByPlaceholderText("e.g., 3.2")).toBeInTheDocument()
    })

    it('should show format examples for feet', () => {
      render(
        <WallEditor
          wallIndex={0}
          currentLength={10}
          shape={rectangleShape}
          units="feet"
          onShapeChange={mockOnShapeChange}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText("Format examples: 10', 10' 6\", 10.5")).toBeInTheDocument()
    })
  })
})