
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/hooks/useJobs';
import JobCard from './JobCard';
import CreateJobForm from './CreateJobForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Briefcase, Users, Calendar, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { jobs, loading, getApplicationHistory } = useJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState<string>('all');

  const applicationHistory = getApplicationHistory();

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedJobType === 'all' || job.type === selectedJobType;
    return matchesSearch && matchesType;
  });

  const jobTypes = ['all', 'full-time', 'part-time', 'internship', 'contract'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {user?.role === 'college' ? 'College Dashboard' : 'Job Portal'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'college' 
              ? 'Manage your job postings and applications' 
              : `Find opportunities at ${user?.collegeName}`
            }
          </p>
        </div>
        
        {user?.role === 'college' && (
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="gap-2"
          >
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {user?.role === 'college' ? 'Active Jobs' : 'Available Jobs'}
                </p>
                <p className="text-2xl font-bold">{jobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.role === 'college' ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">
                    {jobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applications Sent</p>
                  <p className="text-2xl font-bold">{applicationHistory.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold">
                  {jobs.filter(job => {
                    const deadline = new Date(job.deadline);
                    const today = new Date();
                    const daysDiff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 3600 * 24));
                    return daysDiff <= 7 && daysDiff > 0;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {user?.role === 'student' ? (
        <Tabs defaultValue="jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="jobs">Browse Jobs</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-6">
            {/* Search and Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
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
              <div className="flex gap-2 flex-wrap">
                {jobTypes.map((type) => (
                  <Button
                    key={type}
                    variant={selectedJobType === type ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedJobType(type)}
                    className="capitalize"
                  >
                    {type === 'all' ? 'All Types' : type}
                  </Button>
                ))}
              </div>
            </motion.div>

            {/* Jobs Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </motion.div>

            {filteredJobs.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedJobType !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No jobs have been posted yet'
                  }
                </p>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="space-y-4">
              {applicationHistory.map((app) => (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{app.jobTitle}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Applied on {new Date(app.appliedAt).toLocaleDateString()}
                          </p>
                          {app.coverLetter && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {app.coverLetter}
                            </p>
                          )}
                        </div>
                        <Badge className={getStatusColor(app.status)}>
                          {app.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {applicationHistory.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                <p className="text-muted-foreground">
                  Start applying to jobs to see your application history here
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        /* College Dashboard */
        <div className="space-y-6">
          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>

          {/* Jobs Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </motion.div>

          {filteredJobs.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by posting your first job opportunity
              </p>
              <Button onClick={() => setShowCreateForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Post Your First Job
              </Button>
            </motion.div>
          )}
        </div>
      )}

      {/* Create Job Form Dialog */}
      {showCreateForm && (
        <CreateJobForm onClose={() => setShowCreateForm(false)} />
      )}
    </div>
  );
};

export default Dashboard;
