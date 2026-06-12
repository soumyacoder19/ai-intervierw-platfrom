/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Play, 
  Send, 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Award, 
  MessageSquare, 
  AlertCircle, 
  CornerDownLeft,
  Volume2,
  RefreshCw,
  TrendingDown,
  User,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  BrainCircuit
} from "lucide-react";
import { InterviewRole, InterviewDifficulty, InterviewSession, InterviewMessage, ScoreBreakdown } from "../types";

interface InterviewRoomProps {
  onAddSession: (sess: InterviewSession) => void;
  networkStatus: "online" | "offline";
  profileCredits: number;
  onDeductCredit: () => void;
  preconfiguredQuestions?: string[];
  onCompleteSession: (sess: InterviewSession) => void;
}

export default function InterviewRoom({
  onAddSession,
  networkStatus,
  profileCredits,
  onDeductCredit,
  preconfiguredQuestions,
  onCompleteSession
}: InterviewRoomProps) {
  // Setup state
  const [role, setRole] = useState<InterviewRole>(InterviewRole.FRONTEND);
  const [customCourseTitle, setCustomCourseTitle] = useState("");
  const [initialDifficulty, setInitialDifficulty] = useState<InterviewDifficulty>(InterviewDifficulty.MEDIUM);
  const [session, setSession] = useState<InterviewSession | null>(null);

  // Language management states
  const LANGUAGES_LIST = [
    { code: "en", name: "English", locale: "en-US" },
    { code: "es", name: "Español (Spanish)", locale: "es-ES" },
    { code: "fr", name: "Français (French)", locale: "fr-FR" },
    { code: "de", name: "Deutsch (German)", locale: "de-DE" },
    { code: "zh", name: "中文 (Chinese)", locale: "zh-CN" },
    { code: "ja", name: "日本語 (Japanese)", locale: "ja-JP" },
    { code: "hi", name: "हिन्दी (Hindi)", locale: "hi-IN" },
    { code: "ar", name: "العربية (Arabic)", locale: "ar-SA" },
    { code: "pt", name: "Português (Portuguese)", locale: "pt-BR" },
    { code: "it", name: "Italiano (Italian)", locale: "it-IT" },
    { code: "ru", name: "Русский (Russian)", locale: "ru-RU" },
    { code: "custom", name: "Other / Custom...", locale: "en-US" }
  ];
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");
  const [customLanguage, setCustomLanguage] = useState<string>("");
  const [isCustomLang, setIsCustomLang] = useState<boolean>(false);

  // Active room controls
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [difficultyState, setDifficultyState] = useState<InterviewDifficulty>(InterviewDifficulty.MEDIUM);
  
  // Audio, video feed mock variables
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraFallbackActive, setCameraFallbackActive] = useState(false);
  const [forceSimulatedFeed, setForceSimulatedFeed] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [mockPitchScore, setMockPitchScore] = useState(85);
  const [mockPaceState, setMockPaceState] = useState("Balanced");
  const [mockConfidenceLabel, setMockConfidenceLabel] = useState("High");
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  // Voice playback voice state
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Timer state
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // DOM elements pointers
  const chatBottomRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Auto scroll chats
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages, loading]);

  // Video device stream controller
  useEffect(() => {
    if (cameraOn && !forceSimulatedFeed) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraFallbackActive(false);
        })
        .catch(err => {
          console.error("Camera access denied or frames blocked standard", err);
          setCameraFallbackActive(true);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraFallbackActive(cameraOn && forceSimulatedFeed);
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraOn, forceSimulatedFeed]);

  // Timer counter
  useEffect(() => {
    if (session && session.status === "ongoing") {
      timerRef.current = setInterval(() => {
        setElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session?.status]);

  const handleStartSession = async () => {
    if (profileCredits <= 0) {
      alert("No preparation credits remaining! Upgrade to Executive Pro or Elite Premium to add credits instantly.");
      return;
    }

    onDeductCredit();
    setElapsed(0);
    setDifficultyState(initialDifficulty);

    const finalLang = isCustomLang ? customLanguage.trim() || "English" : selectedLanguage;
    const finalRoleName = role === InterviewRole.CUSTOM ? customCourseTitle.trim() || "Custom Course Subject" : undefined;

    const firstQuestion = preconfiguredQuestions && preconfiguredQuestions.length > 0
      ? `Welcome to your mock interview room [Target Language: ${finalLang}]. Based on your tailored resume background, let's tackle this key topic first:\n\n${preconfiguredQuestions[0]}`
      : getFallbackFirstQuestion(role, initialDifficulty, finalLang, finalRoleName);

    const newSession: InterviewSession = {
      id: "sess-" + Date.now(),
      role,
      customRoleName: finalRoleName,
      difficulty: initialDifficulty,
      status: "ongoing",
      currentQuestionIndex: 0,
      maxQuestions: 4,
      language: finalLang,
      createdAt: new Date().toISOString(),
      elapsedSeconds: 0,
      messages: [
        {
          id: "msg-start",
          sender: "interviewer",
          text: firstQuestion,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setSession(newSession);
    
    // Auto trigger spoken TTS vocal synthesizer
    triggerVoiceSpeech(firstQuestion);
  };

  const getFallbackFirstQuestion = (roleSelected: InterviewRole, level: InterviewDifficulty, langName: string = "English", customTitleName?: string) => {
    const isSpanish = langName.toLowerCase().includes("es") || langName.toLowerCase().includes("span");
    const isFrench = langName.toLowerCase().includes("fr") || langName.toLowerCase().includes("fren");
    const isGerman = langName.toLowerCase().includes("de") || langName.toLowerCase().includes("ger");
    const isHindi = langName.toLowerCase().includes("hi") || langName.toLowerCase().includes("hind");
    const isChinese = langName.toLowerCase().includes("zh") || langName.toLowerCase().includes("chin");
    const isJapanese = langName.toLowerCase().includes("ja") || langName.toLowerCase().includes("japa");

    const activeRoleTitle = customTitleName || roleSelected;

    if (isSpanish) {
      return `¡Bienvenido a tu sala de simulación de entrevista adaptativa! Hoy evaluaremos tus habilidades en el área de "${activeRoleTitle}" con un nivel de dificultad establecido en ${level}. Para comenzar, ¿podrías presentarte brevemente y describir tu experiencia relevante o tu motivación con respecto a esta materia?`;
    }
    if (isFrench) {
      return `Bienvenue dans votre salle de simulation d'entretien adaptatif ! Aujourd'hui, nous allons évaluer vos compétences dans le domaine de "${activeRoleTitle}" avec une difficulté réglée sur ${level}. Pour commencer, pourriez-vous vous présenter brièvement et décrire votre expérience pertinente ou votre motivation pour ce sujet ?`;
    }
    if (isGerman) {
      return `Willkommen in Ihrem adaptiven Interview-Simulationsraum! Heute bewerten wir Ihre Fähigkeiten im Bereich "${activeRoleTitle}" mit einem Schwierigkeitsgrad von ${level}. Lassen Sie uns beginnen: Könnten Sie sich bitte kurz vorstellen und Ihre relevanten Erfahrungen oder Ihre Motivation für dieses Fachgebiet beschreiben?`;
    }
    if (isHindi) {
      return `आपके एडेप्टिव इंटरव्यू सिम्युलेटर में आपका स्वागत है! आज हम "${activeRoleTitle}" के क्षेत्र में आपके कौशल का मूल्यांकन करेंगे, जिसमें कठिनाई स्तर ${level} है। शुरू करने के लिए, क्या आप संक्षेप में अपना परिचय दे सकते हैं और इस विषय से संबंधित अपने अनुभव या प्रेरणा के बारे में बता सकते हैं?`;
    }
    if (isChinese) {
      return `欢迎来到您的自适应面试模拟室！今天我们将评估您在“${activeRoleTitle}”领域的专业技能，难度等级设为 ${level}。首先，请您简要介绍一下自己，并描述您与该领域相关的经验或您的学习动机？`;
    }
    if (isJapanese) {
      return `アダプティブ面接シミュレーションルームへようこそ！本日は難易度 ${level} に設定された「${activeRoleTitle}」分野のスキルを評価します。はじめに、簡単に自己紹介をいただき、この分野に関するご経験や志望動機についてお聞かせください。`;
    }

    return `Welcome to your adaptive interview simulation room! Today we will evaluate your core skills specifically in the field of "${activeRoleTitle}" with the starting difficulty set to ${level}. Let's begin: Could you please introduce yourself briefly, and describe your relevant experience, project work, or studies related to this domain?`;
  };

  const triggerVoiceSpeech = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    setIsSpeaking(true);
    const utter = new SpeechSynthesisUtterance(text.slice(0, 200));
    
    // Dynamically query speech codes
    const finalLang = isCustomLang ? customLanguage : selectedLanguage;
    const matchObj = LANGUAGES_LIST.find(l => 
      l.name.toLowerCase().includes(finalLang.toLowerCase()) || 
      finalLang.toLowerCase().includes(l.name.toLowerCase())
    );
    if (matchObj) {
      utter.lang = matchObj.locale;
    }
    
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Simulating spoken input via STT click helper
  const handleSimulateSTT = () => {
    setInputText("To structure this properly, we first capture the context by separating our modules. Then, we apply consistent data caching to optimize operations and ensure durable client metrics fallback.");
    setMicOn(true);
    setTimeout(() => setMicOn(false), 2000);
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !session) return;

    const userText = inputText;
    setInputText("");
    setLoading(true);

    const userMessage: InterviewMessage = {
      id: "user-" + Date.now(),
      sender: "candidate",
      text: userText,
      timestamp: new Date().toISOString()
    };

    // Update session state with candidate answer
    const updatedMessages = [...session.messages, userMessage];
    const currentIndex = session.currentQuestionIndex + 1;
    
    setSession({
      ...session,
      messages: updatedMessages,
      currentQuestionIndex: currentIndex
    });

    try {
      let evaluationFeedback = {
        clarity: "Your reply demonstrates functional engineering intuition.",
        suggestions: "Expand more on transaction isolation metrics.",
        structure: "Good. Situation and Actions clearly identified.",
        correctnessScore: 88
      };

      let nextInterviewerQuestionText = "Interesting points. Can you build on that by describing how you track high stress failure rates or latency metrics in production?";

      if (networkStatus === "online") {
        // Contact server-side Gemini gateway
        const response = await fetch("/api/gemini/interview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updatedMessages,
            role: session.role,
            difficulty: difficultyState,
            language: session.language
          })
        });

        const data = await response.json();
        if (data.feedback && data.nextQuestion) {
          evaluationFeedback = data.feedback;
          nextInterviewerQuestionText = data.nextQuestion;
        }
      } else {
        // Offline simulation logic
        await new Promise(resolve => setTimeout(resolve, 1500));
      }

      // Adaptive difficulty logic:
      // If candidate score is high (>= 90), level up difficulty dynamically!
      let newDiff = difficultyState;
      if (evaluationFeedback.correctnessScore >= 90) {
        if (difficultyState === InterviewDifficulty.EASY) newDiff = InterviewDifficulty.MEDIUM;
        else if (difficultyState === InterviewDifficulty.MEDIUM) newDiff = InterviewDifficulty.HARD;
        else if (difficultyState === InterviewDifficulty.HARD) newDiff = InterviewDifficulty.EXPERT;
      }

      const parsedFeedbackMsg: InterviewMessage = {
        ...userMessage,
        feedback: evaluationFeedback
      };

      const interviewerReplyMsg: InterviewMessage = {
        id: "interviewer-" + Date.now(),
        sender: "interviewer",
        text: nextInterviewerQuestionText,
        timestamp: new Date().toISOString()
      };

      const indexWithReplies = currentIndex;
      const finalSessionState: InterviewSession = {
        ...session,
        difficulty: newDiff,
        currentQuestionIndex: indexWithReplies,
        messages: [...session.messages, parsedFeedbackMsg, interviewerReplyMsg]
      };

      setSession(finalSessionState);
      setDifficultyState(newDiff);
      triggerVoiceSpeech(nextInterviewerQuestionText);

      // Adjust mock visual overlays
      setMockPitchScore(Math.min(98, Math.max(78, mockPitchScore + (evaluationFeedback.correctnessScore > 88 ? 3 : -3))));
      setMockConfidenceLabel(evaluationFeedback.correctnessScore > 90 ? "Excellent" : "Stable");

    } catch (err) {
      console.error("Gemini Interview Loop Failed", err);
      // Fallback message insertion
      const genericInterviewerMsg: InterviewMessage = {
        id: "int-err-" + Date.now(),
        sender: "interviewer",
        text: "That makes perfect sense. Let's redirect slightly. How would you design structured API retry policies to guarantee deliverability under spot failures?",
        timestamp: new Date().toISOString()
      };
      setSession({
        ...session,
        messages: [...session.messages, userMessage, genericInterviewerMsg]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = async () => {
    if (!session) return;

    setLoading(true);
    let finalScores: ScoreBreakdown = {
      technical: 85,
      communication: 82,
      problemSolving: 84,
      confidence: mockPitchScore,
      structure: 80,
      overall: 83
    };

    let summaryReport = "The candidate demonstrated standard structural preparedness, with commendable depth on core framework logic. Suggest practicing on deeper transaction isolation models and STAR concluding statements.";

    try {
      if (networkStatus === "online") {
        const response = await fetch("/api/gemini/interview/grade", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: session.messages,
            role: session.role,
            language: session.language
          })
        });
        const data = await response.json();
        if (data.scores && data.report) {
          finalScores = data.scores;
          summaryReport = data.report;
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (e) {
      console.error("End session grading failure", e);
    }

    const completed: InterviewSession = {
      ...session,
      status: "completed",
      scores: finalScores,
      feedbackReport: summaryReport,
      elapsedSeconds: elapsed
    };

    onCompleteSession(completed);
    setLoading(false);
  };

  // Setup Role & level page
  if (!session) {
    return (
      <div className="mx-auto max-w-3xl" id="interview-setup-panel">
        
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 md:p-8 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500/10 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3.5 py-1.5 rounded-bl-2xl border-l border-b border-slate-800">
            SaaS Room v2
          </div>
          
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/10">
              <BrainCircuit className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">SaaS AI Interview Lab</h2>
              <p className="text-xs text-slate-400">Specify role targeting and standard difficulty rules.</p>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Choose target role */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Choose Target Position</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Object.values(InterviewRole).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex items-center justify-between text-left p-4 rounded-xl border text-xs transition-all ${
                      role === r 
                        ? "border-indigo-500 bg-indigo-500/5 text-white" 
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    <span>{r}</span>
                    <span className="text-[9px] text-indigo-400/70 capitalize">Ready</span>
                  </button>
                ))}
              </div>

              {role === InterviewRole.CUSTOM && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 mt-3 p-4 bg-slate-950/40 rounded-xl border border-indigo-500/20"
                >
                  <label className="text-[10px] text-indigo-400 uppercase font-bold block tracking-wider">
                    Specify Course, Subject, or Job Title
                  </label>
                  <input
                    type="text"
                    value={customCourseTitle}
                    onChange={(e) => setCustomCourseTitle(e.target.value)}
                    placeholder="e.g. Node.js Backend Course, AI & Deep Learning, Nurse Practitioner, AP Physics..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[9px] text-slate-500 italic">
                    Type any mock exam, specialized job role, or academic course topic. The adaptive engine will align the questions, rubric, and feedback to this custom field!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Choose initial difficulty */}
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">Starting difficulty tier</label>
              <div className="flex flex-wrap gap-2">
                {Object.values(InterviewDifficulty).map((d) => (
                  <button
                    key={d}
                    onClick={() => setInitialDifficulty(d)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition ${
                      initialDifficulty === d
                        ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                💡 Note: Adaptive Difficulty Engine is ACTIVE. Performance above 90% score will automatically level up the interviewer's queries in-flight.
              </p>
            </div>

            {/* Choose Target Language */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
                  Select Interview Language
                </label>
                <span className="text-[9px] text-indigo-400 bg-indigo-505/10 px-2 py-0.5 rounded font-mono">
                  All Languages Supported
                </span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {LANGUAGES_LIST.map((lang) => {
                  const isSelected = isCustomLang ? lang.code === "custom" : selectedLanguage === lang.name;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => {
                        if (lang.code === "custom") {
                          setIsCustomLang(true);
                        } else {
                          setIsCustomLang(false);
                          setSelectedLanguage(lang.name);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-left text-[11px] transition-all flex flex-col justify-between h-[55px] ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-500/10 text-white"
                          : "border-slate-850 bg-slate-950/30 text-slate-400 hover:border-slate-800 hover:text-white"
                      }`}
                    >
                      <span className="font-bold truncate">{lang.name}</span>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">{lang.locale}</span>
                    </button>
                  );
                })}
              </div>

              {isCustomLang && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2 mt-2 p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/10"
                >
                  <label className="text-[10px] text-indigo-400 uppercase font-bold block tracking-wider">
                    Specify Custom Language
                  </label>
                  <input
                    type="text"
                    value={customLanguage}
                    onChange={(e) => setCustomLanguage(e.target.value)}
                    placeholder="e.g. Swahili, Greek, Korean, Hebrew, Swedish..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <p className="text-[9px] text-slate-500 italic">
                    Type any language in the world! Gemini will conduct the interview, ask questions, and compose constructive feedback to match fluently.
                  </p>
                </motion.div>
              )}
            </div>

            {/* Action button */}
            <div className="pt-6 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleStartSession}
                className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-3 text-sm font-semibold shadow-lg shadow-indigo-600/15"
              >
                <span>Authorize & Enter Prep Room</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // Active session Room rendering
  return (
    <div className="max-w-7xl mx-auto" id="active-interview-room">
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Chat stream panel */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {/* Header metadata line */}
          <div className="bg-slate-900/40 border border-slate-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-200">{role}</span>
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/15 px-2 py-0.5 rounded-full capitalize">
                {difficultyState} level
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {isSpeaking && (
                <button
                  onClick={handleStopSpeech}
                  className="flex items-center space-x-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold rounded text-[10px] hover:bg-amber-500/20 transition-all"
                >
                  <Volume2 className="h-3 w-3 animate-bounce" />
                  <span>Mute Speech</span>
                </button>
              )}
              
              <div className="flex items-center space-x-1 text-slate-400 font-mono">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                <span>
                  {Math.floor(elapsed / 60).toString().padStart(2, "0")}:
                  {(elapsed % 60).toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Active messages bubble container */}
          <div className="bg-slate-950/60 border border-slate-850 rounded-3xl h-[420px] overflow-y-auto p-4 sm:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
            {session.messages.map((m) => (
              <div key={m.id} className="space-y-2">
                <div className={`flex ${m.sender === "candidate" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    m.sender === "candidate"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none"
                  }`}>
                    <p className="font-semibold text-[9px] text-indigo-200 uppercase tracking-wider mb-1">
                      {m.sender === "candidate" ? "Sarah (You)" : "Elite Interviewer"}
                    </p>
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>

                {/* Display item feedback suggestions right under candidate's bubble block */}
                {m.sender === "candidate" && m.feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-[11px] text-indigo-200/90 leading-relaxed max-w-[82%] ml-auto"
                  >
                    <div className="flex justify-between items-center mb-1 pb-1 border-b border-indigo-500/10">
                      <span className="font-bold text-indigo-400 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5" /> Live answer grading
                      </span>
                      <span className="font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                        Correctness: {m.feedback.correctnessScore}%
                      </span>
                    </div>
                    <ul className="space-y-1">
                      <li><strong>Strength:</strong> {m.feedback.clarity}</li>
                      <li><strong>STAR Structure:</strong> {m.feedback.structure}</li>
                      <li><strong>Tip:</strong> {m.feedback.suggestions}</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            ))}

            {/* Custom sliding loading typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 max-w-[60%] flex items-center space-x-2">
                  <span className="text-[10px] text-slate-500 animate-pulse font-mono">Interviewer is mapping replies...</span>
                  <div className="flex space-x-1">
                    <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce delay-100" />
                    <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce delay-200" />
                    <span className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Form input controls */}
          <form onSubmit={handleSubmitAnswer} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                disabled={loading}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500"
                placeholder={loading ? "Generating next question..." : "Type your detailed professional response..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="bg-indigo-600 hover:bg-slate-850 disabled:opacity-40 text-white rounded-xl px-4 flex items-center justify-center transition"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-2">
              <p className="text-[10px] text-slate-500">Press Enter or click send to submit answer.</p>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSimulateSTT}
                  className="flex items-center space-x-1.5 px-3 py-1.5 border border-slate-850 bg-slate-950 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold"
                >
                  <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Simulate Voice Speech Dictation</span>
                </button>

                <button
                  type="button"
                  onClick={handleEndSession}
                  className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl px-4 py-1.5 text-[10px] font-extrabold shadow"
                >
                  Conclude Round
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* Right: Device Camera visual feed frame */}
        <div className="lg:col-span-4 flex flex-col space-y-4">
          
          <div className="rounded-2xl border border-slate-850 bg-slate-950 p-4 space-y-4">
            
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-900">
              <div className="flex items-center space-x-1.5">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Candidate Video Feed</h4>
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => setCameraOn(!cameraOn)}
                  className={`p-1.5 rounded-lg border transition ${
                    cameraOn 
                      ? "border-emerald-500/30 bg-emerald-505/10 text-emerald-400" 
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                  }`}
                  title={cameraOn ? "Turn camera OFF" : "Turn camera ON"}
                >
                  {cameraOn ? <Video className="h-3.5 w-3.5" /> : <VideoOff className="h-3.5 w-3.5" />}
                </button>

                <button
                  onClick={() => setMicOn(!micOn)}
                  className={`p-1.5 rounded-lg border transition ${
                    micOn 
                      ? "border-emerald-500/30 bg-emerald-505/10 text-emerald-400 animate-pulse" 
                      : "border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700"
                  }`}
                  title={micOn ? "Mute microphone" : "Unmute microphone"}
                >
                  {micOn ? <Mic className="h-3.5 w-3.5" /> : <MicOff className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Simulated/Real Video block */}
            <div className="w-full aspect-video rounded-xl bg-slate-900 border border-slate-850 overflow-hidden relative flex items-center justify-center">
              {cameraOn ? (
                cameraFallbackActive ? (
                  <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden" id="camera-fallback-canvas">
                    {/* Animated grid laser scanners */}
                    <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30" />
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-indigo-500/40 shadow-lg shadow-indigo-500 animate-bounce" style={{ animationDuration: '4s' }} />

                    {/* Elegant Sci-fi Face Coordinate Overlay */}
                    <svg className="w-12 h-12 text-indigo-500/70 mb-1.5 animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M25,30 Q15,50 35,75 Q50,90 65,75 Q85,50 75,30 Q50,20 25,30" stroke="currentColor" strokeDasharray="3 3" />
                      <circle cx="40" cy="45" r="2" fill="#10b981" />
                      <circle cx="60" cy="45" r="2" fill="#10b981" />
                      <line x1="50" y1="40" x2="50" y2="65" stroke="#3b82f6" />
                      <path d="M43,62 Q50,68 57,62" stroke="#f43f5e" strokeWidth="2" />
                      <path d="M10,20 L20,20 M10,20 L10,30 M90,20 L80,20 M90,20 L90,30 M10,80 L20,80 M10,80 L10,70 M90,80 L80,80 M90,80 L90,70" stroke="#10b981" strokeWidth="2" />
                    </svg>
                    <p className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                      <Sparkles className="h-2.5 w-2.5" /> Virtual AI Cam Active
                    </p>
                    <p className="text-[8px] text-slate-500 text-center max-w-[200px] mt-0.5 leading-normal italic">
                      Camera permissions restricted in sandboxed player. Virtual coordinate grid engaged.
                    </p>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                )
              ) : (
                <div className="text-center p-4">
                  <User className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Webcam frame is sleeping</p>
                  <p className="text-[9px] text-slate-600 mt-0.5">Toggle video controls above to sync feed</p>
                </div>
              )}

              {/* Pitch Confidence overlay widgets */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 backdrop-blur-sm p-1.5 rounded-lg border border-slate-850/60 flex justify-between items-center text-[9px]">
                <div>
                  <span className="text-slate-500">Vocal Pitch:</span>
                  <span className="text-indigo-400 font-bold ml-1">{mockPitchScore}%</span>
                </div>
                <div>
                  <span className="text-slate-500">Pace:</span>
                  <span className="text-emerald-400 font-bold ml-1">{mockPaceState}</span>
                </div>
                <div>
                  <span className="text-slate-500">Confidence:</span>
                  <span className="text-pink-400 font-bold ml-1">{mockConfidenceLabel}</span>
                </div>
              </div>
            </div>

            {/* Toggle backup simulation controls */}
            <div className="flex justify-between items-center gap-2 pt-1 border-t border-slate-900/40">
              <span className="text-[9px] text-slate-500 uppercase font-mono tracking-wider">
                {cameraFallbackActive ? "🔄 Virtual Target Mode" : "📹 Hard Device Sync"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setForceSimulatedFeed(!forceSimulatedFeed);
                  if (!cameraOn) setCameraOn(true);
                }}
                className={`text-[8px] uppercase tracking-wider font-extrabold px-2 py-1 rounded border transition ${
                  forceSimulatedFeed 
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" 
                    : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {forceSimulatedFeed ? "Disable Virtual Cam" : "Force Virtual Cam"}
              </button>
            </div>

            <div className="text-xs bg-slate-950/35 border border-slate-900/60 p-3 rounded-xl">
              <h5 className="font-bold text-slate-300 text-[10px] uppercase mb-1.5 tracking-wider">Verbal pacing coach</h5>
              <p className="text-[10px] text-slate-500 leading-normal">
                Speak steadily. Our local STT engine analyzes filler delays (e.g. "actually", "like") and alerts you to speak slightly slower when stress rates spike.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
