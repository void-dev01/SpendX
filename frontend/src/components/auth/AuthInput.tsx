import React, { forwardRef } from 'react';
import { LucideIcon, AlertCircle } from 'lucide-react';

export interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: LucideIcon;
  error?: string;
  helperText?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ id, label, icon: Icon, error, helperText, disabled, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1 w-full text-left">
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold text-secondary-text tracking-wide"
        >
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Icon className="w-4 h-4" />
            </div>
          )}

          <input
            id={id}
            ref={ref}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
            className={`w-full h-10 sm:h-10.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 outline-none ${
              Icon ? 'pl-10 pr-3.5' : 'px-3.5'
            } ${
              error
                ? 'border-destructive bg-destructive/5 focus:ring-1 focus:ring-destructive/30'
                : 'border-border bg-surface-elevated focus:border-border focus:ring-0'
            } border shadow-xs text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />
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

AuthInput.displayName = 'AuthInput';
