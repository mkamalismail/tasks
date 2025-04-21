import { format, isToday, isThisWeek, isPast, parseISO } from 'date-fns';

/**
 * Format date to display in the UI
 */
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = parseISO(dateString);
  const time = format(date, 'HH:mm');
  return `${format(date, 'MMM d, yyyy')} at ${time}`;
};

/**
 * Check if a date is today
 */
export const checkIsToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  return isToday(parseISO(dateString));
};

/**
 * Check if a date is within this week
 */
export const checkIsThisWeek = (dateString: string | null): boolean => {
  if (!dateString) return false;
  return isThisWeek(parseISO(dateString));
};

/**
 * Check if a date is in the past (overdue)
 */
export const checkIsOverdue = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const date = parseISO(dateString);
  return isPast(date) && !isToday(date);
};

/**
 * Get a human-readable relative time description
 */
export const getRelativeTime = (dateString: string | null): string => {
  if (!dateString) return '';
  
  const date = parseISO(dateString);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (isToday(date)) {
    return `Today at ${format(date, 'HH:mm')}`;
  }
  if (diffDays === 1) {
    return `Tomorrow at ${format(date, 'HH:mm')}`;
  }
  if (diffDays > 0 && diffDays < 7) {
    return `In ${diffDays} days at ${format(date, 'HH:mm')}`;
  }
  if (diffDays < 0) {
    return `${Math.abs(diffDays)} days ago at ${format(date, 'HH:mm')}`;
  }
  
  return format(date, 'MMM d') + ' at ' + format(date, 'HH:mm');
};