import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Building, Clock, DollarSign, Heart, ExternalLink, Accessibility, Mic, MicOff, Volume2 } from "lucide-react";

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

interface ConversationalJobMatchingProps {
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

export function ConversationalJobMatching({ userProfile, disabilityData }: ConversationalJobMatchingProps) {
  const [jobs] = useState<JobListing[]>(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasIntroduced, setHasIntroduced] = useState(false);

  const recognition = useState(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en";
      return recognition;
    }
    return null;
  })[0];

  const speak = (text: string) => {
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en";
      utterance.rate = 0.9;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  };

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const currentJob = jobs[currentJobIndex];

  const describeJob = async (job: JobListing) => {
    const description = `Job ${currentJobIndex + 1} of ${jobs.length}. ${job.title} at ${job.company}. This is a ${job.type} position in ${job.location}, with a salary of ${job.salary}. You have a ${job.matchPercentage}% match for this role. The job involves ${job.description} Key requirements include ${job.requirements.join(', ')}. This company offers accommodations like ${job.accommodations.join(', ')}. Available accessibility features include ${job.accessibilityFeatures.join(', ')}. Would you like to apply for this job, save it for later, hear more details, or move to the next job? You can say apply, save, details, next, or previous.`;
    
    await speak(description);
  };

  const handleVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('apply')) {
      setAppliedJobs(prev => new Set([...prev, currentJob.id]));
      await speak(`Great! I've submitted your application for the ${currentJob.title} position at ${currentJob.company}. The employer will review your profile and contact you if you're a good fit. Would you like to continue looking at more jobs?`);
    } else if (lowerCommand.includes('save')) {
      await speak(`I've saved the ${currentJob.title} position for you. You can review saved jobs later. Let's continue looking at other opportunities.`);
    } else if (lowerCommand.includes('details')) {
      const details = `Here are more details about the ${currentJob.title} position: ${currentJob.description} This role was posted ${currentJob.postedDate}. The company specifically supports accessibility with features like ${currentJob.accessibilityFeatures.join(', ')}. Would you like to apply, save it, or continue browsing?`;
      await speak(details);
    } else if (lowerCommand.includes('next')) {
      if (currentJobIndex < jobs.length - 1) {
        setCurrentJobIndex(prev => prev + 1);
        setTimeout(() => describeJob(jobs[currentJobIndex + 1]), 500);
      } else {
        await speak("You've reached the end of the job list. Would you like to go back to the first job or search for more opportunities?");
      }
    } else if (lowerCommand.includes('previous') || lowerCommand.includes('back')) {
      if (currentJobIndex > 0) {
        setCurrentJobIndex(prev => prev - 1);
        setTimeout(() => describeJob(jobs[currentJobIndex - 1]), 500);
      } else {
        await speak("You're already at the first job. Would you like to hear about this position again or move to the next one?");
      }
    } else if (lowerCommand.includes('repeat')) {
      describeJob(currentJob);
    } else {
      await speak("I didn't understand that command. You can say apply, save, details, next, previous, or repeat. What would you like to do?");
    }
  };

  // Initialize voice interaction
  useEffect(() => {
    if (!hasIntroduced) {
      const introduction = `Welcome to your personalized job matches! I found ${jobs.length} great opportunities that match your profile and accessibility needs. I'll read each job to you and you can tell me what you'd like to do. Let's start with the first one.`;
      setTimeout(async () => {
        await speak(introduction);
        setHasIntroduced(true);
        setTimeout(() => describeJob(currentJob), 1000);
      }, 1000);
    }
  }, [hasIntroduced]);

  // Setup speech recognition
  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event: any) => {
        const command = event.results[0][0].transcript;
        handleVoiceCommand(command);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [currentJobIndex, currentJob]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Your Job Matches
          </h1>
          <p className="text-xl text-muted-foreground">
            Voice-guided job browsing experience
          </p>
        </div>

        {/* Voice Controls */}
        <Card className="bg-gradient-card shadow-medium border-0">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Voice Controls</h3>
              <div className="flex justify-center gap-4">
                <Button
                  variant={isListening ? "voice" : "default"}
                  size="lg"
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking}
                  className="gap-2"
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-5 w-5" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      Give Voice Command
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => describeJob(currentJob)}
                  disabled={isSpeaking}
                  className="gap-2"
                >
                  <Volume2 className="h-5 w-5" />
                  Repeat Current Job
                </Button>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Voice Commands:</strong></p>
                <p>"Apply" - Submit application | "Save" - Save for later | "Details" - More info</p>
                <p>"Next" - Next job | "Previous" - Previous job | "Repeat" - Hear again</p>
              </div>
              
              <div className="text-center">
                {isSpeaking && <p className="text-primary">🔊 Speaking...</p>}
                {isListening && <p className="text-voice-active">🎤 Listening for command...</p>}
                {!isSpeaking && !isListening && <p className="text-muted-foreground">Ready for voice command</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Job Display */}
        {currentJob && (
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <CardTitle className="text-xl text-primary">{currentJob.title}</CardTitle>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {currentJob.company}
                    </div>
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
                
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Match</span>
                    <Progress 
                      value={currentJob.matchPercentage} 
                      className="w-20"
                    />
                    <span className="text-sm font-bold text-primary">{currentJob.matchPercentage}%</span>
                  </div>
                  {currentJob.isAccessible && (
                    <Badge variant="secondary" className="bg-success/10 text-success">
                      <Accessibility className="h-3 w-3 mr-1" />
                      Accessible
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{currentJob.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Requirements</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentJob.requirements.map((req) => (
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
                        {currentJob.salary}
                      </div>
                      <Badge variant="secondary">{currentJob.type}</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Accommodations</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentJob.accommodations.map((acc) => (
                        <Badge key={acc} variant="outline" className="text-xs bg-success/10 text-success">
                          {acc}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Accessibility Features</h4>
                    <div className="flex flex-wrap gap-1">
                      {currentJob.accessibilityFeatures.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs bg-primary/10 text-primary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div className="text-sm text-muted-foreground">
                  Job {currentJobIndex + 1} of {jobs.length}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoiceCommand("previous")}
                    disabled={currentJobIndex === 0}
                  >
                    ← Previous
                  </Button>
                  
                  <Button
                    variant={appliedJobs.has(currentJob.id) ? "success" : "gradient"}
                    onClick={() => handleVoiceCommand("apply")}
                    disabled={appliedJobs.has(currentJob.id)}
                    className="gap-2"
                  >
                    {appliedJobs.has(currentJob.id) ? "Applied ✓" : "Apply Now"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoiceCommand("next")}
                    disabled={currentJobIndex === jobs.length - 1}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Use voice commands or click the buttons above to navigate through your job matches
          </p>
        </div>
      </div>
    </div>
  );
}