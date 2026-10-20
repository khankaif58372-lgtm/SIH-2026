/**
 * translator.ts
 *
 * Central translation service for BhashaMitra (Unveishna 2026).
 * Integrates:
 * 1. Dedicated Kurukh Translation Engine (kurukhTranslator.ts)
 * 2. Curated Tribal Dictionaries & Phrasebooks (tribalDictionaries.ts) for:
 *    Santali, Bhili, Bhilodi, Gondi, Bodo, Khasi, Kokborok, Kui
 * 3. MyMemory API & dictionaries for English, Hindi, and Assamese.
 * 4. Honest linguistic status reporting — never spoof tribal translations.
 */

import { translateToKurukh } from './kurukhTranslator'
import { lookupTribalPhrase, getTribalHonestStatus } from './tribalDictionaries'
import { getLanguageById, isTribalLanguage } from '../data/languages'

export interface TranslationParams {
  text: string
  sourceLanguageId?: string
  targetLanguageId: string
}

// Supported language codes mapping for standard external NMT translation API
const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  as: 'as',
}

// Universal fallback phrases for Hindi & English
const GENERAL_DICTIONARY: Record<string, Record<string, string>> = {
  hi: {
    'good morning': 'सुप्रभात',
    'good afternoon': 'शुभ दोपहर',
    'good evening': 'शुभ संध्या',
    'hello': 'नमस्ते',
    'hi': 'नमस्ते',
    'how are you?': 'आप कैसे हैं?',
    'how are you': 'आप कैसे हैं?',
    'what is your name?': 'आपका नाम क्या है?',
    'what is your name': 'आपका नाम क्या है?',
    'thank you': 'धन्यवाद',
    'welcome': 'स्वागत है',
    'yes': 'हाँ',
    'no': 'नहीं',
    'learning': 'सीखना',
    'education': 'शिक्षा',
    'science': 'विज्ञान',
    'mathematics': 'गणित',
    'school': 'विद्यालय / स्कूल',
    'teacher': 'शिक्षक / अध्यापक',
    'student': 'विद्यार्थी / छात्र',
    'book': 'पुस्तक / किताब',
  },
  en: {
    'नमस्ते': 'Hello',
    'सुप्रभात': 'Good morning',
    'धन्यवाद': 'Thank you',
    'हाँ': 'Yes',
    'नहीं': 'No',
    'शिक्षा': 'Education',
    'सीखना': 'Learning',
    'विज्ञान': 'Science',
    'गणित': 'Mathematics',
    'विद्यालय': 'School',
    'शिक्षक': 'Teacher',
    'विद्यार्थी': 'Student',
    'किताब': 'Book',
  },
}

/**
 * Automatically translate text using the specified source and target language parameters.
 */
export async function translateTextAuto({
  text,
  sourceLanguageId = 'auto',
  targetLanguageId,
}: TranslationParams): Promise<string> {
  if (!text || !text.trim()) return ''

  const cleanInput = text.trim()
  const lowerInput = cleanInput.toLowerCase()
  const targetKey = targetLanguageId.toLowerCase()
  const sourceKey = (sourceLanguageId || 'auto').toLowerCase()
  const targetLangObj = getLanguageById(targetKey)

  // 1. Direct identity: If source and target are the same language, return text
  if (sourceKey === targetKey) {
    return cleanInput
  }

  // 2. Dedicated Kurukh Translation Engine (Grammar rule + vocabulary synthesizer)
  if (targetKey === 'kru') {
    return translateToKurukh({ text: cleanInput, sourceLanguageId })
  }

  // 3. Verified Curated Tribal Phrasebook & Lexical Dictionary lookup
  const tribalMatch = lookupTribalPhrase(cleanInput, targetKey)
  if (tribalMatch) {
    return tribalMatch
  }

  // 4. Standard General Dictionary Match (Instant offline response)
  if (GENERAL_DICTIONARY[targetKey] && GENERAL_DICTIONARY[targetKey][lowerInput]) {
    return GENERAL_DICTIONARY[targetKey][lowerInput]
  }

  // 5. If Target is a Tribal Language and not matched in verified corpus:
  // Strictly avoid returning spoofed Hindi or English text. Return honest status!
  if (isTribalLanguage(targetKey)) {
    const langName = targetLangObj?.name || 'Tribal'
    return getTribalHonestStatus(langName, cleanInput)
  }

  // 6. External Translation API (for English, Hindi, Assamese)
  const sourceCode = LANGUAGE_CODE_MAP[sourceKey] || (sourceKey === 'en' ? 'en' : 'autodetect')
  const targetCode = LANGUAGE_CODE_MAP[targetKey]

  if (!targetCode) {
    return `[${targetLangObj?.name || targetKey}]: Translation model in development for this language.`
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      cleanInput
    )}&langpair=${sourceCode}|${targetCode}`

    const res = await fetch(url, { signal: controller.signal })
    clearTimeout(timeoutId)

    if (res.ok) {
      const data = await res.json()
      if (
        data &&
        data.responseData &&
        data.responseData.translatedText &&
        typeof data.responseData.translatedText === 'string'
      ) {
        const result = data.responseData.translatedText.trim()
        if (result && result.toUpperCase() !== 'NULL' && result !== cleanInput) {
          return result
        }
      }
    }
  } catch (err) {
    console.warn('Network translation request failed or timed out:', err)
  }

  // Fallback for network API
  return `[${targetLangObj?.name || 'Translation'}]: Service temporarily offline. Please check connection.`
}
