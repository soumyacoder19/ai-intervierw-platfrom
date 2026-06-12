/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum InterviewRole {
  // Software & IT
  FRONTEND = "Frontend Engineer",
  BACKEND = "Backend Engineer",
  FULLSTACK = "Fullstack Developer",
  DEVOPS = "DevOps & Cloud Architect",
  MOBILE = "Mobile App Developer",
  CYBERSECURITY = "Cybersecurity Analyst",
  UIUX = "UI/UX Designer",

  // AI & Data
  MACHINE_LEARNING = "ML/AI Engineer",
  DATA_SCIENCE = "Data Scientist",
  DATA_ANALYST = "Data & BI Analyst",
  DATA_ENGINEER = "Data Engineer",
  DATABASE_ADMIN = "Database Administrator",

  // Core Engineering
  MECHANICAL = "Mechanical Design Engineer",
  ELECTRICAL = "Electrical Systems Engineer",
  CIVIL = "Civil & Structural Engineer",
  CHEMICAL = "Chemical Process Engineer",

  // Product & Management
  PRODUCT_MANAGER = "Product Manager",
  SCRUM_MASTER = "Scrum Master",
  BUSINESS_ANALYST = "Business/Systems Analyst",
  SYSTEM_DESIGN = "System Design Architect",
  BEHAVIORAL = "HR & Behavioral Specialist",
  PROJECT_MANAGER = "Project & Program Manager",

  // Finance & Accounting
  INVESTMENT_BANKING = "Investment Banker",
  FINANCIAL_ANALYST = "Financial Analyst",
  ACCOUNTANT = "Corporate Accountant",
  RISK_ANALYST = "Risk & Quant Analyst",

  // Sales & Support
  DIGITAL_MARKETING = "Digital Marketing Expert",
  SALES = "Sales Development Rep",
  CUSTOMER_SUCCESS = "Customer Success Lead",

  // Healthcare
  NURSING = "Clinical Nurse Practitioner",
  HEALTHCARE_ADMIN = "Healthcare Administrator",

  // Custom
  CUSTOM = "Custom / Other Position..."
}

export enum InterviewDifficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
  EXPERT = "Expert"
}

export interface ScoreBreakdown {
  technical: number; // 0 - 100
  communication: number; // 0 - 100
  problemSolving: number; // 0 - 100
  confidence: number; // 0 - 100
  structure: number; // 0 - 100
  overall: number; // 0 - 100
}

export interface InterviewMessage {
  id: string;
  sender: "interviewer" | "candidate" | "system";
  text: string;
  timestamp: string;
  audioUrl?: string; // Optional simulated voice audio
  feedback?: {
    clarity: string;
    suggestions: string;
    structure: string;
    correctnessScore: number;
  };
}

export interface InterviewSession {
  id: string;
  role: InterviewRole;
  customRoleName?: string; // Stored user typed custom course or job
  difficulty: InterviewDifficulty;
  status: "setup" | "ongoing" | "completed";
  messages: InterviewMessage[];
  currentQuestionIndex: number;
  maxQuestions: number;
  language?: string; // Selected interview language
  scores?: ScoreBreakdown;
  feedbackReport?: string; // Comprehensive textual summary of performance
  createdAt: string;
  elapsedSeconds: number;
}

export interface ExtractedSkill {
  name: string;
  category: "Technical" | "Soft Skill" | "Domain Expertise";
  relevance: number; // 0 - 100
}

export interface ResumeAnalysis {
  id: string;
  fileName: string;
  uploadedAt: string;
  atsScore: number; // 0 - 100
  skills: ExtractedSkill[];
  experienceLevel: "Junior" | "Mid-level" | "Senior" | "Lead/Architect";
  strengths: string[];
  weaknesses: string[];
  suggestedQuestions: string[];
  atsChecklist: {
    rule: string;
    passed: boolean;
    feedback: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Premium";
  creditsRemaining: number;
  joinedAt: string;
  avatarSeed: string; // for custom visual rendering
}

export interface SkillProgressPoint {
  date: string;
  technical: number;
  communication: number;
  problemSolving: number;
  confidence: number;
  structure: number;
}

export interface AdminStats {
  totalUsers: number;
  activeInterviewsCount: number;
  monthlyRevenueUSD: number;
  totalGeminiTokensUsed: number;
}
