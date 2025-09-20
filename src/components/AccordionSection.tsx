import React from 'react';

interface AccordionSectionProps {
  title: string;
  stepNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isDisabled?: boolean;
}

export function AccordionSection({
  title,
  stepNumber,
  isOpen,
  onToggle,
  children,
  isDisabled = false
}: AccordionSectionProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        disabled={isDisabled}
        className={`w-full px-6 py-4 text-left bg-white hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            isDisabled
              ? 'bg-gray-200 text-gray-400'
              : isOpen
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
          }`}>
            {stepNumber}
          </div>
          <h3 className={`text-lg font-semibold ${
            isDisabled ? 'text-gray-400' : 'text-gray-800'
          }`}>
            {title}
          </h3>
        </div>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          } ${isDisabled ? 'text-gray-400' : 'text-gray-600'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
}