import React from 'react';
import { X, Share, PlusSquare } from 'lucide-react';

interface IOSInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallModal: React.FC<IOSInstallModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full max-w-sm rounded-3xl p-6 border border-border shadow-elevated text-left space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ios-install-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
              SX
            </div>
            <h3 id="ios-install-title" className="text-sm font-display font-bold text-foreground">
              Install SpendX on iOS
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-secondary-text leading-relaxed">
          Install SpendX directly to your iPhone or iPad home screen for an ultra-fast, fullscreen experience:
        </p>

        <div className="space-y-3 pt-1">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-elevated border border-border">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Share className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-foreground block">1. Tap the Share Button</span>
              <span className="text-secondary-text text-[11px]">Located at the bottom of Safari's toolbar.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-surface-elevated border border-border">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-foreground block">2. Select "Add to Home Screen"</span>
              <span className="text-secondary-text text-[11px]">Scroll down in the share sheet and tap Add to Home Screen.</span>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-primary-foreground bg-primary hover:bg-primary-hover shadow-xs transition-colors cursor-pointer text-center"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
