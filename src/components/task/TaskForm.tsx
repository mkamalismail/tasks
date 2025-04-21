import React, { useState, useEffect } from 'react';
import { Task, Quadrant, TaskFormData } from '../../types';
import Button from '../ui/Button';
import { Save, Trash2 } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  onDelete?: () => void;
  initialData?: Task | Partial<TaskFormData>;
}

const initialFormState: TaskFormData = {
  title: '',
  description: '',
  dueDate: '',
  dueTime: '',
  quadrant: Quadrant.URGENT_IMPORTANT,
};

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  onDelete,
  initialData,
}) => {
  const [formData, setFormData] = useState<TaskFormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  // If initialData is provided, populate the form
  useEffect(() => {
    if (initialData) {
      const dueDateTime = initialData.dueDate ? new Date(initialData.dueDate) : null;
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        dueDate: dueDateTime ? dueDateTime.toISOString().split('T')[0] : '',
        dueTime: dueDateTime ? dueDateTime.toTimeString().slice(0, 5) : '',
        quadrant: initialData.quadrant || Quadrant.URGENT_IMPORTANT,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof TaskFormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Combine date and time if both are provided
      const combinedData = {
        ...formData,
        dueDate: formData.dueDate && formData.dueTime
          ? new Date(`${formData.dueDate}T${formData.dueTime}`).toISOString()
          : formData.dueDate
          ? new Date(`${formData.dueDate}T00:00:00`).toISOString()
          : '',
      };
      
      onSubmit(combinedData);
    }
  };

  // Check if we're editing an existing task
  const isEditing = initialData && 'id' in initialData;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-error-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.title ? 'border-error-500 focus:ring-error-500' : 'border-gray-300 focus:ring-primary-500'
          } focus:ring-2 focus:outline-none`}
          placeholder="Enter task title"
          autoFocus
        />
        {errors.title && <p className="mt-1 text-xs text-error-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
          placeholder="Enter task description (optional)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
            Due Time
          </label>
          <input
            type="time"
            id="dueTime"
            name="dueTime"
            value={formData.dueTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="quadrant" className="block text-sm font-medium text-gray-700 mb-1">
          Quadrant
        </label>
        <select
          id="quadrant"
          name="quadrant"
          value={formData.quadrant}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white"
        >
          <option value={Quadrant.URGENT_IMPORTANT}>Do Now (Urgent & Important)</option>
          <option value={Quadrant.NOT_URGENT_IMPORTANT}>Plan (Not Urgent but Important)</option>
          <option value={Quadrant.URGENT_NOT_IMPORTANT}>Delegate (Urgent but Not Important)</option>
          <option value={Quadrant.NOT_URGENT_NOT_IMPORTANT}>Eliminate (Not Urgent & Not Important)</option>
        </select>
      </div>

      <div className="flex justify-between pt-2">
        {onDelete && isEditing && (
          <Button
            type="button"
            variant="danger"
            onClick={onDelete}
            icon={<Trash2 size={16} />}
          >
            Delete
          </Button>
        )}
        
        <div className="flex gap-2 ml-auto">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" icon={<Save size={16} />}>
            {isEditing ? 'Update Task' : 'Add Task'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;