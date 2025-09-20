import {useCallback, useEffect, useRef, useState} from 'react';
import {Point, Shape, TileConfig, Units} from '../../types';
import {convertShapeToPolygon} from '../../utils/geometry';
import {
    drawGrid,
    drawTiles,
    drawRoomShape,
    drawWallLabels,
    calculateWallLabels,
    getRoomBounds,
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    PIXELS_PER_FOOT,
    WallLabel
} from '../../utils/canvasDrawing';
import {
    findWallLabelAt,
    moveWall
} from '../../utils/wallManipulation';

interface CanvasRendererProps {
    shape: Shape;
    tileConfig: TileConfig;
    units: Units;
    onShapeChange: (shape: Shape) => void;
    canvasRef?: React.RefObject<HTMLCanvasElement>;
    className?: string;
}


export function CanvasRenderer({
    shape,
    tileConfig,
    units,
    onShapeChange,
    canvasRef: externalCanvasRef,
    className = ''
}: CanvasRendererProps) {
    const internalCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = externalCanvasRef || internalCanvasRef;
    const [pan, setPan] = useState({x: 0, y: 0});
    const [lastPan, setLastPan] = useState({x: 0, y: 0});
    const [isPanning, setIsPanning] = useState(false);
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


    const render = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw grid FIRST, without any transformations
        drawGrid(ctx, tileConfig);

        // Now apply transformations for the room content
        ctx.save();

        // Draw room shape
        const vertices = convertShapeToPolygon(shape);
        if (vertices.length > 0) {
            // Draw tiles
            drawTiles(ctx, vertices, tileConfig, worldToScreen, getRoomBounds);

            drawRoomShape(ctx, vertices, worldToScreen);

            // Calculate and draw wall labels
            const labels = calculateWallLabels(vertices);
            setWallLabels(labels);
            drawWallLabels(ctx, labels, units, isDraggingWall, worldToScreen);
        }

        ctx.restore();
    }, [shape, tileConfig, pan, worldToScreen, isDraggingWall, units]);


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
        const clickedWall = findWallLabelAt(mousePos, wallLabels, worldToScreen);
        if (clickedWall !== -1) {
            setIsDraggingWall(true);
            setDragStart(screenToWorld(mousePos));
        } else {
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
            setPan(prev => ({x: prev.x + deltaX, y: prev.y + deltaY}));
            setLastPan(mousePos);
        } else if (isDraggingWall && dragStart) {
            // Handle wall dragging
            const currentWorldPos = screenToWorld(mousePos);
            const deltaX = currentWorldPos.x - dragStart.x;
            const deltaY = currentWorldPos.y - dragStart.y;

            const clickedWall = findWallLabelAt(mousePos, wallLabels, worldToScreen);
            if (clickedWall !== -1) {
                moveWall(clickedWall, deltaX, deltaY, shape, onShapeChange);
            }
            setDragStart(currentWorldPos);
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        setIsDraggingWall(false);
        setDragStart(null);
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
                <p>• Shift+click and drag to pan the view</p>
            </div>

        </div>
    );
}