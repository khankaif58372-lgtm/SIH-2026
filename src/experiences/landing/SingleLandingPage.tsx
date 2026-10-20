import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Check, Sparkles, BookOpen, GraduationCap, ChevronDown } from 'lucide-react'
import { LandingNav } from '../../components/navigation/LandingNav'
import { LandingCanvas } from '../../components/cinematic/LandingCanvas'
import { useAppStore } from '../../store/useAppStore'
import type { UserRole } from '../../types'
import { LANGUAGES } from '../../data/languages'

export function SingleLandingPage() {
  const navigate = useNavigate()
  const { isDarkMode, selectedRole, setSelectedRole, setAssistantState } = useAppStore()
  const [activeTabRole, setActiveTabRole] = useState<UserRole>(selectedRole || 'student')
  const [isTransitioningRole, setIsTransitioningRole] = useState<'student' | 'teacher' | null>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleNavigateToLogin = (role: 'student' | 'teacher') => {
    if (isTransitioningRole) return
    setActiveTabRole(role)
    setSelectedRole(role)
    setIsTransitioningRole(role)
    setAssistantState({ mode: 'success', message: `Entering ${role} space` })

    // Cinematic forward camera travel duration (750ms)
    const timeoutDuration = reducedMotion ? 200 : 750
    setTimeout(() => {
      navigate(`/login/${role}`)
    }, timeoutDuration)
  }

  return (
    <div
      className={`relative min-h-screen theme-transition ${
        isDarkMode ? 'bg-[#0A0A0C] text-[#F5F5F5]' : 'bg-[#F6F5F1] text-[#171717]'
      }`}
    >
      {/* ── Persistent Floating Navbar ── */}
      <LandingNav />

      {/* ── Persistent Single 3D AI Core Canvas ── */}
      <LandingCanvas />

      {/* ── Background Subtle Ambient Aura ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[850px] h-[650px] rounded-full blur-[140px] pointer-events-none"
          style={{
            background: isDarkMode
              ? 'radial-gradient(ellipse at center, rgba(6,182,212,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 80%)'
              : 'radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(241,241,238,0.4) 45%, rgba(246,245,241,0) 80%)',
          }}
        />
      </div>

      {/* ── Main Single Page Content Flow with Movie-Like Parallax Exit ── */}
      <AnimatePresence>
        <motion.main
          animate={
            isTransitioningRole
              ? reducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 1.04,
                    y: -32,
                    filter: 'blur(6px)',
                  }
              : {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  filter: 'blur(0px)',
                }
          }
          transition={{
            duration: reducedMotion ? 0.2 : 0.75,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative z-10 w-full flex flex-col items-center"
        >
          
          {/* ========================================================================= */}
          {/* 1. HERO / PREMIUM AI INTRODUCTION                                         */}
          {/* ========================================================================= */}
          <section
            id="hero"
            className="min-h-screen w-full flex flex-col items-center justify-between px-6 sm:px-12 pt-28 pb-12 sm:pb-16 text-center"
          >
            {/* Top Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="pt-2 sm:pt-6"
            >
              <span
                className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.2em] uppercase border theme-transition ${
                  isDarkMode
                    ? 'bg-white/[0.04] border-white/[0.08] text-[#A3A39E]'
                    : 'bg-[#FAFAF8] border-black/[0.05] text-[#6F6F6A] shadow-subtle'
                }`}
              >
                <Sparkles size={13} className="text-cyan-500" />
                WHERE LANGUAGE MEETS LEARNING
              </span>
            </motion.div>

            {/* Hero Center Editorial Copy */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.25 }}
              className="max-w-4xl mx-auto space-y-6 my-auto"
            >
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.02] text-[#171717] dark:text-[#F5F5F5]">
                Learn in the language <br className="hidden sm:inline" />
                <span className="font-serif font-normal italic">that feels like home.</span>
              </h1>

              <p
                className={`text-base sm:text-lg md:text-xl font-normal max-w-xl mx-auto leading-relaxed theme-transition ${
                  isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                }`}
              >
                An intelligent learning space that understands your language, your level, and the way you learn.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => scrollToSection('roles')}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-medium shadow-editorial hover:shadow-editorial-hover transition-all duration-200 cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#FFFFFF] text-[#171717] hover:bg-[#F5F5F5]'
                      : 'bg-[#171717] text-[#FFFFFF] hover:bg-[#262626]'
                  }`}
                >
                  <span className={isDarkMode ? 'text-[#171717]' : 'text-[#FFFFFF]'}>Start Learning</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => scrollToSection('about')}
                  className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-medium border theme-transition hover:shadow-subtle cursor-pointer ${
                    isDarkMode
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-[#F5F5F5]'
                      : 'bg-[#FAFAF8] hover:bg-[#FFFFFF] border-black/[0.05] text-[#171717]'
                  }`}
                >
                  <span>Explore BhashaMitra</span>
                </button>
              </div>
            </motion.div>

            {/* Bottom Scroll Prompt */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="pt-12 sm:pt-16 flex flex-col items-center gap-2 text-xs opacity-50 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => scrollToSection('roles')}
            >
              <span>Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              >
                ↓
              </motion.div>
            </motion.div>
          </section>


          {/* ========================================================================= */}
          {/* 2. SECOND SECTION — DASHBOARD SELECTION (MONITORING / STUDENT / TEACHER)  */}
          {/* ========================================================================= */}
          <section
            id="roles"
            className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-24 sm:py-32 flex flex-col items-center justify-center"
          >
            <div className="w-full max-w-5xl text-center space-y-4 mb-16 sm:mb-20">
              <div className="inline-flex flex-col items-center gap-2 mb-8">
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.25em] ${
                    isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
                  }`}
                >
                  Primary Feature & Pathways
                </span>
                <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight">
                  How will you experience BhashaMitra?
                </h2>
                <p className={`text-sm sm:text-base max-w-xl mx-auto ${isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'}`}>
                  Access real-time language monitoring or select a workspace tailored specifically for you.
                </p>
              </div>

              {/* ── 1. PRIMARY OPTION: MONITORING (PROMINENT RECTANGLE CARD AT TOP) ── */}
              <motion.div
                whileHover={{ y: -3, scale: 1.006 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => navigate('/monitoring')}
                className={`group relative w-full p-8 sm:p-10 rounded-3xl border text-left cursor-pointer theme-transition mb-8 ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-emerald-500/10 via-white/[0.04] to-cyan-500/10 border-emerald-500/30 hover:border-emerald-400/60 shadow-glow-cyan-subtle ring-1 ring-emerald-500/20'
                    : 'bg-gradient-to-r from-emerald-50/80 via-[#FAFAF8] to-cyan-50/80 border-emerald-500/40 hover:border-emerald-500 shadow-editorial-hover ring-1 ring-emerald-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-4 rounded-2xl border ${
                        isDarkMode
                          ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-400'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700'
                      }`}
                    >
                      <Sparkles size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          PRIMARY FEATURE 01
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                          PUBLIC DIRECT ACCESS
                        </span>
                      </div>
                      <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#171717] dark:text-white">
                        MONITORING DASHBOARD
                      </h3>
                    </div>
                  </div>

                  {/* Primary CTA button indicator */}
                  <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-all shrink-0">
                    <span>Open Monitoring Screen</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                <p
                  className={`text-base sm:text-lg leading-relaxed max-w-3xl mb-6 ${
                    isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                  }`}
                >
                  "Real-time voice input, speech-to-text, automatic vernacular translation, and Kurukh language monitoring."
                </p>

                <div
                  className={`pt-4 border-t text-xs sm:text-sm flex flex-wrap items-center gap-6 ${
                    isDarkMode ? 'border-white/[0.08] text-[#A3A39E]' : 'border-black/[0.06] text-[#6F6F6A]'
                  }`}
                >
                  <span>• Automatic speech-to-text & translation</span>
                  <span>• Native Kurukh vernacular support</span>
                  <span>• Toggleable text-to-speech audio</span>
                </div>
              </motion.div>

              {/* ── 2. SECONDARY & TERTIARY OPTIONS: STUDENT & TEACHER (SIDE BY SIDE BELOW MONITORING ON DESKTOP) ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
                
                {/* Student Card */}
                <motion.div
                  whileHover={{ y: -3, scale: 1.008 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleNavigateToLogin('student')}
                  className={`group relative p-8 sm:p-10 rounded-3xl border text-left cursor-pointer theme-transition ${
                    activeTabRole === 'student'
                      ? isDarkMode
                        ? 'bg-white/[0.08] border-cyan-400/50 shadow-glow-cyan-subtle ring-1 ring-cyan-400/40'
                        : 'bg-[#FAFAF8] border-cyan-500 shadow-editorial-hover ring-1 ring-cyan-500/30'
                      : isDarkMode
                      ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                      : 'bg-[#FAFAF8]/80 border-black/[0.05] hover:bg-[#FFFFFF] shadow-subtle'
                  } ${isTransitioningRole === 'student' ? 'ring-2 ring-cyan-400 scale-[1.02] shadow-2xl' : ''}`}
                >
                  {/* Selection Check Indicator */}
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        activeTabRole === 'student'
                          ? 'bg-cyan-500/15 border-cyan-400/30 text-cyan-500'
                          : isDarkMode
                          ? 'bg-white/[0.04] border-white/[0.08] text-slate-400'
                          : 'bg-black/[0.03] border-black/[0.05] text-slate-600'
                      }`}
                    >
                      <BookOpen size={24} />
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        activeTabRole === 'student'
                          ? 'bg-cyan-500 border-cyan-500 text-white'
                          : isDarkMode
                          ? 'border-white/20'
                          : 'border-black/15'
                      }`}
                    >
                      {activeTabRole === 'student' && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-1 block">
                    PATHWAY 02
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                    STUDENT DASHBOARD
                  </h3>
                  <p
                    className={`text-base leading-relaxed mb-6 ${
                      isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                    }`}
                  >
                    "Learn concepts in the language and level that feels right for you."
                  </p>

                  <div
                    className={`pt-4 border-t text-xs space-y-1.5 mb-6 ${
                      isDarkMode ? 'border-white/[0.06] text-[#A3A39E]' : 'border-black/[0.06] text-[#6F6F6A]'
                    }`}
                  >
                    <p>• Adaptive conceptual depth from Primary to College</p>
                    <p>• Native dialect nuances & audio voice synthesis</p>
                  </div>

                  {/* Continue Action */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1.5 transition-transform">
                    <span>{isTransitioningRole === 'student' ? 'Entering Scene...' : 'Continue as Student'}</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>

                {/* Teacher Card */}
                <motion.div
                  whileHover={{ y: -3, scale: 1.008 }}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => handleNavigateToLogin('teacher')}
                  className={`group relative p-8 sm:p-10 rounded-3xl border text-left cursor-pointer theme-transition ${
                    activeTabRole === 'teacher'
                      ? isDarkMode
                        ? 'bg-white/[0.08] border-violet-400/50 shadow-glow-cyan-subtle ring-1 ring-violet-400/40'
                        : 'bg-[#FAFAF8] border-violet-500 shadow-editorial-hover ring-1 ring-violet-500/30'
                      : isDarkMode
                      ? 'bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06]'
                      : 'bg-[#FAFAF8]/80 border-black/[0.05] hover:bg-[#FFFFFF] shadow-subtle'
                  } ${isTransitioningRole === 'teacher' ? 'ring-2 ring-violet-400 scale-[1.02] shadow-2xl' : ''}`}
                >
                  {/* Selection Check Indicator */}
                  <div className="flex items-center justify-between mb-8">
                    <div
                      className={`p-3.5 rounded-2xl border ${
                        activeTabRole === 'teacher'
                          ? 'bg-violet-500/15 border-violet-400/30 text-violet-500'
                          : isDarkMode
                          ? 'bg-white/[0.04] border-white/[0.08] text-slate-400'
                          : 'bg-black/[0.03] border-black/[0.05] text-slate-600'
                      }`}
                    >
                      <GraduationCap size={24} />
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        activeTabRole === 'teacher'
                          ? 'bg-violet-500 border-violet-500 text-white'
                          : isDarkMode
                          ? 'border-white/20'
                          : 'border-black/15'
                      }`}
                    >
                      {activeTabRole === 'teacher' && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-1 block">
                    PATHWAY 03
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                    TEACHER DASHBOARD
                  </h3>
                  <p
                    className={`text-base leading-relaxed mb-6 ${
                      isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                    }`}
                  >
                    "Create more accessible learning experiences for your students."
                  </p>

                  <div
                    className={`pt-4 border-t text-xs space-y-1.5 mb-6 ${
                      isDarkMode ? 'border-white/[0.06] text-[#A3A39E]' : 'border-black/[0.06] text-[#6F6F6A]'
                    }`}
                  >
                    <p>• Automated multilingual curriculum translation</p>
                    <p>• Multi-level explanation generating tools</p>
                  </div>

                  {/* Continue Action */}
                  <div className="flex items-center gap-2 text-xs font-semibold text-violet-600 dark:text-violet-400 group-hover:translate-x-1.5 transition-transform">
                    <span>{isTransitioningRole === 'teacher' ? 'Entering Scene...' : 'Continue as Teacher'}</span>
                    <ArrowRight size={14} />
                  </div>
                </motion.div>

              </div>

            </div>
          </section>


          {/* ========================================================================= */}
          {/* 3. THIRD SECTION — INFORMATION ABOUT BHASHAMITRA                          */}
          {/* ========================================================================= */}
          <section
            id="about"
            className="w-full max-w-6xl mx-auto px-6 sm:px-12 py-24 sm:py-32 flex flex-col items-center space-y-20"
          >
            {/* Editorial Grand Statement */}
            <div className="max-w-3xl text-center space-y-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cyan-500 block">
                ABOUT BHASHAMITRA
              </span>
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]">
                Learn in the language <br className="hidden sm:inline" />
                <span className="font-serif italic font-normal">that feels like home.</span>
              </h2>
              <p
                className={`text-base sm:text-xl font-normal leading-relaxed ${
                  isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                }`}
              >
                BhashaMitra makes learning more comfortable, accessible, and meaningful by bringing education closer to the language students understand best.
              </p>
            </div>

            {/* Formula Card */}
            <div
              className={`w-full max-w-3xl p-6 sm:p-8 rounded-3xl border text-center theme-transition ${
                isDarkMode
                  ? 'bg-white/[0.03] border-white/[0.08]'
                  : 'bg-[#FAFAF8] border-black/[0.05] shadow-editorial'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-500 mb-3 block">
                THE ADAPTIVE LEARNING CORE
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base md:text-lg font-medium">
                <span className="px-3.5 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05]">
                  Language
                </span>
                <span className="text-slate-400">+</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05]">
                  Education Level
                </span>
                <span className="text-slate-400">+</span>
                <span className="px-3.5 py-1.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.05]">
                  Question
                </span>
                <span className="text-cyan-500 font-bold">→</span>
                <span className="px-4 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-semibold">
                  Adaptive AI Explanation
                </span>
              </div>
            </div>

            {/* 3 Carefully Composed Editorial Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              
              <div
                className={`p-8 rounded-3xl border text-left space-y-4 theme-transition ${
                  isDarkMode
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-[#FAFAF8] border-black/[0.05] shadow-subtle'
                }`}
              >
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-500">01</span>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  BhashaMitra Learning
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                  }`}
                >
                  "Understand concepts in the language you naturally think in."
                </p>
              </div>

              <div
                className={`p-8 rounded-3xl border text-left space-y-4 theme-transition ${
                  isDarkMode
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-[#FAFAF8] border-black/[0.05] shadow-subtle'
                }`}
              >
                <span className="text-xs font-bold tracking-widest uppercase text-cyan-500">02</span>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  Adaptive Education
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                  }`}
                >
                  "Explanations change according to the learner's education level."
                </p>
              </div>

              <div
                className={`p-8 rounded-3xl border text-left space-y-4 theme-transition ${
                  isDarkMode
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-[#FAFAF8] border-black/[0.05] shadow-subtle'
                }`}
              >
                <span className="text-xs font-bold tracking-widest uppercase text-violet-500">03</span>
                <h3 className="font-display text-xl font-bold tracking-tight">
                  AI-Powered Learning
                </h3>
                <p
                  className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                  }`}
                >
                  "One intelligent system adapts the learning experience around the learner."
                </p>
              </div>

            </div>

            {/* Subtly Elegant Language Identity */}
            <div className="w-full max-w-4xl text-center space-y-6 pt-6">
              <span
                className={`text-xs font-semibold uppercase tracking-[0.25em] ${
                  isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                }`}
              >
                Multilingual Identity
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-5xl mx-auto">
                {LANGUAGES.map((item) => (
                  <div
                    key={item.id}
                    className={`px-4 py-2.5 rounded-2xl border text-sm font-medium theme-transition flex flex-col items-center ${
                      isDarkMode
                        ? 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.06] text-[#F5F5F5]'
                        : 'bg-[#FAFAF8] border-black/[0.05] hover:border-black/15 shadow-subtle text-[#171717]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">{item.nativeName}</span>
                      <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        ({item.name})
                      </span>
                    </div>
                    <span className="text-[10px] text-[#A3A39E] font-normal mt-0.5 max-w-[180px] text-center truncate">
                      {item.regions.join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>


          {/* ========================================================================= */}
          {/* 4. FINAL CLOSING SECTION & MINIMAL FOOTER                                  */}
          {/* ========================================================================= */}
          <section className="w-full max-w-4xl mx-auto px-6 sm:px-12 py-24 sm:py-32 text-center space-y-8">
            <div className="space-y-4">
              <h2 className="font-display text-4xl sm:text-6xl font-bold tracking-tight">
                Education should speak <br />
                <span className="font-serif italic font-normal">your language.</span>
              </h2>
              <p
                className={`text-base sm:text-lg font-medium max-w-md mx-auto ${
                  isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'
                }`}
              >
                BhashaMitra
              </p>
              <p
                className={`text-xs sm:text-sm max-w-sm mx-auto ${
                  isDarkMode ? 'text-[#737373]' : 'text-[#A3A39E]'
                }`}
              >
                An intelligent learning space designed for every mother tongue.
              </p>
            </div>

            <div>
              <button
                onClick={() => scrollToSection('roles')}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-sm sm:text-base font-medium shadow-editorial hover:shadow-editorial-hover transition-all duration-200 cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#FFFFFF] text-[#171717] hover:bg-[#F5F5F5]'
                    : 'bg-[#171717] text-[#FFFFFF] hover:bg-[#262626]'
                }`}
              >
                <span className={isDarkMode ? 'text-[#171717]' : 'text-[#FFFFFF]'}>Start Learning</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* ── Minimal Footer ── */}
          <footer
            className={`w-full py-8 border-t text-center text-xs space-y-2 theme-transition ${
              isDarkMode
                ? 'border-white/[0.08] text-[#737373] bg-[#0A0A0C]'
                : 'border-black/[0.05] text-[#A3A39E] bg-[#F6F5F1]'
            }`}
          >
            <p className="font-semibold text-sm tracking-tight text-inherit">BhashaMitra</p>
            <p className="text-xs">"AI-powered BhashaMitra learning."</p>
            <p className="text-[11px] pt-2 opacity-60">© 2026 BhashaMitra. All rights reserved.</p>
          </footer>

        </motion.main>
      </AnimatePresence>
    </div>
  )
}
