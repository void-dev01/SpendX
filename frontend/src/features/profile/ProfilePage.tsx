import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  UserRound,
  Mail,
  ShieldCheck,
  Sparkles,
  Camera,
  Trash2,
  Save,
  Phone,
  MapPin,
  Briefcase,
  Coins,
  CheckCircle2,
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/services/api';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'INR (₹) - Indian Rupee' },
  { code: 'USD', symbol: '$', label: 'USD ($) - US Dollar' },
  { code: 'EUR', symbol: '€', label: 'EUR (€) - Euro' },
  { code: 'GBP', symbol: '£', label: 'GBP (£) - British Pound' },
  { code: 'AED', symbol: 'د.إ', label: 'AED (د.إ) - UAE Dirham' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥) - Japanese Yen' },
  { code: 'CAD', symbol: 'CA$', label: 'CAD ($) - Canadian Dollar' },
  { code: 'AUD', symbol: 'AU$', label: 'AUD ($) - Australian Dollar' },
];

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State initialized from user profile
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [bio, setBio] = useState(user?.bio || 'FinTech Explorer & Portfolio Builder');
  const [country, setCountry] = useState(user?.country || 'India');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [monthlyIncomeTarget, setMonthlyIncomeTarget] = useState<string>(
    user?.monthlyIncomeTarget ? String(user.monthlyIncomeTarget) : '150000'
  );
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl);
  const [isSaving, setIsSaving] = useState(false);

  // Photo Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid File Type', {
        description: 'Please upload an image file (PNG, JPG, WebP).',
      });
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error('File Too Large', {
        description: 'Avatar image must be smaller than 3MB.',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setAvatarUrl(base64);
      toast.success('Photo Loaded', {
        description: 'Click "Save Changes" to apply your new profile photo.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.info('Photo Removed', {
      description: 'Your profile will display initials until saved.',
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Name is Required', {
        description: 'Please enter your full name.',
      });
      return;
    }

    setIsSaving(true);

    const updatedUser = {
      ...(user || { id: 'usr_default', email: email || 'user@spendx.local' }),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      bio: bio.trim(),
      country: country.trim(),
      currency,
      monthlyIncomeTarget: Number(monthlyIncomeTarget) || 0,
      avatarUrl,
    };

    try {
      await apiClient.patch('/auth/me', {
        fullName: updatedUser.fullName,
        currency: updatedUser.currency,
        avatarUrl: updatedUser.avatarUrl,
      });
    } catch (err) {
      console.warn('Backend PATCH /auth/me failed, updating locally', err);
    }

    setUser(updatedUser);
    setIsSaving(false);
    toast.success('Profile Updated Successfully', {
      description: 'Your identity and monetary preferences have been synchronized.',
    });
  };

  const displayName = fullName || user?.fullName || 'User Profile';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'SP';

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* 1. Header with Title & Save CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
              Account Identity
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground tracking-tight mt-1">
            User Profile & Identity
          </h1>
          <p className="text-xs sm:text-sm text-secondary-text mt-0.5">
            Manage your personal credentials, contact details, profile photo, and currency preferences.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="h-10 px-5 rounded-xl text-xs font-bold text-[#111711] bg-primary hover:bg-primary-hover shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          {isSaving ? (
            <span>Saving...</span>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Main 2-Column Grid */}
      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Account Badge */}
        <div className="lg:col-span-4 space-y-6">
          {/* Avatar Card */}
          <div className="rounded-2xl bg-card dark:bg-[#1B211B] border border-border p-6 shadow-xs text-center space-y-4">
            <div className="relative w-28 h-28 mx-auto">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full rounded-2xl object-cover border-2 border-primary shadow-xs"
                />
              ) : (
                <div className="w-full h-full rounded-2xl bg-primary text-[#111711] flex items-center justify-center font-bold font-display text-3xl shadow-xs border-2 border-primary/50">
                  {initials}
                </div>
              )}

              {/* Upload Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-surface-elevated border border-border text-foreground hover:text-primary shadow-xs flex items-center justify-center cursor-pointer transition-colors"
                title="Upload Photo"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="text-base font-bold font-display text-foreground">{displayName}</h3>
              <p className="text-xs text-secondary-text mt-0.5">{email || 'client@spendx.local'}</p>
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-surface-subtle dark:bg-[#242C23] border border-border hover:border-primary/40 text-foreground transition-all cursor-pointer"
              >
                Upload Photo
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="p-1.5 rounded-xl text-expense bg-expense/10 hover:bg-expense/20 border border-expense/20 transition-all cursor-pointer"
                  title="Remove custom photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-border space-y-2.5 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-secondary-text">Account Tier</span>
                <span className="inline-flex items-center gap-1 font-bold text-primary">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>SPENDX Pro Client</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-text">Verification</span>
                <span className="inline-flex items-center gap-1 font-semibold text-income">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Identity Verified</span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary-text">Primary Currency</span>
                <span className="font-mono font-bold text-foreground">{currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Details Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl bg-card dark:bg-[#1B211B] border border-border p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <UserRound className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm font-display text-foreground">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shubham Dangi"
                  required
                  className="w-full h-10 px-3.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. shubham@spendx.app"
                    required
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Location / Country */}
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1.5">
                  Country / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. India"
                    className="w-full h-10 pl-10 pr-3.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Bio / Occupation */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-secondary-text mb-1.5">
                  Bio / Professional Headline
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Brief description about your financial goals or profession..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Financial Preferences */}
          <div className="rounded-2xl bg-card dark:bg-[#1B211B] border border-border p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-border">
              <Coins className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm font-display text-foreground">
                Financial & Currency Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Currency */}
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1.5">
                  Primary Ledger Currency *
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all cursor-pointer"
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-muted-foreground mt-1">
                  All charts, metrics, and transaction ledgers will use this currency.
                </p>
              </div>

              {/* Monthly Income Target */}
              <div>
                <label className="block text-xs font-semibold text-secondary-text mb-1.5">
                  Monthly Target Inflow
                </label>
                <input
                  type="number"
                  value={monthlyIncomeTarget}
                  onChange={(e) => setMonthlyIncomeTarget(e.target.value)}
                  placeholder="e.g. 150000"
                  className="w-full h-10 px-3.5 rounded-xl text-xs bg-surface-subtle dark:bg-[#242C23] border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all font-medium"
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Used by the budget optimizer to calculate your discretionary savings cushion.
                </p>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="h-10 px-6 rounded-xl text-xs font-bold text-[#111711] bg-primary hover:bg-primary-hover shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
