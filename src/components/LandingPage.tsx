
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Footer from './Footer';
import { 
  Briefcase, 
  GraduationCap, 
  Building, 
  Users, 
  Search, 
  FileText,
  CheckCircle,
  Star,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { user } = useAuth();

  const collegeFeatures = [
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Post Job Opportunities",
      description: "Create and manage job postings for your college students with advanced filtering and categorization"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Manage Applications",
      description: "Review, approve, or reject student applications with detailed candidate profiles and insights"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Get insights into job posting performance, student engagement, and hiring success rates"
    }
  ];

  const studentFeatures = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Discover Opportunities",
      description: "Browse exclusive job opportunities tailored to your college network and skill set"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Smart Applications",
      description: "Apply to jobs with one click and track your application status in real-time"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Career Growth",
      description: "Build your professional network and advance your career with industry connections"
    }
  ];

  const stats = [
    { number: "2,500+", label: "Active Jobs", icon: <Briefcase className="w-5 h-5" /> },
    { number: "150+", label: "Partner Colleges", icon: <Building className="w-5 h-5" /> },
    { number: "50K+", label: "Students", icon: <GraduationCap className="w-5 h-5" /> },
    { number: "98%", label: "Success Rate", icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge variant="outline" className="mb-6 px-6 py-3 text-base bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Welcome {user?.role === 'college' ? 'College Admin' : 'Student'}! 🎉
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Campus
              </span>
              <span className="text-foreground">Jobs</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
              {user?.role === 'college' 
                ? "Connect with talented students from your college. Post opportunities, manage applications, and build the future workforce with our comprehensive platform."
                : "Discover exclusive job opportunities from your college network. Apply easily, track your progress, and launch your career with confidence."}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                className="text-center bg-gradient-to-br from-card to-card/50 p-6 rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-center justify-center mb-3 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
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
        className="px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Badge variant="outline" className="mb-4 px-4 py-2 bg-primary/5 border-primary/20">
                <Star className="w-4 h-4 mr-2" />
                Features
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {user?.role === 'college' ? 'College Admin Features' : 'Student Features'}
              </h2>
              <p className="text-muted-foreground text-xl max-w-3xl mx-auto">
                {user?.role === 'college' 
                  ? 'Everything you need to manage your college\'s job opportunities and connect with talented students'
                  : 'Powerful tools to help you find the perfect job and advance your career'}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(user?.role === 'college' ? collegeFeatures : studentFeatures).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl bg-gradient-to-br from-card to-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
            <CardHeader className="text-center pb-4 relative">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.4, type: "spring" }}
              >
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              </motion.div>
              <CardTitle className="text-3xl md:text-4xl font-bold">
                Ready to get started?
              </CardTitle>
              <CardDescription className="text-lg mt-4">
                {user?.role === 'college' 
                  ? 'Start posting jobs and connecting with talented students today'
                  : 'Explore amazing job opportunities and kickstart your career journey'}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-8 relative">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-lg px-8 py-6 gap-3 transition-all duration-300 transform hover:scale-105">
                {user?.role === 'college' ? 'Go to Dashboard' : 'Browse Jobs'}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

export default LandingPage;
