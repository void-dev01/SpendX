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

export interface LocalRegisteredUser {
  id: string;
  email: string;
  fullName: string;
  currency: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

const REGISTERED_USERS_KEY = 'spendx_registered_users';

export const getLocalRegisteredUsers = (): LocalRegisteredUser[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    void err;
    return [];
  }
};

export const saveLocalRegisteredUsers = (users: LocalRegisteredUser[]): void => {
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    void err;
  }
};

export const hashPasswordBrowser = async (password: string, salt: string): Promise<string> => {
  const combined = `${salt}:${password}`;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch (err) {
      void err;
    }
  }

  // Fallback hash for environments where window.crypto.subtle is unavailable
  let hash = 5381;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) + hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return 'fx_' + Math.abs(hash).toString(16);
};

export const createSessionToken = (user: { id: string; email: string }): string => {
  const payloadStr = JSON.stringify({ id: user.id, email: user.email, t: Date.now() });
  let b64 = '';
  try {
    b64 = btoa(payloadStr);
  } catch (err) {
    void err;
    b64 = Math.random().toString(36).substring(2, 9);
  }
  return `spendx_session_${b64}_${Math.random().toString(36).substring(2, 7)}`;
};

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
            try {
              sessionStorage.setItem('spendx_temp_auth', token);
            } catch (err) {
              void err;
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

    // 2. Attempt Backend API Auth first
    try {
      const res = await apiClient.post('/auth/login', { email: trimmedEmail, password });
      if (res.data?.success && res.data?.user && res.data?.token) {
        const userProfile = res.data.user;
        const token = res.data.token;
        useAuthStore.getState().setToken(token);
        useAuthStore.getState().setUser(userProfile);

        // Also ensure local registered user cache is synchronized
        const users = getLocalRegisteredUsers();
        if (!users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
          const salt = Math.random().toString(36).substring(2, 10);
          const passwordHash = await hashPasswordBrowser(password, salt);
          users.push({
            id: userProfile.id,
            email: trimmedEmail,
            fullName: userProfile.fullName,
            currency: userProfile.currency || 'INR',
            passwordHash,
            salt,
            createdAt: new Date().toISOString(),
          });
          saveLocalRegisteredUsers(users);
        }

        return {
          success: true,
          user: userProfile,
          token,
        };
      }
    } catch (apiErr: any) {
      // If backend responded with 401 or 400 (e.g. Invalid password, user not found)
      // DO NOT BYPASS! Immediately return the rejection error!
      if (apiErr.response?.data?.message || apiErr.response?.data?.error) {
        return {
          success: false,
          error: apiErr.response.data.error || apiErr.response.data.message || 'Invalid email or password',
        };
      }
      // If network error / backend offline, proceed to check local registered credentials
    }

    // 3. Local Registered Credentials Validation (Offline / Local Mode)
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Basic server-side style validation
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    const localUsers = getLocalRegisteredUsers();
    const existingUser = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    // CRITICAL: If user never signed up / created an account, REJECT!
    if (!existingUser) {
      return {
        success: false,
        error: 'No account found with this email. Please create an account first.',
      };
    }

    // CRITICAL: Validate password hash against registered password!
    const computedHash = await hashPasswordBrowser(password, existingUser.salt);
    if (computedHash !== existingUser.passwordHash) {
      return {
        success: false,
        error: 'Invalid password. Please check your credentials and try again.',
      };
    }

    // Success: user verified
    const userProfile: UserProfile = {
      id: existingUser.id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      currency: existingUser.currency || 'INR',
    };

    const token = createSessionToken(existingUser);
    useAuthStore.getState().setToken(token);
    useAuthStore.getState().setUser(userProfile);

    if (!rememberMe) {
      try {
        sessionStorage.setItem('spendx_temp_auth', token);
      } catch (err) {
        void err;
      }
    }

    return {
      success: true,
      user: userProfile,
      token,
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

    // 2. Attempt Backend API Registration first
    try {
      const res = await apiClient.post('/auth/register', {
        email: trimmedEmail,
        password,
        fullName: cleanName,
      });

      if (res.data?.success && res.data?.user && res.data?.token) {
        const userProfile = res.data.user;
        const token = res.data.token;

        // Persist locally as well
        const salt = Math.random().toString(36).substring(2, 10);
        const passwordHash = await hashPasswordBrowser(password, salt);
        const localUsers = getLocalRegisteredUsers();
        if (!localUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
          localUsers.push({
            id: userProfile.id,
            email: trimmedEmail,
            fullName: cleanName,
            currency: 'INR',
            passwordHash,
            salt,
            createdAt: new Date().toISOString(),
          });
          saveLocalRegisteredUsers(localUsers);
        }

        useAuthStore.getState().setToken(token);
        useAuthStore.getState().setUser(userProfile);

        return {
          success: true,
          user: userProfile,
          token,
        };
      }
    } catch (apiErr: any) {
      if (apiErr.response?.status === 409) {
        return {
          success: false,
          error: apiErr.response?.data?.error || 'An account with this email already exists. Please sign in.',
        };
      }
      if (apiErr.response?.data?.error) {
        return {
          success: false,
          error: apiErr.response.data.error,
        };
      }
      // If offline, continue to local storage registration
    }

    // 3. Local Registration Persistence (Offline / Local Mode)
    await new Promise((resolve) => setTimeout(resolve, 400));

    const localUsers = getLocalRegisteredUsers();
    const existing = localUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in.',
      };
    }

    const salt = Math.random().toString(36).substring(2, 10);
    const passwordHash = await hashPasswordBrowser(password, salt);
    const userId = 'usr_' + Math.random().toString(36).substring(2, 9);

    const userProfile: UserProfile = {
      id: userId,
      email: trimmedEmail,
      fullName: cleanName,
      currency: 'INR',
    };

    localUsers.push({
      id: userId,
      email: trimmedEmail,
      fullName: cleanName,
      currency: 'INR',
      passwordHash,
      salt,
      createdAt: new Date().toISOString(),
    });
    saveLocalRegisteredUsers(localUsers);

    const token = createSessionToken(userProfile);
    useAuthStore.getState().setToken(token);
    useAuthStore.getState().setUser(userProfile);

    return {
      success: true,
      user: userProfile,
      token,
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
      } catch (err) {
        void err;
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
      const currentUser = this.getUser();
      if (currentUser) {
        const users = getLocalRegisteredUsers().filter(
          (u) => u.id !== currentUser.id && u.email.toLowerCase() !== currentUser.email.toLowerCase()
        );
        saveLocalRegisteredUsers(users);
      }
      try {
        await apiClient.delete('/auth/me');
      } catch (err) {
        void err;
      }
      await this.logout();
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete account';
      return { success: false, error: message };
    }
  },
};
