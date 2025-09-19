import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Point, Shape, TileConfig, GridConfig, Units } from '../../types';
import { convertShapeToPolygon } from '../../utils/geometry';
import { formatFeetInches } from '../../utils/units';
import { WallEditor } from './WallEditor';

interface CanvasRendererProps {
  shape: Shape;
  tileConfig: TileConfig;
  gridConfig: GridConfig;
  units: Units;
  onShapeChange: (shape: Shape) => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  className?: string;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PIXELS_PER_FOOT = 40; // Much larger scale for better visibility

interface WallLabel {
  midpoint: Point;
  length: number;
  angle: number;
  wallIndex: number;
}

export function CanvasRenderer({
  shape,
  tileConfig,
  gridConfig,
  units,
  onShapeChange,
  canvasRef: externalCanvasRef,
  className = ''
}: CanvasRendererProps) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [editingWall, setEditingWall] = useState<number | null>(null);
  const [wallLabels, setWallLabels] = useState<WallLabel[]>([]);
  const [isDraggingWall, setIsDraggingWall] = useState(false);
  const [dragStart, setDragStart] = useState<Point | null>(null);

  const worldToScreen = useCallback((point: Point): Point => {
    return {
      x: (point.x * PIXELS_PER_FOOT + pan.x) + CANVAS_WIDTH / 2,
      y: (point.y * PIXELS_PER_FOOT + pan.y) + CANVAS_HEIGHT / 2
    };
  }, [pan]);

  const screenToWorld = useCallback((point: Point): Point => {
    return {
      x: (point.x - CANVAS_WIDTH / 2 - pan.x) / PIXELS_PER_FOOT,
      y: (point.y - CANVAS_HEIGHT / 2 - pan.y) / PIXELS_PER_FOOT
    };
  }, [pan]);

  const calculateWallLabels = useCallback((vertices: Point[]): WallLabel[] => {
    const labels: WallLabel[] = [];

    for (let i = 0; i < vertices.length; i++) {
      const current = vertices[i];
      const next = vertices[(i + 1) % vertices.length];

      const midpoint: Point = {
        x: (current.x + next.x) / 2,
        y: (current.y + next.y) / 2
      };

      const length = Math.sqrt(
        Math.pow(next.x - current.x, 2) + Math.pow(next.y - current.y, 2)
      );

      const angle = Math.atan2(next.y - current.y, next.x - current.x);

      labels.push({
        midpoint,
        length,
        angle,
        wallIndex: i
      });
    }

    return labels;
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid FIRST, without any transformations
    drawGrid(ctx);

    // Now apply transformations for the room content
    ctx.save();

    // Draw tiles
    drawTiles(ctx);

    // Draw room shape
    const vertices = convertShapeToPolygon(shape);
    if (vertices.length > 0) {
      drawRoomShape(ctx, vertices);

      // Calculate and draw wall labels
      const labels = calculateWallLabels(vertices);
      setWallLabels(labels);
      drawWallLabels(ctx, labels);
    }

    ctx.restore();
  }, [shape, tileConfig, pan, calculateWallLabels]);

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;

    const gridSize = PIXELS_PER_FOOT; // 1 foot grid

    // Draw vertical lines - completely fixed grid
    for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Draw horizontal lines - completely fixed grid
    for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
  };

  const drawTiles = (ctx: CanvasRenderingContext2D) => {
    const vertices = convertShapeToPolygon(shape);
    if (vertices.length === 0) return;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    const tileSize = tileConfig.size === '2x2' ? 2 : (tileConfig.orientation === 0 ? { w: 2, h: 4 } : { w: 4, h: 2 });
    const tileSizePixels = {
      width: (typeof tileSize === 'number' ? tileSize : tileSize.w) * PIXELS_PER_FOOT,
      height: (typeof tileSize === 'number' ? tileSize : tileSize.h) * PIXELS_PER_FOOT
    };

    // Get room bounds
    const bounds = getRoomBounds(vertices);
    const topLeft = worldToScreen({ x: bounds.minX, y: bounds.minY });
    const bottomRight = worldToScreen({ x: bounds.maxX, y: bounds.maxY });

    // Draw tile grid within room bounds
    for (let x = topLeft.x; x < bottomRight.x; x += tileSizePixels.width) {
      for (let y = topLeft.y; y < bottomRight.y; y += tileSizePixels.height) {
        ctx.strokeRect(x, y, tileSizePixels.width, tileSizePixels.height);
      }
    }
  };

  const drawRoomShape = (ctx: CanvasRenderingContext2D, vertices: Point[]) => {
    if (vertices.length < 3) return;

    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;

    ctx.beginPath();
    const firstPoint = worldToScreen(vertices[0]);
    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < vertices.length; i++) {
      const point = worldToScreen(vertices[i]);
      ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const drawWallLabels = (ctx: CanvasRenderingContext2D, labels: WallLabel[]) => {
    ctx.fillStyle = '#374151';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.font = '14px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    labels.forEach((label, index) => {
      const screenPos = worldToScreen(label.midpoint);
      const labelText = units === 'feet' ? formatFeetInches(label.length) : `${label.length.toFixed(1)}m`;

      // Offset label from wall
      const offsetDistance = 25;
      const normalAngle = label.angle + Math.PI / 2;
      const offsetX = Math.cos(normalAngle) * offsetDistance;
      const offsetY = Math.sin(normalAngle) * offsetDistance;

      const labelX = screenPos.x + offsetX;
      const labelY = screenPos.y + offsetY;

      // Draw label background
      const metrics = ctx.measureText(labelText);
      const padding = 8;
      const bgWidth = metrics.width + padding * 2;
      const bgHeight = 24;

      const isActive = editingWall === index;
      const isDragging = isActive && isDraggingWall;

      ctx.fillStyle = isDragging ? '#dcfce7' : (isActive ? '#fef3c7' : '#ffffff');
      ctx.strokeStyle = isDragging ? '#16a34a' : (isActive ? '#f59e0b' : '#d1d5db');
      ctx.lineWidth = isDragging ? 3 : 2;

      ctx.fillRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);
      ctx.strokeRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);

      // Draw label text
      ctx.fillStyle = isDragging ? '#166534' : (isActive ? '#92400e' : '#374151');
      ctx.fillText(labelText, labelX, labelY);
    });
  };


  const getRoomBounds = (vertices: Point[]) => {
    let minX = vertices[0].x, maxX = vertices[0].x;
    let minY = vertices[0].y, maxY = vertices[0].y;

    for (const vertex of vertices) {
      minX = Math.min(minX, vertex.x);
      maxX = Math.max(maxX, vertex.x);
      minY = Math.min(minY, vertex.y);
      maxY = Math.max(maxY, vertex.y);
    }

    return { minX, maxX, minY, maxY };
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    if (event.shiftKey) {
      setIsPanning(true);
      setLastPan(mousePos);
      return;
    }

    // Check if clicking on a wall label
    const clickedWall = findWallLabelAt(mousePos);
    if (clickedWall !== -1) {
      setEditingWall(clickedWall);
      setIsDraggingWall(true);
      setDragStart(screenToWorld(mousePos));
    } else {
      // Clicking elsewhere cancels edit mode
      setEditingWall(null);
      setIsDraggingWall(false);
      setDragStart(null);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mousePos = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    if (isPanning) {
      const deltaX = mousePos.x - lastPan.x;
      const deltaY = mousePos.y - lastPan.y;
      setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
      setLastPan(mousePos);
    } else if (isDraggingWall && editingWall !== null && dragStart) {
      // Handle wall dragging
      const currentWorldPos = screenToWorld(mousePos);
      const deltaX = currentWorldPos.x - dragStart.x;
      const deltaY = currentWorldPos.y - dragStart.y;

      moveWall(editingWall, deltaX, deltaY);
      setDragStart(currentWorldPos);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setIsDraggingWall(false);
    setDragStart(null);
  };


  const findWallLabelAt = (screenPos: Point): number => {
    for (let i = 0; i < wallLabels.length; i++) {
      const label = wallLabels[i];
      const labelScreenPos = worldToScreen(label.midpoint);

      const offsetDistance = 25;
      const normalAngle = label.angle + Math.PI / 2;
      const offsetX = Math.cos(normalAngle) * offsetDistance;
      const offsetY = Math.sin(normalAngle) * offsetDistance;

      const labelX = labelScreenPos.x + offsetX;
      const labelY = labelScreenPos.y + offsetY;

      const distance = Math.sqrt(
        Math.pow(screenPos.x - labelX, 2) + Math.pow(screenPos.y - labelY, 2)
      );

      if (distance <= 30) {
        return i;
      }
    }
    return -1;
  };

  const isWallVertical = (wallIndex: number): boolean => {
    const vertices = convertShapeToPolygon(shape);
    if (vertices.length === 0) return false;

    const current = vertices[wallIndex];
    const next = vertices[(wallIndex + 1) % vertices.length];

    // Check if the wall is more vertical than horizontal
    const deltaX = Math.abs(next.x - current.x);
    const deltaY = Math.abs(next.y - current.y);

    return deltaY > deltaX;
  };

  const updateLShapeFromVertices = (vertices: Point[]) => {
    if (vertices.length !== 6) return;

    // L-shape vertices:
    // 0: (0, 0) - bottom left
    // 1: (width1, 0) - bottom right of first section
    // 2: (width1, height1) - top right of first section
    // 3: (width1 + width2, height1) - bottom right of second section
    // 4: (width1 + width2, height1 + height2) - top right of second section
    // 5: (0, height1 + height2) - top left

    const bottomLeft = vertices[0];
    const bottomRight1 = vertices[1];
    const topRight1 = vertices[2];
    const bottomRight2 = vertices[3];
    const topRight2 = vertices[4];
    const topLeft = vertices[5];

    // Calculate L-shape parameters from vertices
    const width1 = bottomRight1.x - bottomLeft.x;
    const height1 = topRight1.y - bottomRight1.y;
    const width2 = bottomRight2.x - bottomRight1.x;
    const height2 = topRight2.y - topRight1.y;

    // Ensure positive dimensions
    if (width1 > 0 && height1 > 0 && width2 > 0 && height2 > 0) {
      const newShape = {
        type: 'l-shape' as const,
        width1: Math.abs(width1),
        height1: Math.abs(height1),
        width2: Math.abs(width2),
        height2: Math.abs(height2)
      };
      onShapeChange(newShape);
    }
  };

  const moveWall = (wallIndex: number, deltaX: number, deltaY: number) => {
    if (shape.type === 'rectangle') {
      moveRectangleWall(wallIndex, deltaX, deltaY);
    } else if (shape.type === 'l-shape') {
      moveLShapeWall(wallIndex, deltaX, deltaY);
    }
  };

  const moveRectangleWall = (wallIndex: number, deltaX: number, deltaY: number) => {
    const vertices = convertShapeToPolygon(shape);
    if (vertices.length === 0) return;

    const isVertical = isWallVertical(wallIndex);
    const newVertices = [...vertices];

    if (isVertical) {
      // For vertical walls, only allow horizontal movement
      const current = vertices[wallIndex];
      const next = vertices[(wallIndex + 1) % vertices.length];

      newVertices[wallIndex] = { ...current, x: current.x + deltaX };
      newVertices[(wallIndex + 1) % vertices.length] = { ...next, x: next.x + deltaX };
    } else {
      // For horizontal walls, only allow vertical movement
      const current = vertices[wallIndex];
      const next = vertices[(wallIndex + 1) % vertices.length];

      newVertices[wallIndex] = { ...current, y: current.y + deltaY };
      newVertices[(wallIndex + 1) % vertices.length] = { ...next, y: next.y + deltaY };
    }

    const bounds = getRoomBounds(newVertices);
    const newShape = {
      type: 'rectangle' as const,
      width: bounds.maxX - bounds.minX,
      height: bounds.maxY - bounds.minY
    };
    onShapeChange(newShape);
  };

  const moveLShapeWall = (wallIndex: number, deltaX: number, deltaY: number) => {
    if (shape.type !== 'l-shape') return;

    const isVertical = isWallVertical(wallIndex);
    const currentShape = shape;
    let newShape = { ...currentShape };

    // L-shape wall mapping (based on lShapeToPolygon):
    // Wall 0: bottom edge of first section (0,0) -> (width1,0)
    // Wall 1: right edge of first section (width1,0) -> (width1,height1)
    // Wall 2: bottom edge of second section (width1,height1) -> (width1+width2,height1)
    // Wall 3: right edge of second section (width1+width2,height1) -> (width1+width2,height1+height2)
    // Wall 4: top edge (width1+width2,height1+height2) -> (0,height1+height2)
    // Wall 5: left edge (0,height1+height2) -> (0,0)

    switch (wallIndex) {
      case 0: // Bottom edge of first section - move horizontally affects width1
        if (!isVertical && deltaY !== 0) {
          // Can't move this wall vertically as it would break L-shape
          return;
        }
        if (isVertical && deltaX !== 0) {
          newShape.width1 = Math.max(0.5, currentShape.width1 + deltaX);
        }
        break;

      case 1: // Right edge of first section - move vertically affects height1
        if (isVertical && deltaX !== 0) {
          newShape.width1 = Math.max(0.5, currentShape.width1 + deltaX);
        }
        if (!isVertical && deltaY !== 0) {
          newShape.height1 = Math.max(0.5, currentShape.height1 + deltaY);
        }
        break;

      case 2: // Bottom edge of second section - move horizontally affects width2
        if (!isVertical && deltaY !== 0) {
          newShape.height1 = Math.max(0.5, currentShape.height1 + deltaY);
        }
        if (isVertical && deltaX !== 0) {
          newShape.width2 = Math.max(0.5, currentShape.width2 + deltaX);
        }
        break;

      case 3: // Right edge of second section - move vertically affects height2
        if (isVertical && deltaX !== 0) {
          newShape.width2 = Math.max(0.5, currentShape.width2 + deltaX);
        }
        if (!isVertical && deltaY !== 0) {
          newShape.height2 = Math.max(0.5, currentShape.height2 + deltaY);
        }
        break;

      case 4: // Top edge - move vertically affects both heights
        if (!isVertical && deltaY !== 0) {
          newShape.height2 = Math.max(0.5, currentShape.height2 + deltaY);
        }
        break;

      case 5: // Left edge - move horizontally would break L-shape
        if (!isVertical && deltaY !== 0) {
          newShape.height2 = Math.max(0.5, currentShape.height2 + deltaY);
        }
        break;
    }

    onShapeChange(newShape);
  };

  // Auto-center room to canvas on shape change
  useEffect(() => {
    const vertices = convertShapeToPolygon(shape);
    if (vertices.length === 0) return;

    const bounds = getRoomBounds(vertices);

    // Center the room
    const roomCenterX = (bounds.minX + bounds.maxX) / 2;
    const roomCenterY = (bounds.minY + bounds.maxY) / 2;
    setPan({
      x: -roomCenterX * PIXELS_PER_FOOT,
      y: -roomCenterY * PIXELS_PER_FOOT
    });
  }, [shape]);

  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            Scale: 1 ft = {PIXELS_PER_FOOT} pixels
          </span>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="cursor-pointer"
        />
      </div>

      <div className="text-sm text-gray-600 space-y-1">
        <p>• Click on wall length labels to edit dimensions</p>
        <p>• Shift+click and drag to pan the view</p>
      </div>

      {/* Wall Editor Modal */}
      {editingWall !== null && wallLabels[editingWall] && (
        <WallEditor
          wallIndex={editingWall}
          currentLength={wallLabels[editingWall].length}
          shape={shape}
          units={units}
          onShapeChange={onShapeChange}
          onClose={() => setEditingWall(null)}
        />
      )}
    </div>
  );
}