import React from 'react';
import useTaskStore from '../../store/taskStore';

const Footer: React.FC = () => {
  const { tasks } = useTaskStore();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <footer className="w-full bg-white border-t py-2 px-4 mt-auto">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <div>
            <span className="font-medium">Total Tasks:</span> {totalTasks}
          </div>
          <div>
            <span className="font-medium">Completed:</span> {completedTasks} ({completionPercentage}%)
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2 items-center">
            <div className="h-2 bg-gray-200 rounded-full w-36 sm:w-48">
              <div 
                className="h-2 bg-primary-600 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
                aria-label={`${completionPercentage}% completed`}
              ></div>
            </div>
            <span>{completionPercentage}%</span>
          </div>
          <div className="text-gray-500">
            © {new Date().getFullYear()} <a href="https://www.exology.co" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">Exology</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;