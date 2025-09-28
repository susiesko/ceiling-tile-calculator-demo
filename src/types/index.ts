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

export interface TileDefinition {
  id: string;
  name: string;
  description: string;
  width: number; // width in inches
  height: number; // height in inches
  imageUrl: string;
  category: string;
}

export type ShapeType = 'rectangle' | 'l-shape';

export interface Wall {
  name: string; // A, B, C, etc.
  lengthInches: number; // Length in inches for precision
  orientation: 'horizontal' | 'vertical';
  wallIndex: number; // Index in the wall array for ordering
}

export interface TileConfig {
  size: TileSize;
  orientation: TileOrientation;
  selectedTile?: TileDefinition;
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
}

export interface AppState {
  units: Units;
  walls: Wall[]; // Array of wall objects
  tileConfig: TileConfig;
  gridConfig: GridConfig;
  calculation: CalculationResult;
}
