
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JobCard from './JobCard';
import CreateJobForm from './CreateJobForm';
import { Search, Plus, Briefcase, Users, Calendar, CheckCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, getStudentApplications } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState('jobs');

  const studentApplications = user?.role === 'student' ? getStudentApplications() : [];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = {
    totalJobs: jobs.length,
    applications: user?.role === 'student' ? studentApplications.length : 
                  jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0),
    activeJobs: jobs.filter(job => new Date(job.deadline) > new Date()).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user?.role === 'college' ? 'College Dashboard' : 'Student Dashboard'}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'college' 
                ? 'Manage your job postings and applications'
                : `Welcome back, ${user?.name}! Find your next opportunity.`}
            </p>
          </div>
          
          {user?.role === 'college' && (
            <Button onClick={() => setShowCreateForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Post New Job
            </Button>
          )}
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'college' ? 'Total Jobs Posted' : 'Available Jobs'}
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user?.role === 'college' ? 'Total Applications' : 'Applications Sent'}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applications}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeJobs}</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="jobs">
              {user?.role === 'college' ? 'My Job Posts' : 'Available Jobs'}
            </TabsTrigger>
            {user?.role === 'student' && (
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Jobs Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence>
                    {filteredJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <CardTitle className="mb-2">No jobs found</CardTitle>
                    <CardDescription>
                      {user?.role === 'college' 
                        ? 'Start by posting your first job opportunity.'
                        : 'Check back later for new opportunities from your college.'}
                    </CardDescription>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </TabsContent>

          {user?.role === 'student' && (
            <TabsContent value="applications" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {studentApplications.length > 0 ? (
                  <div className="space-y-4">
                    {studentApplications.map((application) => (
                      <Card key={application.id}>
                        <CardContent className="pt-6">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="font-semibold text-lg">{application.jobTitle}</h3>
                              <p className="text-muted-foreground">{application.collegeName}</p>
                              <p className="text-sm text-muted-foreground">
                                Applied: {new Date(application.appliedAt).toLocaleDateString()}
                              </p>
                              {application.coverLetter && (
                                <p className="text-sm bg-muted p-3 rounded-md mt-2">
                                  <strong>Cover Letter:</strong> {application.coverLetter}
                                </p>
                              )}
                            </div>
                            <Badge 
                              variant={application.status === 'pending' ? 'outline' : 'default'}
                              className="capitalize"
                            >
                              {application.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="text-center py-12">
                    <CardContent>
                      <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <CardTitle className="mb-2">No applications yet</CardTitle>
                      <CardDescription>
                        Start applying to jobs to see your application history here.
                      </CardDescription>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </TabsContent>
          )}
        </Tabs>

        {/* Create Job Modal */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowCreateForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <CreateJobForm onClose={() => setShowCreateForm(false)} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
