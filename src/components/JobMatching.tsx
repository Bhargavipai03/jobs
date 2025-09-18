import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Building, Clock, DollarSign, Heart, ExternalLink, Accessibility } from "lucide-react";

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  matchPercentage: number;
  description: string;
  requirements: string[];
  accommodations: string[];
  accessibilityFeatures: string[];
  isAccessible: boolean;
  postedDate: string;
}

interface JobMatchingProps {
  userProfile: any;
  disabilityData: any;
}

const mockJobs: JobListing[] = [
  {
    id: "1",
    title: "Customer Service Representative",
    company: "Inclusive Tech Solutions",
    location: "Remote",
    salary: "$35,000 - $45,000",
    type: "Full-time",
    matchPercentage: 95,
    description: "Join our customer support team and help users with technical questions and account management.",
    requirements: ["Communication skills", "Computer skills", "Customer service"],
    accommodations: ["Flexible schedule", "Remote work", "Screen reader compatible"],
    accessibilityFeatures: ["Voice recognition software", "Adjustable workstation", "Sign language interpreter available"],
    isAccessible: true,
    postedDate: "2 days ago"
  },
  {
    id: "2",
    title: "Data Entry Specialist",
    company: "Global Finance Corp",
    location: "New York, NY",
    salary: "$30,000 - $38,000",
    type: "Part-time",
    matchPercentage: 88,
    description: "Accurate data entry and database management for financial records.",
    requirements: ["Attention to detail", "Computer skills", "Microsoft Office"],
    accommodations: ["Flexible hours", "Ergonomic workspace", "Task modifications"],
    accessibilityFeatures: ["Voice-to-text software", "Large monitors", "Adjustable desk"],
    isAccessible: true,
    postedDate: "1 week ago"
  },
  {
    id: "3",
    title: "Content Writer",
    company: "Creative Media Agency",
    location: "Los Angeles, CA",
    salary: "$40,000 - $55,000",
    type: "Contract",
    matchPercentage: 82,
    description: "Create engaging content for websites, blogs, and social media platforms.",
    requirements: ["Writing", "Research", "Social media", "Communication"],
    accommodations: ["Remote work option", "Flexible deadlines", "Mental health support"],
    accessibilityFeatures: ["Dictation software", "Quiet workspace", "Flexible lighting"],
    isAccessible: true,
    postedDate: "3 days ago"
  }
];

export function JobMatching({ userProfile, disabilityData }: JobMatchingProps) {
  const [jobs] = useState<JobListing[]>(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());

  const handleApply = (jobId: string) => {
    setAppliedJobs(prev => new Set([...prev, jobId]));
    // Here you would typically send an application to the backend
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "bg-success";
    if (percentage >= 80) return "bg-warning";
    return "bg-muted";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Job Matches For You
          </h1>
          <p className="text-xl text-muted-foreground">
            Based on your profile and accessibility needs
          </p>
        </div>

        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="bg-gradient-card shadow-medium border-0 hover:shadow-strong transition-smooth">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-primary">{job.title}</CardTitle>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.postedDate}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Match</span>
                      <Progress 
                        value={job.matchPercentage} 
                        className="w-20"
                      />
                      <span className="text-sm font-bold text-primary">{job.matchPercentage}%</span>
                    </div>
                    {job.isAccessible && (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <Accessibility className="h-3 w-3 mr-1" />
                        Accessible
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{job.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.requirements.map((req) => (
                          <Badge key={req} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Salary & Type</h4>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                        <Badge variant="secondary">{job.type}</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Accommodations</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.accommodations.map((acc) => (
                          <Badge key={acc} variant="outline" className="text-xs bg-success/10 text-success">
                            {acc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm mb-2">Accessibility Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.accessibilityFeatures.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs bg-primary/10 text-primary">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Details
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                    >
                      <Heart className="h-4 w-4" />
                      Save
                    </Button>
                    
                    <Button
                      variant={appliedJobs.has(job.id) ? "success" : "gradient"}
                      onClick={() => handleApply(job.id)}
                      disabled={appliedJobs.has(job.id)}
                      className="gap-2"
                    >
                      {appliedJobs.has(job.id) ? "Applied ✓" : "Easy Apply"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center py-8">
          <Button variant="outline" size="lg">
            Load More Jobs
          </Button>
        </div>
      </div>
    </div>
  );
}