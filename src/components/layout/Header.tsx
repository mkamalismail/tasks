import React, { useState, useEffect } from 'react';
import { Search, Calendar, CalendarDays, CalendarRange, CheckCircle2, LayoutGrid, List, ListFilter, User, Target, Menu } from 'lucide-react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        isScrolled 
          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 shadow-lg' 
          : 'bg-gradient-to-r from-primary-500 to-secondary-500'
      }`}
    >
      <div className="container mx-auto px-4">
        {/* Top row with logo, search, and profile */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <Target className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">EMatrix</h1>
          </div>

          <div className="flex-1 max-w-md mx-auto px-4 hidden sm:block">
            <div className="flex items-center w-full bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 border border-white/20">
              <Search size={18} className="text-white/70" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="ml-2 bg-transparent outline-none w-full text-white placeholder-white/70"
                aria-label="Search tasks"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden text-white hover:bg-white/10"
              icon={<Menu size={20} />}
              aria-label="Toggle menu"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={onProfileClick}
              className="flex items-center gap-2 text-white hover:bg-white/10"
              icon={<User size={16} />}
            >
              <span className="hidden sm:inline">{user?.displayName || 'Profile'}</span>
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="sm:hidden px-2 pb-3">
          <div className="flex items-center w-full bg-white/10 backdrop-blur-sm rounded-md px-3 py-2 border border-white/20">
            <Search size={18} className="text-white/70" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="ml-2 bg-transparent outline-none w-full text-white placeholder-white/70"
              aria-label="Search tasks"
            />
          </div>
        </div>

        {/* Bottom row with filters */}
        <div className={`py-3 border-t border-white/10 ${isMenuOpen ? 'block' : 'hidden sm:block'}`}>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 sm:gap-8 sm:justify-between">
            {/* Due Date Filter Group */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-white/70">Due Date Filter</span>
              <div className="flex flex-wrap items-center gap-2">
                <Button 
                  size="sm" 
                  variant={getFilterButtonVariant(DateFilter.ALL)}
                  onClick={() => handleDateFilterClick(DateFilter.ALL)}
                  icon={<CalendarRange size={16} />}
                  className={`flex-1 sm:flex-none ${dateFilter === DateFilter.ALL
                    ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  All
                </Button>
                
                <Button 
                  size="sm" 
                  variant={getFilterButtonVariant(DateFilter.TODAY)}
                  onClick={() => handleDateFilterClick(DateFilter.TODAY)}
                  icon={<Calendar size={16} />}
                  className={`flex-1 sm:flex-none ${dateFilter === DateFilter.TODAY
                    ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  Today
                </Button>
                
                <Button 
                  size="sm" 
                  variant={getFilterButtonVariant(DateFilter.THIS_WEEK)}
                  onClick={() => handleDateFilterClick(DateFilter.THIS_WEEK)}
                  icon={<CalendarDays size={16} />}
                  className={`flex-1 sm:flex-none ${dateFilter === DateFilter.THIS_WEEK
                    ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  This Week
                </Button>
              </div>
            </div>

            {/* Task View Group */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-white/70">Task View</span>
              <div className="grid grid-cols-2 sm:flex items-center gap-2">
                <Button
                  size="sm"
                  variant={viewMode === ViewMode.GRID ? 'primary' : 'outline'}
                  onClick={() => setViewMode(ViewMode.GRID)}
                  icon={<LayoutGrid size={16} />}
                  className={viewMode === ViewMode.GRID 
                    ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }
                >
                  Grid
                </Button>
                
                <Button
                  size="sm"
                  variant={viewMode === ViewMode.LIST ? 'primary' : 'outline'}
                  onClick={() => setViewMode(ViewMode.LIST)}
                  icon={<List size={16} />}
                  className={viewMode === ViewMode.LIST
                    ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }
                >
                  List
                </Button>

                <Button
                  size="sm"
                  variant={viewMode === ViewMode.CALENDAR ? 'primary' : 'outline'}
                  onClick={() => setViewMode(ViewMode.CALENDAR)}
                  icon={<Calendar size={16} />}
                  className={viewMode === ViewMode.CALENDAR
                    ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }
                >
                  Calendar
                </Button>

                <Button
                  size="sm"
                  variant={viewMode === ViewMode.ALL ? 'primary' : 'outline'}
                  onClick={() => setViewMode(ViewMode.ALL)}
                  icon={<ListFilter size={16} />}
                  className={viewMode === ViewMode.ALL
                    ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }
                >
                  All
                </Button>
              </div>
            </div>

            {/* Completed Tasks Toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-white/70">Completed Tasks</span>
              <Button
                size="sm"
                variant={showCompleted ? 'primary' : 'outline'}
                onClick={() => setShowCompleted(!showCompleted)}
                icon={<CheckCircle2 size={16} />}
                className={`w-full sm:w-auto ${showCompleted
                  ? 'bg-primary-700 text-white border-primary-800 hover:bg-primary-800'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {showCompleted ? 'Showing' : 'Hidden'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;