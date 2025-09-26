import {Shape} from '../types';
import {convertShapeToPolygon} from './geometry';

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export function validateShape(shape: Shape): ValidationResult {
    const result: ValidationResult = {
        isValid: true,
        errors: [],
        warnings: []
    };

    const unitLabel = 'feet';
    const minDimension = 0.5; // 0.5 ft

    switch (shape.type) {
        case 'rectangle':
            if (shape.width <= 0) {
                result.errors.push('Width must be greater than 0');
                result.isValid = false;
            }
            if (shape.height <= 0) {
                result.errors.push('Height must be greater than 0');
                result.isValid = false;
            }
            if (shape.width < minDimension) {
                result.warnings.push(`Width is very small (minimum recommended: ${minDimension} ${unitLabel})`);
            }
            if (shape.height < minDimension) {
                result.warnings.push(`Height is very small (minimum recommended: ${minDimension} ${unitLabel})`);
            }
            break;

        case 'l-shape':
            if (shape.width1 <= 0 || shape.width2 <= 0) {
                result.errors.push('All widths must be greater than 0');
                result.isValid = false;
            }
            if (shape.height1 <= 0 || shape.height2 <= 0) {
                result.errors.push('All heights must be greater than 0');
                result.isValid = false;
            }
            break;

    }

    // Check if room is too large
    const vertices = convertShapeToPolygon(shape);
    if (vertices.length > 0) {
        const bounds = getBounds(vertices);
        const area = Math.abs(bounds.maxX - bounds.minX) * Math.abs(bounds.maxY - bounds.minY);
        const maxArea = 2000; // 2000 sq ft

        if (area > maxArea) {
            result.warnings.push(`Room area is very large (${area.toFixed(1)} sq ft). Performance may be affected.`);
        }
    }

    return result;
}

function getBounds(vertices: { x: number; y: number }[]): { minX: number; maxX: number; minY: number; maxY: number } {
    if (vertices.length === 0) {
        return {minX: 0, maxX: 0, minY: 0, maxY: 0};
    }

    let minX = vertices[0].x;
    let maxX = vertices[0].x;
    let minY = vertices[0].y;
    let maxY = vertices[0].y;

    for (const vertex of vertices) {
        minX = Math.min(minX, vertex.x);
        maxX = Math.max(maxX, vertex.x);
        minY = Math.min(minY, vertex.y);
        maxY = Math.max(maxY, vertex.y);
    }

    return {minX, maxX, minY, maxY};
}