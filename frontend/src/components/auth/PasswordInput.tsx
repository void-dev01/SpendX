import React, { useState, forwardRef } from 'react';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, label, error, helperText, disabled, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1 w-full text-left">
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold text-secondary-text tracking-wide"
        >
          {label}
        </label>

        <div className="relative">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Lock className="w-4 h-4" />
          </div>

          <input
            id={id}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={`w-full h-10 sm:h-10.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 outline-none pl-10 pr-10 ${
              error
                ? 'border-destructive bg-destructive/5 focus:ring-1 focus:ring-destructive/30'
                : 'border-border bg-surface-elevated focus:border-border focus:ring-0'
            } border shadow-xs text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          <button
            type="button"
            tabIndex={0}
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error ? (
          <p
            id={`${id}-error`}
            role="alert"
            className="flex items-center gap-1.5 text-xs text-destructive font-medium pt-0.5"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p id={`${id}-helper`} className="text-xs text-muted-foreground pt-0.5">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
