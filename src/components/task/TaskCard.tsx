import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, CalendarClock, Check, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Task, Quadrant } from '../../types';
import { formatDate, checkIsOverdue, getRelativeTime } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  showQuadrant?: boolean;
}

const getQuadrantInfo = (quadrant: Quadrant): { name: string; color: string } => {
  switch (quadrant) {
    case Quadrant.URGENT_IMPORTANT:
      return { name: 'Do Now', color: 'bg-primary-100 text-primary-700' };
    case Quadrant.NOT_URGENT_IMPORTANT:
      return { name: 'Plan', color: 'bg-secondary-100 text-secondary-700' };
    case Quadrant.URGENT_NOT_IMPORTANT:
      return { name: 'Delegate', color: 'bg-accent-100 text-accent-700' };
    case Quadrant.NOT_URGENT_NOT_IMPORTANT:
      return { name: 'Eliminate', color: 'bg-error-100 text-error-700' };
    default:
      return { name: '', color: '' };
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  showQuadrant = true,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    transition: {
      duration: 150,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isOverdue = task.dueDate ? checkIsOverdue(task.dueDate) : false;
  const quadrantInfo = getQuadrantInfo(task.quadrant);
  
  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`group relative p-3 rounded-lg border ${
        isDragging 
          ? 'bg-gray-50 shadow-lg border-primary-300 scale-105 opacity-50' 
          : task.completed 
            ? 'border-gray-200 bg-gray-50 opacity-60' 
            : 'border-gray-200 bg-white hover:border-primary-200 hover:shadow-sm'
      } transition-all duration-200 animate-fade-in`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-full border ${
            task.completed 
              ? 'bg-primary-500 border-primary-500 text-white' 
              : 'border-gray-300 hover:border-primary-500'
          } flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-300`}
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed && <Check size={12} />}
        </button>
        
        <div className="flex-1 min-w-0" {...listeners}>
          <div className="flex items-start justify-between gap-2">
            <h3 
              className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              {task.title}
            </h3>
            {showQuadrant && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${quadrantInfo.color}`}>
                {quadrantInfo.name}
              </span>
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs">
            {task.dueDate && (
              <span className={`flex items-center ${isOverdue ? 'text-error-600' : 'text-gray-500'}`}>
                <Clock size={14} className="mr-1" />
                {isOverdue ? `Overdue: ${formatDate(task.dueDate)}` : `Due: ${getRelativeTime(task.dueDate)}`}
              </span>
            )}
            
            {task.completed && task.completedAt && (
              <span className="flex items-center text-success-600">
                <CheckCircle size={14} className="mr-1" />
                Completed: {formatDate(task.completedAt)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Edit task"
        >
          <Edit size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="p-1.5 rounded-md hover:bg-error-50 text-gray-500 hover:text-error-600 transition-colors"
          aria-label="Delete task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;