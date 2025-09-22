"use client";

import { Bill } from "@/shared/types/bills";
import { useState } from "react";

export default function BillCalendar({ bills }: { bills?: Bill[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<'month' | 'week'>('month');

  // Helper functions
  const getBillTitle = (bill: Bill) => {
    return bill.name || 'Untitled Bill';
  };

  const getBillDueDate = (bill: Bill) => {
    if (bill.due_date) {
      return bill.due_date instanceof Date ? bill.due_date : new Date(bill.due_date);
    }
    if (bill.due_date) {
      return new Date(bill.due_date);
    }
    return new Date();
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Make Monday = 0
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const getDaysDifference = (date1: Date, date2: Date) => {
    const time1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
    const time2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();
    return Math.ceil((time1 - time2) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const getBillsForDate = (date: Date) => {
    return bills?.filter(bill => {
      const billDate = getBillDueDate(bill);
      return isSameDay(billDate, date);
    });
  };

  const getDayStyle = (date: Date) => {
    const today = new Date();
    const dayBills = getBillsForDate(date);
    
    if (!dayBills?.length) return {};

    // Check if all bills are paid
    const allPaid = dayBills.every(bill => bill.status === 'paid');
    if (allPaid) {
      return { backgroundColor: '#dcfce7', color: '#166534', fontWeight: 'bold' };
    }

    // Check for unpaid bills
    const unpaidBills = dayBills.filter(bill => bill.status !== 'paid');
    if (!unpaidBills.length) return {};

    const bill = unpaidBills[0];
    const due = bill?.due_date ? new Date(bill.due_date) : new Date();
    const daysDiff = getDaysDifference(due, today);

    if (daysDiff < 0) {
      return { backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: 'bold' };
    } else if (daysDiff === 0) {
      return { backgroundColor: '#fca5a5', color: '#7f1d1d', fontWeight: 'bold' };
    } else if (daysDiff <= 3) {
      return { backgroundColor: '#fed7aa', color: '#9a3412', fontWeight: 'bold' };
    } else if (daysDiff <= 7) {
      return { backgroundColor: '#fef3c7', color: '#92400e' };
    }
    
    return {};
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const renderBillItem = (bill: Bill) => {
    const isPaid = bill.status === 'paid';
    return (
      <div 
        key={bill.id} 
        className={`text-xs px-1 py-0.5 rounded truncate relative ${
          isPaid 
            ? 'bg-green-100 text-green-800' 
            : 'bg-blue-100 text-blue-800'
        }`}
        title={`${getBillTitle(bill)} - ₦${bill.amount.toLocaleString()} ${isPaid ? '(PAID)' : ''}`}
      >
        <div className="flex items-center justify-between">
          <span className="truncate flex-1">{getBillTitle(bill)}</span>
          {isPaid && (
            <span className="ml-1 text-xs bg-green-600 text-white px-1 rounded font-bold">
              PAID
            </span>
          )}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const today = new Date();
    
    // Previous month's trailing days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
    const prevMonthDays = prevMonth.getDate();
    
    const days = [];
    
    // Add previous month's trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - i);
      days.push(
        <div key={`prev-${prevMonthDays - i}`} className="p-2 h-24 border border-gray-100 bg-gray-50 text-gray-400">
          <div className="text-sm">{prevMonthDays - i}</div>
        </div>
      );
    }
    
    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayBills = getBillsForDate(date);
      const isToday = isSameDay(date, today);
      const dayStyle = getDayStyle(date);
      
      days.push(
        <div 
          key={day} 
          className={`p-2 h-24 border border-gray-100 bg-white hover:bg-gray-50 transition-colors ${isToday ? 'ring-2 ring-blue-500' : ''}`}
          style={dayStyle}
        >
          <div className={`text-sm mb-1 ${isToday ? 'font-bold text-blue-600' : ''}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayBills?.slice(0, 2).map((bill) => renderBillItem(bill))}
            {(dayBills?.length || 0) > 2 && (
              <div className="text-xs text-gray-500">
                +{(dayBills?.length || 0) - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Add next month's leading days to fill the grid
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const remainingCells = totalCells - (firstDay + daysInMonth);
    
    for (let day = 1; day <= remainingCells; day++) {
      days.push(
        <div key={`next-${day}`} className="p-2 h-24 border border-gray-100 bg-gray-50 text-gray-400">
          <div className="text-sm">{day}</div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Week day headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
          <div key={day} className="bg-gray-100 p-3 text-center font-semibold text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    startOfWeek.setDate(diff);

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const dayBills = getBillsForDate(date);
          const isToday = isSameDay(date, new Date());
          const dayStyle = getDayStyle(date);

          return (
            <div key={index} className="border border-gray-200 rounded-lg bg-white">
              <div 
                className={`p-3 text-center border-b border-gray-200 ${isToday ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-50'}`}
                style={isToday ? {} : dayStyle}
              >
                <div className="text-sm font-medium">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-lg">{date.getDate()}</div>
              </div>
              <div className="p-2 space-y-1 min-h-[200px]">
                {dayBills?.map((bill) => {
                  const isPaid = bill.status === 'paid';
                  return (
                    <div 
                      key={bill.id}
                      className={`text-xs p-2 rounded ${
                        isPaid 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium truncate flex-1">{getBillTitle(bill)}</div>
                        {isPaid && (
                          <span className="ml-1 text-xs bg-green-600 text-white px-1 rounded font-bold">
                            PAID
                          </span>
                        )}
                      </div>
                      <div>₦{bill.amount.toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 bg-white rounded-2xl shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">📅 Bills Calendar</h2>
        <div className="text-sm text-gray-600">
          {bills?.length ?? 0} bill{bills?.length !== 1 ? 's' : ''} scheduled
        </div>
      </div>

      {/* Navigation and View Controls */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigateMonth('prev')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            ← Prev
          </button>
          <button 
            onClick={navigateToToday}
            className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
          >
            Today
          </button>
          <button 
            onClick={() => navigateMonth('next')}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Next →
          </button>
        </div>

        <h3 className="text-xl font-semibold text-gray-800">
          {formatDate(currentDate)}
        </h3>

        <div className="flex bg-gray-100 rounded-lg overflow-hidden">
          <button 
            onClick={() => setCurrentView('month')}
            className={`px-4 py-2 text-sm transition-colors ${
              currentView === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button 
            onClick={() => setCurrentView('week')}
            className={`px-4 py-2 text-sm transition-colors ${
              currentView === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-200 rounded"></div>
          <span>Paid Bills</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-200 rounded"></div>
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-300 rounded"></div>
          <span>Due Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-200 rounded"></div>
          <span>Due Soon (1-3 days)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-200 rounded"></div>
          <span>Upcoming (4-7 days)</span>
        </div>
      </div>

      {/* Calendar View */}
      <div className="min-h-[600px]">
        {currentView === 'month' ? renderMonthView() : renderWeekView()}
      </div>

      {/* Upcoming Bills Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Upcoming Bills</h4>
        <div className="space-y-1">
          {bills
            ?.filter(bill => getBillDueDate(bill) >= new Date() && bill.status !== 'paid')
            .sort((a, b) => getBillDueDate(a).getTime() - getBillDueDate(b).getTime())
            .slice(0, 3)
            .map(bill => (
              <div key={bill.id} className="flex justify-between items-center text-sm">
                <span>{getBillTitle(bill)}</span>
                <span className="font-medium">
                  {getBillDueDate(bill).toLocaleDateString()} - ₦{bill.amount.toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>
      </div>
    </div>
  );
}