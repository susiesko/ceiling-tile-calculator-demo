import { useCallback, useEffect, useRef, useState } from 'react';
import { Point } from '../../types';
import { useAppStore } from '../../store/appStore';
import { convertWallsToPolygon } from '../../utils/geometry';
import {
  calculateWallLabels,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  drawGrid,
  drawRoomShape,
  drawTiles,
  drawWallLabels,
  getRoomBounds,
  PIXELS_PER_FOOT,
  WallLabel,
} from '../../utils/canvasDrawing';
import { findWallLabelAt, moveWall } from '../../utils/wallManipulation';

interface CanvasRendererProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  className?: string;
}

export function CanvasRenderer({
  canvasRef: externalCanvasRef,
  className = '',
}: CanvasRendererProps) {
  const walls = useAppStore((state) => state.walls);
  const tileConfig = useAppStore((state) => state.tileConfig);
  const gridConfig = useAppStore((state) => state.gridConfig);
  const units = useAppStore((state) => state.units);
  const updateWall = useAppStore((state) => state.updateWall);
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [wallLabels, setWallLabels] = useState<WallLabel[]>([]);
  const [isDraggingWall, setIsDraggingWall] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  const [draggedWallIndex, setDraggedWallIndex] = useState<number>(-1);
  const [imageLoadCounter, setImageLoadCounter] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT });

  const worldToScreen = useCallback(
    (point: Point): Point => {
      return {
        x: point.x * PIXELS_PER_FOOT + pan.x + CANVAS_WIDTH / 2,
        y: point.y * PIXELS_PER_FOOT + pan.y + CANVAS_HEIGHT / 2,
      };
    },
    [pan]
  );

  const screenToWorld = useCallback(
    (point: Point): Point => {
      return {
        x: (point.x - CANVAS_WIDTH / 2 - pan.x) / PIXELS_PER_FOOT,
        y: (point.y - CANVAS_HEIGHT / 2 - pan.y) / PIXELS_PER_FOOT,
      };
    },
    [pan]
  );

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw fixed background grid for visual reference
    drawGrid(ctx, tileConfig);

    // Now apply transformations for the room content
    ctx.save();

    // Draw room shape
    const vertices = convertWallsToPolygon(walls);
    if (vertices.length > 0) {
      // Draw tiles aligned with fixed grid
      drawTiles(ctx, vertices, tileConfig, worldToScreen, getRoomBounds);

      drawRoomShape(ctx, vertices, worldToScreen);

      // Calculate and draw wall labels
      const labels = calculateWallLabels(vertices);
      setWallLabels(labels);
      drawWallLabels(ctx, labels, units, isDraggingWall, worldToScreen);
    }

    ctx.restore();
  }, [walls, tileConfig, pan, worldToScreen, isDraggingWall, units, imageLoadCounter]);

  const getEventPosition = (event: React.MouseEvent | React.TouchEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return null;

    let clientX: number, clientY: number;

    if ('touches' in event) {
      // Touch event
      const touch = event.touches[0] || event.changedTouches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      // Mouse event
      clientX = event.clientX;
      clientY = event.clientY;
    }

    // Scale coordinates to account for canvas scaling
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    const pos = getEventPosition(event);
    if (!pos) return;

    // Prevent default touch behaviors like scrolling
    if ('touches' in event) {
      event.preventDefault();
    }

    const isShiftClick = 'shiftKey' in event && event.shiftKey;
    const isTwoFingerTouch = 'touches' in event && event.touches.length >= 2;

    if (isShiftClick || isTwoFingerTouch) {
      setIsPanning(true);
      setLastPan(pos);
      return;
    }

    // Check if clicking/touching on a wall label
    const clickedWall = findWallLabelAt(pos, wallLabels, worldToScreen);
    if (clickedWall !== -1) {
      setIsDraggingWall(true);
      setDraggedWallIndex(clickedWall);
      setDragStart(screenToWorld(pos));
    } else {
      setIsDraggingWall(false);
      setDraggedWallIndex(-1);
      setDragStart(null);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    handleStart(event);
  };

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    const pos = getEventPosition(event);
    if (!pos) return;

    // Prevent default touch behaviors like scrolling
    if ('touches' in event) {
      event.preventDefault();
    }

    if (isPanning) {
      const deltaX = pos.x - lastPan.x;
      const deltaY = pos.y - lastPan.y;
      setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPan(pos);
    } else if (isDraggingWall && dragStart && draggedWallIndex !== -1) {
      // Handle wall dragging
      const currentWorldPos = screenToWorld(pos);
      const deltaX = currentWorldPos.x - dragStart.x;
      const deltaY = currentWorldPos.y - dragStart.y;

      // Use the remembered wall index, not the current mouse position
      moveWall(draggedWallIndex, deltaX, deltaY, walls, updateWall);
      setDragStart(currentWorldPos);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    handleMove(event);
  };

  const handleEnd = () => {
    setIsPanning(false);
    setIsDraggingWall(false);
    setDragStart(null);
    setDraggedWallIndex(-1);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    handleStart(event);
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    handleMove(event);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  // Auto-center room to canvas on wall changes
  useEffect(() => {
    const vertices = convertWallsToPolygon(walls);
    if (vertices.length === 0) return;

    const bounds = getRoomBounds(vertices);

    // Center the room
    const roomCenterX = (bounds.minX + bounds.maxX) / 2;
    const roomCenterY = (bounds.minY + bounds.maxY) / 2;
    setPan({
      x: -roomCenterX * PIXELS_PER_FOOT,
      y: -roomCenterY * PIXELS_PER_FOOT,
    });
  }, [walls]);

  // Effect to handle tile image loading
  useEffect(() => {
    if (tileConfig.selectedTile) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setImageLoadCounter(prev => prev + 1);
      };
      img.src = tileConfig.selectedTile.imageUrl;
    }
  }, [tileConfig.selectedTile]);

  // Handle responsive canvas sizing
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const maxWidth = Math.min(containerWidth - 32, CANVAS_WIDTH); // 32px for padding
      const aspectRatio = CANVAS_HEIGHT / CANVAS_WIDTH;
      const newHeight = maxWidth * aspectRatio;

      setCanvasSize({
        width: maxWidth,
        height: Math.min(newHeight, CANVAS_HEIGHT)
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          style={{
            width: canvasSize.width,
            height: canvasSize.height,
            touchAction: 'none' // Prevents default touch behaviors
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="cursor-pointer max-w-full"
        />
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>• <span className="hidden sm:inline">Shift+click and drag to pan the view</span><span className="sm:hidden">Two-finger drag to pan the view</span></p>
        <p>• <span className="hidden sm:inline">Drag</span><span className="sm:hidden">Touch and drag</span> wall labels to resize walls</p>
      </div>
    </div>
  );
}
