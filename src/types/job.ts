
export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  deadline: string;
  collegeId: string;
  collegeName: string;
  createdAt: string;
  requirements?: string[];
  salary?: string;
  type: 'full-time' | 'part-time' | 'internship' | 'contract';
  applications?: JobApplication[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  coverLetter?: string;
}
