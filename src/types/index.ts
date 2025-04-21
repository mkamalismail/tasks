// Task priority quadrants based on Eisenhower Matrix
export enum Quadrant {
  URGENT_IMPORTANT = "1",
  NOT_URGENT_IMPORTANT = "2",
  URGENT_NOT_IMPORTANT = "3",
  NOT_URGENT_NOT_IMPORTANT = "4"
}

// Date filter options
export enum DateFilter {
  ALL = "all",
  TODAY = "today",
  THIS_WEEK = "this_week"
}

// View mode options
export enum ViewMode {
  GRID = "grid",
  LIST = "list",
  ALL = "all",
  CALENDAR = "calendar"
}

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  quadrant: Quadrant;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}

// Task form data for creating/editing tasks
export interface TaskFormData {
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  quadrant: Quadrant;
}

// Application store state
export interface TaskStoreState {
  tasks: Task[];
  searchQuery: string;
  showCompleted: boolean;
  dateFilter: DateFilter;
  viewMode: ViewMode;
  addTask: (task: TaskFormData) => void;
  updateTask: (id: string, task: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  moveTask: (taskId: string, targetQuadrant: Quadrant) => void;
  reorderTasks: (taskId: string, overId: string) => void;
  setSearchQuery: (query: string) => void;
  setShowCompleted: (show: boolean) => void;
  setDateFilter: (filter: DateFilter) => void;
  setViewMode: (mode: ViewMode) => void;
}