import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Mic, MicOff, Volume2, VolumeX, ArrowLeft, RefreshCw, Languages, Sparkles, Send, Trash2, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../store/useAppStore'
import { LANGUAGES } from '../../data/languages'
import { speechService } from '../../services/speech'
import { translateTextAuto } from '../../services/translator'
import { LandingCanvas } from '../../components/cinematic/LandingCanvas'
import { FeedbackButtons } from '../../components/common/FeedbackButtons'

interface ConversationItem {
  id: string
  originalText: string
  translatedText: string
  targetLangName: string
  targetLangNative: string
  timestamp: string
}

// Locale codes mapping for Web Speech API recognition
const SPEECH_LOCALES: Record<string, string> = {
  auto: 'en-US',
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  ml: 'ml-IN',
  gu: 'gu-IN',
  pa: 'pa-IN',
  or: 'or-IN',
  kru: 'hi-IN',
}

export function MonitoringPage() {
  const navigate = useNavigate()
  const { isDarkMode } = useAppStore()

  // Language selection state
  const [sourceLangId, setSourceLangId] = useState('auto')
  const [targetLangId, setTargetLangId] = useState('hi')

  // Voice Input (Speech-to-Text) - AUTOMATIC
  const [isMicActive, setIsMicActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [micError, setMicError] = useState<string | null>(null)

  // Text-to-Speech (TTS) - USER CONTROLLED TOGGLE (Default: OFF)
  const [ttsEnabled, setTtsEnabled] = useState(false)

  // Live Conversation Stream
  const [conversation, setConversation] = useState<ConversationItem[]>([])
  const [manualInput, setManualInput] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)

  const historyEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const isComponentMounted = useRef(true)

  // Target language details
  const targetLanguageObj = LANGUAGES.find((l) => l.id === targetLangId) || LANGUAGES[1] // Default Hindi

  // Auto-scroll stream to bottom
  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation, isTranslating])

  // Translate detected text automatically
  const processTranslation = useCallback(
    async (text: string) => {
      const cleanText = text.trim()
      if (!cleanText) return

      setIsTranslating(true)
      try {
        const translated = await translateTextAuto({
          text: cleanText,
          sourceLanguageId: sourceLangId,
          targetLanguageId: targetLangId,
        })

        const newItem: ConversationItem = {
          id: Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
          originalText: cleanText,
          translatedText: translated,
          targetLangName: targetLanguageObj.name,
          targetLangNative: targetLanguageObj.nativeName,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }

        setConversation((prev) => [...prev, newItem])

        // Audio TTS only when toggle is ON and translation is valid
        if (
          ttsEnabled &&
          translated &&
          !translated.includes('unavailable') &&
          !translated.includes('supported')
        ) {
          speechService.speak(translated, targetLanguageObj.locale || 'hi-IN')
        }
      } catch (err) {
        console.error('Translation error:', err)
      } finally {
        setIsTranslating(false)
      }
    },
    [sourceLangId, targetLangId, targetLanguageObj, ttsEnabled]
  )

  // Re-translate existing conversation stream when target or source language changes
  useEffect(() => {
    if (conversation.length === 0) return

    let isMounted = true
    const targetObj = LANGUAGES.find((l) => l.id === targetLangId) || LANGUAGES[1]

    const retranslateStream = async () => {
      setIsTranslating(true)
      try {
        const updated = await Promise.all(
          conversation.map(async (item) => {
            const newTranslated = await translateTextAuto({
              text: item.originalText,
              sourceLanguageId: sourceLangId,
              targetLanguageId: targetLangId,
            })
            return {
              ...item,
              translatedText: newTranslated,
              targetLangName: targetObj.name,
              targetLangNative: targetObj.nativeName,
            }
          })
        )

        if (isMounted) {
          setConversation(updated)
          // Speak latest translated item if TTS is enabled
          if (ttsEnabled && updated.length > 0) {
            const lastItem = updated[updated.length - 1]
            if (
              lastItem.translatedText &&
              !lastItem.translatedText.includes('unavailable') &&
              !lastItem.translatedText.includes('supported')
            ) {
              speechService.speak(lastItem.translatedText, targetObj.locale || 'hi-IN')
            }
          }
        }
      } catch (err) {
        console.error('Error re-translating stream:', err)
      } finally {
        if (isMounted) setIsTranslating(false)
      }
    }

    retranslateStream()

    return () => {
      isMounted = false
    }
  }, [targetLangId, sourceLangId])

  // Safe Speech Recognition Initializer
  const startSpeechRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMicError('Voice input is not supported in this browser. You can type text below.')
      setIsMicActive(false)
      setIsListening(false)
      return
    }

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null
          recognitionRef.current.stop()
        } catch (e) {}
      }

      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = false
      recognition.lang = SPEECH_LOCALES[sourceLangId] || 'en-US'

      recognition.onstart = () => {
        if (isComponentMounted.current) {
          setIsMicActive(true)
          setIsListening(true)
          setMicError(null)
        }
      }

      recognition.onresult = (event: any) => {
        if (!isComponentMounted.current) return
        const lastIndex = event.results.length - 1
        const transcript = event.results[lastIndex][0].transcript
        if (transcript && transcript.trim()) {
          processTranslation(transcript)
        }
      }

      recognition.onerror = (event: any) => {
        if (!isComponentMounted.current) return
        console.warn('Speech recognition error:', event.error)

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
          setMicError('Microphone access is required for voice input.')
          setIsMicActive(false)
          setIsListening(false)
        }
      }

      recognition.onend = () => {
        if (!isComponentMounted.current) return
        setIsListening(false)

        if (isMicActive && !micError) {
          setTimeout(() => {
            if (isComponentMounted.current && isMicActive) {
              try {
                recognition.start()
              } catch (e) {}
            }
          }, 300)
        }
      }

      recognition.start()
      recognitionRef.current = recognition
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err)
      setMicError('Microphone access is required for voice input.')
      setIsMicActive(false)
      setIsListening(false)
    }
  }, [processTranslation, isMicActive, micError, sourceLangId])

  // Stop speech recognition safely
  const stopSpeechRecognition = useCallback(() => {
    setIsMicActive(false)
    setIsListening(false)
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
      } catch (e) {}
    }
  }, [])

  // Auto-start on mount safely
  useEffect(() => {
    isComponentMounted.current = true
    startSpeechRecognition()

    return () => {
      isComponentMounted.current = false
      stopSpeechRecognition()
      speechService.stopSpeaking()
    }
  }, [])

  // Handle manual fallback submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualInput.trim()) return
    processTranslation(manualInput)
    setManualInput('')
  }

  // Toggle TTS mode
  const handleToggleTTS = () => {
    const nextState = !ttsEnabled
    setTtsEnabled(nextState)
    if (!nextState) {
      speechService.stopSpeaking()
    }
  }

  return (
    <div
      className={`relative min-h-screen w-full flex flex-col overflow-x-hidden theme-transition ${
        isDarkMode ? 'bg-[#0A0A0C] text-[#F5F5F5]' : 'bg-[#F6F5F1] text-[#171717]'
      }`}
    >
      {/* ── Background Canvas ── */}
      <LandingCanvas />

      {/* ── Background Aura ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full blur-[150px] pointer-events-none"
          style={{
            background: isDarkMode
              ? 'radial-gradient(ellipse at center, rgba(16,185,129,0.08) 0%, rgba(6,182,212,0.04) 50%, transparent 80%)'
              : 'radial-gradient(ellipse at center, rgba(16,185,129,0.12) 0%, rgba(241,241,238,0.45) 45%, rgba(246,245,241,0) 80%)',
          }}
        />
      </div>

      {/* ── Sticky Top Bar ── */}
      <header
        className={`sticky top-0 z-40 px-6 sm:px-12 py-4 border-b backdrop-blur-xl theme-transition ${
          isDarkMode ? 'bg-[#0A0A0C]/90 border-white/[0.08]' : 'bg-white/90 border-black/[0.08]'
        }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2.5 rounded-2xl border theme-transition hover:bg-black/[0.04] dark:hover:bg-white/[0.08] cursor-pointer bg-white/80 dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-[#171717] dark:text-white"
              title="Back to Landing Page"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 block">
                REAL-TIME COMMUNICATIONS
              </span>
              <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#171717] dark:text-white">
                MONITORING SCREEN
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Voice Input Badge */}
            <button
              onClick={isMicActive ? stopSpeechRecognition : startSpeechRecognition}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
                isMicActive
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300'
              }`}
              title={isMicActive ? 'Voice Input Active' : 'Click to Activate Microphone'}
            >
              {isMicActive ? <Mic size={14} className="animate-pulse text-emerald-500" /> : <MicOff size={14} />}
              <span className="hidden sm:inline">Voice Input:</span>
              <span className="uppercase font-mono text-[11px] font-bold">{isMicActive ? 'ACTIVE' : 'STANDBY'}</span>
            </button>

            {/* Text to Speech Toggle */}
            <button
              onClick={handleToggleTTS}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
                ttsEnabled
                  ? 'bg-violet-600 border-violet-600 text-white shadow-violet-500/20'
                  : isDarkMode
                  ? 'bg-white/[0.04] border-white/[0.08] text-[#A3A39E] hover:text-white'
                  : 'bg-white border-black/[0.08] text-[#6F6F6A] hover:text-[#171717]'
              }`}
              title="Toggle Text to Speech"
            >
              {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden sm:inline">Text to Speech:</span>
              <span className="font-mono text-[11px] uppercase font-bold">{ttsEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Area ── */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-6 text-left">
        
        {/* ── Ribbon ── */}
        <div
          className={`p-5 rounded-3xl border theme-transition flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
            isDarkMode ? 'bg-[#141418]/95 border-white/[0.08]' : 'bg-white border-black/[0.08]'
          }`}
        >
          {/* Source Language Selection */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#6F6F6A] dark:text-[#A3A39E] uppercase tracking-wider shrink-0">
              Source Language:
            </span>
            <select
              value={sourceLangId}
              onChange={(e) => setSourceLangId(e.target.value)}
              className={`w-full sm:w-48 px-3.5 py-2 rounded-2xl border text-xs font-semibold outline-none cursor-pointer theme-transition ${
                isDarkMode
                  ? 'bg-[#1C1C22] border-white/[0.1] text-white focus:border-emerald-400'
                  : 'bg-white border-black/[0.1] text-[#171717] focus:border-emerald-500'
              }`}
            >
              <option value="auto" className="dark:bg-[#141418] text-black dark:text-white">
                Auto Detect
              </option>
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="dark:bg-[#141418] text-black dark:text-white">
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div className="hidden sm:block text-slate-400 font-bold">→</div>

          {/* Target Language Selection */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-[#6F6F6A] dark:text-[#A3A39E] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Languages size={14} className="text-cyan-500" />
              Target Language:
            </span>
            <select
              value={targetLangId}
              onChange={(e) => setTargetLangId(e.target.value)}
              className={`w-full sm:w-52 px-3.5 py-2 rounded-2xl border text-xs font-semibold outline-none cursor-pointer theme-transition ${
                isDarkMode
                  ? 'bg-[#1C1C22] border-white/[0.1] text-white focus:border-cyan-400'
                  : 'bg-white border-black/[0.1] text-[#171717] focus:border-cyan-500'
              }`}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="dark:bg-[#141418] text-black dark:text-white">
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Mic Permission Prompt ── */}
        {micError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{micError}</span>
            </div>
            <button
              onClick={startSpeechRecognition}
              className="px-3.5 py-1.5 rounded-xl font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw size={12} />
              <span>Enable Microphone Access</span>
            </button>
          </motion.div>
        )}

        {/* ── Live Stream Box ── */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border text-left theme-transition shadow-lg flex flex-col ${
            isDarkMode ? 'bg-[#141418]/95 border-white/[0.08]' : 'bg-white border-black/[0.08]'
          }`}
        >
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-500" />
              <h2 className="font-display text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-white">
                Live Conversation Stream
              </h2>
            </div>
            {conversation.length > 0 && (
              <button
                onClick={() => setConversation([])}
                className="text-xs text-[#A3A39E] hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 size={12} />
                <span>Clear History</span>
              </button>
            )}
          </div>

          <div className="min-h-[260px] max-h-[420px] overflow-y-auto space-y-4 pr-1.5 custom-scrollbar">
            {conversation.length === 0 ? (
              <div className="py-16 text-center space-y-3 text-[#A3A39E]">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Mic size={20} className={isListening ? 'animate-bounce' : ''} />
                </div>
                <p className="font-display text-sm font-bold text-[#171717] dark:text-[#F5F5F5]">
                  Voice Input Active · Listening for Speech...
                </p>
                <p className="text-xs max-w-md mx-auto text-[#6F6F6A] dark:text-[#A3A39E]">
                  Speak into your microphone. Speech will be transcribed and translated automatically into {targetLanguageObj.name}.
                </p>
              </div>
            ) : (
              conversation.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-2.5 ${
                    isDarkMode
                      ? 'bg-white/[0.03] border-white/[0.06]'
                      : 'bg-[#FAFAF8] border-black/[0.06] shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-[#A3A39E]">
                    <span className="font-semibold text-cyan-600 dark:text-cyan-400">SPEECH DETECTED</span>
                    <span className="font-mono">{item.timestamp}</span>
                  </div>

                  <p className="text-sm font-semibold text-[#171717] dark:text-white">
                    "{item.originalText}"
                  </p>

                  <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      <span>AUTOMATIC TRANSLATION ({item.targetLangName})</span>
                      <span>{item.targetLangNative}</span>
                    </div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 leading-relaxed">
                      {item.translatedText}
                    </p>

                    {/* Feedback Buttons */}
                    <FeedbackButtons responseId={item.id} context="monitoring" />
                  </div>
                </motion.div>
              ))
            )}

            {isTranslating && (
              <div className="p-4 rounded-2xl border border-dashed border-emerald-500/30 bg-emerald-500/5 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <RefreshCw size={14} className="animate-spin text-emerald-500" />
                <span>Translating speech automatically...</span>
              </div>
            )}
            <div ref={historyEndRef} />
          </div>
        </div>

        {/* ── Input Box Fallback ── */}
        <form onSubmit={handleManualSubmit} className="relative w-full">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Type a sentence or question here to test automatic translation..."
            className={`w-full pl-4 pr-12 py-3.5 rounded-2xl text-xs font-medium border theme-transition outline-none ${
              isDarkMode
                ? 'bg-[#141418] focus:bg-[#1C1C22] border-white/[0.08] focus:border-emerald-400/40 text-white placeholder-[#737373]'
                : 'bg-white focus:bg-white border-black/[0.08] focus:border-emerald-500/40 text-[#171717] placeholder-[#9E9E9E] shadow-subtle'
            }`}
          />
          <button
            type="submit"
            disabled={!manualInput.trim() || isTranslating}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-emerald-500 text-white disabled:opacity-40 hover:bg-emerald-600 transition-colors cursor-pointer"
            title="Translate Text"
          >
            <Send size={14} />
          </button>
        </form>

        {/* ── Status Bar ── */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#6F6F6A] dark:text-[#A3A39E] px-2 font-medium">
          <span>🎙 Voice Input = AUTOMATIC</span>
          <span>🌐 Translation = AUTOMATIC</span>
          <span>🔊 Text to Speech = {ttsEnabled ? 'ON' : 'OFF'}</span>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer
        className={`w-full py-6 border-t text-center text-xs space-y-1 theme-transition mt-auto ${
          isDarkMode
            ? 'border-white/[0.08] text-[#737373] bg-[#0A0A0C]/90'
            : 'border-black/[0.05] text-[#A3A39E] bg-[#F6F5F1]/90'
        }`}
      >
        <p className="font-semibold text-xs text-inherit">BhashaMitra · Real-Time Monitoring Workspace</p>
        <p className="text-[11px] opacity-60">"AI-powered real-time speech monitoring." · © 2026</p>
      </footer>
    </div>
  )
}
