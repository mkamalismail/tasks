import React, { useState } from 'react';
import { 
  startOfMonth, 
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
  parseISO,
  isSameDay,
  isAfter,
  isBefore,
  startOfDay,
  endOfDay,
  addDays,
  subDays,
  getHours,
  getMinutes,
  setHours,
  setMinutes,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle, Calendar as CalendarIcon, CalendarRange } from 'lucide-react';
import { Task, CalendarViewMode } from '../../types';
import Button from '../ui/Button';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const WORKING_HOURS = HOURS.slice(6, 22); // 6 AM to 10 PM

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>(CalendarViewMode.MONTH);

  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    return tasks
      .filter(task => {
        if (!task.dueDate) return false;
        const taskDate = parseISO(task.dueDate);
        return !isBefore(taskDate, dayStart) && !isAfter(taskDate, dayEnd);
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (!a.dueDate || !b.dueDate) return 0;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      });
  };

  // Get tasks for a specific hour
  const getTasksForHour = (date: Date, hour: number) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = parseISO(task.dueDate);
      return isSameDay(taskDate, date) && getHours(taskDate) === hour;
    });
  };

  // Navigation handlers
  const navigate = (direction: 'prev' | 'next') => {
    switch (viewMode) {
      case CalendarViewMode.DAY:
        setCurrentDate(direction === 'prev' ? subDays(currentDate, 1) : addDays(currentDate, 1));
        break;
      case CalendarViewMode.MONTH:
        setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
        break;
    }
  };

  // View mode specific date ranges
  const getDaysToShow = () => {
    switch (viewMode) {
      case CalendarViewMode.DAY:
        return [currentDate];
      case CalendarViewMode.MONTH:
        return eachDayOfInterval({
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate)
        });
    }
  };

  // Render day view
  const renderDayView = () => (
    <div className="grid grid-cols-1 divide-y divide-gray-200">
      {WORKING_HOURS.map(hour => {
        const date = setHours(setMinutes(currentDate, 0), hour);
        const hourTasks = getTasksForHour(currentDate, hour);
        
        return (
          <div key={hour} className="min-h-[60px] group hover:bg-gray-50">
            <div className="flex">
              <div className="w-20 py-2 text-right text-sm text-gray-500 sticky left-0 bg-white">
                {format(date, 'HH:mm')}
              </div>
              <div className="flex-1 px-4 py-2">
                {hourTasks.map(task => (
                  <div
                    key={task.id}
                    className={`rounded-md p-2 mb-1 ${
                      task.completed
                        ? 'bg-gray-100 line-through text-gray-500'
                        : 'bg-primary-50 text-primary-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          task.completed
                            ? 'bg-primary-500 text-white'
                            : 'border border-gray-300 hover:border-primary-500'
                        }`}
                      >
                        {task.completed && <CheckCircle size={12} />}
                      </button>
                      <span className="text-sm">{task.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // Render month view
  const renderMonthView = () => {
    const days = getDaysToShow();

    return (
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-xs sm:text-sm font-medium text-gray-700"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((date) => {
          const dayTasks = getTasksForDay(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const activeTasks = dayTasks.filter(task => !task.completed);
          const completedTasks = dayTasks.filter(task => task.completed);
          
          return (
            <div
              key={date.toISOString()}
              className={`min-h-[100px] sm:min-h-[120px] p-2 bg-white border-t ${
                isToday(date) ? 'bg-primary-50' : ''
              } ${!isCurrentMonth ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xs sm:text-sm font-medium ${
                    isToday(date)
                      ? 'bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                      : 'text-gray-700'
                  }`}
                >
                  {format(date, 'd')}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-xs text-gray-500">
                    {activeTasks.length}/{dayTasks.length}
                  </span>
                )}
              </div>

              <div className="space-y-2 max-h-[80px] sm:max-h-[150px] overflow-y-auto">
                {activeTasks.map((task) => (
                  <div
                    key={task.id}
                    className="text-sm bg-white rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 p-1">
                      <button
                        onClick={() => onToggleComplete(task.id)}
                        className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-300 hover:border-primary-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="truncate">{task.title}</span>
                          {task.dueDate && (
                            <Clock size={12} className="text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {completedTasks.length > 0 && (
                  <div className="space-y-1 pt-1 border-t border-gray-100">
                    {completedTasks.map((task) => (
                      <div
                        key={task.id}
                        className="text-sm bg-white rounded-md hover:bg-gray-50 transition-colors opacity-60"
                      >
                        <div className="flex items-center gap-2 p-1">
                          <button
                            onClick={() => onToggleComplete(task.id)}
                            className="flex-shrink-0 w-4 h-4 rounded-full bg-primary-500 text-white flex items-center justify-center"
                          >
                            <CheckCircle size={12} />
                          </button>
                          <span className="truncate line-through text-gray-500">
                            {task.title}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dayTasks.length === 0 && (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-xs text-gray-400">No tasks</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
        {/* Calendar Header */}
        <div className="p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-semibold">
                {format(currentDate, viewMode === CalendarViewMode.DAY ? 'MMMM d, yyyy' : 'MMMM yyyy')}
              </h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('prev')}
                  icon={<ChevronLeft size={16} />}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('next')}
                  icon={<ChevronRight size={16} />}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={viewMode === CalendarViewMode.DAY ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode(CalendarViewMode.DAY)}
                icon={<CalendarIcon size={16} />}
              >
                Day
              </Button>
              <Button
                variant={viewMode === CalendarViewMode.MONTH ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode(CalendarViewMode.MONTH)}
                icon={<CalendarRange size={16} />}
              >
                Month
              </Button>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onAddTask}
            icon={<Plus size={16} />}
          >
            Add Task
          </Button>
        </div>

        {/* Calendar Content */}
        <div className="overflow-x-auto">
          {viewMode === CalendarViewMode.DAY && renderDayView()}
          {viewMode === CalendarViewMode.MONTH && renderMonthView()}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;