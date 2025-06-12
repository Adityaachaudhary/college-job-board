
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
import { User, LogOut, Palette, Briefcase, Sparkles } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light', color: '#ffffff', gradient: 'from-gray-50 to-white' },
    { value: 'dark', label: 'Dark', color: '#1a1a1a', gradient: 'from-gray-900 to-black' },
    { value: 'blue', label: 'Ocean Blue', color: '#3b82f6', gradient: 'from-blue-400 to-blue-600' },
    { value: 'green', label: 'Forest Green', color: '#10b981', gradient: 'from-emerald-400 to-green-600' },
    { value: 'purple', label: 'Royal Purple', color: '#8b5cf6', gradient: 'from-purple-400 to-violet-600' },
  ];

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-card/95 via-card to-card/95 backdrop-blur-xl border-b border-primary/30 sticky top-0 z-50 shadow-xl shadow-primary/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div 
            className="flex items-center space-x-3 cursor-pointer group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogoClick}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-all duration-300">
              <Briefcase className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              CampusJobs
            </h1>
          </motion.div>

          <div className="flex items-center space-x-4">
            {/* Theme Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-10 h-10 p-0 rounded-full hover:bg-primary/10 border-primary/20 transition-all duration-300 hover:scale-110"
                >
                  <Palette className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-xl border-primary/20">
                {themeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setTheme(option.value as any)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-primary/10 transition-all duration-200"
                  >
                    <div 
                      className={`w-6 h-6 rounded-full border-2 border-white shadow-md bg-gradient-to-r ${option.gradient}`}
                    />
                    <span className="font-medium">{option.label}</span>
                    {theme === option.value && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 bg-primary rounded-full"
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 hover:bg-primary/10 border-primary/20 transition-all duration-300 hover:scale-105"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-primary/70 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <span className="hidden sm:inline font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-card/95 backdrop-blur-xl border-primary/20">
                  <DropdownMenuItem className="text-muted-foreground cursor-default hover:bg-primary/5">
                    <User className="w-4 h-4 mr-2" />
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground cursor-default hover:bg-primary/5">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {user.role === 'college' ? 'College Admin' : 'Student'}
                  </DropdownMenuItem>
                  {user.collegeName && (
                    <DropdownMenuItem className="text-muted-foreground cursor-default hover:bg-primary/5">
                      <div className="w-4 h-4 mr-2 bg-gradient-to-r from-primary/30 to-primary/50 rounded-sm flex items-center justify-center">
                        <Sparkles className="w-2 h-2 text-primary" />
                      </div>
                      {user.collegeName}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-destructive cursor-pointer hover:bg-destructive/10 transition-colors duration-200"
                  >
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
