/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { storage } from "./lib/storage";
import { 
  UserProfile, 
  InterviewSession, 
  ResumeAnalysis, 
  AdminStats, 
  SkillProgressPoint 
} from "./types";
import Navigation, { ViewTab } from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import Dashboard from "./components/Dashboard";
import Features from "./components/Features";
import AboutUs from "./components/AboutUs";
import InterviewRoom from "./components/InterviewRoom";
import ResumeAnalyzer from "./components/ResumeAnalyzer";
import ResultsPage from "./components/ResultsPage";
import AdminPanel from "./components/AdminPanel";
import { 
  Coins, 
  X, 
  BrainCircuit, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  CloudLightning,
  Activity,
  Heart,
  Share2
} from "lucide-react";

export default function App() {
  // Navigation View Coordinator
  const [currentTab, setCurrentTab] = useState<ViewTab>("landing");
  const [activeSubview, setActiveSubview] = useState<"none" | "interview" | "resume" | "results">("none");

  // Models Core States
  const [profile, setProfile] = useState<UserProfile>(storage.getProfile());
  const [sessions, setSessions] = useState<InterviewSession[]>(storage.getSessions());
  const [resumes, setResumes] = useState<ResumeAnalysis[]>(storage.getResumes());
  const [progress, setProgress] = useState<SkillProgressPoint[]>(storage.getProgress());
  const [adminStats, setAdminStats] = useState<AdminStats>(storage.getAdminStats());

  // Workspace settings and interactive overlays
  const [selectedSessionForReport, setSelectedSessionForReport] = useState<InterviewSession | null>(null);
  const [preconfiguredQuestions, setPreconfiguredQuestions] = useState<string[]>([]);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralEmail, setReferralEmail] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Internet connectivity simulator key
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline">("online");

  // Keep references to localStorage updated
  const triggerDeductCredit = () => {
    const updated = { 
      ...profile, 
      creditsRemaining: Math.max(0, profile.creditsRemaining - 5) 
    };
    setProfile(updated);
    storage.saveProfile(updated);
  };

  const handleCompleteInterviewSession = (endedSess: InterviewSession) => {
    storage.addSession(endedSess);
    // Reload database states
    setSessions(storage.getSessions());
    setProgress(storage.getProgress());
    setAdminStats(storage.getAdminStats());
    
    // Redirect cleanly to detailed Scorecard results
    setSelectedSessionForReport(endedSess);
    setActiveSubview("results");
  };

  const handleAddResumeAnalysis = (newResume: ResumeAnalysis) => {
    storage.addResume(newResume);
    // Reload database
    setResumes(storage.getResumes());
    setAdminStats(storage.getAdminStats());
  };

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referralEmail.trim()) return;

    // Simulate referral reward
    const updated = {
      ...profile,
      creditsRemaining: profile.creditsRemaining + 25
    };
    setProfile(updated);
    storage.saveProfile(updated);
    setShowReferralModal(false);
    setReferralEmail("");
    alert(`Referral invitation sent to ${referralEmail}!\n\nYou've been credited +25 PREP COINS immediately! Go practice dynamic rounds.`);
  };

  const handleTriggerInterviewWithQuestions = (customQs: string[]) => {
    setPreconfiguredQuestions(customQs);
    setActiveSubview("interview");
  };

  // Render Subview router OR standard Landing/Dashboard Page
  const renderCoreContents = () => {
    
    // If has subview selected (e.g. active interview room or results report scorecard)
    if (activeSubview === "interview") {
      return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => {
                setActiveSubview("none");
                setPreconfiguredQuestions([]);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5"
            >
              <span>← Exit Preparation Room</span>
            </button>
          </div>
          <InterviewRoom
            onAddSession={storage.addSession.bind(storage)}
            networkStatus={networkStatus}
            profileCredits={profile.creditsRemaining}
            onDeductCredit={triggerDeductCredit}
            preconfiguredQuestions={preconfiguredQuestions}
            onCompleteSession={handleCompleteInterviewSession}
          />
        </div>
      );
    }

    if (activeSubview === "results" && selectedSessionForReport) {
      return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <button
              onClick={() => {
                setActiveSubview("none");
                setSelectedSessionForReport(null);
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5"
            >
              <span>← Return to history dashboard</span>
            </button>
          </div>
          <ResultsPage
            session={selectedSessionForReport}
            onSelectAnother={() => {
              setActiveSubview("none");
              setSelectedSessionForReport(null);
            }}
          />
        </div>
      );
    }

    if (activeSubview === "resume") {
      return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 font-semibold">
            <button
              onClick={() => setActiveSubview("none")}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1.5"
            >
              <span>← Return to dashboard home</span>
            </button>
          </div>
          <ResumeAnalyzer
            resumes={resumes}
            onAddResume={handleAddResumeAnalysis}
            networkStatus={networkStatus}
            onTriggerInterviewWithQuestions={handleTriggerInterviewWithQuestions}
          />
        </div>
      );
    }

    // Default primary tabs
    switch (currentTab) {
      case "landing":
        return (
          <LandingPage
            onEnterDashboard={() => setCurrentTab("dashboard")}
            profile={profile}
            setProfile={setProfile}
            networkStatus={networkStatus}
          />
        );
      case "dashboard":
        return (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
            
            {showAdminPanel && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded-2xl border border-slate-9ml">
                  <span className="text-xs text-slate-400">Exit SaaS administration panel view</span>
                  <button onClick={() => setShowAdminPanel(false)} className="text-[10px] text-red-400 hover:underline">Dismiss panel</button>
                </div>
                <AdminPanel stats={adminStats} onUpdateStats={(s) => { setAdminStats(s); storage.saveAdminStats(s); }} />
              </div>
            )}

            <Dashboard
              profile={profile}
              sessions={sessions}
              resumes={resumes}
              progress={progress}
              onSelectSession={(sess) => {
                setSelectedSessionForReport(sess);
                setActiveSubview("results");
              }}
              onEnterNewInterview={() => {
                setPreconfiguredQuestions([]);
                setActiveSubview("interview");
              }}
              onEnterNewResume={() => setActiveSubview("resume")}
              onOpenReferral={() => setShowReferralModal(true)}
              onOpenAdmin={() => setShowAdminPanel(!showAdminPanel)}
              showAdmin={showAdminPanel}
              setShowAdmin={setShowAdminPanel}
            />
          </div>
        );
      case "features":
        return <Features />;
      case "about":
        return <AboutUs />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-indigo-500 selection:text-white flex flex-col justify-between relative overflow-hidden">
      
      {/* Dynamic Ambient Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10 opacity-30 animate-pulse" style={{ animationDuration: '8s' }} />
      
      {/* Network toggle header & Main Nav */}
      <div>
        <div className="bg-slate-900 px-4 py-1.5 flex justify-between items-center text-[10px] border-b border-slate-950">
          <div className="flex items-center space-x-1 text-slate-400">
            <CloudLightning className="h-3 w-3 text-indigo-400" />
            <span className="font-semibold select-none">Client Resilient Storage: ON</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setNetworkStatus(networkStatus === "online" ? "offline" : "online")}
              className="flex items-center space-x-1 px-2 py-0.5 rounded border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition"
              title="Click to coordinate simulated online/offline state"
            >
              {networkStatus === "online" ? (
                <span className="flex items-center text-emerald-400">
                  <Wifi className="h-3 w-3 mr-1 animate-pulse" />
                  Toggle Offline Sandbox (Simulation)
                </span>
              ) : (
                <span className="flex items-center text-amber-500">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Toggle Online Live API Mode
                </span>
              )}
            </button>
          </div>
        </div>

        <Navigation
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setCurrentTab(tab);
            setActiveSubview("none");
          }}
          profile={profile}
          setProfile={setProfile}
          onOpenReferral={() => setShowReferralModal(true)}
          networkStatus={networkStatus}
        />

        <main className="flex-1 bg-slate-950">
          {renderCoreContents()}
        </main>
      </div>

      {/* Referral credits modal popup */}
      {showReferralModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-800/80 bg-slate-900 p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-slate-800">
              Refer Friend
            </div>
            <button
              onClick={() => setShowReferralModal(false)}
              className="absolute top-4 left-4 text-slate-500 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center space-y-4 mt-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Coins className="h-6 w-6 text-amber-400 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Earn Free Preparation Coins</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Invite your friends to prepare with Interprestige. When they register, both of you unlock <strong className="text-indigo-400">+25 mock interview credits</strong> absolutely free.
                </p>
              </div>

              <form onSubmit={handleReferralSubmit} className="space-y-3 pt-3">
                <input
                  type="email"
                  placeholder="friend-candidate@gmail.com"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                />
                
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2.5 text-xs font-bold"
                >
                  Send Invite & Credit +25 Cr
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Global Mini Footer */}
      <footer className="bg-slate-950/40 border-t border-slate-900 text-neutral-500 py-6 text-center text-xs">
        <p>&copy; 2026 Interprestige AI Platform. Strictly offline local persistence enabled.</p>
      </footer>

    </div>
  );
}
