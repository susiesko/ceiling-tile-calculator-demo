import {beforeEach, describe, expect, it, vi} from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ShapeConfig} from '../shapes/ShapeConfig'
import {RectangleShape} from '../../types'
import {useAppStore} from '../../store/appStore'

// Mock the store
vi.mock('../../store/appStore')

describe('ShapeConfig', () => {
    const mockUpdateShape = vi.fn()
    const mockUseAppStore = vi.mocked(useAppStore)

    beforeEach(() => {
        mockUpdateShape.mockClear()

        // Setup default store mock
        mockUseAppStore.mockImplementation((selector: any) => {
            const state = {
                shape: {type: 'rectangle', width: 10, height: 8} as RectangleShape,
                updateShape: mockUpdateShape
            }
            return selector(state)
        })
    })

    describe('Shape selector', () => {
        it('should render shape type buttons', () => {
            render(<ShapeConfig/>)

            expect(screen.getByText('Rectangle')).toBeInTheDocument()
            expect(screen.getByText('L-Shape')).toBeInTheDocument()
        })

        it('should highlight selected shape type', () => {
            render(<ShapeConfig/>)

            const rectangleButton = screen.getByText('Rectangle').closest('button')
            expect(rectangleButton).toHaveClass('border-blue-500')
        })

        it('should switch shape types when clicked', async () => {
            const user = userEvent.setup()

            render(<ShapeConfig/>)

            const lShapeButton = screen.getByText('L-Shape')
            await user.click(lShapeButton)

            expect(mockUpdateShape).toHaveBeenCalledWith({
                type: 'l-shape',
                width1: 6,
                height1: 6,
                width2: 6,
                height2: 6
            })
        })
    })

    describe('Default values', () => {
        it('should not change shape if same type is selected', async () => {
            const user = userEvent.setup()

            render(<ShapeConfig/>)

            const rectangleButton = screen.getByText('Rectangle')
            await user.click(rectangleButton)

            // Should not call updateShape if same type
            expect(mockUpdateShape).not.toHaveBeenCalled()
        })
    })
})