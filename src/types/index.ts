export interface Point {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export type Units = 'feet';

export type TileSize = '2x2' | '2x4';

export enum TileOrientation {
  Horizontal = 0,
  Vertical = 90,
}

export type ShapeType = 'rectangle' | 'l-shape';

export interface RectangleShape {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface LShape {
  type: 'l-shape';
  width1: number;
  height1: number;
  width2: number;
  height2: number;
}

export type Shape = RectangleShape | LShape;


export interface TileConfig {
  size: TileSize;
  orientation: TileOrientation;
}

export interface GridConfig {
  origin: 'top-left' | 'center';
  offsetX: number;
  offsetY: number;
  snapGrid: number;
}

export interface CalculationResult {
  totalTiles: number;
  fullTiles: number;
  partialTiles: number;
  estimatedTotal: number;
  area: number;
  tileArea: number;
  wasteFactor: number;
  costEstimate?: number;
}

export interface AppState {
  units: Units;
  shape: Shape;
  tileConfig: TileConfig;
  gridConfig: GridConfig;
  calculation: CalculationResult;
  pricePerTile?: number;
}

