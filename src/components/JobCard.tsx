
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
import { MapPin, Calendar, Building, Clock, Users, Sparkles, Heart, Star } from 'lucide-react';

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
  const [showCelebration, setShowCelebration] = useState(false);

  const hasApplied = hasAppliedToJob(job.id);
  const isExpired = new Date(job.deadline) < new Date();

  const createConfetti = () => {
    const confettiCount = 50;
    const confettiColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti fixed w-2 h-2 pointer-events-none z-50';
      confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    const success = applyToJob(job.id, coverLetter);
    
    if (success) {
      setShowCelebration(true);
      createConfetti();
      
      toast({
        title: "🎉 Application submitted!",
        description: "Your application has been sent successfully. Good luck!",
      });
      
      setShowDialog(false);
      setCoverLetter('');
      
      setTimeout(() => setShowCelebration(false), 2000);
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
      case 'full-time': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'part-time': return 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-200';
      case 'internship': return 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 border-purple-200';
      case 'contract': return 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border-orange-200';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={showCelebration ? 'celebration-animation' : ''}
    >
      <Card className="h-full border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-sm card-hover">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-2">
                {job.title}
                {job.type === 'internship' && <Sparkles className="w-4 h-4 text-purple-500" />}
                {job.type === 'full-time' && <Star className="w-4 h-4 text-green-500" />}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1">
                <Building className="w-4 h-4" />
                {job.collegeName}
              </CardDescription>
            </div>
            <Badge className={`${getJobTypeColor(job.type)} border font-medium px-3 py-1`}>
              {job.type}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
            {job.description}
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-primary" />
              {job.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-primary" />
              Deadline: {new Date(job.deadline).toLocaleDateString()}
            </div>
            {job.salary && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
                <Clock className="w-4 h-4 text-primary" />
                {job.salary}
              </div>
            )}
            {user?.role === 'college' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-primary/10 p-2 rounded-lg">
                <Users className="w-4 h-4 text-primary" />
                {job.applications?.length || 0} applications received
              </div>
            )}
          </div>

          {job.requirements && job.requirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Requirements:
              </h4>
              <div className="flex flex-wrap gap-1">
                {job.requirements.slice(0, 3).map((req, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-primary/5">
                    {req}
                  </Badge>
                ))}
                {job.requirements.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-primary/10">
                    +{job.requirements.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {user?.role === 'student' && (
            <div className="pt-2">
              {hasApplied ? (
                <Button disabled className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <Heart className="w-4 h-4 mr-2" />
                  Applied ✓
                </Button>
              ) : isExpired ? (
                <Button disabled variant="outline" className="w-full opacity-50">
                  Deadline Passed
                </Button>
              ) : (
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        Apply for {job.title}
                      </DialogTitle>
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
                          className="border-primary/20 focus:border-primary/50"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setShowDialog(false)}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleApply} 
                          disabled={isApplying}
                          className="bg-gradient-to-r from-primary to-primary/80"
                        >
                          {isApplying ? (
                            <>
                              <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Submit Application
                            </>
                          )}
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
