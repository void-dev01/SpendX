import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(64, 'Full name cannot exceed 64 characters'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeTerms: z.boolean().refine((val) => val === true, {
      message: 'You must agree to the Terms and Privacy Policy',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationPendingEmail, setVerificationPendingEmail] = useState<string | null>(null);
  const [legalModalContent, setLegalModalContent] = useState<{ title: string; text: string } | null>(null);

  // If already authenticated, redirect to /dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Document SEO title
  useEffect(() => {
    document.title = 'Create Account | SPENDX';
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  const watchedPassword = watch('password');

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.signup(data.fullName, data.email, data.password);

      if (response.success) {
        if (response.requiresEmailVerification) {
          setVerificationPendingEmail(data.email);
        } else {
          navigate('/dashboard', { replace: true });
        }
      } else {
        setServerError(response.error || 'Failed to create account. Please try again.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred during signup';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLegalModal = (title: string, text: string) => {
    setLegalModalContent({ title, text });
  };

  return (
    <AuthLayout
      pageTitle="Create Your Account"
      pageSubtitle="Start your journey toward smarter, proactive financial intelligence."
    >
      {/* Email Verification Success State */}
      {verificationPendingEmail ? (
        <div className="rounded-2xl bg-surface border border-border p-6 sm:p-8 text-center space-y-5 shadow-card animate-in fade-in duration-300">
          <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground mx-auto flex items-center justify-center shadow-xs">
            <Mail className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold font-display text-foreground">
              Verification Link Dispatched
            </h3>
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed max-w-sm mx-auto">
              We have sent a confirmation email to <strong>{verificationPendingEmail}</strong>.
              Please check your inbox and verify your email to unlock your SPENDX workspace.
            </p>
          </div>

          <div className="pt-2">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors"
            >
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Server Error Alert Banner */}
          {serverError && (
            <div
              role="alert"
              className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{serverError}</span>
            </div>
          )}

          {/* Main Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5 sm:space-y-3" noValidate>
            {/* Full Name */}
            <AuthInput
              id="signup-fullname"
              label="Full Name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              icon={User}
              error={errors.fullName?.message}
              disabled={isSubmitting}
              {...register('fullName')}
            />

            {/* Email Address */}
            <AuthInput
              id="signup-email"
              label="Email Address"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              icon={Mail}
              error={errors.email?.message}
              disabled={isSubmitting}
              {...register('email')}
            />

            {/* Password */}
            <div className="space-y-1">
              <PasswordInput
                id="signup-password"
                label="Create Password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                error={errors.password?.message}
                disabled={isSubmitting}
                {...register('password')}
              />
              {/* Dynamic Strength Indicator Checklist */}
              <PasswordStrengthIndicator password={watchedPassword} />
            </div>

            {/* Confirm Password */}
            <PasswordInput
              id="signup-confirm-password"
              label="Confirm Password"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              error={errors.confirmPassword?.message}
              disabled={isSubmitting}
              {...register('confirmPassword')}
            />

            {/* Terms and Privacy Agreement */}
            <div className="space-y-1 pt-0.5">
              <label className="flex items-start gap-2 cursor-pointer select-none text-[11px] text-secondary-text hover:text-foreground">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 bg-surface-elevated mt-0.5"
                  disabled={isSubmitting}
                  {...register('agreeTerms')}
                />
                <span className="leading-tight">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() =>
                      openLegalModal(
                        'Terms of Service',
                        'SPENDX provides intelligent financial telemetry, budget envelope tracking, and AI insights for personal non-commercial management. Users are responsible for maintaining account credential confidentiality.'
                      )
                    }
                    className="text-primary hover:underline font-semibold focus:outline-none"
                  >
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() =>
                      openLegalModal(
                        'Privacy Policy',
                        'SPENDX does not sell personal financial data to advertisers. All transaction metadata is encrypted. You can export or erase your data at any time.'
                      )
                    }
                    className="text-primary hover:underline font-semibold focus:outline-none"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {errors.agreeTerms?.message && (
                <p className="flex items-center gap-1.5 text-[11px] text-destructive font-medium pl-6">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.agreeTerms.message}</span>
                </p>
              )}
            </div>

            {/* Primary Submit Button */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[42px] sm:min-h-[44px] rounded-xl text-xs sm:text-sm font-bold text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Workspace...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Navigation to Login */}
          <div className="pt-2.5 border-t border-border text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
            >
              Sign In
            </Link>
          </div>
        </>
      )}

      {/* Accessible Terms / Privacy Modal Dialog */}
      {legalModalContent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-in fade-in duration-200"
        >
          <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 sm:p-8 max-w-md w-full border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold font-display text-foreground">
                  {legalModalContent.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLegalModalContent(null)}
                aria-label="Close modal"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
              {legalModalContent.text}
            </p>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModalContent(null)}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs transition-colors cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
