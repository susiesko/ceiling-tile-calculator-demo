import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShapeConfig } from '../shapes/ShapeConfig';
import { useAppStore } from '../../store/appStore';
import { generateWallsFromRectangle } from '../../utils/wallUtils';

// Mock the store
vi.mock('../../store/appStore');

describe('ShapeConfig', () => {
  const mockUpdateWalls = vi.fn();
  const mockUseAppStore = vi.mocked(useAppStore);

  beforeEach(() => {
    mockUpdateWalls.mockClear();

    // Setup default store mock
    mockUseAppStore.mockImplementation((selector: any) => {
      const state = {
        walls: generateWallsFromRectangle(10, 8),
        updateWalls: mockUpdateWalls,
      };
      return selector(state);
    });
  });

  describe('Shape selector', () => {
    it('should render shape type buttons', () => {
      render(<ShapeConfig />);

      expect(screen.getByText('Rectangle')).toBeInTheDocument();
      expect(screen.getByText('L-Shape')).toBeInTheDocument();
    });

    it('should highlight selected shape type', () => {
      render(<ShapeConfig />);

      const rectangleButton = screen.getByText('Rectangle').closest('button');
      expect(rectangleButton).toHaveClass('border-blue-500');
    });

    it('should switch shape types when clicked', async () => {
      const user = userEvent.setup();

      render(<ShapeConfig />);

      const lShapeButton = screen.getByText('L-Shape');
      await user.click(lShapeButton);

      expect(mockUpdateWalls).toHaveBeenCalledWith([
        { name: 'A', lengthInches: 72, orientation: 'horizontal', wallIndex: 0 },
        { name: 'B', lengthInches: 72, orientation: 'vertical', wallIndex: 1 },
        { name: 'C', lengthInches: 72, orientation: 'horizontal', wallIndex: 2 },
        { name: 'D', lengthInches: 72, orientation: 'vertical', wallIndex: 3 },
        { name: 'E', lengthInches: 144, orientation: 'horizontal', wallIndex: 4 },
        { name: 'F', lengthInches: 144, orientation: 'vertical', wallIndex: 5 },
      ]);
    });
  });

  describe('Default values', () => {
    it('should not change shape if same type is selected', async () => {
      const user = userEvent.setup();

      render(<ShapeConfig />);

      const rectangleButton = screen.getByText('Rectangle');
      await user.click(rectangleButton);

      // Should not call updateWalls if same type
      expect(mockUpdateWalls).not.toHaveBeenCalled();
    });
  });
});
