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
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">
            <AlertCircle className="w-3 h-3" /> Overdue
          </span>
        );
      case 'DUE_TODAY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-500 border border-amber-500/20 animate-pulse">
            <Clock className="w-3 h-3" /> Due Today
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-income/10 text-income border border-income/20">
            <CheckCircle className="w-3 h-3" /> Paid
          </span>
        );
      case 'PAUSED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-elevated text-secondary-text border border-border">
            <PauseCircle className="w-3 h-3" /> Paused
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
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
      className="bg-surface p-5 sm:p-6 rounded-2xl border border-border shadow-card hover:shadow-elevated flex flex-col justify-between group cursor-pointer transition-all duration-300 relative hover:border-primary/40"
    >
      {/* Top Header: Merchant, Title, and Action Menu */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {payment.category}
              </span>
              <span className="text-[11px] text-secondary-text font-medium">
                • {payment.frequency.toLowerCase()}
              </span>
            </div>
            <h3 className="text-base font-display font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight">
              {payment.name}
            </h3>
            <p className="text-xs text-secondary-text truncate mt-0.5 font-medium">
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
                className="p-1 rounded-lg text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-surface py-1.5 shadow-elevated border border-border z-20 text-xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      navigate(`/recurring/${payment.id}`);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
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
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
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
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
                  >
                    {payment.status === 'PAUSED' ? (
                      <>
                        <PlayCircle className="w-3.5 h-3.5 text-income" />
                        <span>Resume</span>
                      </>
                    ) : (
                      <>
                        <PauseCircle className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pause Schedule</span>
                      </>
                    )}
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onDelete(payment.id);
                    }}
                    className="w-full text-left px-3 py-2 flex items-center gap-2 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
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
        <div className="mt-4 pt-3 border-t border-border flex items-baseline justify-between">
          <div>
            <span className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-foreground tabular-nums">
              {recurringService.formatINR(payment.amount)}
            </span>
            <span className="text-xs text-secondary-text ml-1 font-medium">
              /{payment.frequency === 'MONTHLY' ? 'mo' : payment.frequency.toLowerCase()}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-secondary-text font-medium">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
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
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2">
        {/* Linked account badge */}
        <div className="flex items-center gap-1.5 text-xs text-secondary-text truncate max-w-[55%]">
          <CreditCard className="w-3.5 h-3.5 shrink-0 text-primary" />
          <span className="truncate">{payment.linkedAccountName || 'Unlinked Account'}</span>
        </div>

        {/* Quick action button */}
        {payment.status !== 'PAID' && payment.status !== 'PAUSED' ? (
          <button
            type="button"
            onClick={handleMarkPaid}
            disabled={isProcessing}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-income/10 hover:bg-income/20 text-income border border-income/20 transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Mark Paid</span>
          </button>
        ) : (
          <span className="text-xs text-muted-foreground font-medium italic">
            {payment.status === 'PAID' ? 'Up to date' : 'Schedule paused'}
          </span>
        )}
      </div>
    </div>
  );
};
