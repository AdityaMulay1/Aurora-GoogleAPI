import React from 'react';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  highlightedDates: string[]; // YYYY-MM-DD
}

export const Calendar: React.FC<CalendarProps> = ({ selectedDate, onDateChange, highlightedDates }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + offset);
      return newMonth;
    });
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center mb-4">
      <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-700">&larr;</button>
      <h2 className="font-bold text-lg text-gray-100">
        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-700">&rarr;</button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 text-center text-xs text-gray-400 font-semibold">
        {days.map(day => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = currentMonth;
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));
    
    const rows = [];
    let day = startDate;
    
    while (day <= endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const dateStr = cloneDay.toISOString().split('T')[0];
        const isSelected = dateStr === selectedDate.toISOString().split('T')[0];
        const isCurrentMonth = cloneDay.getMonth() === monthStart.getMonth();
        const isHighlighted = highlightedDates.includes(dateStr);

        week.push(
          <div
            key={day.toString()}
            className={`flex justify-center items-center h-9 w-9 rounded-full cursor-pointer transition-colors ${!isCurrentMonth ? 'text-gray-600' : 'text-gray-100'}`}
            onClick={() => onDateChange(cloneDay)}
          >
            <div className={`relative h-8 w-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary text-white' : 'hover:bg-slate-700'}`}>
              <span>{cloneDay.getDate()}</span>
              {isHighlighted && <div className="absolute bottom-1 h-1 w-1 bg-secondary rounded-full"></div>}
            </div>
          </div>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(<div key={day.toString()} className="grid grid-cols-7">{week}</div>);
    }
    return <div className="space-y-1">{rows}</div>;
  };

  return (
    <div>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};