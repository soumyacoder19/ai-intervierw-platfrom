/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, 
  Upload, 
  FileText, 
  TrendingUp, 
  Clock, 
  Compass, 
  Play, 
  ChevronRight, 
  Award,
  BookOpen,
  PieChart,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Percent,
  Sparkles,
  AwardIcon,
  ChevronLeft
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid
} from "recharts";
import { InterviewSession, ResumeAnalysis, UserProfile, SkillProgressPoint } from "../types";

interface DashboardProps {
  profile: UserProfile;
  sessions: InterviewSession[];
  resumes: ResumeAnalysis[];
  progress: SkillProgressPoint[];
  onSelectSession: (sess: InterviewSession) => void;
  onEnterNewInterview: () => void;
  onEnterNewResume: () => void;
  onOpenReferral: () => void;
  onOpenAdmin: () => void;
  showAdmin: boolean;
  setShowAdmin: (v: boolean) => void;
}

export default function Dashboard({
  profile,
  sessions,
  resumes,
  progress,
  onSelectSession,
  onEnterNewInterview,
  onEnterNewResume,
  onOpenReferral,
  onOpenAdmin,
  showAdmin,
  setShowAdmin
}: DashboardProps) {
  
  // Quick overview stats values
  const completedCount = sessions.filter(s => s.status === "completed").length;
  
  const averageCorrectness = completedCount > 0
    ? Math.round(
        sessions
          .filter(s => s.status === "completed" && s.scores)
          .reduce((acc, current) => acc + (current.scores?.overall || 80), 0) / completedCount
      )
    : 84;

  // Format Recharts data model for radar
  const latestProgressPoint = progress[progress.length - 1] || {
    technical: 85,
    communication: 80,
    problemSolving: 82,
    confidence: 81,
    structure: 80
  };

  const radarData = [
    { subject: "Technical Code", value: latestProgressPoint.technical, fullMark: 100 },
    { subject: "STAR Structure", value: latestProgressPoint.structure, fullMark: 100 },
    { subject: "Vocal Confidence", value: latestProgressPoint.confidence, fullMark: 100 },
    { subject: "Problem Solving", value: latestProgressPoint.problemSolving, fullMark: 100 },
    { subject: "Communication", value: latestProgressPoint.communication, fullMark: 100 }
  ];

  return (
    <div className="space-y-6" id="dashboard-container">
      
      {/* Prime Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-bento-grid">
        
        {/* Bento Cell 1: Principal Welcome & Call-to-Action (col-span-8) */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 p-6 md:p-8 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
          {/* Lights */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
          <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-pink-500/5 blur-3xl -z-10" />

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                {profile.plan} Premium Member
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight sm:text-4xl bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
              Welcome back, {profile.name}!
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Accelerate your preparation using live enterprise models. Upload your resume for automated ATS keyword sync or step into the adaptive, voice-simulated Mock Room to enhance your performance metrics immediately.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={onEnterNewResume}
              className="flex items-center space-x-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-xs font-bold px-5 py-3 rounded-xl text-slate-300 hover:text-white transition-all transform hover:-translate-y-0.5"
            >
              <Upload className="h-4 w-4 text-indigo-400 shrink-0" />
              <span>Upload Resume</span>
            </button>

            <button
              onClick={onEnterNewInterview}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold px-6 py-3  rounded-xl text-white transition-all transform hover:-translate-y-0.5 shadow-lg shadow-indigo-600/20"
            >
              <Play className="h-4 w-4 shrink-0 animate-ping text-indigo-200" style={{ animationDuration: '3s' }} />
              <span>Start Practice Room</span>
            </button>
          </div>
        </div>

        {/* Bento Cell 2: Competency Radar Matrix Blueprint (col-span-4) */}
        <div className="lg:col-span-4 bg-slate-900/30 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between min-h-[320px]">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Dimension Scores</span>
            <h3 className="text-sm font-bold text-white mt-1">Competency Radar</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Real-time dynamic coverage ratings by STAR criteria vectors.</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center my-2 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748b", fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#334155" }} />
                <Radar 
                  name="Sarah" 
                  dataKey="value" 
                  stroke="#6366f1" 
                  fill="#6366f1" 
                  fillOpacity={0.25} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <span className="text-[9px] text-slate-500 leading-normal text-center italic mt-1 block">
            STAR structural vectors represent target tech baseline passing ranks.
          </span>
        </div>

        {/* Bento Cell 3: Metrics Highlight (col-span-12) */}
        <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl hover:border-slate-700 transition duration-300">
            <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Historical Rounds</h5>
            <div className="flex items-baseline space-x-1.5 mt-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">{completedCount}</span>
              <span className="text-xs text-slate-400">sessions</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Recommended baseline: 10 rounds</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl hover:border-slate-700 transition duration-300">
            <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Average Correctness</h5>
            <div className="flex items-baseline space-x-1.5 mt-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">{averageCorrectness}%</span>
              <span className="text-xs text-indigo-400 font-bold">Accuracy</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">SaaS passing requirements: 85%+</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl hover:border-slate-700 transition duration-300">
            <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Resumes Audited</h5>
            <div className="flex items-baseline space-x-1.5 mt-1.5">
              <span className="text-3xl font-extrabold text-white tracking-tight">{resumes.length}</span>
              <span className="text-xs text-slate-400">stored</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">Continuous keyword alignment active</p>
          </div>

          <div className="bg-slate-900/30 border border-slate-850 p-4 rounded-2xl hover:border-slate-700 transition duration-300">
            <h5 className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Preparation Balance</h5>
            <div className="flex items-baseline space-x-1.5 mt-1.5">
              <span className="text-3xl font-extrabold text-indigo-400 tracking-tight">{profile.creditsRemaining}</span>
              <span className="text-xs text-slate-400">credits</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] text-slate-500">Upgrade options ready</span>
              <button 
                onClick={onOpenReferral}
                className="text-[9px] text-indigo-400 hover:underline cursor-pointer font-bold"
              >
                Earn +25 free
              </button>
            </div>
          </div>

        </div>

        {/* Bento Cell 4: Historical Sessions and Timeline Logs (col-span-5) */}
        <div className="lg:col-span-5 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">History Matrix</span>
              <button
                onClick={onOpenAdmin}
                className="text-[9px] uppercase tracking-wider font-bold text-slate-500 hover:text-indigo-400 border border-slate-805 bg-slate-950 px-2.5 py-1 rounded-xl transition"
              >
                {showAdmin ? "Close Logs" : "Telemetry"}
              </button>
            </div>
            <h3 className="text-sm font-bold text-white">Scored Mock Timeline</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Click any score report below to analyze full STAR recommendations.</p>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[300px] pr-1 space-y-2.5 custom-scrollbar">
            {sessions.length > 0 ? (
              sessions.map((sess) => (
                <div 
                  key={sess.id}
                  onClick={() => onSelectSession(sess)}
                  className="p-3 flex items-center justify-between gap-3 bg-slate-950/40 border border-slate-850 hover:border-slate-700 rounded-2xl cursor-pointer transition-all hover:bg-slate-900/40"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="h-8 w-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                      <MessageCircle className="h-4.5 w-4.5 text-indigo-400" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11px] font-bold text-slate-200 truncate">{sess.customRoleName || sess.role}</h4>
                      <p className="text-[9px] text-slate-500 flex items-center space-x-1.5 truncate">
                        <span>{new Date(sess.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{Math.floor(sess.elapsedSeconds / 60)}m</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="hidden sm:inline-block text-[8px] uppercase font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                      {sess.difficulty}
                    </span>
                    {sess.scores ? (
                      <span className="text-[11px] font-bold text-emerald-400">
                        {sess.scores.overall}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-yellow-400 font-semibold animate-pulse">Live</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl h-full flex flex-col items-center justify-center">
                <p className="text-[11px] text-slate-550 leading-relaxed max-w-[200px] text-center">
                  Conduct your initial mock interview to populate timeline charts.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bento Cell 5: Progression Area Trend Chart (col-span-7) */}
        <div className="lg:col-span-7 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Growth Analytics</span>
            <h3 className="text-sm font-bold text-white mt-1">Weekly Progression Trend</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Visual trend over historic preparation attempts.</p>
          </div>

          <div className="h-56 w-full mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progress} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 9 }} />
                <YAxis domain={[50, 100]} tick={{ fill: "#64748b", fontSize: 9 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", fontSize: 11 }}
                  labelStyle={{ color: "#94a3b8" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="technical" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorTech)" 
                  name="Technical Core" 
                />
                <Area 
                  type="monotone" 
                  dataKey="communication" 
                  stroke="#10b981" 
                  fillOpacity={0} 
                  name="STAR Flow" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-[9px] text-slate-500 flex justify-between items-center">
            <span>Synchronized: Continuous</span>
            <span className="text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">Steady growth trend active</span>
          </div>
        </div>

      </div>

    </div>
  );
}
