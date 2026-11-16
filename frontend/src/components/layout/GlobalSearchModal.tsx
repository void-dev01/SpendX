import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { NAVIGATION_ITEMS } from '@/config/navigation';
import { useLayoutStore } from '@/stores/layoutStore';

export const GlobalSearchModal: React.FC = () => {
  const { isGlobalSearchOpen, setGlobalSearchOpen } = useLayoutStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Keyboard shortcut listener for ⌘K / Ctrl+K and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setGlobalSearchOpen(!isGlobalSearchOpen);
      } else if (e.key === 'Escape' && isGlobalSearchOpen) {
        setGlobalSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGlobalSearchOpen, setGlobalSearchOpen]);

  // Lock scroll when open
  useEffect(() => {
    if (isGlobalSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isGlobalSearchOpen]);

  const filteredItems = NAVIGATION_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.group.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setGlobalSearchOpen(false);
    navigate(path);
  };

  return (
    <AnimatePresence>
      {isGlobalSearchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          role="dialog"
          aria-modal="true"
          aria-label="Global search command palette"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setGlobalSearchOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[var(--glass-modal-bg)] backdrop-blur-3xl rounded-3xl p-4 sm:p-5 border border-slate-200/90 dark:border-white/20 shadow-2xl max-w-lg w-full space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10">
          <Search className="w-5 h-5 text-primary shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, ledgers, intelligence tools..."
            className="flex-1 bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto space-y-1 py-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              No matching SPENDX destinations found for &quot;{query}&quot;
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 text-xs font-semibold text-foreground transition-colors group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-normal">{item.group}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="text-[10px]">{item.path}</span>
                    <CornerDownLeft className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Navigate with click or enter</span>
          <span className="flex items-center gap-1">
            SPENDX Command Center <ArrowRight className="w-3 h-3 text-primary" />
          </span>
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
