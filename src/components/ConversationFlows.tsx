// Conversation flow definitions for different user journeys

export interface ConversationStep {
  id: string;
  question: string;
  type: "text" | "choice" | "number" | "confirmation";
  choices?: string[];
  validation?: (input: string) => boolean;
  next?: string | ((input: string) => string);
}

// Disability Assessment Conversation Flow
export const disabilityAssessmentFlow: ConversationStep[] = [
  {
    id: "disability-type",
    question: "To help me understand your needs better, could you tell me about any disabilities or conditions you have? You can say 'none' if this doesn't apply to you, or choose from options like mobility, visual, hearing, cognitive, neurological, mental health, chronic illness, or multiple disabilities.",
    type: "choice",
    choices: [
      "I have a mobility or physical disability",
      "I have a visual disability",
      "I have a hearing disability", 
      "I have a cognitive disability",
      "I have a neurological condition",
      "I have mental health conditions",
      "I have a chronic illness",
      "I have multiple disabilities",
      "I don't have a disability"
    ],
    next: (input: string) => {
      if (input.includes("don't have") || input.includes("none")) {
        return "completion";
      }
      return "severity";
    }
  },
  {
    id: "severity",
    question: "Thank you for sharing that. How would you describe the impact on your daily activities? Is it mild with minimal impact, moderate with some limitations, severe with significant limitations requiring accommodations, or profound requiring extensive support?",
    type: "choice",
    choices: [
      "Mild - minimal impact on daily activities",
      "Moderate - some limitations in daily activities", 
      "Severe - significant limitations requiring accommodations",
      "Profound - extensive support and accommodations needed"
    ],
    next: "accommodations"
  },
  {
    id: "accommodations",
    question: "What types of workplace accommodations typically help you perform your best? For example, flexible work hours, screen reader software, ergonomic workspace, quiet environment, or anything else that comes to mind.",
    type: "text",
    next: "assistive-tech"
  },
  {
    id: "assistive-tech", 
    question: "Do you use any assistive technology or tools that help you work effectively? This could include screen readers, voice recognition software, mobility aids, communication devices, or any other tools.",
    type: "text",
    next: "completion"
  },
  {
    id: "completion",
    question: "Thank you for providing this information. This helps me understand your needs better so I can find the most suitable job opportunities for you.",
    type: "confirmation",
    next: ""
  }
];

// Job Seeker Profile Conversation Flow
export const jobSeekerProfileFlow: ConversationStep[] = [
  {
    id: "name",
    question: "Let's start with the basics. What's your full name?",
    type: "text",
    validation: (input: string) => input.trim().length > 0,
    next: "email"
  },
  {
    id: "email",
    question: "What's your email address? I'll need this for job applications and communication.",
    type: "text",
    validation: (input: string) => /\S+@\S+\.\S+/.test(input),
    next: "phone"
  },
  {
    id: "phone",
    question: "Could you share your phone number? This is optional but helpful for employers to contact you.",
    type: "text",
    next: "location"
  },
  {
    id: "location",
    question: "What city and state are you located in? Or country if you're outside the US?",
    type: "text",
    validation: (input: string) => input.trim().length > 0,
    next: "address"
  },
  {
    id: "address",
    question: "Would you like to provide your full address? This is optional and only used for calculating commute distances.",
    type: "text",
    next: "desired-position"
  },
  {
    id: "desired-position",
    question: "What type of job are you looking for? For example, software developer, teacher, customer service representative, or any other position.",
    type: "text",
    validation: (input: string) => input.trim().length > 0,
    next: "work-type"
  },
  {
    id: "work-type",
    question: "What type of work arrangement would you prefer? Full-time, part-time, contract work, remote work, hybrid, or flexible schedule?",
    type: "choice",
    choices: [
      "Full-time",
      "Part-time", 
      "Contract work",
      "Remote work",
      "Hybrid (mix of remote and office)",
      "Flexible schedule"
    ],
    next: "preferred-location"
  },
  {
    id: "preferred-location",
    question: "Where would you like to work? You can say the same city you live in, a different city, or 'remote' if location doesn't matter.",
    type: "text",
    next: "max-distance"
  },
  {
    id: "max-distance",
    question: "How far are you willing to travel for work? Please tell me the maximum distance in kilometers or miles, or say 'no limit' for remote work.",
    type: "text",
    next: "salary"
  },
  {
    id: "salary",
    question: "What salary range are you looking for? You can give me a range like '40,000 to 60,000 dollars' or say 'negotiable' if you're flexible.",
    type: "text",
    next: "education"
  },
  {
    id: "education",
    question: "Could you tell me about your educational background? Include any degrees, certifications, or relevant training you have.",
    type: "text",
    next: "experience"
  },
  {
    id: "experience",
    question: "Please describe your work experience. Tell me about your previous jobs, responsibilities, and any achievements you're proud of.",
    type: "text",
    next: "skills"
  },
  {
    id: "skills",
    question: "What are your key skills? I'll help you identify relevant ones. You can mention things like communication, teamwork, computer skills, specific software, languages you speak, or any other abilities.",
    type: "text",
    next: "completion"
  },
  {
    id: "completion",
    question: "Perfect! I have all the information I need to create your profile and start finding great job matches for you.",
    type: "confirmation",
    next: ""
  }
];

// Employer Job Posting Conversation Flow
export const employerJobPostingFlow: ConversationStep[] = [
  {
    id: "job-title",
    question: "Let's create your job posting. What's the job title for the position you're hiring for?",
    type: "text",
    validation: (input: string) => input.trim().length > 0,
    next: "job-description"
  },
  {
    id: "job-description", 
    question: "Please describe this job role. What are the main responsibilities and what would a typical day look like for someone in this position?",
    type: "text",
    validation: (input: string) => input.trim().length > 20,
    next: "location"
  },
  {
    id: "location",
    question: "Where is this job located? You can specify a city and state, or say 'remote' if location doesn't matter.",
    type: "text",
    next: "job-type"
  },
  {
    id: "job-type",
    question: "What type of employment is this? Full-time, part-time, contract, remote, or hybrid?",
    type: "choice",
    choices: [
      "Full-time",
      "Part-time",
      "Contract", 
      "Remote",
      "Hybrid"
    ],
    next: "salary"
  },
  {
    id: "salary",
    question: "What's the salary range for this position? You can give me a range like '40,000 to 60,000 dollars annually' or say what works for your budget.",
    type: "text",
    next: "disability-support"
  },
  {
    id: "disability-support",
    question: "On a scale from 0 to 100 percent, how much disability support can your company provide? This helps us match you with suitable candidates who need different levels of accommodation.",
    type: "number",
    validation: (input: string) => {
      const num = parseInt(input);
      return !isNaN(num) && num >= 0 && num <= 100;
    },
    next: "match-threshold"
  },
  {
    id: "match-threshold",
    question: "What's the minimum skills match percentage you'd accept for candidates? For example, would you consider someone who matches 70% of your requirements, or do you need a higher match?",
    type: "number", 
    validation: (input: string) => {
      const num = parseInt(input);
      return !isNaN(num) && num >= 0 && num <= 100;
    },
    next: "accommodations"
  },
  {
    id: "accommodations",
    question: "What accommodations can your company provide? For example, flexible work hours, remote work options, ergonomic workspaces, screen reader compatibility, sign language interpreters, quiet workspaces, modified tasks, or any other support you can offer.",
    type: "text",
    next: "accessibility-equipment"
  },
  {
    id: "accessibility-equipment",
    question: "What accessibility equipment or technology does your company have available? This could include height-adjustable desks, screen magnification software, voice recognition software, hearing loops, wheelchair accessible facilities, or any other assistive technology.",
    type: "text", 
    next: "completion"
  },
  {
    id: "completion",
    question: "Excellent! I have all the information needed to create your inclusive job posting. This will help us connect you with qualified candidates who match your requirements.",
    type: "confirmation",
    next: ""
  }
];

// Helper function to convert conversation data to structured format
export const parseConversationData = (responses: Record<string, any>, flowType: 'disability' | 'profile' | 'employer') => {
  switch (flowType) {
    case 'disability':
      return {
        type: responses['disability-type'] || '',
        severity: responses['severity'] || '',
        accommodations: responses['accommodations'] || '',
        assistiveTech: responses['assistive-tech'] || ''
      };
      
    case 'profile':
      return {
        personalInfo: {
          name: responses['name'] || '',
          email: responses['email'] || '',
          phone: responses['phone'] || '',
          address: responses['address'] || '',
          city: responses['location'] || '',
          state: '',
          country: ''
        },
        preferences: {
          position: responses['desired-position'] || '',
          location: responses['preferred-location'] || '',
          maxDistance: parseInt(responses['max-distance']) || 0,
          workType: responses['work-type'] || '',
          salary: responses['salary'] || ''
        },
        education: responses['education'] || '',
        experience: responses['experience'] || '',
        skills: responses['skills']?.split(',').map((s: string) => s.trim()) || []
      };
      
    case 'employer':
      return {
        title: responses['job-title'] || '',
        description: responses['job-description'] || '',
        location: responses['location'] || '',
        type: responses['job-type'] || '',
        salary: responses['salary'] || '',
        disabilitySupport: parseInt(responses['disability-support']) || 0,
        matchThreshold: parseInt(responses['match-threshold']) || 0,
        accommodations: responses['accommodations']?.split(',').map((s: string) => s.trim()) || [],
        accessibilityEquipment: responses['accessibility-equipment']?.split(',').map((s: string) => s.trim()) || []
      };
      
    default:
      return responses;
  }
};