import {useCallback, useEffect, useRef, useState} from 'react';
import Decimal from 'decimal.js';

function roundToNearestHalf(value: number): number {
    return Math.round(value * 2) / 2;
}

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
    const isUserTyping = useRef(false);
    const lastProcessedValue = useRef<number | null>(null);

    // Convert current value to feet and inches when it changes
    useEffect(() => {
        // Don't update inputs if user is actively typing
        if (isUserTyping.current) return;

        // Don't update if this is very close to the last value we set (within floating point precision)
        if (lastProcessedValue.current !== null && Math.abs(lastProcessedValue.current - currentValue) < 0.0001) return;

        isUpdatingFromProp.current = true;
        const totalInches = new Decimal(currentValue).times(12);
        const feetPart = totalInches.dividedBy(12).floor().toNumber();
        const exactInchesPart = totalInches.modulo(12).toNumber();

        // Round the inches part when displaying from external updates
        const roundedInchesPart = roundToNearestHalf(exactInchesPart);

        setFeet(() => feetPart.toString());
        setInches(() => roundedInchesPart % 1 === 0 ? roundedInchesPart.toString() : roundedInchesPart.toFixed(1));
        isUpdatingFromProp.current = false;
    }, [currentValue]);


    const handleChange = useCallback(() => {
        console.log('HANDLE CHANGE RUNNING');
        // Round the inches value to nearest half
        const inchesValue = parseFloat(inches) || 0;
        const roundedInches = roundToNearestHalf(inchesValue);

        console.log('HANDLE CHANGE: inchesValue:', inchesValue, '→ rounded:', roundedInches);

        // Update display with rounded value
        const displayInches = roundedInches % 1 === 0 ? roundedInches.toString() : roundedInches.toFixed(1);
        setInches(displayInches);

        isUserTyping.current = false; // User finished typing

        // Calculate with rounded value using high precision
        const feetValue = parseFloat(feet) || 0;
        const totalFeet = new Decimal(feetValue).plus(new Decimal(roundedInches).dividedBy(12)).toNumber();

        lastProcessedValue.current = totalFeet;
        onValueChange(totalFeet);
    }, [feet, inches, onValueChange]);

    const debouncedUpdate = useCallback(() => {
        if (isUpdatingFromProp.current) return;

        // Clear existing timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout for 1 second
        debounceTimeoutRef.current = setTimeout(() => {
            // Round the inches value when debounce fires
            const inchesValue = parseFloat(inches) || 0;
            const roundedInches = roundToNearestHalf(inchesValue);

            // Update display with rounded value
            const displayInches = roundedInches % 1 === 0 ? roundedInches.toString() : roundedInches.toFixed(1);
            setInches(displayInches);

            isUserTyping.current = false; // User stopped typing

            // Calculate with rounded value (use roundedInches, not current state)
            const feetValue = parseFloat(feet) || 0;
            const totalFeet = new Decimal(feetValue).plus(new Decimal(roundedInches).dividedBy(12)).toNumber();

            lastProcessedValue.current = totalFeet;
            onValueChange(totalFeet);
        }, 1000);
    }, [feet, inches, onValueChange]);

    const setFeetWithDebounce = useCallback((value: string) => {
        console.log('setFeetWithDebounce called with', value);
        isUserTyping.current = true;
        setFeet(value);
        debouncedUpdate();
    }, [debouncedUpdate]);

    const setInchesWithDebounce = useCallback((value: string) => {
        console.log('setInchesWithDebounce called with', value);
        isUserTyping.current = true;
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