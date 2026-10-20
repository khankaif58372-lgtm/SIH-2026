/**
 * Speech Service Abstraction for BhashaMitra (Unveishna 2026).
 * Safely inspects native device voices for regional and tribal locales.
 * Never plays mismatched audio for tribal languages lacking native TTS engines.
 */

export interface SpeechService {
  speak(text: string, locale?: string): Promise<{ success: boolean; hasNativeVoice: boolean }>
  stopSpeaking(): void
  hasVoiceForLocale(locale: string): boolean
  listen(onResult: (text: string) => void, onError: (err: any) => void, locale?: string): () => void
}

export const speechService: SpeechService = {
  hasVoiceForLocale: (locale: string): boolean => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false
    const voices = window.speechSynthesis.getVoices()
    const langPrefix = locale.toLowerCase().split('-')[0]
    return voices.some(
      (v) =>
        v.lang.toLowerCase().startsWith(langPrefix) ||
        v.name.toLowerCase().includes(langPrefix)
    )
  },

  speak: async (text: string, locale: string = 'hi-IN'): Promise<{ success: boolean; hasNativeVoice: boolean }> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('TTS not supported in this browser environment')
        resolve({ success: false, hasNativeVoice: false })
        return
      }

      const voices = window.speechSynthesis.getVoices()
      const langPrefix = locale.toLowerCase().split('-')[0]
      const matchingVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(langPrefix) ||
          v.name.toLowerCase().includes(langPrefix)
      )

      // Guard: If it's a tribal/regional language and device has no matching acoustic voice,
      // strictly do not synthesize in an unnatural fallback voice.
      const isStandardVoice = locale.startsWith('hi') || locale.startsWith('en')
      if (!matchingVoice && !isStandardVoice) {
        console.warn(`No native voice installed for ${locale}. Suppressing audio synthesis.`)
        resolve({ success: false, hasNativeVoice: false })
        return
      }

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = locale
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }
      utterance.rate = 0.9

      utterance.onend = () => resolve({ success: true, hasNativeVoice: !!matchingVoice })
      utterance.onerror = () => resolve({ success: false, hasNativeVoice: !!matchingVoice })

      window.speechSynthesis.cancel() // Stop previous utterance
      window.speechSynthesis.speak(utterance)
    })
  },

  stopSpeaking: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  },

  listen: (onResult, onError, locale = 'en-US') => {
    if (typeof window === 'undefined') return () => {}
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      onError(new Error('Speech recognition not supported in this browser.'))
      return () => {}
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = locale

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      onResult(transcript)
    }

    recognition.onerror = (event: any) => {
      onError(event.error)
    }

    try {
      recognition.start()
    } catch (err) {
      onError(err)
    }

    return () => {
      try {
        recognition.stop()
      } catch (e) {}
    }
  },
}
