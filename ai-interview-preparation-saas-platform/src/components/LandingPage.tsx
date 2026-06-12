/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  CheckCircle2, 
  Play, 
  HelpCircle, 
  ShieldCheck, 
  MessageSquare, 
  FileCheck, 
  Video, 
  Flame, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  BookOpen,
  BrainCircuit
} from "lucide-react";
import { UserProfile } from "../types";

interface LandingPageProps {
  onEnterDashboard: () => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  networkStatus: "online" | "offline";
}

export default function LandingPage({
  onEnterDashboard,
  profile,
  setProfile,
  networkStatus
}: LandingPageProps) {
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive mini AI Coach state
  const [coachPrompt, setCoachPrompt] = useState("");
  const [coachResponse, setCoachResponse] = useState("");
  const [coachLoading, setCoachLoading] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === "CAREER2026") {
      setCouponApplied(true);
      const updated = { ...profile, plan: "Premium" as const, creditsRemaining: profile.creditsRemaining + 30 };
      setProfile(updated);
      localStorage.setItem("ai_prep_profile", JSON.stringify(updated));
    } else {
      alert("Invalid coupon code! Try using 'CAREER2026' for a special discount.");
    }
  };

  const handleSimulateCheckout = (planName: "Pro" | "Premium", basePrice: number) => {
    const finalPrice = couponApplied ? Math.round(basePrice * 0.5) : basePrice;
    
    // Simulate payment transaction
    const confirmation = window.confirm(
      `Confirm subscription purchase:\n\nPlan: ${planName} Plan\nAmount Due: $${finalPrice}/mo\n\nWould you like to authorize this payment via Stripe gateway?`
    );

    if (confirmation) {
      const updated = { 
        ...profile, 
        plan: planName, 
        creditsRemaining: profile.creditsRemaining + (planName === "Premium" ? 100 : 40) 
      };
      setProfile(updated);
      localStorage.setItem("ai_prep_profile", JSON.stringify(updated));
      alert(`Stripe Checkout Successful! You have been upgraded to the ${planName} Plan. Added fresh credits to your stash.`);
    }
  };

  // Quick live interactive mini API demo
  const handleQueryCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachPrompt.trim()) return;

    setCoachLoading(true);
    setCoachResponse("");

    try {
      if (networkStatus === "offline") {
        setTimeout(() => {
          setCoachResponse("Coach (Offline Mode): Great question! To prepare dynamic architecture maps, emphasize API decouplings, redundant data caching strategies, and stateless cluster scalability.");
          setCoachLoading(false);
        }, 1000);
        return;
      }

      const response = await fetch("/api/gemini/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `You are an veteran Elite AI Technical Coach. Provide a short, ultra-polished, 3-sentence action tip answering: "${coachPrompt}". Be professional and encouraging.` 
        }),
      });

      const data = await response.json();
      if (data.text) {
        setCoachResponse(data.text);
      } else {
        setCoachResponse("Our server responded with an empty tip. Please toggle your connection settings and try again.");
      }
    } catch (error) {
      console.error(error);
      setCoachResponse("AI is busy onboarding other candidates. Try asking: 'How should I explain my biggest weakness?' or check server status.");
    } finally {
      setCoachLoading(false);
    }
  };

  const faqItems = [
    {
      q: "How realistic are the AI mock interview evaluations?",
      a: "Extraordinarily realistic. Powered by Google's Gemini models, we evaluate not only your factual response correctness, but also communication structure, explanation structure, clarity, and keyword density. Our behavioral agent is programmed with industry-first STAR methodology reviews."
    },
    {
      q: "Can I practice with speech audio instead of typing?",
      a: "Yes! The platform includes full live microphone recording simulation and text-to-speech feedback (AI spoken dialog audio) so you can train exactly like a real webcam panel or live audio round."
    },
    {
      q: "How does the ATS Resume Analyzer handle scores?",
      a: "Our ATS agent conducts deep structural audits, extracting key skills, identifying experience level indicators, assessing technical keyword densities, and generating tailored custom questions specific to your background."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white" id="landing-page-root">
      
      {/* Hero Banner Grid section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36 lg:pt-40">
        
        {/* Background ambient lighting blobs */}
        <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-[120px]" />
        <div className="absolute top-1/3 right-10 -z-10 h-[300px] w-[300px] rounded-full bg-pink-500/10 blur-[100px]" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-indigo-300 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>Introducing Intelligent Enterprise Interview SaaS Platform V2</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Master the Job Interview.<br/>
            Engineered by <span className="text-indigo-400 bg-indigo-900/20 px-4 py-0.5 rounded-2xl border border-indigo-500/20 inline-block">Advanced AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mt-6 max-w-3xl text-sm sm:text-lg text-slate-400 leading-relaxed"
          >
            Stop guessing what hiring managers want. Get live, real-time mock interviews evaluated by senior expert AI coaches. Analyze resumes for ATS compatibility, receive instant voice simulations, and review deep analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <button
              onClick={onEnterDashboard}
              className="group flex items-center space-x-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Dashboard Prep</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#pricing"
              className="flex items-center space-x-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white transition-all"
            >
              <span>View SaaS Pricing</span>
            </a>
          </motion.div>

        </div>
      </section>

      {/* Interactive Micro Coach Playground Demo */}
      <section className="py-12 bg-slate-900/40 border-y border-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-bl-xl border-l border-b border-slate-800">
              Live AI Sandbox
            </div>
            <h3 className="text-xl font-bold mb-2 flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span>Ask the Executive Coach</span>
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Test drive the intelligence of our platform instantly. Ask our AI career coach any questions related to resume improvements, dynamic salary negotiations, or difficult situational questions.
            </p>

            <form onSubmit={handleQueryCoach} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g., How do I explain a 1-year employment gap gracefully?"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  value={coachPrompt}
                  onChange={(e) => setCoachPrompt(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={coachLoading}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl px-5 text-sm font-medium transition-all"
                >
                  {coachLoading ? "Coaching..." : "Ask AI"}
                </button>
              </div>
            </form>

            {coachResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-slate-900/60 border border-indigo-500/25 text-sm text-slate-300 leading-relaxed"
              >
                <strong>Coach Response:</strong>
                <p className="mt-1 text-xs italic text-indigo-200">{coachResponse}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Feature matrix grid */}
      <section className="py-24" id="features">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Equipped with Complete SaaS Prep Arsenal
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-sm text-slate-400">
              Every specialized tool you need to secure technical credentials and outshine other applicants.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {[
              {
                icon: <MessageSquare className="h-6 w-6 text-indigo-400" />,
                title: "Dynamic AI Conversation",
                desc: "Simulate top tech hiring panels using custom tailored roles (Frontend, Backend, System Architect) with sub-second streamed answers.",
                className: "lg:col-span-8 bg-gradient-to-br from-indigo-950/30 via-slate-900/85 to-slate-950/90 border border-indigo-500/30 p-8 min-h-[250px] relative overflow-hidden flex flex-col justify-between"
              },
              {
                icon: <Video className="h-6 w-6 text-pink-400" />,
                title: "Camera & Mic Sync Mode",
                desc: "Turn on your device camera and microphone to train with realistic non-verbal and spoken audio simulators.",
                className: "lg:col-span-4 bg-slate-900/30 border border-slate-800/80 p-6 flex flex-col justify-between"
              },
              {
                icon: <FileCheck className="h-6 w-6 text-emerald-400" />,
                title: "Smart ATS Resume Auditor",
                desc: "Check your PDF or text resume for core keyword matches, discover weaknesses, and auto-build personal questions.",
                className: "lg:col-span-4 bg-slate-900/30 border border-slate-800/80 p-6 flex flex-col justify-between"
              },
              {
                icon: <Flame className="h-6 w-6 text-rose-500 animate-pulse" />,
                title: "Adaptive Interview Room",
                desc: "Feel the pressure of a live countdown, interactive typing feedback cues, and responsive behavioral questions.",
                className: "lg:col-span-8 bg-gradient-to-br from-purple-950/30 via-slate-900/85 to-slate-950/90 border border-purple-500/30 p-8 min-h-[250px] relative overflow-hidden flex flex-col justify-between"
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
                title: "Interactive Progress Radar",
                desc: "Review skill radars, progress metrics, and detailed communication feedback reports across multiple historical rounds.",
                className: "lg:col-span-6 bg-slate-900/30 border border-slate-800/80 p-6 flex flex-col justify-between"
              },
              {
                icon: <Award className="h-6 w-6 text-cyan-400" />,
                title: "Fidelity Scoring Engine",
                desc: "See a detailed scoring map tracing correctness grammar, STAR structured answers, technical clarity, and user benchmark stats.",
                className: "lg:col-span-6 bg-slate-900/30 border border-slate-800/80 p-6 flex flex-col justify-between"
              }
            ].map((f, i) => (
              <div 
                key={i}
                className={`border rounded-3xl transition duration-350 hover:border-slate-700/80 hover:bg-slate-900/40 relative ${f.className}`}
              >
                {/* Lights for the larger gradient card */}
                {f.className.includes("col-span-8") && (
                  <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl -z-10" />
                )}
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 border border-slate-850">
                    {f.icon}
                  </div>
                  <h4 className="text-lg font-extrabold text-white mb-2">{f.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed max-w-xl">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing / Stripe SaaS checkout subscription models */}
      <section className="py-24 bg-slate-900/25 border-t border-slate-900" id="pricing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Transparent, Value-Optimized Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400">
              Upgrade to Premium today to unlock advanced AI models, vocal simulators, and unlimited mock checklists.
            </p>

            {/* Promo Code entry */}
            <div className="mt-6 max-w-sm mx-auto p-4 rounded-xl bg-slate-950 border border-slate-800">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code / Referral"
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white uppercase"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1 text-xs font-semibold"
                >
                  Apply
                </button>
              </form>
              <p className="mt-1.5 text-[10px] text-slate-500 text-left">
                💡 Tip: Use code <span className="text-indigo-400 font-bold">CAREER2026</span> for high credits booster discount!
              </p>
              {couponApplied && (
                <div className="mt-2 text-xs font-bold text-emerald-400">
                  ✓ Code APPLIED successfully! 50% discount and +30 credits unlocked.
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            
            {/* Free */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-slate-400">Standard Starter</h4>
                <p className="mt-2 text-slate-500 text-xs">For casual interview brush-ups.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold">$0</span>
                  <span className="ml-1 text-slate-500 text-xs">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-400">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> 2 basic chat mock rounds</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> ATS Resume audit score</li>
                  <li className="flex items-center text-slate-600"><CheckCircle2 className="h-4 w-4 text-slate-700 mr-2" /> Speech to text & TTS audio</li>
                  <li className="flex items-center text-slate-600"><CheckCircle2 className="h-4 w-4 text-slate-700 mr-2" /> Real-time active feedback panel</li>
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => handleSimulateCheckout("Free" as any, 0)}
                  disabled={profile.plan === "Free"}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-2.5 text-xs font-semibold text-slate-300 disabled:opacity-50"
                >
                  {profile.plan === "Free" ? "Currently Active" : "Downgrade to Free"}
                </button>
              </div>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-indigo-500 bg-slate-950 p-8 flex flex-col justify-between relative shadow-lg shadow-indigo-500/10">
              <div className="absolute top-0 right-4 -translate-y-1/2 bg-indigo-500 text-white text-[10px] uppercase font-bold px-3 py-0.5 rounded-full">
                Popular Match
              </div>
              <div>
                <h4 className="text-lg font-bold text-indigo-300">Executive Pro</h4>
                <p className="mt-2 text-slate-500 text-xs">For active job seekers looking for speed.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold">{couponApplied ? "$14" : "$29"}</span>
                  <span className="ml-1 text-slate-500 text-xs">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-400">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> 25 detailed interview credits</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> Advanced resume extracted questions</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> Real-time feedback & metric charts</li>
                  <li className="flex items-center text-slate-600"><CheckCircle2 className="h-4 w-4 text-slate-700 mr-2" /> Premium speech voice mode</li>
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => handleSimulateCheckout("Pro", 29)}
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition-all shadow-md shadow-indigo-600/10"
                >
                  {profile.plan === "Pro" ? "Currently Active Plan" : "Upgrade to Pro"}
                </button>
              </div>
            </div>

            {/* Premium */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-8 flex flex-col justify-between">
              <div>
                <h4 className="text-lg font-bold text-pink-400">Elite Premium</h4>
                <p className="mt-2 text-slate-500 text-xs">For maximum competitive advantages.</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold">{couponApplied ? "$39" : "$79"}</span>
                  <span className="ml-1 text-slate-500 text-xs">/ month</span>
                </div>
                <ul className="mt-6 space-y-3 text-xs text-slate-400">
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> 100 premium interview credits</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> Unlimited resume ATS analyses</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> Full Speech mode & webcam frame</li>
                  <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-indigo-400 mr-2" /> Direct PDF metrics download</li>
                </ul>
              </div>
              <div className="mt-8">
                <button
                  onClick={() => handleSimulateCheckout("Premium", 79)}
                  className="w-full rounded-xl border border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 py-2.5 text-xs font-semibold text-pink-300 transition"
                >
                  {profile.plan === "Premium" ? "Currently Active Plan" : "Get Elite Premium"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqItems.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex justify-between items-center px-5 py-4 text-sm font-medium text-left text-slate-200 hover:text-white focus:outline-none"
              >
                <span>{faq.q}</span>
                <span className="text-indigo-400 ml-4">{activeFaq === idx ? "−" : "+"}</span>
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 pt-2 bg-slate-950/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="h-5 w-5 text-indigo-400" />
            <span className="font-bold text-sm text-slate-300">Interprestige AI SaaS Inc.</span>
          </div>
          <p className="mt-4 md:mt-0 text-[11px] text-slate-500">
            &copy; 2026 Interprestige SaaS. All systems operational. Offline-first local database enabled.
          </p>
        </div>
      </footer>

    </div>
  );
}
