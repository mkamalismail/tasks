import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Task, TaskFormData, Quadrant, DateFilter, ViewMode, TaskStoreState } from '../types';
import useAuthStore from './authStore';

const COLLECTION_NAME = 'tasks';

const useTaskStore = create<TaskStoreState>()((set, get) => {
  // Initialize listener for real-time updates
  const setupTaskListener = (userId: string) => {
    const tasksRef = collection(db, COLLECTION_NAME);
    // Simplified query that only filters by userId without ordering
    const q = query(
      tasksRef,
      where('userId', '==', userId)
    );

    return onSnapshot(q, {
      next: (snapshot) => {
        // Sort tasks by dueDate and createdAt client-side
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];

        // Client-side sorting by dueDate and createdAt
        tasks.sort((a, b) => {
          // First sort by dueDate. Tasks without a due date should appear last.
          const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          if (dateA !== dateB) return dateA - dateB;

          // If dueDates are equal, sort by createdAt
          const createdAtA = new Date(a.createdAt).getTime();
          const createdAtB = new Date(b.createdAt).getTime();
          return createdAtB - createdAtA;
        });

        set({ tasks });
      },
      error: (error) => {
        console.error('Error listening to tasks:', error);
        // Clear tasks if permission is denied to avoid stale state
        if ((error as { code?: string }).code === 'permission-denied') {
          set({ tasks: [] });
        }
      }
    });
  };

  // Get current user
  const { user } = useAuthStore.getState();
  let unsubscribe: (() => void) | null = null;

  if (user) {
    unsubscribe = setupTaskListener(user.uid);
  }

  // Listen for auth state changes
  useAuthStore.subscribe((state) => {
    if (unsubscribe) {
      unsubscribe();
    }
    if (state.user) {
      unsubscribe = setupTaskListener(state.user.uid);
    } else {
      set({ tasks: [] });
    }
  });

  return {
    tasks: [],
    searchQuery: '',
    showCompleted: true,
    dateFilter: DateFilter.ALL,
    viewMode: ViewMode.GRID,

    addTask: async (taskData: TaskFormData) => {
      const user = useAuthStore.getState().user;
      if (!user) return;

      const newTask = {
        ...taskData,
        userId: user.uid,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      try {
        await addDoc(collection(db, COLLECTION_NAME), newTask);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    },

    updateTask: async (id: string, taskData: Partial<TaskFormData>) => {
      try {
        const taskRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(taskRef, taskData);
      } catch (error) {
        console.error('Error updating task:', error);
      }
    },

    deleteTask: async (id: string) => {
      try {
        const taskRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(taskRef);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    },

    toggleTaskCompletion: async (id: string) => {
      const task = get().tasks.find(t => t.id === id);
      if (!task) return;

      try {
        const taskRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(taskRef, {
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : null,
        });
      } catch (error) {
        console.error('Error toggling task completion:', error);
      }
    },

    moveTask: async (taskId: string, targetQuadrant: Quadrant) => {
      try {
        const taskRef = doc(db, COLLECTION_NAME, taskId);
        await updateDoc(taskRef, { quadrant: targetQuadrant });
      } catch (error) {
        console.error('Error moving task:', error);
      }
    },

    reorderTasks: async (taskId: string, overId: string) => {
      // For simplicity, we're not implementing task reordering in Firestore
      console.log('Task reordering not implemented in Firestore');
    },

    setSearchQuery: (query: string) => {
      set({ searchQuery: query });
    },

    setShowCompleted: (show: boolean) => {
      set({ showCompleted: show });
    },

    setDateFilter: (filter: DateFilter) => {
      set({ dateFilter: filter });
    },

    setViewMode: (mode: ViewMode) => {
      set({ viewMode: mode });
    },
  };
});

export default useTaskStore;