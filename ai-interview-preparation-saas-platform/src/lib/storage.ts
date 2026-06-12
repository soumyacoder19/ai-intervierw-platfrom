/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  UserProfile,
  InterviewSession,
  ResumeAnalysis,
  InterviewRole,
  InterviewDifficulty,
  SkillProgressPoint,
  AdminStats
} from "../types";

const STORAGE_KEYS = {
  PROFILE: "ai_prep_profile",
  SESSIONS: "ai_prep_sessions",
  RESUMES: "ai_prep_resumes",
  PROGRESS: "ai_prep_progress",
  ADMIN: "ai_prep_admin"
};

// Initial realistic data sets for high fidelity SaaS experience
const DEFAULT_PROFILE: UserProfile = {
  id: "user-101",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@alumni.edu",
  plan: "Pro",
  creditsRemaining: 45,
  joinedAt: "2026-05-15",
  avatarSeed: "sarah"
};

const DEFAULT_SESSIONS: InterviewSession[] = [
  {
    id: "sess-01",
    role: InterviewRole.FRONTEND,
    difficulty: InterviewDifficulty.MEDIUM,
    status: "completed",
    createdAt: "2026-06-05T14:32:00Z",
    elapsedSeconds: 840,
    currentQuestionIndex: 5,
    maxQuestions: 5,
    messages: [
      {
        id: "msg-1",
        sender: "interviewer",
        text: "Welcome to your Frontend Engineering Mock Interview! Let's start with a foundational concept. Can you explain the difference between virtual DOM and shadow DOM in contemporary front-end development?",
        timestamp: "2026-06-05T14:32:10Z"
      },
      {
        id: "msg-2",
        sender: "candidate",
        text: "The virtual DOM is a programming concept where an ideal, or virtual, representation of a UI is kept in memory and synced with the real DOM by a library such as ReactDOM. This process is called reconciliation. Shadow DOM is a browser technology designed for scoping variables and CSS in web components, so markup and styles don't conflict.",
        timestamp: "2026-06-05T14:34:00Z",
        feedback: {
          clarity: "Your explanation is highly precise and correctly distinguishes the in-memory diffing mechanism of the virtual DOM from native CSS scoping in web components.",
          suggestions: "Consider mentioning how standard libraries, like React, use synthetic events on the virtual DOM tree, which runs separate from shadow boundaries.",
          structure: "Excellent structured layout. Starts with definition, introduces reconciliation, then contrasts with scoped encapsulation.",
          correctnessScore: 95
        }
      },
      {
        id: "msg-3",
        sender: "interviewer",
        text: "That's exactly correct. Now let's build on this. How would you optimize the performance of a large React application where nested components trigger expensive re-renders?",
        timestamp: "2026-06-05T14:34:30Z"
      },
      {
        id: "msg-4",
        sender: "candidate",
        text: "I would utilize memoization techniques such as React.memo for component structural skipping, and useMemo or useCallback for stabilizing reference coordinates. I'd also split state so that fast-changing state doesn't re-render parent cards, and implement lazy loading for route boundaries.",
        timestamp: "2026-06-05T14:38:00Z",
        feedback: {
          clarity: "You've successfully outlined the primary rendering control mechanisms in React.",
          suggestions: "Highlight state-colocation as a primary optimization strategy before resorting to complex hook memoization.",
          structure: "Clean bullet-point description detailing structural memoization, reference optimization, and architecture-level code splitting.",
          correctnessScore: 92
        }
      }
    ],
    scores: {
      technical: 93,
      communication: 88,
      problemSolving: 90,
      confidence: 85,
      structure: 91,
      overall: 89
    },
    feedbackReport: "Sarah demonstrated excellent domain knowledge in browser architectures and modern UI reconciliation cycles. Her communication is highly structured and professional, though a slightly faster pace would display even higher technical comfort. Solid performance."
  },
  {
    id: "sess-02",
    role: InterviewRole.SYSTEM_DESIGN,
    difficulty: InterviewDifficulty.HARD,
    status: "completed",
    createdAt: "2026-06-09T18:15:00Z",
    elapsedSeconds: 1520,
    currentQuestionIndex: 3,
    maxQuestions: 3,
    messages: [
      {
        id: "msg-1",
        sender: "interviewer",
        text: "Let's dive into system design. How would you design a real-time notification system capable of sending millions of push alerts daily with strict sub-second delivery guarantees?",
        timestamp: "2026-06-09T18:15:15Z"
      },
      {
        id: "msg-2",
        sender: "candidate",
        text: "I would use a distributed message queue like Apache Kafka as the backbone to ingest and orchestrate incoming notifications, coupled with specialized background workers querying microservices. I'd use Redis for user channel mappings and active socket registries, and establish multiplexed keep-alive channels for APNs and FCM integrations.",
        timestamp: "2026-06-09T18:18:00Z",
        feedback: {
          clarity: "Excellent architecture outlining clean pub/sub mechanics, cached routing configurations, and asynchronous workers.",
          suggestions: "Expand more on retry metrics, dead-letter queues (DLQs), and handling cellular disconnect dropouts.",
          structure: "Fabulous top-down overview tracing ingestion, queuing, persistence, dispatchers, and external client pushes.",
          correctnessScore: 89
        }
      }
    ],
    scores: {
      technical: 88,
      communication: 82,
      problemSolving: 85,
      confidence: 80,
      structure: 84,
      overall: 84
    },
    feedbackReport: "Designed a very reliable asynchronous broker pipeline. Understood queue backpressure and the role of high-throughput buffers like Kafka. Could show deeper confidence by anticipating edge failures (such as standard token invalidations, payload limits, and service outages) on her own."
  }
];

const DEFAULT_RESUMES: ResumeAnalysis[] = [
  {
    id: "res-01",
    fileName: "sarah_jenkins_lead_frontend.pdf",
    uploadedAt: "2026-06-01T10:00:00Z",
    atsScore: 88,
    experienceLevel: "Senior",
    skills: [
      { name: "TypeScript", category: "Technical", relevance: 98 },
      { name: "Tailwind CSS", category: "Technical", relevance: 95 },
      { name: "System Design", category: "Technical", relevance: 85 },
      { name: "CI/CD Pipeline", category: "Domain Expertise", relevance: 80 },
      { name: "React / Next.js", category: "Technical", relevance: 99 },
      { name: "Team Coaching", category: "Soft Skill", relevance: 75 }
    ],
    strengths: [
      "Substantial TypeScript enterprise expertise with Next.js",
      "Proven architecture ownership and API contracts coordination",
      "Stately layout alignment, performance audits, and modern responsive design mechanics"
    ],
    weaknesses: [
      "Relatively scarce native cloud (AWS/GCP/Kubernetes) scaling details",
      "Under-documented machine learning inference or serverless optimizations"
    ],
    suggestedQuestions: [
      "How would you migrate a legacy Webpack/CRA SPA to Next.js App Router without downtime?",
      "Can you describe your ideal modular design system structure for a scaling engineering org?"
    ],
    atsChecklist: [
      { rule: "Modern Contact Details & Layout", passed: true, feedback: "Professional header with GitHub, LinkedIn, and clean typography." },
      { rule: "Impact Metrics & Action Verbs", passed: true, feedback: "Excellent use of quantitative outcomes (e.g., 'reduced render overhead by 42%')." },
      { rule: "Technical Keyword Density Score", passed: true, feedback: "High alignment with contemporary corporate frontend job charts." },
      { rule: "No Complex Double-Column Parsing Errors", passed: true, feedback: "Optimally structural for automated scanner parsers." },
      { rule: "Cloud Backend Infrastructure Keywords", passed: false, feedback: "Missing keywords: AWS Lambda, Docker, PostgreSQL, Serverless orchestration." }
    ]
  }
];

const DEFAULT_PROGRESS: SkillProgressPoint[] = [
  { date: "May 20", technical: 70, communication: 75, problemSolving: 72, confidence: 68, structure: 70 },
  { date: "May 27", technical: 75, communication: 78, problemSolving: 74, confidence: 72, structure: 74 },
  { date: "June 03", technical: 82, communication: 81, problemSolving: 79, confidence: 77, structure: 80 },
  { date: "June 10", technical: 89, communication: 86, problemSolving: 85, confidence: 82, structure: 86 }
];

const DEFAULT_ADMIN: AdminStats = {
  totalUsers: 1482,
  activeInterviewsCount: 37,
  monthlyRevenueUSD: 18450,
  totalGeminiTokensUsed: 12450800
};

// Local storage access functions with safe default fallback and automatic preservation
export const storage = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error("Storage load failed, restoring profile standard config", e);
    }
    this.saveProfile(DEFAULT_PROFILE);
    return DEFAULT_PROFILE;
  },

  saveProfile(profile: UserProfile) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  },

  getSessions(): InterviewSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveSessions(DEFAULT_SESSIONS);
    return DEFAULT_SESSIONS;
  },

  saveSessions(sessions: InterviewSession[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error(e);
    }
  },

  getResumes(): ResumeAnalysis[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RESUMES);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveResumes(DEFAULT_RESUMES);
    return DEFAULT_RESUMES;
  },

  saveResumes(resumes: ResumeAnalysis[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify(resumes));
    } catch (e) {
      console.error(e);
    }
  },

  getProgress(): SkillProgressPoint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveProgress(DEFAULT_PROGRESS);
    return DEFAULT_PROGRESS;
  },

  saveProgress(points: SkillProgressPoint[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(points));
    } catch (e) {
      console.error(e);
    }
  },

  getAdminStats(): AdminStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    this.saveAdminStats(DEFAULT_ADMIN);
    return DEFAULT_ADMIN;
  },

  saveAdminStats(stats: AdminStats) {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  },

  addSession(session: InterviewSession) {
    const list = this.getSessions();
    list.unshift(session);
    this.saveSessions(list);
    
    // Increment admin telemetry mock data
    const admin = this.getAdminStats();
    admin.totalGeminiTokensUsed += 45000;
    this.saveAdminStats(admin);

    // Append to progression points if completed
    if (session.status === "completed" && session.scores) {
      const prog = this.getProgress();
      const lastPoint = prog[prog.length - 1];
      const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" });
      const newPoint: SkillProgressPoint = {
        date: today,
        technical: Math.round((lastPoint.technical + session.scores.technical) / 2),
        communication: Math.round((lastPoint.communication + session.scores.communication) / 2),
        problemSolving: Math.round((lastPoint.problemSolving + session.scores.problemSolving) / 2),
        confidence: Math.round((lastPoint.confidence + session.scores.confidence) / 2),
        structure: Math.round((lastPoint.structure + session.scores.structure) / 2)
      };
      prog.push(newPoint);
      this.saveProgress(prog);
    }
  },

  addResume(resume: ResumeAnalysis) {
    const list = this.getResumes();
    list.unshift(resume);
    this.saveResumes(list);

    // Update tokens metrics
    const admin = this.getAdminStats();
    admin.totalGeminiTokensUsed += 60000;
    this.saveAdminStats(admin);
  }
};
