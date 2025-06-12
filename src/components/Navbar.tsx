
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Palette, Briefcase } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', color: '#ffffff' },
    { value: 'dark', label: 'Dark', color: '#1a1a1a' },
    { value: 'blue', label: 'Ocean Blue', color: '#3b82f6' },
    { value: 'green', label: 'Forest Green', color: '#10b981' },
    { value: 'purple', label: 'Royal Purple', color: '#8b5cf6' },
  ];

  const handleLogoClick = () => {
    // Navigate to landing page - in a real app you'd use router
    window.location.reload();
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-card/95 backdrop-blur-lg border-b border-primary/20 sticky top-0 z-50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              CampusJobs
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10 border-primary/20">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTheme(option.value as any)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div 
                      className="w-4 h-4 rounded-full border shadow-sm"
                      style={{ backgroundColor: option.color }}
                    />
                    <span>{option.label}</span>
                    {theme === option.value && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10 border-primary/20">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    <User className="w-4 h-4 mr-2" />
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {user.role === 'college' ? 'College Admin' : 'Student'}
                  </DropdownMenuItem>
                  {user.collegeName && (
                    <DropdownMenuItem className="text-muted-foreground cursor-default">
                      <div className="w-4 h-4 mr-2 bg-primary/20 rounded-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                      {user.collegeName}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer hover:bg-destructive/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
