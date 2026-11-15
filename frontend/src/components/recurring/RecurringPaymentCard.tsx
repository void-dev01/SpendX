import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  CreditCard,
  CheckCircle,
  MoreVertical,
  PauseCircle,
  PlayCircle,
  Edit2,
  Trash2,
  ExternalLink,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { RecurringRecord, recurringService } from '@/services/recurringService';

interface RecurringPaymentCardProps {
  payment: RecurringRecord;
  onEdit: (payment: RecurringRecord) => void;
  onDelete: (id: string) => void;
  onTogglePause: (payment: RecurringRecord) => void;
  onMarkAsPaid: (id: string) => void;
}

export const RecurringPaymentCard: React.FC<RecurringPaymentCardProps> = ({
  payment,
  onEdit,
  onDelete,
  onTogglePause,
  onMarkAsPaid,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate days remaining
  const now = new Date();
  const dueDate = new Date(payment.nextDueDate);
  const diffTime = dueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const getStatusBadge = () => {
    switch (payment.status) {
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      case 'DUE_TODAY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> Due Today
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-500 dark:text-slate-400 border border-slate-500/20">
            <PauseCircle className="w-3 h-3" /> Paused
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-spendx-blue-primary/10 text-spendx-blue-primary border border-spendx-blue-primary/20">
            <Clock className="w-3 h-3" /> {diffDays > 0 ? `In ${diffDays} days` : 'Upcoming'}
          </span>
        );
    }
  };

  const handleMarkPaid = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);
    try {
      await onMarkAsPaid(payment.id);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/recurring/${payment.id}`)}
      className="glass-card-interactive p-5 rounded-2xl flex flex-col justify-between group cursor-pointer transition-all duration-300 relative border border-slate-200/60 dark:border-white/10 hover:border-spendx-blue-primary/40"
    >
      {/* Top Header: Merchant, Title, and Action Menu */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-spendx-blue-primary/90 bg-spendx-blue-primary/10 px-2 py-0.5 rounded-md">
                {payment.category}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                • {payment.frequency.toLowerCase()}
              </span>
            </div>
            <h3 className="text-base font-bold text-spendx-text-primary dark:text-spendx-soft-purple truncate group-hover:text-spendx-blue-primary transition-colors">
              {payment.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {payment.merchant}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {getStatusBadge()}

            {/* Menu trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                aria-label="Payment options"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 w-44 rounded-xl glass-card py-1.5 shadow-xl border border-slate-200 dark:border-white/10 z-20 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/recurring/${payment.id}`);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onEdit(payment);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Schedule</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onTogglePause(payment);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-700 dark:text-slate-200 hover:bg-spendx-blue-primary/10 transition-colors"
                  >
                    {payment.status === 'PAUSED' ? (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pause Schedule</span>
                      </>
                    )}
                  </button>
                  <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(payment.id);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Amount & Due Date row */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-baseline justify-between">
          <div>
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-spendx-indigo dark:text-spendx-soft-purple tabular-nums">
              {recurringService.formatINR(payment.amount)}
            </span>
            <span className="text-xs text-slate-400 ml-1">
              /{payment.frequency === 'MONTHLY' ? 'mo' : payment.frequency.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {new Date(payment.nextDueDate).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-2">
        {/* Linked account badge */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate max-w-[55%]">
          <CreditCard className="w-3.5 h-3.5 shrink-0 text-spendx-blue-primary/80" />
          <span className="truncate">{payment.linkedAccountName || 'Unlinked Account'}</span>
        </div>

        {/* Quick action button */}
        {payment.status !== 'PAID' && payment.status !== 'PAUSED' ? (
          <button
            type="button"
            onClick={handleMarkPaid}
            disabled={isProcessing}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Mark Paid</span>
          </button>
        ) : (
          <span className="text-xs text-slate-400 font-medium italic">
            {payment.status === 'PAID' ? 'Up to date' : 'Schedule paused'}
          </span>
        )}
      </div>
    </div>
  );
};
