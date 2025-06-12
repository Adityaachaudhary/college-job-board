
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Job } from '@/types/job';
import { useAuth } from '@/contexts/AuthContext';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Building, Clock, Users } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const { user } = useAuth();
  const { applyToJob, hasAppliedToJob } = useJobs();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const hasApplied = hasAppliedToJob(job.id);
  const isExpired = new Date(job.deadline) < new Date();

  const handleApply = async () => {
    setIsApplying(true);
    const success = applyToJob(job.id, coverLetter);
    
    if (success) {
      toast({
        title: "Application submitted!",
        description: "Your application has been sent to the college.",
      });
      setShowDialog(false);
      setCoverLetter('');
    } else {
      toast({
        title: "Application failed",
        description: "You have already applied to this job.",
        variant: "destructive",
      });
    }
    setIsApplying(false);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                {job.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building className="w-4 h-4" />
                {job.collegeName}
              </CardDescription>
            </div>
            <Badge className={getJobTypeColor(job.type)}>
              {job.type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {job.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {job.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
            {job.salary && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {job.salary}
              </div>
            )}
            {user?.role === 'college' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                {job.applications?.length || 0} applications
              </div>
            )}
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Requirements:</h4>
              <div className="flex flex-wrap gap-1">
                {job.requirements.slice(0, 3).map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
                {job.requirements.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{job.requirements.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {user?.role === 'student' && (
            <div className="pt-2">
              {hasApplied ? (
                <Button disabled className="w-full">
                  Applied ✓
                </Button>
              ) : isExpired ? (
                <Button disabled variant="outline" className="w-full">
                  Deadline Passed
                </Button>
              ) : (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Apply for {job.title}</DialogTitle>
                      <DialogDescription>
                        Submit your application to {job.collegeName}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                        <Textarea
                          id="coverLetter"
                          placeholder="Tell us why you're interested in this position..."
                          value={coverLetter}
                          onChange={(e) => setCoverLetter(e.target.value)}
                          rows={5}
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleApply} disabled={isApplying}>
                          {isApplying ? 'Submitting...' : 'Submit Application'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobCard;
