import React, { useState, useEffect } from 'react';
import { Search, Calendar, CalendarDays, CalendarRange, CheckCircle2, LayoutGrid, List, ListFilter, User } from 'lucide-react';
import useTaskStore from '../../store/taskStore';
import useAuthStore from '../../store/authStore';
import { DateFilter, ViewMode } from '../../types';
import Button from '../ui/Button';

interface HeaderProps {
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    showCompleted, 
    setShowCompleted,
    dateFilter,
    setDateFilter,
    viewMode,
    setViewMode,
  } = useTaskStore();

  const { user } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState(searchQuery);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, setSearchQuery]);

  const handleDateFilterClick = (filter: DateFilter) => {
    setDateFilter(filter);
  };

  const getFilterButtonVariant = (filter: DateFilter) => {
    return dateFilter === filter ? 'primary' : 'outline';
  };

  return (
    <header 
      className={`sticky top-0 z-10 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800">Eisenhower Matrix</h1>
            <Button
              size="sm"
              variant="ghost"
              onClick={onProfileClick}
              className="flex items-center gap-2"
              icon={<User size={16} />}
            >
              {user?.displayName || 'Profile'}
            </Button>
          </div>
          
          <div className="flex items-center w-full md:w-auto bg-gray-100 rounded-md px-3 py-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full"
              aria-label="Search tasks"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-2 ml-auto">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant={getFilterButtonVariant(DateFilter.ALL)}
                onClick={() => handleDateFilterClick(DateFilter.ALL)}
                icon={<CalendarRange size={16} />}
              >
                All
              </Button>
              
              <Button 
                size="sm" 
                variant={getFilterButtonVariant(DateFilter.TODAY)}
                onClick={() => handleDateFilterClick(DateFilter.TODAY)}
                icon={<Calendar size={16} />}
              >
                Today
              </Button>
              
              <Button 
                size="sm" 
                variant={getFilterButtonVariant(DateFilter.THIS_WEEK)}
                onClick={() => handleDateFilterClick(DateFilter.THIS_WEEK)}
                icon={<CalendarDays size={16} />}
              >
                This Week
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={viewMode === ViewMode.GRID ? 'primary' : 'outline'}
                onClick={() => setViewMode(ViewMode.GRID)}
                icon={<LayoutGrid size={16} />}
              >
                Grid
              </Button>
              
              <Button
                size="sm"
                variant={viewMode === ViewMode.LIST ? 'primary' : 'outline'}
                onClick={() => setViewMode(ViewMode.LIST)}
                icon={<List size={16} />}
              >
                List
              </Button>

              <Button
                size="sm"
                variant={viewMode === ViewMode.CALENDAR ? 'primary' : 'outline'}
                onClick={() => setViewMode(ViewMode.CALENDAR)}
                icon={<Calendar size={16} />}
              >
                Calendar
              </Button>

              <Button
                size="sm"
                variant={viewMode === ViewMode.ALL ? 'primary' : 'outline'}
                onClick={() => setViewMode(ViewMode.ALL)}
                icon={<ListFilter size={16} />}
              >
                All Tasks
              </Button>
            </div>
            
            <Button
              size="sm"
              variant={showCompleted ? 'primary' : 'outline'}
              onClick={() => setShowCompleted(!showCompleted)}
              icon={<CheckCircle2 size={16} />}
            >
              {showCompleted ? 'Showing Completed' : 'Hide Completed'}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;