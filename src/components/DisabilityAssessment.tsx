import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface DisabilityData {
  type: string;
  severity: string;
  accommodations: string;
  assistiveTech: string;
}

interface DisabilityAssessmentProps {
  onComplete: (data: DisabilityData) => void;
  onSkip: () => void;
}

const disabilityTypes = [
  { id: "mobility", label: "Mobility/Physical", description: "Difficulty with movement or physical tasks" },
  { id: "visual", label: "Visual", description: "Blind, low vision, or visual processing" },
  { id: "hearing", label: "Hearing", description: "Deaf, hard of hearing, or auditory processing" },
  { id: "cognitive", label: "Cognitive", description: "Learning disabilities, ADHD, memory issues" },
  { id: "neurological", label: "Neurological", description: "Autism, epilepsy, brain injury" },
  { id: "mental", label: "Mental Health", description: "Depression, anxiety, PTSD" },
  { id: "chronic", label: "Chronic Illness", description: "Diabetes, arthritis, chronic pain" },
  { id: "multiple", label: "Multiple Disabilities", description: "Combination of above" },
  { id: "none", label: "No Disability", description: "I don't have a disability" },
];

const severityLevels = [
  { id: "mild", label: "Mild", description: "Minimal impact on daily activities" },
  { id: "moderate", label: "Moderate", description: "Some limitations in daily activities" },
  { id: "severe", label: "Severe", description: "Significant limitations requiring accommodations" },
  { id: "profound", label: "Profound", description: "Extensive support and accommodations needed" },
];

export function DisabilityAssessment({ onComplete, onSkip }: DisabilityAssessmentProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<DisabilityData>>({});

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(formData as DisabilityData);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-gradient-card shadow-strong border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-hero bg-clip-text text-transparent">
            Accessibility Assessment
          </CardTitle>
          <p className="text-muted-foreground">
            Help us understand your needs to provide better job matches
          </p>
          <Progress value={progress} className="mt-4" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of 4</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What type of disability do you have?</h3>
              <p className="text-sm text-muted-foreground">
                This helps us understand what accommodations you might need
              </p>
              <RadioGroup
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                className="space-y-3"
              >
                {disabilityTypes.map((type) => (
                  <div key={type.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                    <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                    <Label htmlFor={type.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 2 && formData.type !== "none" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">How would you describe the severity?</h3>
              <p className="text-sm text-muted-foreground">
                This helps employers understand what level of support you need
              </p>
              <RadioGroup
                value={formData.severity}
                onValueChange={(value) => setFormData({ ...formData, severity: value })}
                className="space-y-3"
              >
                {severityLevels.map((level) => (
                  <div key={level.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-smooth">
                    <RadioGroupItem value={level.id} id={level.id} className="mt-1" />
                    <Label htmlFor={level.id} className="flex-1 cursor-pointer">
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm text-muted-foreground">{level.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {step === 3 && formData.type !== "none" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What accommodations do you typically need?</h3>
              <p className="text-sm text-muted-foreground">
                Describe any workplace accommodations that help you perform your best
              </p>
              <Textarea
                placeholder="Examples: Flexible work hours, screen reader software, ergonomic workspace, quiet environment, etc."
                value={formData.accommodations || ""}
                onChange={(e) => setFormData({ ...formData, accommodations: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          )}

          {step === 4 && formData.type !== "none" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Do you use any assistive technology?</h3>
              <p className="text-sm text-muted-foreground">
                Tell us about any tools or software that help you work effectively
              </p>
              <Textarea
                placeholder="Examples: Screen readers, voice recognition software, mobility aids, communication devices, etc."
                value={formData.assistiveTech || ""}
                onChange={(e) => setFormData({ ...formData, assistiveTech: e.target.value })}
                className="min-h-[120px]"
              />
            </div>
          )}

          {formData.type === "none" && step === 2 && (
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Thank you for the information!</h3>
              <p className="text-muted-foreground">
                You'll still have access to all job opportunities and can help promote inclusive hiring.
              </p>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={step === 1 ? onSkip : handlePrevious}
            >
              {step === 1 ? "Skip Assessment" : "Previous"}
            </Button>

            <Button
              variant="gradient"
              onClick={handleNext}
              disabled={
                (step === 1 && !formData.type) ||
                (step === 2 && formData.type !== "none" && !formData.severity)
              }
            >
              {step === 4 || (step === 2 && formData.type === "none") ? "Complete" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}