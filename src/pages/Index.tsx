import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationalInterface } from "@/components/ConversationalInterface";
import { disabilityAssessmentFlow, jobSeekerProfileFlow, employerJobPostingFlow, parseConversationData } from "@/components/ConversationFlows";
import { ConversationalJobMatching } from "@/components/ConversationalJobMatching";
import { EmployerPortal } from "@/components/EmployerPortal";
import { Accessibility, Users, Building, Globe, Award, Mic, Volume2, VolumeX } from "lucide-react";

type UserType = "job-seeker" | "employer" | null;
type AppStep = "welcome" | "user-type" | "disability-assessment" | "profile" | "dashboard" | "employer-job-posting" | "employer-portal";

interface UserData {
  userType: UserType;
  disabilityData?: any;
  profileData?: any;
  employerData?: any;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>("welcome");
  const [userData, setUserData] = useState<UserData>({ userType: null });
  const [language, setLanguage] = useState("en");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Auto-speak welcome message
  useEffect(() => {
    if (currentStep === "welcome" && !hasInteracted) {
      const welcomeMessage = "Welcome to Inclusive Jobs! I'm your voice assistant. This platform is designed to be fully accessible and conversational. I'll guide you through everything using voice. Press any key or click anywhere to start our conversation.";
      setTimeout(() => speak(welcomeMessage), 1000);
    }
  }, [currentStep, hasInteracted]);

  const handleUserTypeSelection = (type: UserType) => {
    setUserData({ ...userData, userType: type });
    if (type === "job-seeker") {
      setCurrentStep("disability-assessment");
    } else {
      setCurrentStep("employer-job-posting");
    }
  };

  const handleDisabilityAssessmentComplete = (data: any) => {
    const parsedData = parseConversationData(data, 'disability');
    setUserData({ ...userData, disabilityData: parsedData });
    setCurrentStep("profile");
  };

  const handleProfileComplete = (data: any) => {
    const parsedData = parseConversationData(data, 'profile');
    setUserData({ ...userData, profileData: parsedData });
    setCurrentStep("dashboard");
  };

  const handleEmployerJobPostingComplete = (data: any) => {
    const parsedData = parseConversationData(data, 'employer');
    setUserData({ ...userData, employerData: parsedData });
    setCurrentStep("employer-portal");
  };

  const startConversation = async () => {
    setHasInteracted(true);
    stopSpeaking();
    setCurrentStep("user-type");
  };

  const handleKeyPress = () => {
    if (!hasInteracted) {
      startConversation();
    }
  };

  // Listen for any interaction to start
  useEffect(() => {
    const handleClick = () => handleKeyPress();
    const handleKey = () => handleKeyPress();
    
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKey);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [hasInteracted]);

  // Voice-First Welcome Screen
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
                Voice-First Accessible Employment Platform
              </p>
              <div className="bg-primary/10 p-4 rounded-lg">
                <p className="text-lg font-medium text-primary">
                  🎤 This platform is designed for blind and visually impaired users
                </p>
                <p className="text-muted-foreground mt-2">
                  I'm speaking to you right now. Click anywhere or press any key to continue.
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mic className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Voice-First Experience</h3>
                <p className="text-sm text-muted-foreground">
                  Everything is conversational - I'll guide you through each step
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                  <Globe className="h-6 w-6 text-success" />
                </div>
                <h3 className="font-semibold">Multi-language Support</h3>
                <p className="text-sm text-muted-foreground">
                  Available in multiple languages with natural conversation
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-warning" />
                </div>
                <h3 className="font-semibold">Accessibility First</h3>
                <p className="text-sm text-muted-foreground">
                  Built specifically for users with disabilities
                </p>
              </div>
            </div>

            <div className="text-center space-y-6">
              {!hasInteracted && (
                <div className="flex justify-center gap-4">
                  <Button
                    variant={isSpeaking ? "voice" : "outline"}
                    size="lg"
                    onClick={stopSpeaking}
                    className="gap-2"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="h-5 w-5" />
                        Stop Speaking
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-5 w-5" />
                        Voice Stopped
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              <Button
                variant="gradient"
                size="xl"
                onClick={startConversation}
                className="gap-2 animate-pulse"
              >
                <Mic className="h-6 w-6" />
                Start Voice Conversation
              </Button>
              
              <p className="text-sm text-muted-foreground">
                Click anywhere, press any key, or use the button above to begin
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Conversational User Type Selection
  if (currentStep === "user-type") {
    const userTypeSteps = [
      {
        id: "user-type",
        question: "Perfect! Now I need to know how you'd like to use this platform. Are you looking for a job, or are you an employer looking to hire someone?",
        type: "choice" as const,
        choices: [
          "I'm looking for a job",
          "I'm an employer looking to hire"
        ],
        next: "completion"
      },
      {
        id: "completion",
        question: "Great! Let's get started with setting up your experience.",
        type: "confirmation" as const,
        next: ""
      }
    ];

    return (
      <ConversationalInterface
        steps={userTypeSteps}
        initialMessage="I'm so glad you're here! Let me help you get started with InclusiveJobs."
        language={language}
        onComplete={(data) => {
          const userType = data["user-type"];
          if (userType.includes("looking for a job")) {
            handleUserTypeSelection("job-seeker");
          } else {
            handleUserTypeSelection("employer");
          }
        }}
      />
    );
  }

  // Conversational Disability Assessment
  if (currentStep === "disability-assessment") {
    return (
      <ConversationalInterface
        steps={disabilityAssessmentFlow}
        initialMessage="Now I'd like to learn about your accessibility needs so I can find the best job matches for you. This information helps me understand what accommodations might be helpful."
        language={language}
        onComplete={handleDisabilityAssessmentComplete}
      />
    );
  }

  // Conversational Profile Building
  if (currentStep === "profile") {
    return (
      <ConversationalInterface
        steps={jobSeekerProfileFlow}
        initialMessage="Great! Now let's build your job seeker profile. I'll ask you some questions about your background, skills, and what kind of work you're looking for."
        language={language}
        onComplete={handleProfileComplete}
      />
    );
  }

  // Job Matching Dashboard (with voice guidance)
  if (currentStep === "dashboard") {
    return (
      <ConversationalJobMatching
        userProfile={userData.profileData}
        disabilityData={userData.disabilityData}
      />
    );
  }

  // Conversational Employer Job Posting
  if (currentStep === "employer-job-posting") {
    return (
      <ConversationalInterface
        steps={employerJobPostingFlow}
        initialMessage="Welcome! I'm excited to help you create an inclusive job posting. I'll guide you through some questions about the position and the accessibility features your company can provide."
        language={language}
        onComplete={handleEmployerJobPostingComplete}
      />
    );
  }

  // Employer Portal
  if (currentStep === "employer-portal") {
    return (
      <EmployerPortal />
    );
  }

  return null;
};

export default Index;