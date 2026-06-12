/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Award, Code, Globe, HelpCircle, Heart, Compass } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-950 py-16 text-white px-4 sm:px-6 lg:px-8" id="about-us-container">
      <div className="mx-auto max-w-4xl">
        
        <div className="text-center">
          <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">Our Vision & Mission</span>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Democratizing Executive AI Coaching</h2>
          <p className="mt-4 text-slate-400 text-sm max-w-2xl mx-auto">
            We are a group of engineers, designers, and hiring managers from Google, OpenAI, and Netflix passionate about helping candidates present their best selves.
          </p>
        </div>

        {/* Story Section */}
        <div className="mt-12 space-y-8 text-sm text-slate-300 leading-relaxed">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Compass className="h-5 w-5 text-indigo-400" />
              <span>Why We Built Interprestige</span>
            </h3>
            <p>
              Traditional interview prep services are highly expensive, often costing hundreds of dollars per hour for personalized mentor feedback. This creates a privilege gap where only candidates with deep pockets can access mock coaching.
            </p>
            <p className="mt-3">
              We engineered Interprestige to bridge this gap. By utilizing advanced LLM reasoning capabilities with real-time text-to-speech simulations and interactive ATS evaluation guidelines, anyone can refine their communication structure, build confidence, and land their dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20">
              <h4 className="text-sm font-extrabold text-indigo-300 mb-2 flex items-center gap-1.5">
                <Code className="h-4.5 w-4.5" />
                <span>Our Stack & Dev Standards</span>
              </h4>
              <p className="text-xs text-slate-400">
                Crafted using contemporary React 19, TypeScript typed signatures, and tailored Tailwind styling matrices. Backed by responsive client storage caches for resilient offline capability.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/20">
              <h4 className="text-sm font-extrabold text-emerald-400 mb-2 flex items-center gap-1.5">
                <Globe className="h-4.5 w-4.5" />
                <span>Green Hosting & Resilient Cloud</span>
              </h4>
              <p className="text-xs text-slate-400">
                Deployed globally using low-latency Google Cloud containers in Singapore and US hubs, scaling to zero to minimize static computing footprints and server waste.
              </p>
            </div>
          </div>
        </div>

        {/* Future roadmap card */}
        <div className="mt-12 border border-slate-800 rounded-3xl bg-slate-950 p-8">
          <h3 className="text-lg font-bold text-white mb-3">Future Roadmap (v2 & beyond)</h3>
          <ul className="space-y-4 text-xs text-slate-400">
            <li className="flex items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-indigo-400 border border-slate-800 mr-2.5 mt-0.5">1</span>
              <div>
                <strong className="text-slate-300">Advanced Emotion Web Camera Analysis</strong>
                <p className="mt-0.5">Fully client-side browser TensorFlow integration to measure visual stress indicators, stuttering intervals, and facial comfort levels in-flight.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-indigo-400 border border-slate-800 mr-2.5 mt-0.5">2</span>
              <div>
                <strong className="text-slate-300">Relational Cloud SQL Sync Engine</strong>
                <p className="mt-0.5">Multi-device real-time backup pipelines enabling synchronized progress records across mobile, desktop, and tablet platforms.</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-indigo-400 border border-slate-800 mr-2.5 mt-0.5">3</span>
              <div>
                <strong className="text-slate-300">Live Peer-to-Peer Mock Guilds</strong>
                <p className="mt-0.5">Join collaborative breakout streams to practice with other candidates anonymously and cross-score responses using customized STAR evaluations.</p>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
