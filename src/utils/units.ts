import Decimal from 'decimal.js';

function roundToNearestHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function formatFeetInches(totalFeet: number): string {
  const feet = Math.floor(totalFeet);
  const exactInches = new Decimal(totalFeet).minus(feet).times(12).toNumber();
  const inches = roundToNearestHalf(exactInches);

  if (inches >= 12) {
    return `${feet + Math.floor(inches / 12)}'`;
  } else if (inches === 0) {
    return `${feet}'`;
  } else {
    const inchesDisplay = inches % 1 === 0 ? inches.toString() : inches.toFixed(1);
    return `${feet}' ${inchesDisplay}"`;
  }
}

export function parseFeetInches(input: string): number {
  // Handle formats like "10' 6"", "10'", "10.5", "10 ft 6 in"
  const cleaned = input.trim();

  // Try to match feet and inches pattern first (most specific)
  const feetInchesMatch = cleaned.match(
    /^(\d+(?:\.\d+)?)\s*(?:ft|feet|')?\s+(\d+(?:\.\d+)?)\s*(?:in|inches|")?$/i
  );
  if (feetInchesMatch) {
    const feet = parseFloat(feetInchesMatch[1]);
    const inches = parseFloat(feetInchesMatch[2]);
    return new Decimal(feet).plus(new Decimal(inches).dividedBy(12)).toNumber();
  }

  // Try to match just feet with unit indicators
  const feetMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*(?:ft|feet|')(?:\s*\w+)?$/i);
  if (feetMatch) {
    return parseFloat(feetMatch[1]);
  }

  // Try to match just inches with unit indicators
  const inchesMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*(?:in|inches|")$/i);
  if (inchesMatch) {
    return new Decimal(parseFloat(inchesMatch[1])).dividedBy(12).toNumber();
  }

  // Default to parsing as decimal feet (no units)
  const numberMatch = cleaned.match(/^(\d+(?:\.\d+)?)$/);
  if (numberMatch) {
    return parseFloat(numberMatch[1]);
  }

  return 0;
}
