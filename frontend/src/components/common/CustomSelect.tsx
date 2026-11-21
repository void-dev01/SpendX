import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
  description?: string;
}

interface CustomSelectProps {
  id?: string;
  name?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  name,
  label,
  value: controlledValue,
  defaultValue,
  onChange,
  options,
  placeholder = 'Select option...',
  error,
  disabled = false,
  className = '',
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue || (typeof options[0] === 'string' ? options[0] : options[0]?.value) || ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  const normalizedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === currentValue);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    if (!isControlled) {
      setInternalValue(val);
    }
    onChange?.(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block font-medium text-foreground text-xs mb-1"
        >
          {label}
        </label>
      )}

      {/* Hidden input for form registration / submission */}
      {name && <input type="hidden" name={name} value={currentValue || ''} />}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        data-testid={id ? `${id}-trigger` : 'custom-select-trigger'}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full px-3 py-2.5 rounded-xl bg-surface-elevated border ${
          error ? 'border-destructive' : 'border-border'
        } text-foreground text-xs flex items-center justify-between gap-2 shadow-xs hover:border-primary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <span className="truncate font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-secondary-text shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Floating In-DOM Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-surface-elevated border border-border shadow-elevated p-1 max-h-56 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150"
        >
          {normalizedOptions.map((opt) => {
            const isSelected = opt.value === currentValue;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                data-value={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-primary/15 text-primary font-bold'
                    : 'text-foreground hover:bg-surface-subtle dark:hover:bg-[#242C23]'
                }`}
              >
                <div className="flex flex-col min-w-0">
                  <span className="truncate">{opt.label}</span>
                  {opt.description && (
                    <span className="text-[10px] text-secondary-text truncate">
                      {opt.description}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </div>
            );
          })}
        </div>
      )}

      {error && <p className="text-[11px] text-destructive mt-1">{error}</p>}
    </div>
  );
};
