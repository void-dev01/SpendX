import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { RecurringRecord, recurringService } from '@/services/recurringService';

interface PaymentCalendarProps {
  payments: RecurringRecord[];
  onSelectPayment: (payment: RecurringRecord) => void;
}

export const PaymentCalendar: React.FC<PaymentCalendarProps> = ({ payments, onSelectPayment }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayPayments, setSelectedDayPayments] = useState<RecurringRecord[] | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // First day of month and total days
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDayPayments(null);
    setSelectedDayNumber(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDayPayments(null);
    setSelectedDayNumber(null);
  };

  // Group payments by day of month
  const paymentsByDay: Record<number, RecurringRecord[]> = {};
  payments.forEach((payment) => {
    const due = new Date(payment.nextDueDate);
    if (due.getFullYear() === year && due.getMonth() === month) {
      const day = due.getDate();
      if (!paymentsByDay[day]) {
        paymentsByDay[day] = [];
      }
      paymentsByDay[day].push(payment);
    }
  });

  const handleDayClick = (day: number) => {
    const dayPayments = paymentsByDay[day] || [];
    setSelectedDayPayments(dayPayments);
    setSelectedDayNumber(day);
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-slate-200/60 dark:border-white/10 space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-spendx-blue-primary/10 text-spendx-blue-primary flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Visual payment roadmap & scheduled debit days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-spendx-blue-primary/10 text-spendx-blue-primary hover:bg-spendx-blue-primary/20 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Leading empty days */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[85px] rounded-2xl bg-transparent" />
        ))}

        {/* Days of month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayList = paymentsByDay[day] || [];
          const hasPayments = dayList.length > 0;
          const totalAmount = dayList.reduce((sum, p) => sum + p.amount, 0);
          const isSelected = selectedDayNumber === day;
          const isToday =
            new Date().getDate() === day &&
            new Date().getMonth() === month &&
            new Date().getFullYear() === year;

          return (
            <div
              key={`day-${day}`}
              onClick={() => handleDayClick(day)}
              className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-spendx-blue-primary bg-spendx-blue-primary/10 ring-2 ring-spendx-blue-primary/30'
                  : hasPayments
                  ? 'border-spendx-blue-primary/40 bg-white/60 dark:bg-slate-900/40 hover:border-spendx-blue-primary'
                  : 'border-slate-100 dark:border-white/5 bg-white/20 dark:bg-white/[0.02] hover:bg-white/40 dark:hover:bg-white/[0.05]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-spendx-blue-primary text-white'
                      : 'text-spendx-text-primary dark:text-slate-200'
                  }`}
                >
                  {day}
                </span>

                {hasPayments && (
                  <span className="w-2 h-2 rounded-full bg-spendx-purple-primary animate-pulse" />
                )}
              </div>

              {hasPayments && (
                <div className="mt-1">
                  <p className="text-[11px] font-bold text-spendx-indigo dark:text-spendx-soft-purple truncate">
                    {recurringService.formatINR(totalAmount)}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {dayList.length} {dayList.length === 1 ? 'charge' : 'charges'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Day Drilldown Panel */}
      {selectedDayNumber !== null && (
        <div className="pt-4 border-t border-slate-200/60 dark:border-white/10 animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-spendx-text-primary dark:text-spendx-soft-purple">
              Charges on {monthNames[month]} {selectedDayNumber}, {year}
            </h4>
            <span className="text-xs text-slate-500">
              {selectedDayPayments?.length || 0} scheduled
            </span>
          </div>

          {selectedDayPayments && selectedDayPayments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedDayPayments.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPayment(p)}
                  className="p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/10 hover:border-spendx-blue-primary transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-bold text-spendx-text-primary dark:text-spendx-soft-purple truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{p.merchant}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-spendx-indigo dark:text-spendx-soft-purple">
                      {recurringService.formatINR(p.amount)}
                    </p>
                    <span className="text-[10px] text-spendx-blue-primary">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No payments due on this date.</p>
          )}
        </div>
      )}
    </div>
  );
};
