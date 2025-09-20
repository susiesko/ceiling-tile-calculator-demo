import { useState, useEffect } from 'react';

export interface FeetInchesInputReturn {
  feet: string;
  inches: string;
  setFeet: (value: string) => void;
  setInches: (value: string) => void;
  handleChange: () => void;
}

export function useFeetInchesInput(
  currentValue: number,
  onValueChange: (value: number) => void
): FeetInchesInputReturn {
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');

  // Convert current value to feet and inches when it changes
  useEffect(() => {
    const totalInches = currentValue * 12;
    const feetPart = Math.floor(totalInches / 12);
    const inchesPart = totalInches % 12;

    setFeet(feetPart.toString());
    setInches(inchesPart.toFixed(1));
  }, [currentValue]);

  const handleChange = () => {
    const feetValue = parseFloat(feet) || 0;
    const inchesValue = parseFloat(inches) || 0;
    const totalFeet = feetValue + (inchesValue / 12);
    onValueChange(totalFeet);
  };

  return {
    feet,
    inches,
    setFeet,
    setInches,
    handleChange
  };
}