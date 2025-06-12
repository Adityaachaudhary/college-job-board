
import { useState, useEffect } from 'react';
import { Job, JobApplication } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, [user]);

  const loadJobs = () => {
    try {
      const savedJobs = localStorage.getItem('jobs');
      const allJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : [];
      
      if (user?.role === 'student') {
        // Students only see jobs from their college
        const filteredJobs = allJobs.filter(job => 
          job.collegeName.toLowerCase() === user.collegeName?.toLowerCase()
        );
        setJobs(filteredJobs);
      } else if (user?.role === 'college') {
        // Colleges only see their own jobs
        const filteredJobs = allJobs.filter(job => job.collegeId === user.id);
        setJobs(filteredJobs);
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'applications'>) => {
    if (user?.role !== 'college') return false;

    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      collegeId: user.id,
      collegeName: user.name,
      applications: []
    };

    const savedJobs = localStorage.getItem('jobs');
    const allJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : [];
    allJobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(allJobs));
    
    loadJobs();
    return true;
  };

  const applyToJob = (jobId: string, coverLetter?: string) => {
    if (user?.role !== 'student') return false;

    const savedJobs = localStorage.getItem('jobs');
    const allJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : [];
    const jobIndex = allJobs.findIndex(job => job.id === jobId);
    
    if (jobIndex === -1) return false;

    const application: JobApplication = {
      id: Date.now().toString(),
      jobId,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      appliedAt: new Date().toISOString(),
      status: 'pending',
      coverLetter
    };

    if (!allJobs[jobIndex].applications) {
      allJobs[jobIndex].applications = [];
    }

    // Check if user already applied
    const existingApplication = allJobs[jobIndex].applications?.find(
      app => app.studentId === user.id
    );

    if (existingApplication) return false;

    allJobs[jobIndex].applications?.push(application);
    localStorage.setItem('jobs', JSON.stringify(allJobs));
    
    loadJobs();
    return true;
  };

  const getApplicationHistory = () => {
    if (user?.role !== 'student') return [];

    const savedJobs = localStorage.getItem('jobs');
    const allJobs: Job[] = savedJobs ? JSON.parse(savedJobs) : [];
    const applications: (JobApplication & { jobTitle: string })[] = [];

    allJobs.forEach(job => {
      if (job.applications) {
        job.applications.forEach(app => {
          if (app.studentId === user.id) {
            applications.push({
              ...app,
              jobTitle: job.title
            });
          }
        });
      }
    });

    return applications.sort((a, b) => 
      new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    );
  };

  const hasAppliedToJob = (jobId: string) => {
    if (user?.role !== 'student') return false;
    
    const job = jobs.find(j => j.id === jobId);
    return job?.applications?.some(app => app.studentId === user.id) || false;
  };

  return {
    jobs,
    loading,
    createJob,
    applyToJob,
    getApplicationHistory,
    hasAppliedToJob,
    refreshJobs: loadJobs
  };
};
