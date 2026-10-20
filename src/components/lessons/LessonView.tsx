import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Clock, FileText, Download, Sparkles, CheckCircle2, Globe, Volume2, VolumeX, AlertCircle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { Lesson } from '../../types/lesson'

interface LessonViewProps {
  lesson: Lesson
  subjectName: string
  subjectNativeName?: string
  onBack: () => void
}

export function LessonView({ lesson, subjectName, subjectNativeName, onBack }: LessonViewProps) {
  const { isDarkMode } = useAppStore()

  // Language selection state: English ('en') by default
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'kru'>('en')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsNotice, setTtsNotice] = useState<string | null>(null)

  // Derive active content based on selected language
  const activeTranslation = useMemo(() => {
    if (selectedLanguage === 'kru') {
      const kruData = lesson.translations?.kru
      if (kruData && kruData.title && kruData.content) {
        return {
          title: kruData.title,
          description: kruData.description || '',
          content: kruData.content,
          isAvailable: true,
        }
      }
      return {
        title: lesson.translations?.en?.title || lesson.title,
        description: lesson.translations?.en?.description || lesson.description,
        content: lesson.translations?.en?.content || lesson.content,
        isAvailable: false,
      }
    }

    // Default: English
    return {
      title: lesson.translations?.en?.title || lesson.title,
      description: lesson.translations?.en?.description || lesson.description,
      content: lesson.translations?.en?.content || lesson.content,
      isAvailable: true,
    }
  }, [selectedLanguage, lesson])

  // Handle Text-To-Speech
  const handleToggleTTS = () => {
    if (!('speechSynthesis' in window)) {
      setTtsNotice('Text-to-Speech is not supported in your browser.')
      setTimeout(() => setTtsNotice(null), 4000)
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    if (selectedLanguage === 'kru') {
      const voices = window.speechSynthesis.getVoices()
      const kruVoice = voices.find(
        (v) => v.lang.toLowerCase().includes('kru') || v.name.toLowerCase().includes('kurukh')
      )
      if (!kruVoice) {
        setTtsNotice('Kurukh speech synthesis is not supported on your browser/device. Displaying written Kurukh text.')
        setTimeout(() => setTtsNotice(null), 4000)
        return
      }
    }

    const textToSpeak = `${activeTranslation.title}. ${activeTranslation.description}. ${activeTranslation.content.replace(/[#*-]/g, '')}`
    const utterance = new SpeechSynthesisUtterance(textToSpeak)

    if (selectedLanguage === 'en') {
      const voices = window.speechSynthesis.getVoices()
      const enVoice = voices.find((v) => v.lang.startsWith('en'))
      if (enVoice) utterance.voice = enVoice
    }

    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  // Format content paragraphs and headers nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed) return <div key={idx} className="h-3" />

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-display text-lg font-bold mt-5 mb-2 text-[#171717] dark:text-[#F5F5F5]">
            {trimmed.replace('### ', '')}
          </h3>
        )
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="font-display text-xl font-extrabold mt-6 mb-3 text-[#171717] dark:text-[#F5F5F5]">
            {trimmed.replace('## ', '')}
          </h2>
        )
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const itemText = trimmed.substring(2)
        const parts = itemText.split('**')
        return (
          <li key={idx} className="flex items-start gap-2.5 my-1.5 ml-1 text-sm text-[#404040] dark:text-[#D4D4D4] leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 shrink-0" />
            <span>
              {parts.map((part, pIdx) =>
                pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-[#171717] dark:text-white">{part}</strong> : part
              )}
            </span>
          </li>
        )
      }

      // Check for bold text formatting like **text**
      const parts = trimmed.split('**')
      return (
        <p key={idx} className="text-sm leading-relaxed text-[#404040] dark:text-[#D4D4D4] my-2">
          {parts.map((part, pIdx) =>
            pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-[#171717] dark:text-white">{part}</strong> : part
          )}
        </p>
      )
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full p-6 sm:p-8 rounded-3xl border text-left theme-transition shadow-xl ${
        isDarkMode
          ? 'bg-[#121216] border-white/[0.08] text-[#F5F5F5]'
          : 'bg-white border-black/[0.08] text-[#171717]'
      }`}
    >
      {/* ── Top Bar: Back Button, Language Selector & Subject Info ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-black/[0.06] dark:border-white/[0.08]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-semibold border theme-transition transition-all duration-200 hover:-translate-x-0.5 cursor-pointer bg-black/[0.02] hover:bg-black/[0.05] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border-black/[0.08] dark:border-white/[0.08] text-[#171717] dark:text-[#F5F5F5] shrink-0"
        >
          <ArrowLeft size={16} />
          <span>Back to {subjectName}</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* ── Language Selector Control ── */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] shadow-xs">
            <Globe size={14} className="text-cyan-500 shrink-0" />
            <span className="text-xs font-medium text-[#6F6F6A] dark:text-[#A3A39E]">
              Language:
            </span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'kru')}
              className="bg-transparent text-xs font-bold text-[#171717] dark:text-white outline-none cursor-pointer focus:ring-0"
              aria-label="Select lesson language"
            >
              <option value="en" className="dark:bg-[#141418] text-black dark:text-white font-medium">
                English
              </option>
              <option value="kru" className="dark:bg-[#141418] text-black dark:text-white font-medium">
                Kurukh
              </option>
            </select>
          </div>

          {/* ── TTS Audio Button ── */}
          <button
            onClick={handleToggleTTS}
            title={isSpeaking ? 'Stop Audio' : 'Listen to Lesson Audio'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-cyan-500 text-white border-cyan-400 animate-pulse'
                : 'bg-black/[0.02] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] border-black/[0.08] dark:border-white/[0.08] text-[#171717] dark:text-[#F5F5F5]'
            }`}
          >
            {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan-500" />}
            <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
          </button>

          {/* Subject Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <BookOpen size={12} />
            {subjectName} {subjectNativeName ? `(${subjectNativeName})` : ''}
          </span>

          {lesson.duration && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[10px] font-mono text-[#A3A39E] bg-black/[0.03] dark:bg-white/[0.04]">
              <Clock size={12} />
              {lesson.duration}
            </span>
          )}
        </div>
      </div>

      {/* ── Graceful TTS Notice ── */}
      {ttsNotice && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-medium flex items-center gap-2"
        >
          <AlertCircle size={15} className="shrink-0" />
          <span>{ttsNotice}</span>
        </motion.div>
      )}

      {/* ── Lesson Title Header & Content Body ── */}
      {selectedLanguage === 'kru' && !activeTranslation.isAvailable ? (
        /* Missing Kurukh Translation Fallback Container */
        <div className="py-10 px-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300 text-center space-y-3 my-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 font-bold text-xl">
            <Globe size={24} />
          </div>
          <h3 className="font-display text-base sm:text-lg font-bold">
            Kurukh translation is not available for this lesson yet.
          </h3>
          <p className="text-xs sm:text-sm text-amber-700/80 dark:text-amber-400/90 max-w-md mx-auto">
            Please check back later.
          </p>
        </div>
      ) : (
        /* Active Lesson Content */
        <>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl text-xs font-mono font-extrabold bg-cyan-500 text-white shadow-xs">
                Lesson {lesson.lessonNumber}
              </span>
              <span className="text-xs font-mono text-[#A3A39E]">
                MODULE {lesson.lessonNumber.padStart(2, '0')} · {selectedLanguage === 'kru' ? 'Kurukh' : 'English'}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-white">
              "{activeTranslation.title}"
            </h1>

            {activeTranslation.description && (
              <div className="p-4 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.05] dark:border-white/[0.06]">
                <p className="text-xs font-semibold text-[#737373] dark:text-[#A3A39E] uppercase tracking-wider mb-1">
                  Description ({selectedLanguage === 'kru' ? 'Kurukh' : 'English'})
                </p>
                <p className="text-sm font-medium text-[#404040] dark:text-[#D4D4D4] leading-relaxed">
                  {activeTranslation.description}
                </p>
              </div>
            )}
          </div>

          {/* ── Main Lesson Body Content ── */}
          <div className="py-4 border-t border-b border-black/[0.06] dark:border-white/[0.08] my-6 space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-cyan-500" />
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#A3A39E]">
                Lesson Content ({selectedLanguage === 'kru' ? 'Kurukh' : 'English'})
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-left">
              {renderFormattedContent(activeTranslation.content)}
            </div>
          </div>
        </>
      )}

      {/* ── Optional Material / Resources Attachment ── */}
      {lesson.material && (
        <div className="p-4 rounded-2xl border bg-cyan-500/5 dark:bg-cyan-500/10 border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500 text-white shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-[#171717] dark:text-white">
                Lesson Material & Resources
              </p>
              <p className="text-xs text-[#6F6F6A] dark:text-[#A3A39E]">
                {lesson.material}
              </p>
            </div>
          </div>
          <button
            onClick={() => alert(`Downloading resource: ${lesson.material}`)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-white hover:bg-cyan-600 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
          >
            <Download size={14} />
            <span>Resource Info</span>
          </button>
        </div>
      )}

      {/* ── Footer Navigation ── */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-[#171717] dark:bg-white text-white dark:text-[#171717] hover:opacity-90 transition-opacity cursor-pointer shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to {subjectName}</span>
        </button>

        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={14} />
          Module Verified & Ready ({selectedLanguage.toUpperCase()})
        </span>
      </div>
    </motion.div>
  )
}

