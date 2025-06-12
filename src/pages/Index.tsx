
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthPage from '@/components/AuthPage';
import Dashboard from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Navigation buttons */}
      <div className="bg-card/50 border-b border-border/50 px-4 py-2">
        <div className="max-w-7xl mx-auto flex gap-2">
          <Button
            variant={currentView === 'landing' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('landing')}
          >
            Home
          </Button>
          <Button
            variant={currentView === 'dashboard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView('dashboard')}
          >
            {user.role === 'college' ? 'Admin Dashboard' : 'Job Dashboard'}
          </Button>
        </div>
      </div>

      {currentView === 'landing' ? <LandingPage /> : <Dashboard />}
    </div>
  );
};

const Index = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Index;
