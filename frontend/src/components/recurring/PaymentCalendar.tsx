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
    <div className="bg-surface p-6 rounded-2xl border border-border shadow-card space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-foreground">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-secondary-text">
              Visual payment roadmap & scheduled debit days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            aria-label="Previous month"
            className="p-2 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            aria-label="Next month"
            className="p-2 rounded-xl text-secondary-text hover:text-foreground hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
          <div key={`empty-${i}`} className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-transparent" />
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
              className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-primary/10 ring-1 ring-primary/30 shadow-xs'
                  : hasPayments
                  ? 'border-primary/40 bg-surface-elevated hover:border-primary shadow-xs'
                  : 'border-border bg-surface hover:bg-surface-elevated'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isToday
                      ? 'bg-primary text-white shadow-xs'
                      : 'text-foreground'
                  }`}
                >
                  {day}
                </span>

                {hasPayments && (
                  <span className="w-2 h-2 rounded-full bg-secondary" />
                )}
              </div>

              {hasPayments && (
                <div className="mt-1">
                  <p className="text-[11px] font-display font-bold text-foreground truncate">
                    {recurringService.formatINR(totalAmount)}
                  </p>
                  <p className="text-[10px] text-secondary-text">
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
        <div className="pt-4 border-t border-border animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-display font-bold text-foreground">
              Charges on {monthNames[month]} {selectedDayNumber}, {year}
            </h4>
            <span className="text-xs text-secondary-text">
              {selectedDayPayments?.length || 0} scheduled
            </span>
          </div>

          {selectedDayPayments && selectedDayPayments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {selectedDayPayments.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectPayment(p)}
                  className="p-3 rounded-xl bg-surface-elevated border border-border hover:border-primary transition-all cursor-pointer flex items-center justify-between shadow-xs"
                >
                  <div className="truncate mr-2">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {p.name}
                    </p>
                    <p className="text-[10px] text-secondary-text truncate">{p.merchant}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-display font-bold text-foreground">
                      {recurringService.formatINR(p.amount)}
                    </p>
                    <span className="text-[10px] text-primary font-medium">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-secondary-text italic">No payments due on this date.</p>
          )}
        </div>
      )}
    </div>
  );
};
