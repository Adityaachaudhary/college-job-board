
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

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              CampusJobs
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Theme
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTheme(option.value as any)}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: option.color }}
                    />
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {user.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground">
                    Role: {user.role === 'college' ? 'College Admin' : 'Student'}
                  </DropdownMenuItem>
                  {user.collegeName && (
                    <DropdownMenuItem className="text-muted-foreground">
                      {user.collegeName}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout} className="text-destructive">
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
