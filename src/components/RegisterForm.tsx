
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, GraduationCap, Building } from 'lucide-react';

interface RegisterFormProps {
  onToggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    collegeName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'college' | 'student'>('student');
  
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password || !formData.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (role === 'student' && !formData.collegeName) {
      toast({
        title: "Error",
        description: "Please enter your college name",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const success = await register(
      formData.email, 
      formData.password, 
      formData.name, 
      role,
      formData.collegeName
    );
    
    if (success) {
      toast({
        title: "Account created!",
        description: "Welcome to CampusJobs! You are now logged in.",
      });
    } else {
      toast({
        title: "Registration failed",
        description: "An account with this email already exists.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="glass-effect border-border/50">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join CampusJobs today</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(value) => setRole(value as 'college' | 'student')}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="college" className="flex items-center gap-2">
                <Building className="w-4 h-4" />
                College
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  {role === 'college' ? 'College Name' : 'Full Name'}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={role === 'college' ? 'Enter college name' : 'Enter your full name'}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              {role === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="collegeName">College Name</Label>
                  <Input
                    id="collegeName"
                    type="text"
                    placeholder="Enter your college name"
                    value={formData.collegeName}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                    className="transition-all duration-200 focus:scale-[1.02]"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="transition-all duration-200 focus:scale-[1.02] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="transition-all duration-200 focus:scale-[1.02]"
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  onClick={onToggleForm}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RegisterForm;
