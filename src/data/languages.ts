import type { Language } from '../types'

/**
 * BhashaMitra — Centralized Language Configuration
 * Tailored for rural and regional-language primary & secondary learners across India (Unveishna 2026).
 *
 * Preserves English and Hindi for foundational interface and source-language functionality,
 * while providing dedicated support for 9 verified tribal and regional languages:
 * 1. Santali
 * 2. Kurukh
 * 3. Bhili
 * 4. Bhilodi (distinct option, regional variety of Bhil continuum)
 * 5. Gondi
 * 6. Assamese
 * 7. Bodo
 * 8. Khasi
 * 9. Kokborok
 */
export const LANGUAGES: Language[] = [
  // ── Source & Universal Academic Languages ───────────────────────────────────
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    locale: 'en-IN',
    script: 'Latin',
    regions: ['Pan-India'],
    isTribal: false,
    translationSupport: 'full',
    sttSupport: 'supported',
    ttsSupport: 'supported',
    notes: 'Associate official language of the Union. Academic and foundational source language.',
  },
  {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    locale: 'hi-IN',
    script: 'Devanagari',
    regions: ['Northern, Central, and Western India'],
    isTribal: false,
    translationSupport: 'full',
    sttSupport: 'supported',
    ttsSupport: 'supported',
    notes: 'Official language of the Union. Primary national vernacular source and target language.',
  },

  // ── Regional & Tribal Languages (Unveishna 2026 Selection) ───────────────────
  {
    id: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    locale: 'sat-IN',
    script: 'Ol Chiki',
    regions: ['Jharkhand', 'Odisha', 'West Bengal', 'Assam'],
    isTribal: true,
    translationSupport: 'phrasebook',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Austroasiatic Munda language in Eighth Schedule, written in authentic Ol Chiki script.',
  },
  {
    id: 'kru',
    name: 'Kurukh',
    nativeName: 'कुड़ुख़',
    locale: 'kru-IN',
    script: 'Devanagari / Tolong Siki',
    regions: ['Jharkhand', 'Odisha', 'Chhattisgarh', 'West Bengal'],
    isTribal: true,
    translationSupport: 'dedicated_engine',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Dravidian tribal language of the Oraon people. Features dedicated BhashaMitra translation engine.',
  },
  {
    id: 'bhili',
    name: 'Bhili',
    nativeName: 'भीली',
    locale: 'bhb-IN',
    script: 'Devanagari',
    regions: ['Madhya Pradesh', 'Gujarat', 'Rajasthan', 'Maharashtra'],
    isTribal: true,
    translationSupport: 'phrasebook',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Western Indo-Aryan language spoken by the Bhil community across Western & Central India.',
  },
  {
    id: 'bhilodi',
    name: 'Bhilodi',
    nativeName: 'भीलोड़ी',
    locale: 'bho_di-IN',
    script: 'Devanagari',
    regions: ['Madhya Pradesh', 'Gujarat', 'Rajasthan', 'Maharashtra'],
    isTribal: true,
    translationSupport: 'phrasebook',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Recognized regional dialect variety in the Bhil linguistic continuum. Maintained as a distinct selectable option.',
  },
  {
    id: 'gon',
    name: 'Gondi',
    nativeName: 'गोंडी',
    locale: 'gon-IN',
    script: 'Devanagari / Gunjala Gondi',
    regions: ['Madhya Pradesh', 'Chhattisgarh', 'Maharashtra', 'Telangana'],
    isTribal: true,
    translationSupport: 'phrasebook',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Central Dravidian language of the Gond people across the central Deccan and Gondwana belt.',
  },
  {
    id: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    locale: 'as-IN',
    script: 'Bengali-Assamese',
    regions: ['Assam'],
    isTribal: false,
    translationSupport: 'full',
    sttSupport: 'partial',
    ttsSupport: 'partial',
    notes: 'Eighth Schedule official language of Assam and the Brahmaputra Valley.',
  },
  {
    id: 'brx',
    name: 'Bodo',
    nativeName: 'बड़ो',
    locale: 'brx-IN',
    script: 'Devanagari',
    regions: ['Assam'],
    isTribal: true,
    translationSupport: 'phrasebook',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Tibeto-Burman Eighth Schedule language of the Bodoland Territorial Region, Assam.',
  },
  {
    id: 'kha',
    name: 'Khasi',
    nativeName: 'Ka Ktien Khasi',
    locale: 'kha-IN',
    script: 'Latin',
    regions: ['Meghalaya'],
    isTribal: true,
    translationSupport: 'phrasebook',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Austroasiatic language of the Khasi and Jaintia Hills, Meghalaya; written in Latin script.',
  },
  {
    id: 'kokborok',
    name: 'Kokborok',
    nativeName: 'ককবরক',
    locale: 'trp-IN',
    script: 'Bengali / Latin',
    regions: ['Tripura'],
    isTribal: true,
    translationSupport: 'phrasebook',
    sttSupport: 'unsupported',
    ttsSupport: 'unsupported',
    notes: 'Tibeto-Burman official state language of Tripura spoken by the Borok people.',
  },
]

/** Look up a language by its id. Returns undefined if not found. */
export function getLanguageById(id: string): Language | undefined {
  return LANGUAGES.find((lang) => lang.id === id)
}

/** Check if a language has tribal / indigenous classification */
export function isTribalLanguage(id: string): boolean {
  const lang = getLanguageById(id)
  return !!lang?.isTribal
}

/** Default fallback language */
export const DEFAULT_LANGUAGE_ID = 'hi'

/** Tribal Languages Subset */
export const TRIBAL_LANGUAGES = LANGUAGES.filter((l) => l.isTribal)

/** All active selectable languages */
export const ACTIVE_LANGUAGES = LANGUAGES
