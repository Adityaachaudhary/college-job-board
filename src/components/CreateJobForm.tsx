
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useJobs } from '@/hooks/useJobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { X, Plus, Minus } from 'lucide-react';

interface CreateJobFormProps {
  onClose: () => void;
}

const CreateJobForm: React.FC<CreateJobFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    deadline: '',
    salary: '',
    type: 'full-time' as 'full-time' | 'part-time' | 'internship' | 'contract',
  });
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  
  const { createJob } = useJobs();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location || !formData.deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const deadlineDate = new Date(formData.deadline);
    if (deadlineDate <= new Date()) {
      toast({
        title: "Error",
        description: "Deadline must be in the future",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const jobData = {
      ...formData,
      requirements: requirements.filter(req => req.trim() !== ''),
    };

    const success = createJob(jobData);
    
    if (success) {
      toast({
        title: "Job posted successfully!",
        description: "Your job posting is now live and visible to students.",
      });
      onClose();
    } else {
      toast({
        title: "Failed to create job",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addRequirement = () => {
    setRequirements(prev => [...prev, '']);
  };

  const removeRequirement = (index: number) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  };

  const updateRequirement = (index: number, value: string) => {
    setRequirements(prev => prev.map((req, i) => i === index ? value : req));
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>
            Create a job posting for students at your college
          </DialogDescription>
        </DialogHeader>

        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Software Developer Intern"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Job Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g. Remote, New York, On-campus"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary (Optional)</Label>
              <Input
                id="salary"
                placeholder="e.g. $50,000/year, $20/hour"
                value={formData.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              min={minDate}
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Requirements (Optional)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addRequirement}
                className="gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </Button>
            </div>
            
            {requirements.map((req, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2 items-center"
              >
                <Input
                  placeholder="e.g. JavaScript, React, 2+ years experience"
                  value={req}
                  onChange={(e) => updateRequirement(index, e.target.value)}
                />
                {requirements.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeRequirement(index)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobForm;
