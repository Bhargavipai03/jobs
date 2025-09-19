import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  X, 
  RotateCcw, 
  MapPin, 
  Building, 
  DollarSign, 
  Accessibility,
  Star,
  Clock,
  Users,
  Award
} from "lucide-react";

interface DisabilitySupport {
  type: string;
  supportLevel: number; // 0-100%
  accommodations: string[];
  equipment: string[];
}

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  
  // Disability-specific fields
  disabilitySupport: DisabilitySupport[];
  overallDisabilityRating: number; // 0-100%
  accessibilityScore: number; // 0-100%
  inclusionRating: number; // Company's inclusion rating 1-5 stars
  
  // Matching fields
  skillsMatch: number; // 0-100%
  disabilityMatch: number; // 0-100%
  overallMatch: number; // Calculated composite score
  
  postedDate: string;
  applicants: number;
  isAccessible: boolean;
  isPremium: boolean;
}

interface UserProfile {
  skills: string[];
  experience: string[];
  disabilities: string[];
  accommodationNeeds: string[];
  preferredSalaryMin: number;
  preferredSalaryMax: number;
  preferredLocation: string;
  jobType: string[];
}

interface SwipeJobMatchingProps {
  userProfile: UserProfile;
  disabilityData: any;
}

// Mock job data with enhanced disability support information
const mockJobs: JobListing[] = [
  {
    id: "1",
    title: "Customer Service Representative",
    company: "Inclusive Tech Solutions",
    location: "Remote",
    salary: "$45,000 - $55,000",
    type: "Full-time",
    description: "Join our customer support team and help users with technical questions. We pride ourselves on being a disability-inclusive employer with comprehensive support systems.",
    requirements: ["Communication skills", "Computer literacy", "Customer service experience"],
    disabilitySupport: [
      {
        type: "Visual Impairment",
        supportLevel: 95,
        accommodations: ["Screen readers", "Voice commands", "Flexible hours"],
        equipment: ["JAWS software", "Braille displays", "Voice recognition software"]
      },
      {
        type: "Hearing Impairment",
        supportLevel: 90,
        accommodations: ["Video calls with captions", "Text-based communication", "Sign language interpreter"],
        equipment: ["Hearing loops", "Visual notification systems"]
      },
      {
        type: "Mobility Impairment",
        supportLevel: 100,
        accommodations: ["Remote work", "Flexible schedule", "Ergonomic setup"],
        equipment: ["Adjustable desk", "Voice commands", "Accessible parking"]
      }
    ],
    overallDisabilityRating: 95,
    accessibilityScore: 98,
    inclusionRating: 5,
    skillsMatch: 92,
    disabilityMatch: 95,
    overallMatch: 94,
    postedDate: "2 days ago",
    applicants: 12,
    isAccessible: true,
    isPremium: true
  },
  {
    id: "2",
    title: "Data Analyst",
    company: "Progressive Finance Corp",
    location: "New York, NY (Hybrid)",
    salary: "$55,000 - $70,000",
    type: "Full-time",
    description: "Analyze financial data and create reports. Our office is fully accessible and we provide comprehensive disability support.",
    requirements: ["Excel", "Data analysis", "SQL", "Statistical analysis"],
    disabilitySupport: [
      {
        type: "Visual Impairment",
        supportLevel: 85,
        accommodations: ["Screen magnification", "Voice output", "Modified lighting"],
        equipment: ["ZoomText", "High contrast monitors", "Adjustable lighting"]
      },
      {
        type: "Cognitive Disability",
        supportLevel: 80,
        accommodations: ["Extended time for tasks", "Written instructions", "Job coaching"],
        equipment: ["Task reminder software", "Noise-canceling headphones"]
      }
    ],
    overallDisabilityRating: 83,
    accessibilityScore: 88,
    inclusionRating: 4,
    skillsMatch: 78,
    disabilityMatch: 85,
    overallMatch: 82,
    postedDate: "1 week ago",
    applicants: 28,
    isAccessible: true,
    isPremium: false
  },
  {
    id: "3",
    title: "Content Writer",
    company: "Creative Media Agency",
    location: "Los Angeles, CA",
    salary: "$42,000 - $58,000",
    type: "Contract",
    description: "Create engaging content for digital platforms. We welcome writers with diverse perspectives and provide flexible work arrangements.",
    requirements: ["Writing", "SEO", "Social media", "Content strategy"],
    disabilitySupport: [
      {
        type: "Mental Health",
        supportLevel: 92,
        accommodations: ["Mental health days", "Flexible deadlines", "Quiet workspace"],
        equipment: ["Stress management apps", "Ergonomic furniture"]
      },
      {
        type: "Learning Disability",
        supportLevel: 75,
        accommodations: ["Alternative communication methods", "Extended deadlines"],
        equipment: ["Text-to-speech software", "Grammar checking tools"]
      }
    ],
    overallDisabilityRating: 84,
    accessibilityScore: 79,
    inclusionRating: 4,
    skillsMatch: 88,
    disabilityMatch: 84,
    overallMatch: 86,
    postedDate: "3 days ago",
    applicants: 45,
    isAccessible: true,
    isPremium: false
  }
];

export function SwipeJobMatching({ userProfile, disabilityData }: SwipeJobMatchingProps) {
  const [jobs, setJobs] = useState<JobListing[]>(mockJobs);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [likedJobs, setLikedJobs] = useState<Set<string>>(new Set());
  const [passedJobs, setPassedJobs] = useState<Set<string>>(new Set());
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const { toast } = useToast();

  const currentJob = jobs[currentJobIndex];

  const handleLike = () => {
    if (!currentJob) return;
    
    setLikedJobs(prev => new Set([...prev, currentJob.id]));
    
    // Simulate mutual match (employer also liked the candidate)
    const isMatch = Math.random() > 0.3; // 70% chance of match
    
    if (isMatch) {
      setShowMatchCelebration(true);
      toast({
        title: "🎉 It's a Match!",
        description: `${currentJob.company} is interested in your profile!`,
        duration: 5000,
      });
      
      setTimeout(() => setShowMatchCelebration(false), 3000);
    } else {
      toast({
        title: "Job Saved!",
        description: "We'll notify you if there's mutual interest.",
        duration: 3000,
      });
    }
    
    nextJob();
  };

  const handlePass = () => {
    if (!currentJob) return;
    
    setPassedJobs(prev => new Set([...prev, currentJob.id]));
    toast({
      title: "Job Passed",
      description: "We'll find you better matches!",
      duration: 2000,
    });
    
    nextJob();
  };

  const nextJob = () => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(prev => prev + 1);
    } else {
      // Load more jobs (in real app, this would fetch from backend)
      toast({
        title: "No more jobs!",
        description: "Check back later for new opportunities.",
        duration: 3000,
      });
    }
  };

  const undoLastAction = () => {
    if (currentJobIndex > 0) {
      const previousJob = jobs[currentJobIndex - 1];
      setLikedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(previousJob.id);
        return newSet;
      });
      setPassedJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(previousJob.id);
        return newSet;
      });
      setCurrentJobIndex(prev => prev - 1);
      
      toast({
        title: "Action Undone",
        description: "Brought back the previous job.",
        duration: 2000,
      });
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 80) return "text-warning";
    if (percentage >= 70) return "text-primary";
    return "text-muted-foreground";
  };

  const getSalaryRange = (salary: string) => {
    const matches = salary.match(/\$(\d+),?(\d+)? - \$(\d+),?(\d+)?/);
    if (matches) {
      const min = parseInt(matches[1] + (matches[2] || '000'));
      const max = parseInt(matches[3] + (matches[4] || '000'));
      return { min, max };
    }
    return { min: 0, max: 0 };
  };

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
        <Card className="bg-gradient-card shadow-strong border-0 max-w-md w-full">
          <CardContent className="text-center p-8 space-y-4">
            <Award className="h-16 w-16 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">You've seen all jobs!</h2>
            <p className="text-muted-foreground">
              Check back later for new opportunities, or adjust your preferences to see more matches.
            </p>
            <Button variant="gradient" onClick={() => window.location.reload()}>
              Start Over
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Job Matching
          </h1>
          <p className="text-sm text-muted-foreground">
            {currentJobIndex + 1} of {jobs.length} • {likedJobs.size} liked
          </p>
        </div>

        {/* Match Celebration */}
        {showMatchCelebration && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="bg-gradient-card shadow-strong border-0 max-w-sm mx-4">
              <CardContent className="text-center p-8 space-y-4">
                <div className="text-6xl">🎉</div>
                <h2 className="text-2xl font-bold text-success">It's a Match!</h2>
                <p className="text-muted-foreground">
                  {currentJob.company} is interested in your profile!
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Job Card */}
        <Card className="bg-gradient-card shadow-strong border-0 overflow-hidden">
          {/* Company Badge */}
          {currentJob.isPremium && (
            <div className="bg-gradient-hero text-white text-center py-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                ⭐ Premium Employer
              </Badge>
            </div>
          )}

          <CardHeader className="space-y-4">
            {/* Main Job Info */}
            <div className="space-y-2">
              <CardTitle className="text-xl text-primary">{currentJob.title}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4" />
                <span className="font-medium">{currentJob.company}</span>
                <div className="flex">
                  {[...Array(currentJob.inclusionRating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-warning text-warning" />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {currentJob.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {currentJob.postedDate}
                </div>
              </div>
            </div>

            {/* Match Scores */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-background/50 rounded-lg">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{currentJob.overallMatch}%</p>
                <p className="text-xs text-muted-foreground">Overall Match</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">{currentJob.disabilityMatch}%</p>
                <p className="text-xs text-muted-foreground">Disability Support</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">{currentJob.skillsMatch}%</p>
                <p className="text-xs text-muted-foreground">Skills Match</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Salary & Type */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-success" />
                <span className="font-semibold text-success">{currentJob.salary}</span>
              </div>
              <Badge variant="outline">{currentJob.type}</Badge>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">{currentJob.description}</p>

            {/* Accessibility Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Accessibility className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Disability Support</span>
                <Badge variant="secondary" className="bg-success/10 text-success">
                  {currentJob.overallDisabilityRating}% Compatible
                </Badge>
              </div>
              
              <div className="space-y-2">
                {currentJob.disabilitySupport.map((support, index) => (
                  <div key={index} className="p-3 bg-background/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{support.type}</span>
                      <span className="text-sm font-bold text-success">{support.supportLevel}%</span>
                    </div>
                    <Progress value={support.supportLevel} className="h-2 mb-2" />
                    <div className="flex flex-wrap gap-1">
                      {support.accommodations.slice(0, 3).map((acc) => (
                        <Badge key={acc} variant="outline" className="text-xs">
                          {acc}
                        </Badge>
                      ))}
                      {support.accommodations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{support.accommodations.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Requirements</h4>
              <div className="flex flex-wrap gap-1">
                {currentJob.requirements.map((req) => (
                  <Badge key={req} variant="outline" className="text-xs">
                    {req}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {currentJob.applicants} applicants
              </div>
              <div>Accessibility Score: {currentJob.accessibilityScore}%</div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-white"
            onClick={handlePass}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={undoLastAction}
            disabled={currentJobIndex === 0}
          >
            <RotateCcw className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full border-success text-success hover:bg-success hover:text-white"
            onClick={handleLike}
          >
            <Heart className="h-6 w-6" />
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={((currentJobIndex + 1) / jobs.length) * 100} className="h-2" />
          <p className="text-center text-xs text-muted-foreground">
            Swipe through jobs to find your perfect match
          </p>
        </div>
      </div>
    </div>
  );
}