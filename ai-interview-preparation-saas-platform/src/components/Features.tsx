/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Cpu, 
  Workflow, 
  CloudLightning, 
  Activity, 
  Database, 
  Lock, 
  CheckCheck,
  Award
} from "lucide-react";

export default function Features() {
  return (
    <div className="min-h-screen bg-slate-950 py-16 text-white px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Platform Specifications</span>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Platform Capabilities Matrix</h2>
          <p className="mt-4 text-slate-400 text-sm max-w-2xl mx-auto">
            Compare standard, pro, and enterprise capabilities available within our offline-first local sandbox and live cloud environments.
          </p>
        </div>

        {/* Dynamic Comparison Matrix Card Grid */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Requirement / Metric</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-indigo-400">SaaS v2 Standards</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-emerald-400">Cloud Sync Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {[
                { label: "Adaptive Difficulty Engine", dev: "Adjusts easily Easy → Expert", prod: "Real-time query analysis" },
                { label: "ATS Bullet parsing & check list", dev: "Extracts TS, CSS, Frameworks", prod: "Dynamic scoring algorithm" },
                { label: "Vocal Mic and Speaker audio loops", dev: "Simulated PCM speech waveforms", prod: "High fidelity TTS Audio outputs" },
                { label: "Offline Cache and Local backup", dev: "Auto-saves to browser storage", prod: "Instant restoration triggers" },
                { label: "Confidence & Emotion Overlay Metrics", dev: "Visual indicators state maps", prod: "Pacing guidance and checks" },
                { label: "System Telemetry and Token Count", dev: "Internal token gauges on Admin", prod: "Real-time Stripe gateway charts" },
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/20">
                  <td className="p-4 font-semibold text-slate-300">{row.label}</td>
                  <td className="p-4 text-slate-400">{row.dev}</td>
                  <td className="p-4 text-slate-400 flex items-center gap-1">
                    <CheckCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{row.prod}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Visual Call Check */}
        <div className="mt-12 p-8 rounded-2xl border border-slate-800 bg-slate-950 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>Full compliance verified</span>
            </h3>
            <p className="mt-2 text-xs text-slate-400 max-w-xl">
              Equipped with deep structural code analysis blocks, client-side session fallbacks, responsive typography pairings, and modern modular layouts.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-400 text-xs font-semibold">v2.4.0 Production</span>
          </div>
        </div>

      </div>
    </div>
  );
}
