import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WallLengthAdjustments } from '../WallLengthAdjustments';
import { useAppStore } from '../../store/appStore';
import { generateWallsFromLShape, generateWallsFromRectangle } from '../../utils/wallUtils';

// Mock the store
vi.mock('../../store/appStore');

describe('WallLengthAdjustments', () => {
  const mockUpdateWall = vi.fn();
  const mockUseAppStore = vi.mocked(useAppStore);

  beforeEach(() => {
    mockUpdateWall.mockClear();
  });

  describe('Rectangle form', () => {
    it('should render rectangle form for rectangle walls', () => {
      const walls = generateWallsFromRectangle(10, 8);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      expect(screen.getByText('Rectangle Dimensions')).toBeInTheDocument();
      expect(screen.getByText('Wall A')).toBeInTheDocument();
      expect(screen.getByText('Wall B')).toBeInTheDocument();
      expect(screen.getByText('Wall C')).toBeInTheDocument();
      expect(screen.getByText('Wall D')).toBeInTheDocument();
    });

    it('should display current dimensions', () => {
      const walls = generateWallsFromRectangle(10, 8);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      // Check width inputs - find all inputs with value 10 (walls A and C)
      const widthFeetInputs = screen.getAllByDisplayValue('10');
      expect(widthFeetInputs).toHaveLength(2); // A and C walls

      // Check height inputs - find all inputs with value 8 (walls B and D)
      const heightFeetInputs = screen.getAllByDisplayValue('8');
      expect(heightFeetInputs).toHaveLength(2); // B and D walls
    });

    it('should call updateWall when width changes', async () => {
      const user = userEvent.setup();
      const walls = generateWallsFromRectangle(10, 8);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      // Get all width inputs (value 10) and pick the first one (Wall A)
      const widthFeetInputs = screen.getAllByDisplayValue('10');
      const wallAFeetInput = widthFeetInputs[0]; // First one should be Wall A

      // Change width from 10 to 12
      await user.clear(wallAFeetInput);
      await user.type(wallAFeetInput, '12');

      // Trigger the onBlur event to save the change
      fireEvent.blur(wallAFeetInput);

      // Check that updateWall was called for the width change
      expect(mockUpdateWall).toHaveBeenCalled();

      // For rectangles, updating Wall A should also update Wall C (opposite wall)
      // Check that both Wall A (index 0) and Wall C (index 2) were updated
      const calls = mockUpdateWall.mock.calls;
      const wallACall = calls.find((call) => call[0] === 0);
      const wallCCall = calls.find((call) => call[0] === 2);

      expect(wallACall).toBeDefined();
      expect(wallACall?.[1]).toEqual({ lengthInches: 144 }); // 12 feet = 144 inches
      expect(wallCCall).toBeDefined();
      expect(wallCCall?.[1]).toEqual({ lengthInches: 144 }); // Same length for opposite wall
    });
  });

  describe('L-Shape form', () => {
    it('should render L-shape form for L-shape walls', () => {
      const walls = generateWallsFromLShape(6, 6, 4, 3);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      expect(screen.getByText('L-Shape Dimensions')).toBeInTheDocument();
      expect(screen.getByText('Wall A')).toBeInTheDocument();
      expect(screen.getByText('Wall B')).toBeInTheDocument();
      expect(screen.getByText('Wall C')).toBeInTheDocument();
      expect(screen.getByText('Wall D')).toBeInTheDocument();
      expect(screen.getByText('Wall E')).toBeInTheDocument();
      expect(screen.getByText('Wall F')).toBeInTheDocument();
    });

    it('should display current L-shape dimensions', () => {
      const walls = generateWallsFromLShape(6, 6, 4, 3);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      // Check Wall A (width1) inputs - find by placeholder and value
      const wallAInputs = screen
        .getAllByPlaceholderText('0')
        .filter((input) => (input as HTMLInputElement).value === '6');
      expect(wallAInputs.length).toBeGreaterThan(0);

      // Check Wall B (height1) inputs
      const wallBInputs = screen
        .getAllByPlaceholderText('0')
        .filter((input) => (input as HTMLInputElement).value === '6');
      expect(wallBInputs.length).toBeGreaterThan(0);

      // Check Wall C (width2) inputs
      const wallCInputs = screen
        .getAllByPlaceholderText('0')
        .filter((input) => (input as HTMLInputElement).value === '4');
      expect(wallCInputs.length).toBeGreaterThan(0);

      // Check Wall D (height2) inputs
      const wallDInputs = screen
        .getAllByPlaceholderText('0')
        .filter((input) => (input as HTMLInputElement).value === '3');
      expect(wallDInputs.length).toBeGreaterThan(0);
    });

    it('should call updateWall when L-shape dimensions change', async () => {
      const user = userEvent.setup();
      const walls = generateWallsFromLShape(6, 6, 4, 3);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      // Find the first feet input under Wall A section
      const wallAInputs = screen.getAllByPlaceholderText('0');
      const width1FeetInput = wallAInputs.find(
        (input) => (input as HTMLInputElement).value === '6'
      );

      expect(width1FeetInput).toBeDefined();

      // Change width1 from 6 to 12
      await user.clear(width1FeetInput!);
      await user.type(width1FeetInput!, '12');

      // Trigger the onBlur event to save the change
      fireEvent.blur(width1FeetInput!);

      // Check that updateWall was called for the width1 change
      expect(mockUpdateWall).toHaveBeenCalled();

      // For L-shapes, updating Wall A should also update Wall E (total width)
      // Check that both Wall A (index 0) and Wall E (index 4) were updated
      const calls = mockUpdateWall.mock.calls;
      const wallACall = calls.find((call) => call[0] === 0);
      const wallECall = calls.find((call) => call[0] === 4);

      expect(wallACall).toBeDefined();
      expect(wallACall?.[1]).toEqual({ lengthInches: 144 }); // 12 feet = 144 inches
      expect(wallECall).toBeDefined();
      // Wall E should be updated to width1 (144) + width2 (48) = 192 inches
      expect(wallECall?.[1]).toEqual({ lengthInches: 192 }); // 12 + 4 = 16 feet = 192 inches
    });
  });

  describe('Error handling', () => {
    it('should handle empty input gracefully', async () => {
      const user = userEvent.setup();
      const walls = generateWallsFromRectangle(10, 8);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      // Get the first width input (Wall A)
      const widthFeetInputs = screen.getAllByDisplayValue('10');
      const widthFeetInput = widthFeetInputs[0];

      // Clear the input
      await user.clear(widthFeetInput);

      // Trigger the onBlur event to save the change
      fireEvent.blur(widthFeetInput);

      // Should call updateWall with 0 when empty
      expect(mockUpdateWall).toHaveBeenCalledWith(0, { lengthInches: 0 });
    });

    it('should handle decimal inputs', async () => {
      const user = userEvent.setup();
      const walls = generateWallsFromRectangle(10, 8);

      mockUseAppStore.mockImplementation((selector: any) => {
        const state = {
          walls,
          units: 'feet' as const,
          updateWall: mockUpdateWall,
        };
        return selector(state);
      });

      render(<WallLengthAdjustments />);

      // Get all inputs with value "0" and find the width inches input (first one)
      const inchesInputs = screen.getAllByDisplayValue('0');
      const widthInchesInput = inchesInputs[0]; // First inches input should be width

      // Add 6 inches
      await user.clear(widthInchesInput);
      await user.type(widthInchesInput, '6');

      // Trigger the onBlur event to save the change
      fireEvent.blur(widthInchesInput);

      // Should call updateWall with 126 inches (10 feet + 6 inches)
      expect(mockUpdateWall).toHaveBeenCalledWith(0, { lengthInches: 126 });
    });
  });
});
