export function formatFeetInches(totalFeet: number): string {
  const feet = Math.floor(totalFeet);
  const inches = Math.round((totalFeet - feet) * 12);

  if (inches >= 12) {
    return `${feet + Math.floor(inches / 12)}'`;
  } else if (inches === 0) {
    return `${feet}'`;
  } else {
    return `${feet}' ${inches}"`;
  }
}

export function parseFeetInches(input: string): number {
  // Handle formats like "10' 6"", "10'", "10.5", "10 ft 6 in"
  const cleaned = input.trim();

  // Try to match feet and inches pattern first (most specific)
  const feetInchesMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*(?:ft|feet|')?\s+(\d+(?:\.\d+)?)\s*(?:in|inches|")?$/i);
  if (feetInchesMatch) {
    const feet = parseFloat(feetInchesMatch[1]);
    const inches = parseFloat(feetInchesMatch[2]);
    return feet + inches / 12;
  }

  // Try to match just feet with unit indicators
  const feetMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*(?:ft|feet|')(?:\s*\w+)?$/i);
  if (feetMatch) {
    return parseFloat(feetMatch[1]);
  }

  // Try to match just inches with unit indicators
  const inchesMatch = cleaned.match(/^(\d+(?:\.\d+)?)\s*(?:in|inches|")$/i);
  if (inchesMatch) {
    return parseFloat(inchesMatch[1]) / 12;
  }

  // Default to parsing as decimal feet (no units)
  const numberMatch = cleaned.match(/^(\d+(?:\.\d+)?)$/);
  if (numberMatch) {
    return parseFloat(numberMatch[1]);
  }

  return 0;
}