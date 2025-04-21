import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent,
  DragOverlay, 
  DragStartEvent,
  closestCorners,
  defaultDropAnimationSideEffects,
  DropAnimation,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { 
  SortableContext, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { Quadrant, Task, DateFilter, ViewMode } from '../../types';
import TaskList from '../task/TaskList';
import TaskCard from '../task/TaskCard';
import CalendarView from '../calendar/CalendarView';
import useTaskStore from '../../store/taskStore';
import Modal from '../ui/Modal';
import TaskForm from '../task/TaskForm';
import { TaskFormData } from '../../types';
import { checkIsToday, checkIsThisWeek } from '../../utils/dateUtils';

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

// Helper functions
const getQuadrantTitle = (quadrant: Quadrant): string => {
  switch (quadrant) {
    case Quadrant.URGENT_IMPORTANT:
      return 'Do Now (Urgent & Important)';
    case Quadrant.NOT_URGENT_IMPORTANT:
      return 'Plan (Not Urgent but Important)';
    case Quadrant.URGENT_NOT_IMPORTANT:
      return 'Delegate (Urgent but Not Important)';
    case Quadrant.NOT_URGENT_NOT_IMPORTANT:
      return 'Eliminate (Not Urgent & Not Important)';
    default:
      return '';
  }
};

const QuadrantGrid: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    moveTask,
    reorderTasks,
    searchQuery,
    showCompleted,
    dateFilter,
    viewMode,
  } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [selectedQuadrant, setSelectedQuadrant] = useState<Quadrant>(Quadrant.URGENT_IMPORTANT);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Get active task for drag overlay
  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  // Filter tasks based on search, completion status, and date filter
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Completion filter
    const matchesCompletion = showCompleted || !task.completed;

    // Date filter
    let matchesDate = true;
    if (dateFilter === DateFilter.TODAY) {
      matchesDate = task.dueDate ? checkIsToday(task.dueDate) : false;
    } else if (dateFilter === DateFilter.THIS_WEEK) {
      matchesDate = task.dueDate ? checkIsThisWeek(task.dueDate) : false;
    }

    return matchesSearch && matchesCompletion && matchesDate;
  });

  // Group tasks by quadrant
  const getTasksByQuadrant = (quadrant: Quadrant) => {
    return filteredTasks.filter((task) => task.quadrant === quadrant);
  };

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  // Handle drag over
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find(t => t.id === active.id);
    if (!activeTask) return;

    // Check if we're dropping into a quadrant
    if (Object.values(Quadrant).includes(over.id as Quadrant)) {
      const targetQuadrant = over.id as Quadrant;
      if (activeTask.quadrant !== targetQuadrant) {
        moveTask(active.id as string, targetQuadrant);
      }
    }
    // If dropping over another task
    else {
      const overTask = tasks.find(t => t.id === over.id);
      if (!overTask) return;

      if (activeTask.quadrant !== overTask.quadrant) {
        moveTask(active.id as string, overTask.quadrant);
      }
    }
  };

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping onto a task (not a quadrant)
    if (!Object.values(Quadrant).includes(overId as Quadrant)) {
      reorderTasks(activeId, overId);
    }
  };

  // Handle task actions
  const handleAddTask = (quadrant: Quadrant = Quadrant.URGENT_IMPORTANT) => {
    setSelectedQuadrant(quadrant);
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setSelectedQuadrant(task.quadrant);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  const handleSubmitTask = (data: TaskFormData) => {
    const taskData = {
      ...data,
      quadrant: selectedQuadrant,
    };

    if (currentTask) {
      updateTask(currentTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setIsModalOpen(false);
  };

  const handleDeleteCurrentTask = () => {
    if (currentTask) {
      deleteTask(currentTask.id);
      setIsModalOpen(false);
    }
  };

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Quadrant 1: Do Now */}
      <div className="h-[calc(50vh-6rem)] min-h-[300px]">
        <TaskList
          quadrantId={Quadrant.URGENT_IMPORTANT}
          title={getQuadrantTitle(Quadrant.URGENT_IMPORTANT)}
          tasks={getTasksByQuadrant(Quadrant.URGENT_IMPORTANT)}
          onToggleComplete={toggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      </div>

      {/* Quadrant 2: Plan */}
      <div className="h-[calc(50vh-6rem)] min-h-[300px]">
        <TaskList
          quadrantId={Quadrant.NOT_URGENT_IMPORTANT}
          title={getQuadrantTitle(Quadrant.NOT_URGENT_IMPORTANT)}
          tasks={getTasksByQuadrant(Quadrant.NOT_URGENT_IMPORTANT)}
          onToggleComplete={toggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      </div>

      {/* Quadrant 3: Delegate */}
      <div className="h-[calc(50vh-6rem)] min-h-[300px]">
        <TaskList
          quadrantId={Quadrant.URGENT_NOT_IMPORTANT}
          title={getQuadrantTitle(Quadrant.URGENT_NOT_IMPORTANT)}
          tasks={getTasksByQuadrant(Quadrant.URGENT_NOT_IMPORTANT)}
          onToggleComplete={toggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      </div>

      {/* Quadrant 4: Eliminate */}
      <div className="h-[calc(50vh-6rem)] min-h-[300px]">
        <TaskList
          quadrantId={Quadrant.NOT_URGENT_NOT_IMPORTANT}
          title={getQuadrantTitle(Quadrant.NOT_URGENT_NOT_IMPORTANT)}
          tasks={getTasksByQuadrant(Quadrant.NOT_URGENT_NOT_IMPORTANT)}
          onToggleComplete={toggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-6">
      {Object.values(Quadrant).map((quadrant) => (
        <TaskList
          key={quadrant}
          quadrantId={quadrant}
          title={getQuadrantTitle(quadrant)}
          tasks={getTasksByQuadrant(quadrant)}
          onToggleComplete={toggleTaskCompletion}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onAddTask={handleAddTask}
        />
      ))}
    </div>
  );

  const renderAllTasksView = () => {
    const allTasks = [...filteredTasks].sort((a, b) => {
      // Sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by quadrant priority
      if (a.quadrant !== b.quadrant) {
        return parseInt(a.quadrant) - parseInt(b.quadrant);
      }
      // Then by due date if available
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      // Finally by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
      <div className="max-w-3xl mx-auto space-y-3">
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">All Tasks</h2>
          <SortableContext items={allTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {allTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={toggleTaskCompletion}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
    );
  };

  const renderCalendarView = () => (
    <CalendarView
      tasks={filteredTasks}
      onToggleComplete={toggleTaskCompletion}
      onEdit={handleEditTask}
      onDelete={handleDeleteTask}
      onAddTask={() => handleAddTask()}
    />
  );

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
      measuring={measuring}
    >
      <div className="flex-1 px-8 py-4">
        {viewMode === ViewMode.GRID && renderGridView()}
        {viewMode === ViewMode.LIST && renderListView()}
        {viewMode === ViewMode.ALL && renderAllTasksView()}
        {viewMode === ViewMode.CALENDAR && renderCalendarView()}
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={dropAnimation}>
        {activeTask ? (
          <div className="opacity-80">
            <TaskCard
              task={activeTask}
              onToggleComplete={toggleTaskCompletion}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>
        ) : null}
      </DragOverlay>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentTask ? 'Edit Task' : 'Add Task'}
      >
        <TaskForm
          onSubmit={handleSubmitTask}
          onCancel={() => setIsModalOpen(false)}
          onDelete={currentTask ? handleDeleteCurrentTask : undefined}
          initialData={currentTask || { title: '', description: '', dueDate: '', quadrant: selectedQuadrant }}
        />
      </Modal>
    </DndContext>
  );
};

export default QuadrantGrid;