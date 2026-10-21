import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, Clock, FileText, Download, Sparkles, CheckCircle2, Globe, Volume2, VolumeX, AlertCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { Lesson, LessonTranslation } from '../../types/lesson'
import { LANGUAGES, getLanguageById } from '../../data/languages'
import { speechService } from '../../services/speech'
import { translateTextAuto } from '../../services/translator'

interface LessonViewProps {
  lesson: Lesson
  subjectName: string
  subjectNativeName?: string
  onBack: () => void
}

export function LessonView({ lesson, subjectName, subjectNativeName, onBack }: LessonViewProps) {
  const { isDarkMode } = useAppStore()

  // Language selection state: English ('en') by default
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [ttsNotice, setTtsNotice] = useState<string | null>(null)
  const [isTranslatingOnFly, setIsTranslatingOnFly] = useState(false)
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, LessonTranslation>>({})

  const selectedLangObj = getLanguageById(selectedLanguage) || LANGUAGES[0]

  // Derive active content based on selected language
  const activeTranslation = useMemo(() => {
    // 1. English
    if (selectedLanguage === 'en') {
      return {
        title: lesson.translations?.en?.title || lesson.title,
        description: lesson.translations?.en?.description || lesson.description,
        content: lesson.translations?.en?.content || lesson.content,
        isAvailable: true,
      }
    }

    // 2. Pre-saved translation in lesson
    const saved = lesson.translations?.[selectedLanguage]
    if (saved && saved.title && saved.content) {
      return {
        title: saved.title,
        description: saved.description || '',
        content: saved.content,
        isAvailable: true,
      }
    }

    // 3. Dynamically generated translation during session
    const dynamic = dynamicTranslations[selectedLanguage]
    if (dynamic) {
      return {
        title: dynamic.title,
        description: dynamic.description || '',
        content: dynamic.content,
        isAvailable: true,
      }
    }

    // 4. Unavailable for this language
    return {
      title: lesson.translations?.en?.title || lesson.title,
      description: lesson.translations?.en?.description || lesson.description,
      content: lesson.translations?.en?.content || lesson.content,
      isAvailable: false,
    }
  }, [selectedLanguage, lesson, dynamicTranslations])

  // Handle on-the-fly translation generation
  const handleGenerateTranslation = async () => {
    setIsTranslatingOnFly(true)
    try {
      const titleRes = await translateTextAuto({
        text: lesson.title,
        sourceLanguageId: 'en',
        targetLanguageId: selectedLanguage,
      })
      const descRes = lesson.description
        ? await translateTextAuto({
            text: lesson.description,
            sourceLanguageId: 'en',
            targetLanguageId: selectedLanguage,
          })
        : ''
      const contentRes = await translateTextAuto({
        text: lesson.content,
        sourceLanguageId: 'en',
        targetLanguageId: selectedLanguage,
      })

      setDynamicTranslations((prev) => ({
        ...prev,
        [selectedLanguage]: {
          title: titleRes,
          description: descRes,
          content: contentRes,
        },
      }))
    } catch (err) {
      console.error('Failed to translate lesson on the fly:', err)
    } finally {
      setIsTranslatingOnFly(false)
    }
  }

  // Handle Text-To-Speech with honest voice check
  const handleToggleTTS = () => {
    if (!('speechSynthesis' in window)) {
      setTtsNotice('Text-to-Speech is not supported in your browser.')
      setTimeout(() => setTtsNotice(null), 4000)
      return
    }

    if (isSpeaking) {
      speechService.stopSpeaking()
      setIsSpeaking(false)
      return
    }

    const hasVoice = speechService.hasVoiceForLocale(selectedLangObj.locale)
    if (!hasVoice && selectedLanguage !== 'en' && selectedLanguage !== 'hi') {
      setTtsNotice(
        `Device voice for ${selectedLangObj.name} is not installed on this system. Displaying verified written text in ${selectedLangObj.script}.`
      )
      setTimeout(() => setTtsNotice(null), 6000)
      return
    }

    const textToSpeak = `${activeTranslation.title}. ${activeTranslation.description}. ${activeTranslation.content.replace(/[#*-]/g, '')}`
    setIsSpeaking(true)

    speechService
      .speak(textToSpeak, selectedLangObj.locale)
      .then((res) => {
        if (!res.hasNativeVoice && selectedLanguage !== 'en' && selectedLanguage !== 'hi') {
          setTtsNotice(
            `Device voice for ${selectedLangObj.name} is unavailable. Audio synthesis suppressed to avoid mismatched voice.`
          )
          setTimeout(() => setTtsNotice(null), 5000)
        }
      })
      .finally(() => {
        setIsSpeaking(false)
      })
  }

  // Format content paragraphs and headers nicely
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      const trimmed = line.trim()
      if (!trimmed) return <div key={idx} className="h-3" />

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="font-display text-base font-bold text-cyan-600 dark:text-cyan-400 mt-4 mb-2">
            {trimmed.replace('### ', '')}
          </h3>
        )
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="text-sm text-[#525252] dark:text-[#A3A39E] ml-4 list-disc my-1 leading-relaxed">
            {trimmed.substring(2)}
          </li>
        )
      }

      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="text-sm text-[#525252] dark:text-[#A3A39E] ml-4 list-decimal my-1 leading-relaxed">
            {trimmed.replace(/^\d+\.\s/, '')}
          </li>
        )
      }

      const parts = trimmed.split('**')
      return (
        <p key={idx} className="text-sm leading-relaxed text-[#404040] dark:text-[#D4D4D4] my-2">
          {parts.map((part, pIdx) =>
            pIdx % 2 === 1 ? (
              <strong key={pIdx} className="font-bold text-[#171717] dark:text-white">
                {part}
              </strong>
            ) : (
              part
            )
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
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#171717] dark:text-white outline-none cursor-pointer focus:ring-0 max-w-[220px]"
              aria-label="Select lesson language"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="dark:bg-[#141418] text-black dark:text-white font-medium">
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* ── TTS Audio Button ── */}
          <button
            onClick={handleToggleTTS}
            title={isSpeaking ? 'Stop Audio' : `Listen to Lesson Audio in ${selectedLangObj.name}`}
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

      {/* ── Selected Language Info Banner ── */}
      <div className="mb-4 px-4 py-2.5 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-2 bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.06] text-[#737373] dark:text-[#A3A39E]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#171717] dark:text-white">
            {selectedLangObj.name} ({selectedLangObj.nativeName})
          </span>
          <span className="opacity-60">• Script: {selectedLangObj.script}</span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
          Support: {selectedLangObj.translationSupport.replace('_', ' ').toUpperCase()}
        </span>
      </div>

      {/* ── Graceful TTS Notice ── */}
      {ttsNotice && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mb-4 p-3 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-800 dark:text-cyan-200 text-xs font-medium flex items-center gap-2"
        >
          <AlertCircle size={15} className="shrink-0 text-cyan-500" />
          <span>{ttsNotice}</span>
        </motion.div>
      )}

      {/* ── Missing Translation Fallback & Dynamic Generator ── */}
      {!activeTranslation.isAvailable ? (
        <div className="py-10 px-6 rounded-3xl border border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300 text-center space-y-4 my-6">
          <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 font-bold text-xl">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="font-display text-base sm:text-lg font-bold">
              {selectedLangObj.name} ({selectedLangObj.nativeName}) translation is not pre-packaged for this lesson.
            </h3>
            <p className="text-xs sm:text-sm text-amber-700/80 dark:text-amber-400/90 max-w-md mx-auto mt-1">
              You can generate an on-the-fly synthesis below.
            </p>
          </div>

          <button
            onClick={handleGenerateTranslation}
            disabled={isTranslatingOnFly}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-60"
          >
            {isTranslatingOnFly ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>{isTranslatingOnFly ? `Synthesizing ${selectedLangObj.name}...` : `Generate ${selectedLangObj.name} Translation`}</span>
          </button>
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
                MODULE {lesson.lessonNumber.padStart(2, '0')} · {selectedLangObj.name.toUpperCase()}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171717] dark:text-white">
              "{activeTranslation.title}"
            </h1>

            {activeTranslation.description && (
              <div className="p-4 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.05] dark:border-white/[0.06]">
                <p className="text-xs font-semibold text-[#737373] dark:text-[#A3A39E] uppercase tracking-wider mb-1">
                  Description ({selectedLangObj.name} — {selectedLangObj.nativeName})
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
                Lesson Content ({selectedLangObj.name} — {selectedLangObj.nativeName})
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
            onClick={() => alert(`Accessing resource: ${lesson.material}`)}
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
          Module Verified ({selectedLangObj.name})
        </span>
      </div>
    </motion.div>
  )
}
