/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart3, 
  Users, 
  DollarSign, 
  Cpu, 
  FileCode, 
  Activity, 
  TrendingUp, 
  AlertCircle,
  Clock,
  Terminal
} from "lucide-react";
import { AdminStats } from "../types";

interface AdminPanelProps {
  stats: AdminStats;
  onUpdateStats: (s: AdminStats) => void;
}

export default function AdminPanel({ stats, onUpdateStats }: AdminPanelProps) {
  const [couponCount, setCouponCount] = useState(24);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("POST /api/gemini/interview");

  const handleClearLogs = () => {
    alert("Clearing system console telemetry buffers...\n\nAll session logs compressed and rotated.");
  };

  const handleSimulateNewRegistration = () => {
    // Increment telemetry counters
    onUpdateStats({
      ...stats,
      totalUsers: stats.totalUsers + 1,
      monthlyRevenueUSD: stats.monthlyRevenueUSD + 29
    });
  };

  const activeEndpoints = [
    { method: "POST", path: "/api/gemini/interview", desc: "Generates tailored progressive questions", duration: "120ms", hits: "4.5k" },
    { method: "POST", path: "/api/gemini/resume", desc: "Extracts TS stack skills and computes ATS scores", duration: "840ms", hits: "1.2k" },
    { method: "GET", path: "/api/health", desc: "Server container health status check", duration: "15ms", hits: "24.5k" },
    { method: "POST", path: "/api/gemini/generate", desc: "One-shot AI executive coaching endpoint", duration: "180ms", hits: "3.1k" },
  ];

  return (
    <div className="bg-slate-900/30 rounded-3xl border border-slate-800 p-6 shadow-xl" id="admin-panel-box">
      
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-800/60">
        <div>
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Cpu className="h-5 w-5 text-indigo-400" />
            <span>Telemetry Admin dashboard</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track metrics, active Stripe monthly MRR allocations, and Gemini LLM token allotments in-flight.
          </p>
        </div>
        
        <div>
          <button
            onClick={handleSimulateNewRegistration}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-1.5 px-3.5 text-xs font-bold shadow-lg shadow-indigo-600/10 transition"
          >
            Simulate mock $29 payment transaction
          </button>
        </div>
      </div>

      {/* Grid numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-500">Subscribed Users</h4>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-white">{stats.totalUsers}</span>
              <span className="text-[10px] text-emerald-400 font-bold">+12%</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-500">Active Live Rooms</h4>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-white">{stats.activeInterviewsCount}</span>
              <span className="text-[10px] text-indigo-400 font-bold">In-flight</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-500">Stripe SaaS MRR</h4>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-extrabold text-white">${stats.monthlyRevenueUSD.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-bold">USD</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] uppercase font-bold text-slate-500">Gemini Tokens Allotted</h4>
            <p className="text-sm font-bold text-slate-300">
              {(stats.totalGeminiTokensUsed / 1000000).toFixed(2)}M
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* API Endpoint tracker table */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
            <FileCode className="h-4 w-4 text-indigo-400" />
            <span>Active REST & WebSocket Server API Endpoints</span>
          </h3>

          <div className="overflow-hidden rounded-xl border border-slate-855 bg-slate-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-850 bg-slate-900/40 text-slate-400 text-[10px] uppercase font-bold">
                  <th className="p-3">Endpoint Node</th>
                  <th className="p-3">Function Purpose</th>
                  <th className="p-3">Pacing</th>
                  <th className="p-3">Req Hits</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-[11px] text-slate-300">
                {activeEndpoints.map((end, idx) => (
                  <tr 
                    key={idx}
                    onClick={() => setSelectedEndpoint(end.path)}
                    className="hover:bg-slate-900/10 cursor-pointer transition"
                  >
                    <td className="p-3 font-semibold text-indigo-300 font-mono">
                      <span className="font-bold text-[9px] uppercase tracking-wide bg-slate-900 px-1 py-0.5 border border-slate-800 rounded mr-1.5">
                        {end.method}
                      </span>
                      {end.path}
                    </td>
                    <td className="p-3 text-slate-400">{end.desc}</td>
                    <td className="p-3 font-mono text-slate-500">{end.duration}</td>
                    <td className="p-3 font-semibold text-slate-300">{end.hits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live system logs mock viewer */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Terminal className="h-4 w-4 text-pink-400" />
              <span>Diagnostic Systems Console</span>
            </h3>
            <button 
              onClick={handleClearLogs}
              className="text-[9px] uppercase font-bold text-slate-500 hover:text-white"
            >
              Clear Logs
            </button>
          </div>

          <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-850 font-mono text-[10px] text-slate-400 space-y-3 min-h-48">
            <div className="flex justify-between text-indigo-400">
              <span>[SYSTEM LOG] 12:56:30</span>
              <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/25 px-1 rounded uppercase">INFO</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Express router parsed /api/gemini/interview. Status code 200 OK. Returned {selectedEndpoint} schema.
            </p>

            <div className="flex justify-between text-yellow-500 pt-2 border-t border-slate-900">
              <span>[METRIC LOG] 12:53:15</span>
              <span className="text-[8px] bg-yellow-500/10 border border-yellow-500/25 px-1 rounded uppercase font-bold">INFO</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Stripe checkout session initialized successfully for candidate sarah.jenkins@alumni.edu. Added 45 credits.
            </p>

            <div className="flex justify-between text-emerald-400 pt-2 border-t border-slate-900">
              <span>[DATABASE LOG] 12:48:02</span>
              <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/25 px-1 rounded uppercase">SUCCESS</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Active local cache snapshot verified. Synced 2 mock interview histories stably with zero relational lag.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
