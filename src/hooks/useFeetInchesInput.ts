import { useState, useEffect, useCallback, useRef } from 'react';

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
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingFromProp = useRef(false);

  // Convert current value to feet and inches when it changes
  useEffect(() => {
    isUpdatingFromProp.current = true;
    const totalInches = currentValue * 12;
    const feetPart = Math.floor(totalInches / 12);
    const inchesPart = totalInches % 12;

    setFeet(feetPart.toString());
    setInches(inchesPart.toFixed(1));
    isUpdatingFromProp.current = false;
  }, [currentValue]);

  const calculateAndUpdate = useCallback(() => {
    const feetValue = parseFloat(feet) || 0;
    const inchesValue = parseFloat(inches) || 0;
    const totalFeet = feetValue + (inchesValue / 12);
    onValueChange(totalFeet);
  }, [feet, inches, onValueChange]);

  const handleChange = () => {
    calculateAndUpdate();
  };

  const debouncedUpdate = useCallback(() => {
    if (isUpdatingFromProp.current) return;

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout for 1 second
    debounceTimeoutRef.current = setTimeout(() => {
      calculateAndUpdate();
    }, 1000);
  }, [calculateAndUpdate]);

  const setFeetWithDebounce = useCallback((value: string) => {
    setFeet(value);
    debouncedUpdate();
  }, [debouncedUpdate]);

  const setInchesWithDebounce = useCallback((value: string) => {
    setInches(value);
    debouncedUpdate();
  }, [debouncedUpdate]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return {
    feet,
    inches,
    setFeet: setFeetWithDebounce,
    setInches: setInchesWithDebounce,
    handleChange
  };
}