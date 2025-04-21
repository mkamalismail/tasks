import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, Quadrant } from '../../types';
import TaskCard from './TaskCard';
import { CheckCircle2, Clock, ListTodo, Trash2 } from 'lucide-react';

interface TaskListProps {
  quadrantId: Quadrant;
  title: string;
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onAddTask: (quadrant: Quadrant) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  quadrantId,
  title,
  tasks,
  onToggleComplete,
  onEdit,
  onDelete,
  onAddTask,
}) => {
  const { setNodeRef } = useDroppable({
    id: quadrantId,
  });

  // Separate completed tasks to show at the bottom
  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  // Quadrant-specific styles and icons
  const quadrantStyles: Record<Quadrant, {
    borderColor: string,
    bgColor: string,
    hoverBg: string,
    icon: JSX.Element,
  }> = {
    [Quadrant.URGENT_IMPORTANT]: {
      borderColor: 'border-primary-500',
      bgColor: 'bg-primary-500',
      hoverBg: 'hover:bg-primary-600',
      icon: <Clock size={18} className="text-primary-500" />,
    },
    [Quadrant.NOT_URGENT_IMPORTANT]: {
      borderColor: 'border-secondary-500',
      bgColor: 'bg-secondary-500',
      hoverBg: 'hover:bg-secondary-600',
      icon: <ListTodo size={18} className="text-secondary-500" />,
    },
    [Quadrant.URGENT_NOT_IMPORTANT]: {
      borderColor: 'border-accent-500',
      bgColor: 'bg-accent-500',
      hoverBg: 'hover:bg-accent-600',
      icon: <CheckCircle2 size={18} className="text-accent-500" />,
    },
    [Quadrant.NOT_URGENT_NOT_IMPORTANT]: {
      borderColor: 'border-error-500',
      bgColor: 'bg-error-500',
      hoverBg: 'hover:bg-error-600',
      icon: <Trash2 size={18} className="text-error-500" />,
    }
  };

  const style = quadrantStyles[quadrantId];

  return (
    <div
      ref={setNodeRef}
      className={`h-full flex flex-col bg-white rounded-lg shadow-md border-t-4 ${style.borderColor}`}
    >
      <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {style.icon}
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <span className="text-sm bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No tasks in this quadrant
          </div>
        )}

        {/* Active tasks */}
        <SortableContext items={activeTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                showQuadrant={false}
              />
            ))}
          </div>
        </SortableContext>

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-6 pt-3 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 mb-3">COMPLETED</h4>
            <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    showQuadrant={false}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        )}
      </div>

      {/* Add Task Button */}
      <div className="p-3 border-t bg-gray-50">
        <button
          onClick={() => onAddTask(quadrantId)}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium text-white transition-colors ${style.bgColor} ${style.hoverBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${style.borderColor.split('-')[1]}`}
        >
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskList;