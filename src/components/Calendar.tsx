import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';

interface CalendarProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
}

const Calendar = ({ tasks, onTaskClick }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const daysOfWeek = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

  // Get first day of month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
  // Get starting day of week (0 = Sunday, 6 = Saturday)
  const startingDayOfWeek = firstDayOfMonth.getDay();
  
  // Get number of days in month
  const daysInMonth = lastDayOfMonth.getDate();

  // Get tasks for a specific date
  const getTasksForDate = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split('T')[0];
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Check if date is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const getTaskStatusColor = (task: Task) => {
    switch (task.status) {
      case 'done': return 'bg-green-500';
      case 'in-progress': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (task: Task) => {
    switch (task.priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {thaiMonths[currentDate.getMonth()]} {currentDate.getFullYear() + 543}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={goToToday}
            className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            วันนี้
          </button>
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dayTasks = getTasksForDate(day);
          const today = isToday(day);

          return (
            <div
              key={day}
              className={`aspect-square border rounded-lg p-2 transition-all hover:shadow-md ${
                today
                  ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-200'
                  : 'bg-white border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="h-full flex flex-col">
                <div className={`text-sm font-semibold mb-1 ${
                  today ? 'text-primary-600' : 'text-gray-700'
                }`}>
                  {day}
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-1">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => onTaskClick?.(task)}
                      className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity border-l-2 ${getPriorityColor(task)}`}
                      style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      title={task.title}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={`w-1.5 h-1.5 rounded-full ${getTaskStatusColor(task)}`} />
                        <div className="truncate flex-1 text-gray-700">
                          {task.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {dayTasks.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1 text-center">
                    {dayTasks.length} งาน
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-gray-600">รอดำเนินการ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-gray-600">กำลังดำเนินการ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">เสร็จสิ้น</span>
          </div>
          <div className="mx-4 border-l border-gray-300" />
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-blue-500" />
            <span className="text-gray-600">ความสำคัญต่ำ</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-yellow-500" />
            <span className="text-gray-600">ความสำคัญปานกลาง</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-red-500" />
            <span className="text-gray-600">ความสำคัญสูง</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;

