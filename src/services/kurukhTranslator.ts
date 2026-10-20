/**
 * kurukhTranslator.ts
 *
 * Dedicated Kurukh (कुड़ुख़ / Oraon) translation service for BhashaMitra.
 * Dynamic sentence & question translator supporting English, Hindi, and auto-detected speech
 * into Kurukh Devanagari script (कुड़ुख़ कत्था).
 */

export interface KurukhTranslationParams {
  text: string
  sourceLanguageId?: string
}

// 1. Comprehensive Direct Phrase Dictionary (Exact match ONLY)
const KURUKH_EXACT_PHRASE_MAP: Record<string, string> = {
  // Greetings & Core Conversations
  'good morning': 'जय धरमे (कोडहा पाहना)',
  'good afternoon': 'शुभ दोपहर (जय धरमे)',
  'good evening': 'शुभ संध्या (जय धरमे)',
  'hello': 'जय धरमे',
  'hi': 'जय धरमे',
  'greetings': 'जय धरमे',
  'namaste': 'जय धरमे',
  'नमस्ते': 'जय धरमे',
  'राम राम': 'जय धरमे',
  'सुप्रभात': 'जय धरमे',

  // Questions & Conversational Sentences
  'how are you?': 'ईन्के एकासे रअइया?',
  'how are you': 'ईन्के एकासे रअइया?',
  'आप कैसे हैं?': 'ईन्के एकासे रअइया?',
  'तुम कैसे हो?': 'ईन्के एकासे रअइया?',
  'क्या हाल है?': 'ईन्के एकासे रअइया?',

  'what is your name?': 'निङ्गहै नाम इन्दिर तली?',
  'what is your name': 'निङ्गहै नाम इन्दिर तली?',
  'आपका नाम क्या है?': 'निङ्गहै नाम इन्दिर तली?',
  'तुम्हारा नाम क्या है?': 'निङ्गहै नाम इन्दिर तली?',

  'i am fine': 'एन् कोड़े रअअन्।',
  'i am good': 'एन् कोड़े रअअन्।',
  'मैं ठीक हूँ': 'एन् कोड़े रअअन्।',
  'मैं अच्छा हूँ': 'एन् कोड़े रअअन्।',

  'thank you': 'धन्वाजी (गोड लागिन)',
  'thank you very much': 'निङ्गहै बगघे धन्वाजी',
  'thanks': 'धन्वाजी',
  'धन्यवाद': 'धन्वाजी',
  'शुक्रिया': 'धन्वाजी',

  'welcome': 'स्वागत रअइ',
  'yes': 'हाँ (हअ-इ)',
  'no': 'मल्ला',
  'हाँ': 'हाँ (हअ-इ)',
  'नहीं': 'मल्ला',

  'where are you going?': 'इन्सान कालोया?',
  'where are you going': 'इन्सान कालोया?',
  'आप कहाँ जा रहे हैं?': 'इन्सान कालोया?',

  'what are you doing?': 'इन्दिर ननहइया?',
  'what are you doing': 'इन्दिर ननहइया?',
  'आप क्या कर रहे हैं?': 'इन्दिर ननहइया?',

  'what is this?': 'इदि इन्दिर तली?',
  'what is this': 'इदि इन्दिर तली?',
  'यह क्या है?': 'इदि इन्दिर तली?',

  'education': 'सिखना अरा पढ़ना (कहापु)',
  'learning': 'सिखना (कत्था सिखना)',
  'science': 'विज्ञान (गियान)',
  'mathematics': 'गणित (लेखा)',
  'math': 'गणित (लेखा)',
  'school': 'एड़पा सिखना (स्कुल)',
  'teacher': 'पढ़ावूस (गुरु)',
  'student': 'पढ़ुवा खद्द',
  'language': 'कत्था (भाषा)',
  'book': 'पुथी',
}

// 2. Vocabulary Mappings (English & Hindi -> Kurukh Devanagari)
const KURUKH_VOCAB: Record<string, string> = {
  // Interrogatives
  'what': 'इन्दिर',
  'क्या': 'इन्दिर',
  'where': 'इन्सन',
  'कहाँ': 'इन्सन',
  'how': 'एकासे',
  'कैसे': 'एकासे',
  'who': 'ने',
  'कौन': 'ने',
  'why': 'इन्दिरगे',
  'क्यों': 'इन्दिरगे',

  // Pronouns & Possessives
  'i': 'एन्',
  'मैं': 'एन्',
  'you': 'नीन्',
  'आप': 'नीन्',
  'तुम': 'नीन्',
  'we': 'एम',
  'हम': 'एम',
  'he': 'आस',
  'she': 'आदि',
  'वह': 'आस',
  'this': 'इदि',
  'यह': 'इदि',
  'my': 'एङ्गहै',
  'मेरा': 'एङ्गहै',
  'मेरी': 'एङ्गहै',
  'मेरे': 'एङ्गहै',
  'your': 'निङ्गहै',
  'आपका': 'निङ्गहै',
  'आपकी': 'निङ्गहै',
  'आपके': 'निङ्गहै',
  'our': 'एमहै',
  'हमारा': 'एमहै',

  // Nouns & Key Concepts
  'name': 'नाम',
  'नाम': 'नाम',
  'ai': 'आर्टिफिशियल इंटेलिजेंस',
  'artificial intelligence': 'आर्टिफिशियल इंटेलिजेंस',
  'photosynthesis': 'प्रकाश संश्लेषण',
  'gravity': 'गुरुत्वाकर्षण',
  'computer': 'कंप्यूटर',
  'capital': 'राजधानी',
  'india': 'भारत',
  'bharat': 'भारत',
  'internet': 'इंटरनेट',
  'solar system': 'सौरमंडल',
  'water': 'अम्म',
  'पानी': 'अम्म',
  'food': 'मंडी',
  'खाना': 'मंडी',
  'home': 'एड़पा',
  'house': 'एड़पा',
  'घर': 'एड़पा',
  'friend': 'संगी',
  'दोस्त': 'संगी',
  'language': 'कत्था',
  'भाषा': 'कत्था',
  'work': 'काम नन्ता',
  'काम': 'काम',
  'need': 'जरूरत',
  'आवश्यकता': 'जरूरत',
  'जरूरत': 'जरूरत',
}

/**
 * Translates input text dynamically into Kurukh Devanagari script.
 */
export async function translateToKurukh({
  text,
  sourceLanguageId = 'auto',
}: KurukhTranslationParams): Promise<string> {
  if (!text || !text.trim()) return ''

  const rawInput = text.trim()
  const cleanInput = rawInput.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')

  // 1. Strict Exact Match Check ONLY
  if (KURUKH_EXACT_PHRASE_MAP[cleanInput]) {
    return KURUKH_EXACT_PHRASE_MAP[cleanInput]
  }

  // 2. Dynamic Pattern Translators for Common Question Structures
  // Pattern A: "What is [X]?" / "[X] क्या है?"
  const whatIsPatternEng = /^what\s+is\s+(?:the\s+|a\s+)?(.+)\??$/i
  const matchEng = rawInput.match(whatIsPatternEng)
  if (matchEng && matchEng[1]) {
    const subject = matchEng[1].trim().replace(/\?$/, '')
    const mappedSubject = translateSubjectToKurukh(subject)
    return `${mappedSubject} इन्दिर तली?`
  }

  const whatIsPatternHin = /^(.+)\s+क्या\s+है\??$/i
  const matchHin = rawInput.match(whatIsPatternHin)
  if (matchHin && matchHin[1]) {
    const subject = matchHin[1].trim().replace(/\?$/, '')
    const mappedSubject = translateSubjectToKurukh(subject)
    return `${mappedSubject} इन्दिर तली?`
  }

  // Pattern B: "Why do we need [X]?" / "हमें [X] की आवश्यकता क्यों है?"
  const whyNeedEng = /^why\s+do\s+we\s+need\s+(.+)\??$/i
  const matchWhyEng = rawInput.match(whyNeedEng)
  if (matchWhyEng && matchWhyEng[1]) {
    const obj = matchWhyEng[1].trim().replace(/\?$/, '')
    const mappedObj = translateSubjectToKurukh(obj)
    return `एमगे ${mappedObj} गहि जरूरत इन्दिरगे तली?`
  }

  // Pattern C: "How does [X] work?" / "[X] कैसे काम करता है?"
  const howWorkEng = /^how\s+does\s+(?:the\s+)?(.+)\s+work\??$/i
  const matchHowEng = rawInput.match(howWorkEng)
  if (matchHowEng && matchHowEng[1]) {
    const obj = matchHowEng[1].trim().replace(/\?$/, '')
    const mappedObj = translateSubjectToKurukh(obj)
    return `${mappedObj} एकासे काम नन्ता?`
  }

  // 3. General Sentence Dynamic Lexical & Grammatical Translation
  const words = rawInput.split(/\s+/)
  const translatedWords = words.map((w) => {
    const cleanWord = w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    if (KURUKH_VOCAB[cleanWord]) {
      return KURUKH_VOCAB[cleanWord]
    }
    return w
  })

  let kurukhResult = translatedWords.join(' ')

  // Apply Kurukh grammatical postpositions & copulas
  kurukhResult = kurukhResult
    .replace(/\b(का|की|के|of|'s)\b/gi, 'गहि')
    .replace(/\b(में|पर|in|on|at)\b/gi, 'नू')
    .replace(/\b(से|from|with)\b/gi, 'ती')
    .replace(/\b(है|is)\b/gi, 'तली')
    .replace(/\b(हैं|are)\b/gi, 'रअइया')

  return kurukhResult
}

/**
 * Utility to map subject terms into clean Kurukh Devanagari representation.
 */
function translateSubjectToKurukh(subject: string): string {
  const cleanSub = subject.toLowerCase().trim()

  if (KURUKH_VOCAB[cleanSub]) {
    return KURUKH_VOCAB[cleanSub]
  }

  // Common phrase mappings for subject terms
  if (cleanSub === 'capital of india' || cleanSub === 'the capital of india') {
    return 'भारत गहि राजधानी'
  }
  if (cleanSub === 'solar system' || cleanSub === 'the solar system') {
    return 'सौरमंडल'
  }
  if (cleanSub === 'computer' || cleanSub === 'a computer') {
    return 'कंप्यूटर'
  }

  // Capitalize main subject words cleanly
  return subject
    .split(' ')
    .map((w) => (KURUKH_VOCAB[w.toLowerCase()] ? KURUKH_VOCAB[w.toLowerCase()] : w))
    .join(' ')
}
