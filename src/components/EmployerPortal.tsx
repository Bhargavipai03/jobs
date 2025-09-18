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
import { Building, Users, Award, TrendingUp, FileText } from "lucide-react";

interface JobPosting {
  title: string;
  description: string;
  requirements: string[];
  accommodations: string[];
  disabilitySupport: number;
  matchThreshold: number;
  salary: string;
  location: string;
  type: string;
  accessibilityEquipment: string[];
}

export function EmployerPortal() {
  const [activeTab, setActiveTab] = useState("post-job");
  const [jobData, setJobData] = useState<Partial<JobPosting>>({
    requirements: [],
    accommodations: [],
    accessibilityEquipment: [],
  });

  const accommodationOptions = [
    "Flexible work hours",
    "Remote work option",
    "Ergonomic workspace",
    "Screen reader compatible",
    "Sign language interpreter",
    "Quiet workspace",
    "Modified tasks",
    "Extended breaks",
    "Job coaching",
    "Transportation assistance"
  ];

  const accessibilityEquipment = [
    "Height-adjustable desks",
    "Screen magnification software",
    "Voice recognition software",
    "Ergonomic keyboards/mice",
    "Hearing loops",
    "Wheelchair accessible facilities",
    "Braille displays",
    "Communication devices",
    "Mobility aids",
    "Adaptive technology"
  ];

  const toggleAccommodation = (accommodation: string) => {
    const current = jobData.accommodations || [];
    if (current.includes(accommodation)) {
      setJobData({
        ...jobData,
        accommodations: current.filter(a => a !== accommodation)
      });
    } else {
      setJobData({
        ...jobData,
        accommodations: [...current, accommodation]
      });
    }
  };

  const toggleEquipment = (equipment: string) => {
    const current = jobData.accessibilityEquipment || [];
    if (current.includes(equipment)) {
      setJobData({
        ...jobData,
        accessibilityEquipment: current.filter(e => e !== equipment)
      });
    } else {
      setJobData({
        ...jobData,
        accessibilityEquipment: [...current, equipment]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Employer Portal
          </h1>
          <p className="text-xl text-muted-foreground">
            Post inclusive jobs and find talented candidates
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="post-job" className="gap-2">
              <FileText className="h-4 w-4" />
              Post Job
            </TabsTrigger>
            <TabsTrigger value="candidates" className="gap-2">
              <Users className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="incentives" className="gap-2">
              <Award className="h-4 w-4" />
              Incentives
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="post-job" className="space-y-6">
            <Card className="bg-gradient-card shadow-medium border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Create Inclusive Job Posting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    <Label htmlFor="job-type">Job Type</Label>
                    <Select
                      value={jobData.type || ""}
                      onValueChange={(value) => setJobData({ ...jobData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={jobData.description || ""}
                    onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                    placeholder="Describe the role, responsibilities, and what makes your company inclusive..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Disability Support Level (0-100%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={jobData.disabilitySupport || ""}
                      onChange={(e) => setJobData({ ...jobData, disabilitySupport: parseInt(e.target.value) })}
                      placeholder="80"
                    />
                    <p className="text-sm text-muted-foreground">
                      How much disability support can your company provide?
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Minimum Match Threshold (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={jobData.matchThreshold || ""}
                      onChange={(e) => setJobData({ ...jobData, matchThreshold: parseInt(e.target.value) })}
                      placeholder="70"
                    />
                    <p className="text-sm text-muted-foreground">
                      Minimum skills match percentage to show candidates
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Available Accommodations</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {accommodationOptions.map((accommodation) => (
                      <div key={accommodation} className="flex items-center space-x-2">
                        <Checkbox
                          id={accommodation}
                          checked={jobData.accommodations?.includes(accommodation) || false}
                          onCheckedChange={() => toggleAccommodation(accommodation)}
                        />
                        <Label htmlFor={accommodation} className="text-sm cursor-pointer">
                          {accommodation}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Accessibility Equipment Available</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {accessibilityEquipment.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={jobData.accessibilityEquipment?.includes(equipment) || false}
                          onCheckedChange={() => toggleEquipment(equipment)}
                        />
                        <Label htmlFor={equipment} className="text-sm cursor-pointer">
                          {equipment}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <Button variant="outline">Save Draft</Button>
                  <Button variant="gradient">Post Job</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates" className="space-y-6">
            <Card className="bg-gradient-card shadow-medium border-0">
              <CardHeader>
                <CardTitle>Candidate Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No candidates available yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Post a job to start receiving candidate matches.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incentives" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Government Incentives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 bg-success/10 rounded-lg">
                      <h4 className="font-semibold text-success">Work Opportunity Tax Credit</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Up to $9,600 tax credit for hiring qualified individuals with disabilities.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">Learn More</Button>
                    </div>
                    
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <h4 className="font-semibold text-primary">Disabled Access Credit</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        50% tax credit for accessibility improvements up to $10,250.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">Learn More</Button>
                    </div>
                    
                    <div className="p-4 bg-warning/10 rounded-lg">
                      <h4 className="font-semibold text-warning">Architectural Barrier Removal</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Deduction up to $15,000 for removing architectural barriers.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">Learn More</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-medium border-0">
                <CardHeader>
                  <CardTitle>Application Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Get help applying for government incentives and tax credits.
                    </p>
                    <Button variant="gradient" className="w-full">
                      Start Application Process
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Applications</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Users className="h-8 w-8 text-success" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-card shadow-medium border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Hires</p>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                    <Award className="h-8 w-8 text-warning" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}