import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({
  password = '',
}) => {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  const passedCount = [hasMinLength, hasUppercase, hasLowercase, hasNumber].filter(Boolean).length;

  // Strength computation
  let strengthLabel = 'Too Weak';
  let barColor = 'bg-red-500';
  let barWidth = 'w-1/4';

  if (passedCount === 4) {
    strengthLabel = 'Strong';
    barColor = 'bg-emerald-500';
    barWidth = 'w-full';
  } else if (passedCount === 3) {
    strengthLabel = 'Good';
    barColor = 'bg-primary';
    barWidth = 'w-3/4';
  } else if (passedCount === 2) {
    strengthLabel = 'Fair';
    barColor = 'bg-amber-500';
    barWidth = 'w-1/2';
  }

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-2 pt-1">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[11px] font-semibold">
          <span className="text-muted-foreground">Password Strength</span>
          <span className={passedCount === 4 ? 'text-emerald-500' : 'text-muted-foreground'}>
            {strengthLabel}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-300 ${barColor} ${barWidth}`} />
        </div>
      </div>

      {/* Requirement Checklist */}
      <div className="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
        <div
          className={`flex items-center gap-1.5 ${
            hasMinLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'
          }`}
        >
          {hasMinLength ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0 opacity-50" />}
          <span>8+ characters</span>
        </div>

        <div
          className={`flex items-center gap-1.5 ${
            hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'
          }`}
        >
          {hasUppercase ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0 opacity-50" />}
          <span>1 uppercase letter</span>
        </div>

        <div
          className={`flex items-center gap-1.5 ${
            hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'
          }`}
        >
          {hasLowercase ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0 opacity-50" />}
          <span>1 lowercase letter</span>
        </div>

        <div
          className={`flex items-center gap-1.5 ${
            hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-muted-foreground'
          }`}
        >
          {hasNumber ? <Check className="w-3 h-3 shrink-0" /> : <X className="w-3 h-3 shrink-0 opacity-50" />}
          <span>1 number</span>
        </div>
      </div>
    </div>
  );
};
