/**
 * Translation service helper supporting automatic vernacular translation for Indic languages.
 * Integrates with dedicated Kurukh Translation Engine and MyMemory API.
 */

import { translateToKurukh } from './kurukhTranslator'

export interface TranslationParams {
  text: string
  sourceLanguageId?: string
  targetLanguageId: string
}

// Supported language codes mapping for standard translation API
const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: 'en',
  hi: 'hi',
  mr: 'mr',
  bn: 'bn',
  ta: 'ta',
  te: 'te',
  kn: 'kn',
  ml: 'ml',
  gu: 'gu',
  pa: 'pa',
  or: 'or',
}

// Dictionary for offline / instant phrase translation fallback
const PHRASE_DICTIONARY: Record<string, Record<string, string>> = {
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
  },
  mr: {
    'good morning': 'शुभ प्रभात',
    'hello': 'नमस्कार',
    'how are you?': 'तुम्ही कसे आहात?',
    'how are you': 'तुम्ही कसे आहात?',
    'thank you': 'धन्यवाद',
    'welcome': 'सुस्वागतम्',
  },
  bn: {
    'good morning': 'সুপ্রভাত',
    'hello': 'নমস্কার',
    'how are you?': 'আপনি কেমন আছেন?',
    'how are you': 'আপনি কেমন আছেন?',
    'thank you': 'ধন্যবাদ',
  },
  ta: {
    'good morning': 'காலை வணக்கம்',
    'hello': 'வணக்கம்',
    'how are you?': 'நீங்கள் எப்படி இருக்கிறீர்கள்?',
    'how are you': 'நீங்கள் எப்படி இருக்கிறீர்கள்?',
    'thank you': 'நன்றி',
  },
  te: {
    'good morning': 'శుభోదయం',
    'hello': 'నమస్కారం',
    'how are you?': 'మీరు ఎలా ఉన్నారు?',
    'how are you': 'మీరు ఎలా ఉన్నారు?',
    'thank you': 'ధన్యవాదాలు',
  },
  kn: {
    'good morning': 'ಶುಭೋದಯ',
    'hello': 'ನಮಸ್ಕಾರ',
    'how are you?': 'ಹೇಗಿದ್ದೀರ?',
    'how are you': 'ಹೇಗಿದ್ದೀರ?',
    'thank you': 'ಧನ್ಯವಾದಗಳು',
  },
  ml: {
    'good morning': 'സുപ്രഭാതം',
    'hello': 'നമസ്കാരം',
    'how are you?': 'സുഖമാണോ?',
    'how are you': 'സുഖമാണോ?',
    'thank you': 'നന്ദി',
  },
  gu: {
    'good morning': 'શુભ સવાર',
    'hello': 'નમસ્તે',
    'how are you?': 'તમે કેમ છો?',
    'how are you': 'તમે કેમ છો?',
    'thank you': 'આભાર',
  },
  pa: {
    'good morning': 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ',
    'hello': 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ',
    'how are you?': 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
    'how are you': 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
    'thank you': 'ਧੰਨਵਾਦ',
  },
  or: {
    'good morning': 'ଶୁଭ ସକାଳ',
    'hello': 'ନମସ୍କାର',
    'how are you?': 'ଆପଣ କେମିତି ଅଛନ୍ତି?',
    'how are you': 'ଆପଣ କେମିତି ଅଛନ୍ତି?',
    'thank you': 'ଧନ୍ୟବାଦ',
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

  const cleanInput = text.trim().toLowerCase()
  const targetKey = targetLanguageId.toLowerCase()
  const sourceKey = (sourceLanguageId || 'auto').toLowerCase()

  // 1. Route Kurukh target language directly to Dedicated Kurukh Engine
  if (targetKey === 'kru') {
    return translateToKurukh({ text, sourceLanguageId })
  }

  // 2. If source and target are the same language, return original text directly
  if (sourceKey === targetKey) {
    return text.trim()
  }

  // 3. Check direct phrase dictionary match first (instant offline response)
  if (PHRASE_DICTIONARY[targetKey] && PHRASE_DICTIONARY[targetKey][cleanInput]) {
    return PHRASE_DICTIONARY[targetKey][cleanInput]
  }

  // 4. Resolve API language codes
  const sourceCode = LANGUAGE_CODE_MAP[sourceKey] || 'autodetect'
  const targetCode = LANGUAGE_CODE_MAP[targetKey]

  if (!targetCode) {
    return 'This language is not currently supported.'
  }

  // 5. Fetch translation from MyMemory API
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text.trim()
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
        if (result && result.toUpperCase() !== 'NULL') {
          return result
        }
      }
    }
  } catch (err) {
    console.warn('Network translation request failed or timed out:', err)
  }

  // 6. Fallback if network request is unavailable
  return 'Translation temporarily unavailable.'
}
