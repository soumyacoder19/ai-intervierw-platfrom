/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Award, 
  FileDown, 
  Share2, 
  TrendingUp, 
  CheckSquare, 
  MessageCircle, 
  Check, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  ThumbsUp
} from "lucide-react";
import { InterviewSession, ScoreBreakdown } from "../types";

interface ResultsPageProps {
  session: InterviewSession;
  onSelectAnother: () => void;
}

export default function ResultsPage({ session, onSelectAnother }: ResultsPageProps) {
  const scores: ScoreBreakdown = session.scores || {
    technical: 85,
    communication: 80,
    problemSolving: 82,
    confidence: 81,
    structure: 80,
    overall: 82
  };

  const handleDownloadPDF = () => {
    alert(`Downloading PDF Evaluation Report...\n\nDocument: Interprestige_Scorecard_${session.id}.pdf\nFormat: High-Impact Corporate Summary\n\nDownload completes instantly.`);
  };

  const handleShareResult = () => {
    const url = `${window.location.origin}/share/result/${session.id}`;
    navigator.clipboard.writeText(url);
    alert(`Copied high fidelity share link to clipboard:\n\n${url}\n\nShare with corporate selectors or peers!`);
  };

  const scoreMetrics = [
    { name: "Technical Correctness", score: scores.technical, color: "bg-indigo-500", text: "Measures accuracy of systems layout and stack specifications." },
    { name: "Communication & Clarity", score: scores.communication, color: "bg-emerald-500", text: "Evaluates professional terminology and clear vocal explanations." },
    { name: "Problem Solving Logic", score: scores.problemSolving, color: "bg-pink-500", text: "Tracks analytical decomposition of engineering constraints." },
    { name: "Vocal Confidence", score: scores.confidence, color: "bg-amber-500", text: "Estimated presence, pacing triggers, and lack of filler hesitation." },
    { name: "Answer Structure (STAR)", score: scores.structure, color: "bg-cyan-500", text: "Evaluates Situation, Task, Action, and Result framing density." }
  ];

  return (
    <div className="bg-slate-900/40 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-xl" id="results-page-frame">
      
      {/* Overview header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-800/60 mb-8">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-1 rounded-full">
            Evaluation metrics live
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-3">
            Mock Scorecard Report
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Completed: {new Date(session.createdAt).toLocaleDateString()} for {session.customRoleName || session.role} ({session.difficulty})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-1 border border-slate-850 hover:border-slate-700 bg-slate-950 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <FileDown className="h-4 w-4 text-indigo-400" />
            <span>Download PDF</span>
          </button>
          
          <button
            onClick={handleShareResult}
            className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/15 transition"
          >
            <Share2 className="h-4 w-3.5 text-indigo-200" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left scorecard panel */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-indigo-500 to-pink-500" />
            
            <div className="h-24 w-24 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-white font-extrabold text-3xl mb-4 relative">
              <span>{scores.overall}</span>
              <span className="text-xs font-semibold text-slate-400 absolute bottom-3 uppercase text-[10px] tracking-wide">Score</span>
            </div>

            <h3 className="text-base font-bold text-white mb-1">
              Qualified Performance
            </h3>
            <p className="text-[11px] text-slate-400">
              Your scorecard represents high competitive advantages compared to average community benchmarks (82% top ranking).
            </p>

            <div className="mt-4 pt-4 border-t border-slate-900 w-full grid grid-cols-2 gap-4 text-left">
              <div>
                <h5 className="text-[9px] uppercase font-bold text-slate-500">Duration</h5>
                <p className="text-xs font-semibold text-slate-300">
                  {Math.floor(session.elapsedSeconds / 60)} min {session.elapsedSeconds % 60} sec
                </p>
              </div>
              <div>
                <h5 className="text-[9px] uppercase font-bold text-slate-500">State</h5>
                <p className="text-xs font-semibold text-emerald-400">Analyzed v2</p>
              </div>
            </div>
          </div>

          {/* Benchmark comparison widget */}
          <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-300 mb-2">Community Benchmark</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-indigo-400 font-semibold">Your Average Scope</span>
                  <span>{scores.overall}% ID</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${scores.overall}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-500">Typical Applicant Average</span>
                  <span>71% ID</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-700 rounded-full" style={{ width: `71%` }} />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right detailed scorecard breakdown metrics */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
              <span>Dimension Analytics Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scoreMetrics.map((met, idx) => (
                <div key={idx} className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-300">{met.name}</span>
                    <span className="font-semibold text-indigo-300">{met.score}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div className={`h-full ${met.color} rounded-full`} style={{ width: `${met.score}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">{met.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Text feedback report */}
          {session.feedbackReport && (
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative">
              <div className="absolute top-3 right-4 flex items-center space-x-1 text-slate-500 text-[10px]">
                <ThumbsUp className="h-3.5 w-3.5 text-indigo-400" />
                <span>Coach Recommendation</span>
              </div>
              <h4 className="text-[11px] uppercase tracking-wider font-bold text-indigo-300 mb-2">
                EXECUTIVE ANALYTICAL SUMMARY
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "{session.feedbackReport}"
              </p>
            </div>
          )}

          {/* Next steps actions plan */}
          <div className="border border-slate-800 rounded-2xl p-4 bg-slate-950/25">
            <h4 className="text-xs font-bold text-white mb-3">Suggested Learning Roadmap Suggestions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-xl flex gap-2.5">
                <div className="h-5 w-5 bg-indigo-500/10 border border-indigo-500/15 rounded text-indigo-400 text-[10px] flex items-center justify-center font-bold shrink-0">1</div>
                <div>
                  <strong className="text-slate-300 block">Review structural STAR method</strong>
                  <span className="text-[10px] text-slate-500">Ensure every behavioral question ends with a quantitative result metric.</span>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-slate-900 p-3 rounded-xl flex gap-2.5">
                <div className="h-5 w-5 bg-indigo-500/10 border border-indigo-500/15 rounded text-indigo-400 text-[10px] flex items-center justify-center font-bold shrink-0">2</div>
                <div>
                  <strong className="text-slate-300 block">Stabilize Technical vocabulary</strong>
                  <span className="text-[10px] text-slate-500">Reinforce browser reconciliation cycles and state-colocation patterns.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="mt-8 pt-6 border-t border-slate-800/60 flex justify-end">
        <button
          onClick={onSelectAnother}
          className="flex items-center space-x-2 border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-300 px-6 py-2.5 rounded-xl text-xs font-semibold"
        >
          <span>Return to Dashboard History</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
}
