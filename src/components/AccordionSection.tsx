import React from 'react';

interface AccordionSectionProps {
  title: string;
  stepNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isDisabled?: boolean;
  isActive?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  showBackButton?: boolean;
  showNextButton?: boolean;
}

export function AccordionSection({
  title,
  stepNumber,
  isOpen,
  onToggle,
  children,
  isDisabled = false,
  isActive = false,
  onPrevious,
  onNext,
  showBackButton = false,
  showNextButton = false,
}: AccordionSectionProps) {
  return (
    <div className={`border rounded-lg overflow-hidden ${
      isActive
        ? 'border-blue-500 bg-blue-50/30 shadow-md'
        : 'border-gray-200'
    }`}>
      <button
        onClick={onToggle}
        disabled={isDisabled}
        className={`w-full px-6 py-4 text-left transition-colors duration-200 flex items-center justify-between ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed bg-gray-100'
            : isActive
              ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer'
              : 'bg-white hover:bg-gray-50 cursor-pointer'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              isDisabled
                ? 'bg-gray-200 text-gray-400'
                : isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : isOpen
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600'
            }`}
          >
            {stepNumber}
          </div>
          <h3 className={`text-lg font-semibold ${isDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="bg-gray-50 border-t border-gray-200">
          <div className="px-6 py-4">{children}</div>
          {(showBackButton || showNextButton) && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
              <div>
                {showBackButton && (
                  <button
                    onClick={onPrevious}
                    className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Back</span>
                  </button>
                )}
              </div>
              <div>
                {showNextButton && (
                  <button
                    onClick={onNext}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>Next</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
