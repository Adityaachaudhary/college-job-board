import { useState, useEffect } from 'react';
import { Job, JobApplication } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';

interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  coverLetter?: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load jobs from localStorage
    const savedJobs = localStorage.getItem('jobs');
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    }

    // Load applications from localStorage
    const savedApplications = localStorage.getItem('applications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  const createJob = (jobData: Omit<Job, 'id' | 'createdAt' | 'applications'>) => {
    const newJob: Job = {
      ...jobData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      applications: []
    };

    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    return true;
  };

  const applyToJob = (jobId: string, coverLetter?: string) => {
    if (!user || user.role !== 'student') return false;
    
    // Check if already applied
    const existingApplication = applications.find(
      app => app.jobId === jobId && app.studentId === user.id
    );
    
    if (existingApplication) return false;

    const applicationData: Application = {
      id: Date.now().toString(),
      jobId,
      studentId: user.id,
      studentName: user.name,
      studentEmail: user.email,
      coverLetter,
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedApplications = [...applications, applicationData];
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));

    // Update job with application - convert to JobApplication format for consistency
    const jobApplication: JobApplication = {
      id: applicationData.id,
      jobId: applicationData.jobId,
      studentId: applicationData.studentId,
      studentName: applicationData.studentName,
      studentEmail: applicationData.studentEmail,
      appliedAt: applicationData.appliedAt,
      status: applicationData.status,
      coverLetter: applicationData.coverLetter
    };

    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        return {
          ...job,
          applications: [...(job.applications || []), jobApplication]
        };
      }
      return job;
    });
    
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    return true;
  };

  const hasAppliedToJob = (jobId: string) => {
    if (!user || user.role !== 'student') return false;
    return applications.some(
      app => app.jobId === jobId && app.studentId === user.id
    );
  };

  const updateApplicationStatus = (applicationId: string, status: 'pending' | 'reviewed' | 'accepted' | 'rejected') => {
    if (!user || user.role !== 'college') return false;

    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status } : app
    );
    
    setApplications(updatedApplications);
    localStorage.setItem('applications', JSON.stringify(updatedApplications));

    // Update jobs with the new application status
    const updatedJobs = jobs.map(job => ({
      ...job,
      applications: job.applications?.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ) || []
    }));
    
    setJobs(updatedJobs);
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));
    return true;
  };

  const getStudentJobs = () => {
    if (!user || user.role !== 'student') return [];
    // Students see jobs from their college only
    return jobs.filter(job => job.collegeName === user.collegeName);
  };

  const getCollegeJobs = () => {
    if (!user || user.role !== 'college') return [];
    // Colleges see only their own jobs
    return jobs.filter(job => job.collegeId === user.id);
  };

  const getStudentApplications = () => {
    if (!user || user.role !== 'student') return [];
    return applications
      .filter(app => app.studentId === user.id)
      .map(app => {
        const job = jobs.find(j => j.id === app.jobId);
        return {
          ...app,
          jobTitle: job?.title || 'Unknown Job',
          collegeName: job?.collegeName || 'Unknown College'
        };
      });
  };

  const getJobApplications = (jobId: string) => {
    if (!user || user.role !== 'college') return [];
    return applications.filter(app => app.jobId === jobId);
  };

  const filteredJobs = user?.role === 'student' ? getStudentJobs() : getCollegeJobs();

  return {
    jobs: filteredJobs,
    applications,
    createJob,
    applyToJob,
    hasAppliedToJob,
    getStudentApplications,
    getJobApplications,
    updateApplicationStatus
  };
};
