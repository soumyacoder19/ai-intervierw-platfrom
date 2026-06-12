/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BrainCircuit, 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  Settings, 
  Activity, 
  Coins, 
  ShieldAlert, 
  Compass,
  Star
} from "lucide-react";
import { UserProfile } from "../types";

export type ViewTab = "landing" | "dashboard" | "features" | "about" | "blog";

interface NavigationProps {
  currentTab: ViewTab;
  setCurrentTab: (tab: ViewTab) => void;
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onOpenReferral: () => void;
  networkStatus: "online" | "offline";
}

export default function Navigation({
  currentTab,
  setCurrentTab,
  profile,
  setProfile,
  onOpenReferral,
  networkStatus
}: NavigationProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [editedName, setEditedName] = useState(profile.name);

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...profile, name: editedName };
    setProfile(updated);
    storageSave(updated);
    setShowSettings(false);
  };

  const storageSave = (p: UserProfile) => {
    localStorage.setItem("ai_prep_profile", JSON.stringify(p));
  };

  // Add credits for coupon code or mock stripe checkout
  const handleBoostCredits = () => {
    const updated = { ...profile, plan: "Premium" as const, creditsRemaining: profile.creditsRemaining + 25 };
    setProfile(updated);
    storageSave(updated);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo and Brand */}
        <div 
          onClick={() => setCurrentTab("landing")}
          className="flex cursor-pointer items-center space-x-2 transition-opacity hover:opacity-90"
          id="brand-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/20">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Interprestige <span className="text-indigo-400 font-normal text-xs uppercase tracking-widest pl-1 bg-slate-900 px-1.5 py-0.5 rounded-full border border-slate-800">SaaS</span>
            </h1>
          </div>
        </div>

        {/* Global Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          <button
            onClick={() => setCurrentTab("landing")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === "landing" 
                ? "bg-slate-900 border border-slate-800 text-indigo-400" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => setCurrentTab("dashboard")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === "dashboard" 
                ? "bg-slate-900 border border-slate-800 text-indigo-400" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setCurrentTab("features")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === "features" 
                ? "bg-slate-900 border border-slate-800 text-indigo-400" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Features Matrix</span>
          </button>

          <button
            onClick={() => setCurrentTab("about")}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              currentTab === "about" 
                ? "bg-slate-900 border border-slate-800 text-indigo-400" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Star className="h-4 w-4" />
            <span>About Us</span>
          </button>
        </nav>

        {/* Right side Profile, Network Status, and Credits */}
        <div className="flex items-center space-x-4">
          
          {/* Network Connection Indicator */}
          <div className="flex items-center space-x-1.5 text-xs">
            {networkStatus === "online" ? (
              <span className="flex items-center text-emerald-400">
                <span className="mr-1 h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Live API
              </span>
            ) : (
              <span className="flex items-center text-amber-500">
                <ShieldAlert className="mr-1 h-3.5 w-3.5" />
                Offline State
              </span>
            )}
          </div>

          {/* Credits remaining Pill */}
          <div 
            onClick={onOpenReferral}
            className="hidden sm:flex cursor-pointer select-none items-center space-x-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-500/20 transition-all"
            title="Refer friend to earn 25 extra credits"
          >
            <Coins className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
            <span className="font-semibold">{profile.creditsRemaining} credits</span>
          </div>

          <div className="relative">
            {/* User Profile Button */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center space-x-2 rounded-full border border-slate-800 bg-slate-900 p-1 pr-3 hover:border-slate-700 transition"
                id="user-profile-button"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white uppercase">
                  {profile.name[0]}
                </div>
                <div className="hidden text-left md:block">
                  <p className="text-xs font-semibold text-white truncate max-w-[80px]">
                    {profile.name}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">
                    {profile.plan} Plan
                  </p>
                </div>
              </button>
            </div>

            {/* Quick Settings Dropdown */}
            {showSettings && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <h3 className="text-sm font-semibold text-white mb-2">My Profile Settings</h3>
                
                <form onSubmit={handleUpdateName} className="space-y-3">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Registered Email</label>
                    <input
                      type="email"
                      disabled
                      className="w-full bg-slate-950/60 border border-slate-800/60 rounded-lg px-2.5 py-1.5 text-sm text-slate-500 cursor-not-allowed"
                      value={profile.email}
                    />
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 text-xs font-semibold"
                    >
                      Save Profile Name
                    </button>
                    {profile.plan !== "Premium" && (
                      <button
                        type="button"
                        onClick={handleBoostCredits}
                        className="w-full border border-pink-500/30 hover:border-pink-500 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 rounded-lg py-1.5 text-xs font-bold transition-all"
                      >
                        Upgrade to Premium (+25 Cr)
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile view subheader */}
      <div className="flex md:hidden border-t border-slate-900 bg-slate-950/40 px-4 py-2 justify-around">
        <button
          onClick={() => setCurrentTab("landing")}
          className={`flex items-center space-x-1 text-xs px-2 py-1.5 rounded ${
            currentTab === "landing" ? "text-indigo-400 font-bold bg-slate-900" : "text-slate-400"
          }`}
        >
          <Compass className="h-3.5 w-3.5" />
          <span>Overview</span>
        </button>
        <button
          onClick={() => setCurrentTab("dashboard")}
          className={`flex items-center space-x-1 text-xs px-2 py-1.5 rounded ${
            currentTab === "dashboard" ? "text-indigo-400 font-bold bg-slate-900" : "text-slate-400"
          }`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => setCurrentTab("features")}
          className={`flex items-center space-x-1 text-xs px-2 py-1.5 rounded ${
            currentTab === "features" ? "text-indigo-400 font-bold bg-slate-900" : "text-slate-400"
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>Features</span>
        </button>
        <button
          onClick={() => setCurrentTab("about")}
          className={`flex items-center space-x-1 text-xs px-2 py-1.5 rounded ${
            currentTab === "about" ? "text-indigo-400 font-bold bg-slate-900" : "text-slate-400"
          }`}
        >
          <Star className="h-3.5 w-3.5" />
          <span>About</span>
        </button>
      </div>
    </header>
  );
}
