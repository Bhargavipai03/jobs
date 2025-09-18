import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Extend Window interface for Speech Recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: any) => void;
  onend: () => void;
}

interface VoiceBotProps {
  language: string;
  onLanguageChange: (lang: string) => void;
  isActive: boolean;
  onToggle: () => void;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", flag: "🇮🇳" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
];

export function VoiceBot({ language, onLanguageChange, isActive, onToggle }: VoiceBotProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const recognition = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition.current = new SpeechRecognitionClass();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;
      recognition.current.lang = language;

      recognition.current.onresult = (event) => {
        const last = event.results.length - 1;
        const transcript = event.results[last][0].transcript;
        setTranscript(transcript);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const startListening = () => {
    if (recognition.current) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isActive) {
    return (
      <Button
        variant="voice"
        size="icon"
        onClick={onToggle}
        className="fixed bottom-6 right-6 rounded-full z-50"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 p-4 bg-gradient-card shadow-strong z-50 border-0">
      <div className="space-y-4">
        {/* Language Selector */}
        <div className="flex gap-2 flex-wrap">
          {languages.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? "default" : "outline"}
              size="sm"
              onClick={() => onLanguageChange(lang.code)}
              className="text-xs"
            >
              {lang.flag} {lang.name}
            </Button>
          ))}
        </div>

        {/* Voice Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant={isListening ? "voice" : "outline"}
            size="icon"
            onClick={handleVoiceToggle}
            className={cn(
              "rounded-full",
              isListening && "animate-pulse"
            )}
          >
            {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
          </Button>
          
          <Button
            variant={isSpeaking ? "voice" : "outline"}
            size="icon"
            onClick={() => speak("Hello! How can I help you today?")}
            className="rounded-full"
          >
            {isSpeaking ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="rounded-full"
          >
            ×
          </Button>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">You said:</p>
            <p className="text-sm">{transcript}</p>
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="bg-primary/10 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">AI Response:</p>
            <p className="text-sm">{response}</p>
          </div>
        )}

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Voice AI Assistant - Click mic to speak
          </p>
        </div>
      </div>
    </Card>
  );
}