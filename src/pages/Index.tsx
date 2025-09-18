import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceBot } from "@/components/VoiceBot";
import { DisabilityAssessment } from "@/components/DisabilityAssessment";
import { JobSeekerProfile } from "@/components/JobSeekerProfile";
import { JobMatching } from "@/components/JobMatching";
import { EmployerPortal } from "@/components/EmployerPortal";
import { Accessibility, Users, Building, Globe, Award, Search } from "lucide-react";

type UserType = "job-seeker" | "employer" | null;
type AppStep = "welcome" | "user-type" | "disability-assessment" | "profile" | "dashboard" | "employer-portal";

interface UserData {
  userType: UserType;
  disabilityData?: any;
  profileData?: any;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("welcome");
  const [userData, setUserData] = useState<UserData>({ userType: null });
  const [voiceBotActive, setVoiceBotActive] = useState(false);
  const [language, setLanguage] = useState("en");

  const handleUserTypeSelection = (type: UserType) => {
    setUserData({ ...userData, userType: type });
    if (type === "job-seeker") {
      setCurrentStep("disability-assessment");
    } else {
      setCurrentStep("employer-portal");
    }
  };

  const handleDisabilityAssessmentComplete = (data: any) => {
    setUserData({ ...userData, disabilityData: data });
    setCurrentStep("profile");
  };

  const handleProfileComplete = (data: any) => {
    setUserData({ ...userData, profileData: data });
    setCurrentStep("dashboard");
  };

  const skipDisabilityAssessment = () => {
    setCurrentStep("profile");
  };

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl bg-gradient-card shadow-strong border-0">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center">
              <Accessibility className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                InclusiveJobs
              </h1>
              <p className="text-xl text-muted-foreground">
                Connecting talent with opportunity through inclusive hiring
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Multi-lingual Voice AI</h3>
                <p className="text-sm text-muted-foreground">
                  AI assistant that speaks your language and understands your needs
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Search className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold">Smart Job Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced algorithm matches skills with accessibility needs
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold">Government Incentives</h3>
                <p className="text-sm text-muted-foreground">
                  Find and apply for hiring incentives and tax credits
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold">How would you like to get started?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Button
                  variant="gradient"
                  size="lg"
                  onClick={() => setCurrentStep("user-type")}
                  className="gap-2"
                >
                  <Users className="h-5 w-5" />
                  Get Started
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <VoiceBot
          language={language}
          onLanguageChange={setLanguage}
          isActive={voiceBotActive}
          onToggle={() => setVoiceBotActive(!voiceBotActive)}
        />
      </div>
    );
  }

  if (currentStep === "user-type") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-gradient-card shadow-strong border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-hero bg-clip-text text-transparent">
              Choose Your Path
            </CardTitle>
            <p className="text-muted-foreground">
              Select how you'd like to use InclusiveJobs
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <Button
                variant="outline"
                size="xl"
                onClick={() => handleUserTypeSelection("job-seeker")}
                className="p-8 h-auto flex-col gap-4 hover:bg-primary/5 hover:border-primary transition-smooth"
              >
                <Users className="h-12 w-12 text-primary" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold">I'm Looking for a Job</h3>
                  <p className="text-muted-foreground mt-2">
                    Find inclusive employers who value your unique abilities
                  </p>
                </div>
              </Button>

              <Button
                variant="outline"
                size="xl"
                onClick={() => handleUserTypeSelection("employer")}
                className="p-8 h-auto flex-col gap-4 hover:bg-secondary/5 hover:border-secondary transition-smooth"
              >
                <Building className="h-12 w-12 text-secondary" />
                <div className="text-center">
                  <h3 className="text-xl font-semibold">I'm an Employer</h3>
                  <p className="text-muted-foreground mt-2">
                    Hire talented individuals and access government incentives
                  </p>
                </div>
              </Button>
            </div>

            <div className="text-center pt-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep("welcome")}
              >
                ← Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <VoiceBot
          language={language}
          onLanguageChange={setLanguage}
          isActive={voiceBotActive}
          onToggle={() => setVoiceBotActive(!voiceBotActive)}
        />
      </div>
    );
  }

  if (currentStep === "disability-assessment") {
    return (
      <>
        <DisabilityAssessment
          onComplete={handleDisabilityAssessmentComplete}
          onSkip={skipDisabilityAssessment}
        />
        <VoiceBot
          language={language}
          onLanguageChange={setLanguage}
          isActive={voiceBotActive}
          onToggle={() => setVoiceBotActive(!voiceBotActive)}
        />
      </>
    );
  }

  if (currentStep === "profile") {
    return (
      <>
        <JobSeekerProfile
          onComplete={handleProfileComplete}
          disabilityData={userData.disabilityData}
        />
        <VoiceBot
          language={language}
          onLanguageChange={setLanguage}
          isActive={voiceBotActive}
          onToggle={() => setVoiceBotActive(!voiceBotActive)}
        />
      </>
    );
  }

  if (currentStep === "dashboard") {
    return (
      <>
        <JobMatching
          userProfile={userData.profileData}
          disabilityData={userData.disabilityData}
        />
        <VoiceBot
          language={language}
          onLanguageChange={setLanguage}
          isActive={voiceBotActive}
          onToggle={() => setVoiceBotActive(!voiceBotActive)}
        />
      </>
    );
  }

  if (currentStep === "employer-portal") {
    return (
      <>
        <EmployerPortal />
        <VoiceBot
          language={language}
          onLanguageChange={setLanguage}
          isActive={voiceBotActive}
          onToggle={() => setVoiceBotActive(!voiceBotActive)}
        />
      </>
    );
  }

  return null;
};

export default Index;
