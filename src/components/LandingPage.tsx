
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  GraduationCap, 
  Building, 
  Users, 
  Search, 
  FileText,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const collegeFeatures = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Post Job Opportunities",
      description: "Create and manage job postings for your college students"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Manage Applications",
      description: "Review and track student applications for posted positions"
    },
    {
      icon: <Building className="w-6 h-6" />,
      title: "College Dashboard",
      description: "Get insights into job posting performance and student engagement"
    }
  ];

  const studentFeatures = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Browse Jobs",
      description: "Discover job opportunities exclusive to your college network"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Easy Applications",
      description: "Apply to jobs with a simple click and optional cover letter"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Track Applications",
      description: "Monitor your application status and history"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Jobs" },
    { number: "50+", label: "Partner Colleges" },
    { number: "10K+", label: "Students" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-2">
              Welcome {user?.role === 'college' ? 'College Admin' : 'Student'}! 🎉
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Campus
              </span>
              <span className="text-foreground">Jobs</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {user?.role === 'college' 
                ? "Connect with talented students from your college. Post opportunities, manage applications, and build the future workforce."
                : "Discover exclusive job opportunities from your college network. Apply easily and track your progress."}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {user?.role === 'college' ? 'College Admin Features' : 'Student Features'}
            </h2>
            <p className="text-muted-foreground text-lg">
              {user?.role === 'college' 
                ? 'Everything you need to manage your college\'s job opportunities'
                : 'Tools to help you find and apply to the perfect job'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(user?.role === 'college' ? collegeFeatures : studentFeatures).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quick Actions */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">
                Ready to get started?
              </CardTitle>
              <CardDescription className="text-lg">
                {user?.role === 'college' 
                  ? 'Start posting jobs and connecting with students today'
                  : 'Explore job opportunities and start your career journey'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="gap-2">
                {user?.role === 'college' ? 'Go to Dashboard' : 'Browse Jobs'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
