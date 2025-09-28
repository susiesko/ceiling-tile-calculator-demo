import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TilePicker } from '../TilePicker';
import { TileDefinition } from '../../types';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

const mockTiles: TileDefinition[] = [
  {
    id: 'paw-2x2',
    name: 'Paw Pattern 2×2',
    description: '2×2 ceiling tile with paw pattern',
    width: 24,
    height: 24,
    imageUrl: '/tiles/paw-2x2.png',
    category: 'pattern'
  },
  {
    id: 'paw-2x4',
    name: 'Paw Pattern 2×4',
    description: '2×4 ceiling tile with paw pattern',
    width: 24,
    height: 48,
    imageUrl: '/tiles/paw-2x4.png',
    category: 'pattern'
  }
];

describe('TilePicker', () => {
  const mockOnTileSelect = vi.fn();

  beforeEach(() => {
    mockFetch.mockClear();
    mockOnTileSelect.mockClear();
  });

  it('should show loading state initially', () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    expect(screen.getByText('Loading tiles...')).toBeInTheDocument();
  });

  it('should show error state when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to load tiles'));

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load tiles')).toBeInTheDocument();
    });
  });

  it('should filter tiles by 2x2 size', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTiles)
    });

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Paw Pattern 2×2')).toBeInTheDocument();
      expect(screen.queryByText('Paw Pattern 2×4')).not.toBeInTheDocument();
    });

    // Should show size filter message
    expect(screen.getByText('Select a 2x2 tile pattern:')).toBeInTheDocument();
  });

  it('should filter tiles by 2x4 size', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTiles)
    });

    render(
      <TilePicker
        selectedTileSize="2x4"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Paw Pattern 2×4')).toBeInTheDocument();
      expect(screen.queryByText('Paw Pattern 2×2')).not.toBeInTheDocument();
    });

    // Should show size filter message
    expect(screen.getByText('Select a 2x4 tile pattern:')).toBeInTheDocument();
  });

  it('should show no tiles message when no tiles match size', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]) // Empty array
    });

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('No tiles available for 2x2 size')).toBeInTheDocument();
    });
  });

  it('should highlight selected tile', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTiles)
    });

    render(
      <TilePicker
        selectedTileSize="2x2"
        selectedTileId="paw-2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      const selectedTile = screen.getByText('Paw Pattern 2×2').closest('button');
      expect(selectedTile).toHaveClass('border-primary-500', 'bg-primary-50');

      // Should show checkmark
      const checkmark = selectedTile?.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });
  });

  it('should call onTileSelect when tile is clicked', async () => {
    const user = userEvent.setup();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTiles)
    });

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Paw Pattern 2×2')).toBeInTheDocument();
    });

    const tileButton = screen.getByText('Paw Pattern 2×2').closest('button');
    await user.click(tileButton!);

    expect(mockOnTileSelect).toHaveBeenCalledWith(mockTiles[0]);
  });

  it('should display tile dimensions and description', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTiles)
    });

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('24" × 24"')).toBeInTheDocument();
      expect(screen.getByText('2×2 ceiling tile with paw pattern')).toBeInTheDocument();
    });
  });

  it('should fetch tiles from correct URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTiles)
    });

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/tiles.json');
    });
  });

  it('should handle fetch response not ok', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    });

    render(
      <TilePicker
        selectedTileSize="2x2"
        onTileSelect={mockOnTileSelect}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to load tiles')).toBeInTheDocument();
    });
  });
});