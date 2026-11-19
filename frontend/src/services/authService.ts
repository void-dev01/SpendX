import { supabase } from './supabase';
import { useAuthStore } from '../stores/authStore';
import { UserProfile } from '../types';
import { apiClient } from './api';

export interface AuthResponse {
  success: boolean;
  user?: UserProfile;
  token?: string;
  error?: string;
  requiresEmailVerification?: boolean;
}

export const authService = {
  /**
   * Sign In with Email and Password
   */
  async login(email: string, password: string, rememberMe = true): Promise<AuthResponse> {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. If Supabase Client is configured with live credentials, use real Supabase Auth
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (error) {
          return {
            success: false,
            error: error.message || 'Invalid email or password',
          };
        }

        if (data.session && data.user) {
          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            fullName: data.user.user_metadata?.full_name || trimmedEmail.split('@')[0],
            currency: 'INR',
          };

          const token = data.session.access_token;
          useAuthStore.getState().setToken(token);
          useAuthStore.getState().setUser(userProfile);

          if (!rememberMe) {
            // If user did not check 'Remember Me', store in sessionStorage fallback
            try {
              sessionStorage.setItem('spendx_temp_auth', token);
            } catch {
              // noop
            }
          }

          return {
            success: true,
            user: userProfile,
            token,
          };
        }

        return {
          success: false,
          error: 'Authentication failed: No active session received',
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Network error during login';
        return {
          success: false,
          error: message,
        };
      }
    }

    // 2. Local Development Fallback (when Supabase credentials are not in .env)
    // Simulates secure deterministic auth for testing & local development
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Basic server-side style validation
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const mockToken = `spendx_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userProfile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: trimmedEmail,
      fullName: trimmedEmail.split('@')[0].replace(/[._-]/g, ' '),
      currency: 'INR',
    };

    useAuthStore.getState().setToken(mockToken);
    useAuthStore.getState().setUser(userProfile);

    return {
      success: true,
      user: userProfile,
      token: mockToken,
    };
  },

  /**
   * Sign Up with Full Name, Email, and Password
   */
  async signup(fullName: string, email: string, password: string): Promise<AuthResponse> {
    const trimmedEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    // 1. Live Supabase Auth Sign Up
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            data: {
              full_name: cleanName,
            },
          },
        });

        if (error) {
          return {
            success: false,
            error: error.message || 'Failed to create account',
          };
        }

        // Supabase with email confirmation enabled returns user but null session
        if (data.user && !data.session) {
          return {
            success: true,
            requiresEmailVerification: true,
            user: {
              id: data.user.id,
              email: data.user.email || trimmedEmail,
              fullName: cleanName,
              currency: 'INR',
            },
          };
        }

        // Supabase with email confirmation disabled returns immediate session
        if (data.session && data.user) {
          const userProfile: UserProfile = {
            id: data.user.id,
            email: data.user.email || trimmedEmail,
            fullName: cleanName,
            currency: 'INR',
          };

          const token = data.session.access_token;
          useAuthStore.getState().setToken(token);
          useAuthStore.getState().setUser(userProfile);

          return {
            success: true,
            user: userProfile,
            token,
          };
        }

        return {
          success: false,
          error: 'Account creation response was incomplete',
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Network failure during registration';
        return {
          success: false,
          error: message,
        };
      }
    }

    // 2. Local Development Fallback
    await new Promise((resolve) => setTimeout(resolve, 700));

    const mockToken = `spendx_session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userProfile: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: trimmedEmail,
      fullName: cleanName,
      currency: 'INR',
    };

    useAuthStore.getState().setToken(mockToken);
    useAuthStore.getState().setUser(userProfile);

    return {
      success: true,
      user: userProfile,
      token: mockToken,
    };
  },

  /**
   * Password Reset Request
   */
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    const trimmedEmail = email.trim().toLowerCase();

    if (supabase) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo: `${window.location.origin}/login`,
        });

        if (error) {
          return { success: false, error: error.message };
        }
        return { success: true };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to request password reset';
        return { success: false, error: message };
      }
    }

    // Local simulation
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // noop
      }
    }
    useAuthStore.getState().logout();
  },

  /**
   * Get Current Authenticated User Profile
   */
  getUser(): UserProfile | null {
    return useAuthStore.getState().user;
  },

  /**
   * Delete User Account and all associated financial records
   */
  async deleteAccount(): Promise<{ success: boolean; error?: string }> {
    try {
      await apiClient.delete('/auth/me');
      await this.logout();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      return { success: false, error: message };
    }
  },
};
