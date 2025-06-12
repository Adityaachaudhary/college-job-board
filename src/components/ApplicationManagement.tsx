
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Calendar, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

interface ApplicationManagementProps {
  jobId: string;
  jobTitle: string;
}

const ApplicationManagement: React.FC<ApplicationManagementProps> = ({ jobId, jobTitle }) => {
  const { getJobApplications, updateApplicationStatus } = useJobs();
  const { toast } = useToast();
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  const applications = getJobApplications(jobId);

  const handleStatusUpdate = (applicationId: string, status: 'accepted' | 'rejected') => {
    const success = updateApplicationStatus(applicationId, status);
    if (success) {
      toast({
        title: status === 'accepted' ? "✅ Application Accepted" : "❌ Application Rejected",
        description: `The application has been ${status}.`,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-200';
      case 'reviewed': return 'bg-gradient-to-r from-blue-100 to-sky-100 text-blue-800 border-blue-200';
      default: return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Applications for {jobTitle}</h3>
        <Badge variant="outline" className="bg-primary/10">
          {applications.length} Total Applications
        </Badge>
      </div>

      {applications.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="mb-2">No applications yet</CardTitle>
            <CardDescription>
              Applications will appear here once students start applying.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-lg">{application.studentName}</h4>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <Mail className="w-3 h-3" />
                            {application.studentEmail}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Applied: {new Date(application.appliedAt).toLocaleDateString()}
                      </div>

                      {application.coverLetter && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="w-4 h-4" />
                              View Cover Letter
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Cover Letter - {application.studentName}</DialogTitle>
                              <DialogDescription>
                                Application for {jobTitle}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="bg-muted/30 p-4 rounded-lg">
                              <p className="text-sm leading-relaxed">{application.coverLetter}</p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <Badge className={`${getStatusColor(application.status)} border font-medium px-3 py-1 capitalize flex items-center gap-1`}>
                        {getStatusIcon(application.status)}
                        {application.status}
                      </Badge>

                      {application.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            size="sm"
                            variant="destructive"
                            className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
