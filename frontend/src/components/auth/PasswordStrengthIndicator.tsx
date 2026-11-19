import React from 'react';

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

  if (passedCount === 4) {
    strengthLabel = 'Strong';
    barColor = 'bg-emerald-500';
  } else if (passedCount === 3) {
    strengthLabel = 'Good';
    barColor = 'bg-primary';
  } else if (passedCount === 2) {
    strengthLabel = 'Fair';
    barColor = 'bg-amber-500';
  }

  if (!password) {
    return null;
  }

  return (
    <div className="pt-0.5 space-y-1">
      <div className="flex justify-between items-center text-[10px] font-semibold">
        <span className="text-muted-foreground">Password strength</span>
        <span className={passedCount === 4 ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}>
          {strengthLabel}
        </span>
      </div>
      <div className="w-full h-1 rounded-full bg-muted overflow-hidden flex gap-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full flex-1 rounded-full transition-all duration-200 ${
              passedCount >= step ? barColor : 'bg-border'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
