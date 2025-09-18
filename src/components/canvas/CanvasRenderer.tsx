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
    ctx.save();

    // Draw grid
    drawGrid(ctx);

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
    const startX = (-pan.x % gridSize + CANVAS_WIDTH / 2) % gridSize;
    const startY = (-pan.y % gridSize + CANVAS_HEIGHT / 2) % gridSize;

    // Draw vertical lines
    for (let x = startX; x < CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = startY; y < CANVAS_HEIGHT; y += gridSize) {
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

      ctx.fillStyle = editingWall === index ? '#fef3c7' : '#ffffff';
      ctx.strokeStyle = editingWall === index ? '#f59e0b' : '#d1d5db';
      ctx.lineWidth = 2;

      ctx.fillRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);
      ctx.strokeRect(labelX - bgWidth / 2, labelY - bgHeight / 2, bgWidth, bgHeight);

      // Draw label text
      ctx.fillStyle = editingWall === index ? '#92400e' : '#374151';
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
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
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
        {editingWall !== null && (
          <button
            onClick={() => setEditingWall(null)}
            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
          >
            Cancel Edit
          </button>
        )}
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