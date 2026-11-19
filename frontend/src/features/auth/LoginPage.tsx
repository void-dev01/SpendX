import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowRight, Loader2, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthInput } from '@/components/auth/AuthInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(true),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  // If already authenticated, redirect to /dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Document SEO title
  useEffect(() => {
    document.title = 'Sign In | SPENDX';
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    setIsSubmitting(true);

    try {
      const response = await authService.login(data.email, data.password, data.rememberMe);

      if (response.success) {
        // Navigate to intended protected route if passed via state, else /dashboard
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setServerError(response.error || 'Invalid email or password');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) return;
    setForgotLoading(true);
    try {
      await authService.resetPassword(forgotEmail);
      setForgotSuccess(true);
    } catch {
      // noop
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AuthLayout
      pageTitle="Welcome Back"
      pageSubtitle="Your financial clarity is just one step away. Sign in to continue."
    >
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

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
        {/* Email Address */}
        <AuthInput
          id="login-email"
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
        <PasswordInput
          id="login-password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password?.message}
          disabled={isSubmitting}
          {...register('password')}
        />

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 bg-surface-elevated"
              {...register('rememberMe')}
            />
            <span>Remember Me</span>
          </label>

          <button
            type="button"
            onClick={() => {
              setForgotPasswordOpen(true);
              setForgotSuccess(false);
            }}
            className="text-primary hover:underline font-semibold focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        {/* Primary Submit Button */}
        <div className="pt-1.5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full min-h-[42px] sm:min-h-[44px] rounded-xl text-xs sm:text-sm font-bold text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Navigation to Signup */}
      <div className="pt-3 border-t border-border text-center text-xs text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="text-primary font-bold hover:underline transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
        >
          Sign Up
        </Link>
      </div>

      {/* Forgot Password Modal Dialog */}
      {forgotPasswordOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 animate-in fade-in duration-200"
        >
          <div className="bg-card dark:bg-[#1B211B] rounded-[22px] p-6 sm:p-8 max-w-md w-full border border-border shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 id="forgot-password-title" className="text-lg font-bold font-display text-foreground">
                Reset Your Password
              </h3>
              <button
                type="button"
                onClick={() => setForgotPasswordOpen(false)}
                aria-label="Close dialog"
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-foreground">Recovery Link Sent</h4>
                  <p className="text-xs text-muted-foreground">
                    If an account exists for <strong>{forgotEmail}</strong>, a password reset link has been dispatched to your inbox.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setForgotPasswordOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary-hover shadow-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter your registered email address and we will send you secure instructions to reset your password.
                </p>

                <AuthInput
                  id="forgot-email-input"
                  label="Registered Email"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Recovery Link</span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
