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
  isSameDay
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Task } from '../../types';
import TaskCard from '../task/TaskCard';
import Button from '../ui/Button';

interface CalendarViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific day
  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(parseISO(task.dueDate), date)
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  return (
    <div className="flex-1 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md">
        {/* Calendar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousMonth}
                icon={<ChevronLeft size={16} />}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextMonth}
                icon={<ChevronRight size={16} />}
              />
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

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {/* Weekday headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-700"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {daysInMonth.map((date) => {
            const dayTasks = getTasksForDay(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[120px] p-2 bg-white border-t ${
                  isToday(date) ? 'bg-primary-50' : ''
                } ${!isCurrentMonth ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-sm font-medium ${
                      isToday(date)
                        ? 'bg-primary-500 text-white w-6 h-6 rounded-full flex items-center justify-center'
                        : 'text-gray-700'
                    }`}
                  >
                    {format(date, 'd')}
                  </span>
                </div>
                <div className="space-y-1">
                  {dayTasks.map((task) => (
                    <div key={task.id} className="text-sm">
                      <TaskCard
                        task={task}
                        onToggleComplete={onToggleComplete}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        showQuadrant
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;