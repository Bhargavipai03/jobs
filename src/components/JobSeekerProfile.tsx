import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Briefcase, GraduationCap, Star } from "lucide-react";

interface ProfileData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
  };
  preferences: {
    position: string;
    location: string;
    maxDistance: number;
    workType: string;
    salary: string;
  };
  education: string;
  experience: string;
  skills: string[];
}

interface JobSeekerProfileProps {
  onComplete: (data: ProfileData) => void;
  disabilityData?: any;
}

const skillSuggestions = [
  "Communication", "Teamwork", "Problem Solving", "Leadership", "Time Management",
  "Computer Skills", "Customer Service", "Data Analysis", "Project Management",
  "Writing", "Research", "Teaching", "Sales", "Marketing", "Accounting",
  "Programming", "Design", "Languages", "Microsoft Office", "Social Media"
];

const workTypes = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "flexible", label: "Flexible Schedule" },
];

export function JobSeekerProfile({ onComplete, disabilityData }: JobSeekerProfileProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
    preferences: {
      position: "",
      location: "",
      maxDistance: 0,
      workType: "",
      salary: "",
    },
    skills: [],
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      personalInfo: { ...formData.personalInfo, [field]: value }
    });
  };

  const handlePreferencesChange = (field: string, value: string | number) => {
    setFormData({
      ...formData,
      preferences: { ...formData.preferences, [field]: value }
    });
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = formData.skills || [];
    if (currentSkills.includes(skill)) {
      setFormData({
        ...formData,
        skills: currentSkills.filter(s => s !== skill)
      });
    } else {
      setFormData({
        ...formData,
        skills: [...currentSkills, skill]
      });
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData as ProfileData);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-card shadow-strong border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-hero bg-clip-text text-transparent">
              Complete Your Profile
            </CardTitle>
            <p className="text-muted-foreground">
              Help us find the perfect job opportunities for you
            </p>
            <Progress value={progress} className="mt-4" />
            <p className="text-sm text-muted-foreground mt-2">Step {step} of 4</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Personal Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.personalInfo?.name || ""}
                      onChange={(e) => handlePersonalInfoChange("name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personalInfo?.email || ""}
                      onChange={(e) => handlePersonalInfoChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.personalInfo?.phone || ""}
                      onChange={(e) => handlePersonalInfoChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.personalInfo?.city || ""}
                      onChange={(e) => handlePersonalInfoChange("city", e.target.value)}
                      placeholder="Your city"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.personalInfo?.state || ""}
                      onChange={(e) => handlePersonalInfoChange("state", e.target.value)}
                      placeholder="Your state"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.personalInfo?.country || ""}
                      onChange={(e) => handlePersonalInfoChange("country", e.target.value)}
                      placeholder="Your country"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Textarea
                    id="address"
                    value={formData.personalInfo?.address || ""}
                    onChange={(e) => handlePersonalInfoChange("address", e.target.value)}
                    placeholder="Enter your complete address"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Job Preferences</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Desired Position *</Label>
                    <Input
                      id="position"
                      value={formData.preferences?.position || ""}
                      onChange={(e) => handlePreferencesChange("position", e.target.value)}
                      placeholder="e.g. Software Developer, Teacher, Sales Representative"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="workType">Work Type</Label>
                    <Select
                      value={formData.preferences?.workType || ""}
                      onValueChange={(value) => handlePreferencesChange("workType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select work type" />
                      </SelectTrigger>
                      <SelectContent>
                        {workTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Preferred Location</Label>
                    <Input
                      id="location"
                      value={formData.preferences?.location || ""}
                      onChange={(e) => handlePreferencesChange("location", e.target.value)}
                      placeholder="City, State or Remote"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxDistance">Max Distance (km)</Label>
                    <Input
                      id="maxDistance"
                      type="number"
                      value={formData.preferences?.maxDistance || ""}
                      onChange={(e) => handlePreferencesChange("maxDistance", parseInt(e.target.value))}
                      placeholder="25"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="salary">Expected Salary Range</Label>
                  <Input
                    id="salary"
                    value={formData.preferences?.salary || ""}
                    onChange={(e) => handlePreferencesChange("salary", e.target.value)}
                    placeholder="e.g. $40,000 - $60,000 or Negotiable"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Skills & Experience</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="education">Education Background</Label>
                    <Textarea
                      id="education"
                      value={formData.education || ""}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="Describe your educational background, degrees, certifications, etc."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Work Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience || ""}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Describe your work experience, responsibilities, achievements, etc."
                      className="min-h-[120px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Select Your Skills</h3>
                </div>
                
                <p className="text-muted-foreground">
                  Choose skills that match your experience and the position you're seeking:
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {skillSuggestions.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={formData.skills?.includes(skill) || false}
                        onCheckedChange={() => toggleSkill(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm cursor-pointer">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
                
                {formData.skills && formData.skills.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Skills:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="cursor-pointer" onClick={() => toggleSkill(skill)}>
                          {skill} ×
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                Previous
              </Button>

              <Button
                variant="gradient"
                onClick={handleNext}
                disabled={
                  (step === 1 && (!formData.personalInfo?.name || !formData.personalInfo?.email || !formData.personalInfo?.city)) ||
                  (step === 2 && !formData.preferences?.position)
                }
              >
                {step === 4 ? "Complete Profile" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}