import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, MapPin, BookOpen, User } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/trips', icon: MapPin, label: 'My Trips' },
    { to: '/diary', icon: BookOpen, label: 'Diary' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
          
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center py-2 px-3 transition-smooth ${
                isActive 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'fill-current' : ''}`} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;