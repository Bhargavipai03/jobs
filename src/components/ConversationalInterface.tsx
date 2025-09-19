import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Volume2, Mic, MicOff, RotateCcw } from "lucide-react";

interface ConversationStep {
  id: string;
  question: string;
  type: "text" | "choice" | "number" | "confirmation";
  choices?: string[];
  validation?: (input: string) => boolean;
  next?: string | ((input: string) => string);
}

interface ConversationalInterfaceProps {
  steps: ConversationStep[];
  onComplete: (data: Record<string, any>) => void;
  onDataUpdate?: (data: Record<string, any>) => void;
  initialMessage?: string;
  language?: string;
}

export function ConversationalInterface({ 
  steps, 
  onComplete, 
  onDataUpdate,
  initialMessage = "Hello! I'm here to help you. Let's start our conversation.",
  language = "en"
}: ConversationalInterfaceProps) {
  const [currentStepId, setCurrentStepId] = useState(steps[0]?.id || "");
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [conversationHistory, setConversationHistory] = useState<Array<{
    speaker: "ai" | "user";
    message: string;
    timestamp: Date;
  }>>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const recognition = useState(() => {
    console.log("Initializing speech recognition...");
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = language;
      console.log("Speech recognition initialized successfully");
      return recognition;
    } else {
      console.error("Speech recognition not supported in this browser");
      return null;
    }
  })[0];

  const currentStep = steps.find(step => step.id === currentStepId);

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

  const addToHistory = (speaker: "ai" | "user", message: string) => {
    setConversationHistory(prev => [...prev, {
      speaker,
      message,
      timestamp: new Date()
    }]);
  };

  const startListening = () => {
    if (recognition) {
      console.log("Starting speech recognition...");
      setIsListening(true);
      setCurrentTranscript("");
      try {
        recognition.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        setIsListening(false);
      }
    } else {
      console.error("Speech recognition not available");
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const processUserInput = async (input: string) => {
    if (!currentStep) return;

    addToHistory("user", input);

    // Validate input if validation function exists
    if (currentStep.validation && !currentStep.validation(input)) {
      const errorMessage = "I didn't understand that. Could you please try again?";
      addToHistory("ai", errorMessage);
      await speak(errorMessage);
      return;
    }

    // Store the response
    const newResponses = { ...responses, [currentStep.id]: input };
    setResponses(newResponses);
    
    if (onDataUpdate) {
      onDataUpdate(newResponses);
    }

    // Determine next step
    let nextStepId: string | null = null;
    if (currentStep.next) {
      if (typeof currentStep.next === "function") {
        nextStepId = currentStep.next(input);
      } else {
        nextStepId = currentStep.next;
      }
    }

    // Check if we're done
    if (!nextStepId || !steps.find(step => step.id === nextStepId)) {
      setIsComplete(true);
      const completionMessage = "Thank you! I have all the information I need. Let me process this for you.";
      addToHistory("ai", completionMessage);
      await speak(completionMessage);
      setTimeout(() => onComplete(newResponses), 2000);
      return;
    }

    // Move to next step
    setCurrentStepId(nextStepId);
    const nextStep = steps.find(step => step.id === nextStepId);
    if (nextStep) {
      await speak(nextStep.question);
      addToHistory("ai", nextStep.question);
    }
  };

  // Initialize conversation
  useEffect(() => {
    const initConversation = async () => {
      await speak(initialMessage);
      addToHistory("ai", initialMessage);
      
      if (currentStep) {
        setTimeout(async () => {
          await speak(currentStep.question);
          addToHistory("ai", currentStep.question);
        }, 1000);
      }
    };

    initConversation();
  }, []);

  // Setup speech recognition
  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event: any) => {
        console.log("Speech recognition result:", event);
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        console.log("Transcript:", transcript);
        setCurrentTranscript(transcript);
      };

      recognition.onend = () => {
        console.log("Speech recognition ended, transcript:", currentTranscript);
        setIsListening(false);
        if (currentTranscript.trim()) {
          processUserInput(currentTranscript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Microphone access denied. Please allow microphone access and try again.");
        } else if (event.error === 'no-speech') {
          console.log("No speech detected, please try again");
        } else {
          alert(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onstart = () => {
        console.log("Speech recognition started");
      };
    }
  }, [currentTranscript, currentStep, responses]);

  const handleChoiceClick = async (choice: string) => {
    await processUserInput(choice);
  };

  const restartConversation = () => {
    setCurrentStepId(steps[0]?.id || "");
    setResponses({});
    setConversationHistory([]);
    setIsComplete(false);
    setCurrentTranscript("");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-gradient-card shadow-strong border-0">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center">
              <Volume2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-success">Processing Complete!</h2>
            <p className="text-muted-foreground">
              Thank you for providing all the information. I'm now processing your details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Conversation Display */}
        <Card className="bg-gradient-card shadow-medium border-0">
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {conversationHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`flex ${entry.speaker === "ai" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      entry.speaker === "ai"
                        ? "bg-primary/10 text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm">{entry.message}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Input */}
        {currentStep && !isComplete && (
          <Card className="bg-gradient-card shadow-medium border-0">
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Current Question:</h3>
                <p className="text-muted-foreground">{currentStep.question}</p>
              </div>

              {/* Voice Controls */}
              <div className="flex justify-center gap-4">
                {!recognition && (
                  <div className="bg-destructive/10 p-4 rounded-lg text-center">
                    <p className="text-destructive font-medium">Speech Recognition Not Supported</p>
                    <p className="text-sm text-muted-foreground">Please use Chrome, Edge, or Safari browser</p>
                  </div>
                )}
                
                {recognition && (
                  <>
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
                          Speak Your Answer
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => speak(currentStep.question)}
                      disabled={isSpeaking}
                      className="gap-2"
                    >
                      <Volume2 className="h-5 w-5" />
                      Repeat Question
                    </Button>
                  </>
                )}
              </div>

              {/* Live Transcript */}
              {currentTranscript && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">You're saying:</p>
                  <p className="font-medium">{currentTranscript}</p>
                </div>
              )}

              {/* Choice Buttons (if applicable) */}
              {currentStep.type === "choice" && currentStep.choices && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentStep.choices.map((choice, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleChoiceClick(choice)}
                      disabled={isSpeaking || isListening}
                      className="p-4 h-auto text-left justify-start"
                    >
                      {choice}
                    </Button>
                  ))}
                </div>
              )}

              {/* Status */}
              <div className="text-center text-sm text-muted-foreground">
                {isSpeaking && "🔊 AI is speaking..."}
                {isListening && "🎤 Listening for your response..."}
                {!isSpeaking && !isListening && "Ready for your input"}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restart Button */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={restartConversation}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>
    </div>
  );
}