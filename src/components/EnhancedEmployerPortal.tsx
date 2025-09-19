import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { 
  Building, 
  Users, 
  Award, 
  TrendingUp, 
  FileText, 
  Accessibility,
  Star,
  Heart,
  X,
  Eye,
  MessageCircle
} from "lucide-react";

interface DisabilitySupport {
  type: string;
  supportLevel: number;
  accommodations: string[];
  equipment: string[];
}

interface JobPosting {
  title: string;
  description: string;
  requirements: string[];
  salary: string;
  location: string;
  type: string;
  
  // Enhanced disability support
  disabilitySupport: DisabilitySupport[];
  overallDisabilityRating: number;
  accessibilityScore: number;
  inclusionCommitment: number; // 1-5 stars
  
  // Matching criteria
  skillsMatchThreshold: number; // Minimum % match for skills
  disabilityMatchThreshold: number; // Minimum % compatibility
  overallMatchThreshold: number; // Overall minimum match
  
  // Premium features
  isPremium: boolean;
  isUrgentHiring: boolean;
}

interface CandidateProfile {
  id: string;
  name: string;
  skills: string[];
  experience: string;
  disabilityType: string[];
  accommodationNeeds: string[];
  skillsMatch: number;
  disabilityMatch: number;
  overallMatch: number;
  hasApplied: boolean;
  avatar: string;
  summary: string;
}

const mockCandidates: CandidateProfile[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    skills: ["Customer Service", "Communication", "Problem Solving", "Microsoft Office"],
    experience: "3 years in customer support",
    disabilityType: ["Visual Impairment"],
    accommodationNeeds: ["Screen reader", "Voice commands", "Flexible hours"],
    skillsMatch: 95,
    disabilityMatch: 98,
    overallMatch: 96,
    hasApplied: true,
    avatar: "SJ",
    summary: "Experienced customer service professional with excellent communication skills and proficiency in assistive technologies."
  },
  {
    id: "2",
    name: "Marcus Chen",
    skills: ["Data Analysis", "Excel", "SQL", "Statistical Analysis"],
    experience: "2 years as data analyst",
    disabilityType: ["Hearing Impairment"],
    accommodationNeeds: ["Text communication", "Visual alerts", "Captioned meetings"],
    skillsMatch: 88,
    disabilityMatch: 92,
    overallMatch: 90,
    hasApplied: false,
    avatar: "MC",
    summary: "Detail-oriented data analyst with strong technical skills and experience in accessible communication methods."
  },
  {
    id: "3",
    name: "Amanda Rodriguez",
    skills: ["Writing", "Content Creation", "SEO", "Social Media"],
    experience: "4 years in content marketing",
    disabilityType: ["Mobility Impairment"],
    accommodationNeeds: ["Remote work", "Ergonomic setup", "Flexible schedule"],
    skillsMatch: 92,
    disabilityMatch: 85,
    overallMatch: 89,
    hasApplied: true,
    avatar: "AR",
    summary: "Creative content writer with proven track record in digital marketing and accessibility advocacy."
  }
];

const disabilityTypes = [
  "Visual Impairment",
  "Hearing Impairment", 
  "Mobility Impairment",
  "Cognitive Disability",
  "Mental Health",
  "Learning Disability",
  "Speech Impairment",
  "Multiple Disabilities"
];

const accommodationsByType = {
  "Visual Impairment": ["Screen readers", "Voice commands", "Braille displays", "Screen magnification", "High contrast", "Flexible lighting"],
  "Hearing Impairment": ["Sign language interpreter", "Text communication", "Video calls with captions", "Visual alerts", "Hearing loops"],
  "Mobility Impairment": ["Remote work", "Wheelchair accessible", "Ergonomic workspace", "Flexible schedule", "Adjustable desk", "Voice commands"],
  "Cognitive Disability": ["Extended time", "Written instructions", "Job coaching", "Simplified tasks", "Regular breaks", "Quiet environment"],
  "Mental Health": ["Mental health days", "Flexible deadlines", "Stress management support", "Quiet workspace", "Counseling resources"],
  "Learning Disability": ["Alternative formats", "Extended deadlines", "Reading assistance", "Audio materials", "Note-taking support"],
  "Speech Impairment": ["Alternative communication", "Text-based interaction", "Extra time for responses", "Communication devices"],
  "Multiple Disabilities": ["Combination of supports", "Individualized accommodations", "Comprehensive assessment", "Flexible arrangements"]
};

export function EnhancedEmployerPortal() {
  const [activeTab, setActiveTab] = useState("post-job");
  const [jobData, setJobData] = useState<Partial<JobPosting>>({
    disabilitySupport: [],
    skillsMatchThreshold: 70,
    disabilityMatchThreshold: 80,
    overallMatchThreshold: 75,
    inclusionCommitment: 3,
    isPremium: false,
    isUrgentHiring: false
  });
  const [candidates] = useState<CandidateProfile[]>(mockCandidates);
  const [likedCandidates, setLikedCandidates] = useState<Set<string>>(new Set());
  const [passedCandidates, setPassedCandidates] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const addDisabilitySupport = (type: string) => {
    const existing = jobData.disabilitySupport?.find(ds => ds.type === type);
    if (existing) return;

    const newSupport: DisabilitySupport = {
      type,
      supportLevel: 70,
      accommodations: [],
      equipment: []
    };

    setJobData({
      ...jobData,
      disabilitySupport: [...(jobData.disabilitySupport || []), newSupport]
    });
  };

  const updateDisabilitySupport = (type: string, field: keyof DisabilitySupport, value: any) => {
    const updated = jobData.disabilitySupport?.map(ds => 
      ds.type === type ? { ...ds, [field]: value } : ds
    ) || [];
    
    setJobData({ ...jobData, disabilitySupport: updated });
  };

  const removeDisabilitySupport = (type: string) => {
    const filtered = jobData.disabilitySupport?.filter(ds => ds.type !== type) || [];
    setJobData({ ...jobData, disabilitySupport: filtered });
  };

  const toggleAccommodation = (disabilityType: string, accommodation: string) => {
    const updated = jobData.disabilitySupport?.map(ds => {
      if (ds.type === disabilityType) {
        const accommodations = ds.accommodations.includes(accommodation)
          ? ds.accommodations.filter(a => a !== accommodation)
          : [...ds.accommodations, accommodation];
        return { ...ds, accommodations };
      }
      return ds;
    }) || [];
    
    setJobData({ ...jobData, disabilitySupport: updated });
  };

  const handleCandidateAction = (candidateId: string, action: 'like' | 'pass') => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (!candidate) return;

    if (action === 'like') {
      setLikedCandidates(prev => new Set([...prev, candidateId]));
      toast({
        title: "Candidate Liked!",
        description: `${candidate.name} will be notified of your interest.`,
        duration: 3000,
      });
    } else {
      setPassedCandidates(prev => new Set([...prev, candidateId]));
      toast({
        title: "Candidate Passed",
        description: "They won't see this action.",
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

  const calculateOverallDisabilityRating = () => {
    if (!jobData.disabilitySupport?.length) return 0;
    const average = jobData.disabilitySupport.reduce((sum, ds) => sum + ds.supportLevel, 0) / jobData.disabilitySupport.length;
    return Math.round(average);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Enhanced Employer Portal
          </h1>
          <p className="text-xl text-muted-foreground">
            Smart job posting with AI-powered disability matching
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="post-job" className="gap-2">
              <FileText className="h-4 w-4" />
              Smart Job Posting
            </TabsTrigger>
            <TabsTrigger value="candidates" className="gap-2">
              <Users className="h-4 w-4" />
              Candidate Matching
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Match Analytics
            </TabsTrigger>
            <TabsTrigger value="incentives" className="gap-2">
              <Award className="h-4 w-4" />
              Incentives
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post-job" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Job Posting Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-card shadow-medium border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Job Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="job-title">Job Title *</Label>
                        <Input
                          id="job-title"
                          value={jobData.title || ""}
                          onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
                          placeholder="e.g. Customer Service Representative"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={jobData.location || ""}
                          onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
                          placeholder="City, State or Remote"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Job Description *</Label>
                      <Textarea
                        id="description"
                        value={jobData.description || ""}
                        onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                        placeholder="Describe the role and your commitment to inclusion..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="salary">Salary Range</Label>
                        <Input
                          id="salary"
                          value={jobData.salary || ""}
                          onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
                          placeholder="$40,000 - $60,000"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Inclusion Rating</Label>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-6 w-6 cursor-pointer ${
                                star <= (jobData.inclusionCommitment || 0)
                                  ? "fill-warning text-warning"
                                  : "text-muted-foreground"
                              }`}
                              onClick={() => setJobData({ ...jobData, inclusionCommitment: star })}
                            />
                          ))}
                          <span className="text-sm text-muted-foreground ml-2">
                            Company inclusion commitment
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="premium"
                          checked={jobData.isPremium || false}
                          onCheckedChange={(checked) => setJobData({ ...jobData, isPremium: checked as boolean })}
                        />
                        <Label htmlFor="premium">Premium Job Posting (+$50)</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="urgent"
                          checked={jobData.isUrgentHiring || false}
                          onCheckedChange={(checked) => setJobData({ ...jobData, isUrgentHiring: checked as boolean })}
                        />
                        <Label htmlFor="urgent">Urgent Hiring (+$25)</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Disability Support Configuration */}
                <Card className="bg-gradient-card shadow-medium border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Accessibility className="h-5 w-5" />
                      Disability Support Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Add Disability Support */}
                    <div className="space-y-2">
                      <Label>Add Disability Support</Label>
                      <Select onValueChange={addDisabilitySupport}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select disability type to support" />
                        </SelectTrigger>
                        <SelectContent>
                          {disabilityTypes.map((type) => (
                            <SelectItem 
                              key={type} 
                              value={type}
                              disabled={jobData.disabilitySupport?.some(ds => ds.type === type)}
                            >
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Configured Disability Supports */}
                    <div className="space-y-4">
                      {jobData.disabilitySupport?.map((support) => (
                        <div key={support.type} className="p-4 bg-background/50 rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{support.type}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDisabilitySupport(support.type)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label>Support Level: {support.supportLevel}%</Label>
                            <Slider
                              value={[support.supportLevel]}
                              onValueChange={([value]) => updateDisabilitySupport(support.type, 'supportLevel', value)}
                              max={100}
                              step={5}
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Available Accommodations</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {accommodationsByType[support.type as keyof typeof accommodationsByType]?.map((acc) => (
                                <div key={acc} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`${support.type}-${acc}`}
                                    checked={support.accommodations.includes(acc)}
                                    onCheckedChange={() => toggleAccommodation(support.type, acc)}
                                  />
                                  <Label htmlFor={`${support.type}-${acc}`} className="text-sm">
                                    {acc}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Matching Thresholds & Preview */}
              <div className="space-y-6">
                <Card className="bg-gradient-card shadow-medium border-0">
                  <CardHeader>
                    <CardTitle>Matching Thresholds</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Skills Match Minimum: {jobData.skillsMatchThreshold}%</Label>
                      <Slider
                        value={[jobData.skillsMatchThreshold || 70]}
                        onValueChange={([value]) => setJobData({ ...jobData, skillsMatchThreshold: value })}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Disability Compatibility: {jobData.disabilityMatchThreshold}%</Label>
                      <Slider
                        value={[jobData.disabilityMatchThreshold || 80]}
                        onValueChange={([value]) => setJobData({ ...jobData, disabilityMatchThreshold: value })}
                        max={100}
                        step={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Overall Match Minimum: {jobData.overallMatchThreshold}%</Label>
                      <Slider
                        value={[jobData.overallMatchThreshold || 75]}
                        onValueChange={([value]) => setJobData({ ...jobData, overallMatchThreshold: value })}
                        max={100}
                        step={5}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card shadow-medium border-0">
                  <CardHeader>
                    <CardTitle>Job Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold text-primary">
                        {calculateOverallDisabilityRating()}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Overall Disability Support Rating
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="font-semibold text-sm">Supported Disabilities:</p>
                      <div className="flex flex-wrap gap-1">
                        {jobData.disabilitySupport?.map((support) => (
                          <Badge key={support.type} variant="outline" className="text-xs">
                            {support.type}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="gradient" className="w-full">
                      Post Job
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <div className="grid gap-6">
              {candidates.map((candidate) => (
                <Card key={candidate.id} className="bg-gradient-card shadow-medium border-0">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {candidate.avatar}
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{candidate.name}</h3>
                            <p className="text-sm text-muted-foreground">{candidate.experience}</p>
                          </div>
                          
                          <div className="text-right space-y-1">
                            <div className="text-2xl font-bold text-primary">
                              {candidate.overallMatch}%
                            </div>
                            <div className="text-xs text-muted-foreground">Overall Match</div>
                          </div>
                        </div>

                        <p className="text-sm">{candidate.summary}</p>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Skills Match</p>
                            <div className="flex items-center gap-2">
                              <Progress value={candidate.skillsMatch} className="flex-1" />
                              <span className={`text-sm font-bold ${getMatchColor(candidate.skillsMatch)}`}>
                                {candidate.skillsMatch}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Disability Compatibility</p>
                            <div className="flex items-center gap-2">
                              <Progress value={candidate.disabilityMatch} className="flex-1" />
                              <span className={`text-sm font-bold ${getMatchColor(candidate.disabilityMatch)}`}>
                                {candidate.disabilityMatch}%
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Disabilities</p>
                            <div className="flex flex-wrap gap-1">
                              {candidate.disabilityType.map((type) => (
                                <Badge key={type} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Profile
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                              <MessageCircle className="h-4 w-4" />
                              Message
                            </Button>
                          </div>

                          <div className="flex gap-2">
                            {!passedCandidates.has(candidate.id) && !likedCandidates.has(candidate.id) ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCandidateAction(candidate.id, 'pass')}
                                  className="text-destructive border-destructive hover:bg-destructive hover:text-white"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCandidateAction(candidate.id, 'like')}
                                  className="text-success border-success hover:bg-success hover:text-white"
                                >
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </>
                            ) : likedCandidates.has(candidate.id) ? (
                              <Badge variant="secondary" className="bg-success/10 text-success">
                                ✓ Interested
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-muted-foreground">
                                Passed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-bold text-primary">{candidates.length}</p>
                    <p className="text-sm text-muted-foreground">Total Candidates</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-bold text-success">{likedCandidates.size}</p>
                    <p className="text-sm text-muted-foreground">Interested</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <p className="text-3xl font-bold text-warning">
                      {Math.round(candidates.reduce((sum, c) => sum + c.overallMatch, 0) / candidates.length)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Match Score</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="incentives" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Available Incentives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg">
                    <h4 className="font-semibold text-success">Work Opportunity Tax Credit</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Up to $9,600 tax credit per qualified hire
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h4 className="font-semibold text-primary">Disabled Access Credit</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      50% tax credit for accessibility improvements
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Estimated Benefits</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">$15,600</p>
                    <p className="text-sm text-muted-foreground">
                      Potential tax savings for your first inclusive hire
                    </p>
                  </div>
                  <Button variant="gradient" className="w-full">
                    Calculate Your Savings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}