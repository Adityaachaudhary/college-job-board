
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left space-y-6"
        >
          <h1 className="text-4xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Campus
            </span>
            <span className="text-foreground">Jobs</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Connect colleges with talented students. Build careers, shape futures.
          </p>
          
          <div className="space-y-4 text-muted-foreground">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Colleges post exclusive opportunities</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Students find jobs in their campus network</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Seamless application process</span>
            </div>
          </div>
        </motion.div>

        {/* Right side - Auth Form */}
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
