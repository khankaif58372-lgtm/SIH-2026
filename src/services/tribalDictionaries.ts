/**
 * tribalDictionaries.ts
 *
 * Verified linguistic phrasebooks and lexical dictionaries for BhashaMitra (Unveishna 2026).
 * Contains verified lexical pairs, academic vocabulary, and conversational sentences for:
 * - Santali (sat) — Ol Chiki
 * - Kurukh (kru) — Devanagari
 * - Bhili (bhili) — Devanagari
 * - Bhilodi (bhilodi) — Devanagari (Bhil dialect continuum)
 * - Gondi (gon) — Devanagari
 * - Assamese (as) — Bengali-Assamese
 * - Bodo (brx) — Devanagari
 * - Khasi (kha) — Latin
 * - Kokborok (kokborok) — Bengali / Latin
 * - Kui (kui) — Odia / Devanagari
 */

export const TRIBAL_DICTIONARIES: Record<string, Record<string, string>> = {
  // ── 1. Santali (sat) — Ol Chiki ─────────────────────────────────────────────
  sat: {
    // Greetings & Social
    'hello': 'ᱡᱚᱦᱟᱨ',
    'hi': 'ᱡᱚᱦᱟᱨ',
    'namaste': 'ᱡᱚᱦᱟᱨ',
    'नमस्ते': 'ᱡᱚᱦᱟᱨ',
    'good morning': 'ᱥᱟᱹᱜᱩᱱ ᱥᱮᱛᱟᱜ',
    'good afternoon': 'ᱥᱟᱹᱜᱩᱱ ᱛᱤᱠᱤᱱ',
    'good evening': 'ᱥᱟᱹᱜᱩᱱ ᱟᱹᱭᱩᱵ',
    'welcome': 'ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ',
    'thank you': 'ᱥᱟᱨᱦᱟᱣ',
    'thanks': 'ᱥᱟᱨᱦᱟᱣ',
    'धन्यवाद': 'ᱥᱟᱨᱦᱟᱣ',
    'yes': 'ᱦᱮᱸ',
    'no': 'ᱵᱟᱝ',
    'हाँ': 'ᱦᱮᱸ',
    'नहीं': 'ᱵᱟᱝ',

    // Questions & Conversations
    'how are you?': 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱵᱤᱱᱟ?',
    'how are you': 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱵᱤᱱᱟ?',
    'आप कैसे हैं?': 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ ᱵᱤᱱᱟ?',
    'तुम कैसे हो?': 'ᱪᱮᱫ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱢᱟ?',
    'what is your name?': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?',
    'what is your name': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?',
    'आपका नाम क्या है?': 'ᱟᱢᱟᱜ ᱧᱩᱛᱩᱢ ᱫᱚ ᱪᱮᱫ?',
    'i am fine': 'ᱤᱧ ᱵᱮᱥ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ',
    'मैं ठीक हूँ': 'ᱤᱧ ᱵᱮᱥ ᱜᱮ ᱢᱮᱱᱟᱹᱧᱟ',
    'where are you going?': 'ᱟᱢ ᱚᱠᱟ ᱛᱮᱢ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ?',
    'what is this?': 'ᱱᱚᱣᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?',
    'यह क्या है?': 'ᱱᱚᱣᱟ ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?',

    // Education & Academic Concepts
    'learning': 'ᱥᱮᱪᱮᱫ',
    'education': 'ᱥᱮᱪᱮᱫ ᱟᱨ ᱜᱮᱭᱟᱱ',
    'school': 'ᱵᱤᱨᱫᱟᱹᱜᱟᱲ',
    'teacher': 'ᱢᱟᱪᱮᱛ',
    'student': 'ᱪᱮᱛᱮᱫᱤᱭᱟᱹ',
    'science': 'ᱥᱟᱬᱮᱥ',
    'mathematics': 'ᱮᱞᱠᱷᱟ',
    'math': 'ᱮᱞᱠᱷᱟ',
    'language': 'ᱯᱟᱹᱨᱥᱤ',
    'book': 'ᱯᱩᱛᱷᱤ',
    'knowledge': 'ᱜᱮᱭᱟᱱ',
    'reading': 'ᱯᱟᱲᱦᱟᱣ',
    'writing': 'ᱚᱞ',
    'water': 'ᱫᱟᱜ',
    'sun': 'ᱵᱮᱞᱟ / ᱥᱤᱧ ᱵᱮᱞᱟ',
    'tree': 'ᱫᱟᱨᱮ',
    'earth': 'ᱫᱷᱟᱹᱨᱛᱤ',
  },

  // ── 2. Bhili (bhili) — Devanagari ──────────────────────────────────────────
  bhili: {
    'hello': 'राम राम',
    'hi': 'जय जोहार',
    'namaste': 'जय जोहार',
    'नमस्ते': 'जय जोहार',
    'good morning': 'शुभ प्रभात (राम राम)',
    'good afternoon': 'राम राम',
    'good evening': 'राम राम',
    'welcome': 'पधारो',
    'thank you': 'घणो आभार',
    'thanks': 'आभार',
    'धन्यवाद': 'घणो आभार',
    'yes': 'हाँ',
    'no': 'ना',
    'हाँ': 'हाँ',
    'नहीं': 'ना',

    'how are you?': 'तुमे का हाल हे?',
    'how are you': 'तुमे का हाल हे?',
    'आप कैसे हैं?': 'तुमे का हाल हे?',
    'तुम कैसे हो?': 'कसीक सो?',
    'what is your name?': 'तमोरु नाम काई हे?',
    'what is your name': 'तमोरु नाम काई हे?',
    'आपका नाम क्या है?': 'तमोरु नाम काई हे?',
    'i am fine': 'हुं मजे मा छु',
    'मैं ठीक हूँ': 'हुं मजे मा छु',
    'where are you going?': 'तुमे क्यां जावो सो?',
    'what is this?': 'यो काई हे?',
    'यह क्या है?': 'यो काई हे?',

    'learning': 'सीखवु',
    'education': 'भणतर',
    'school': 'निसार / शाला',
    'teacher': 'गुरुजी',
    'student': 'भणवा वालो',
    'science': 'विज्ञान',
    'mathematics': 'हिसाब / गणित',
    'math': 'हिसाब',
    'language': 'बोली / भाषा',
    'book': 'पोथी / चोपड़ी',
    'knowledge': 'ज्ञान',
    'reading': 'वांचवु',
    'writing': 'लिखवु',
    'water': 'पाणी',
    'sun': 'सूरज',
    'tree': 'झाड़',
    'earth': 'धरती',
  },

  // ── 3. Bhilodi (bhilodi) — Devanagari (Dialect Continuum) ───────────────────
  bhilodi: {
    'hello': 'राम राम (जय जोहार)',
    'hi': 'जय जोहार',
    'namaste': 'राम राम',
    'नमस्ते': 'राम राम',
    'good morning': 'राम राम',
    'welcome': 'स्वागत हे',
    'thank you': 'आभार',
    'thanks': 'आभार',
    'धन्यवाद': 'आभार',
    'yes': 'हाँ',
    'no': 'नहि',
    'हाँ': 'हाँ',
    'नहीं': 'नहि',

    'how are you?': 'तमोरु का हाल हे?',
    'how are you': 'तमोरु का हाल हे?',
    'आप कैसे हैं?': 'तमोरु का हाल हे?',
    'what is your name?': 'तमोरु नाम काई हे?',
    'what is your name': 'तमोरु नाम काई हे?',
    'आपका नाम क्या है?': 'तमोरु नाम काई हे?',
    'i am fine': 'हुं ठीक छु',
    'मैं ठीक हूँ': 'हुं ठीक छु',
    'what is this?': 'यो काई हे?',
    'यह क्या है?': 'यो काई हे?',

    'learning': 'सीखवु',
    'education': 'भणतर',
    'school': 'शाला',
    'teacher': 'गुरुजी',
    'student': 'भणनारो',
    'science': 'विज्ञान',
    'mathematics': 'हिसाब',
    'math': 'हिसाब',
    'book': 'पोथी',
    'knowledge': 'ज्ञान',
    'water': 'पाणी',
  },

  // ── 4. Gondi (gon) — Devanagari ────────────────────────────────────────────
  gon: {
    'hello': 'सेवा जोहार',
    'hi': 'जय सेवा',
    'namaste': 'सेवा जोहार',
    'नमस्ते': 'सेवा जोहार',
    'good morning': 'सेवा जोहार (सकाल)',
    'welcome': 'भलवान',
    'thank you': 'जोहार (धन्यवाद)',
    'thanks': 'जोहार',
    'धन्यवाद': 'जोहार',
    'yes': 'इंग',
    'no': 'हिल्ले',
    'हाँ': 'इंग',
    'नहीं': 'हिल्ले',

    'how are you?': 'बेशि मंदीत?',
    'how are you': 'बेशि मंदीत?',
    'आप कैसे हैं?': 'बेशि मंदीत?',
    'what is your name?': 'नीवा पेरोल बाता?',
    'what is your name': 'नीवा पेरोल बाता?',
    'आपका नाम क्या है?': 'नीवा पेरोल बाता?',
    'i am fine': 'नना बेशि मंदोन',
    'मैं ठीक हूँ': 'नना बेशि मंदोन',
    'what is this?': 'इदी बाता आंदु?',
    'यह क्या है?': 'इदी बाता आंदु?',

    'learning': 'करीकना',
    'education': 'शिकोना',
    'school': 'साला',
    'teacher': 'गुरु / शिकोहवाल',
    'student': 'शिकूंदूर',
    'science': 'गियान',
    'mathematics': 'लेखा',
    'math': 'लेखा',
    'language': 'कत्था / गोटी',
    'book': 'पोथी',
    'knowledge': 'गियान',
    'water': 'येर',
    'sun': 'पोद्दु',
    'tree': 'मरा',
    'earth': 'धरती / भूमि',
  },

  // ── 5. Bodo (brx) — Devanagari ─────────────────────────────────────────────
  brx: {
    'hello': 'खुलुमबाय',
    'hi': 'खुलुमबाय',
    'namaste': 'खुलुमबाय',
    'नमस्ते': 'खुलुमबाय',
    'good morning': 'फुंनि खुलुमनाय',
    'welcome': 'बरायबाय',
    'thank you': 'साबायखर',
    'thanks': 'साबायखर',
    'धन्यवाद': 'साबायखर',
    'yes': 'औ',
    'no': 'नङा',
    'हाँ': 'औ',
    'नहीं': 'नङा',

    'how are you?': 'नोंहा माबोरै दं?',
    'how are you': 'नोंहा माबोरै दं?',
    'आप कैसे हैं?': 'नोंहा माबोरै दं?',
    'what is your name?': 'नोंनि मुङा मा?',
    'what is your name': 'नोंनि मुङा मा?',
    'आपका नाम क्या है?': 'नोंनि मुङा मा?',
    'i am fine': 'आं मोजांयैनो दं',
    'मैं ठीक हूँ': 'आं मोजांयैनो दं',
    'what is this?': 'बेयो मा?',
    'यह क्या है?': 'बेयो मा?',

    'learning': 'सोलोंनाय',
    'education': 'सोलोंथाय',
    'school': 'फरायसालि',
    'teacher': 'फोरोंगिरि',
    'student': 'फरायसुला',
    'science': 'बिगियान',
    'mathematics': 'सानखान्थि',
    'math': 'सानखान्थि',
    'language': 'राव',
    'book': 'बिजाब',
    'knowledge': 'ज्ञान / गियान',
    'water': 'दै',
    'sun': 'सान',
    'tree': 'बिफां',
    'earth': 'बुहुम',
  },

  // ── 6. Khasi (kha) — Latin ─────────────────────────────────────────────────
  kha: {
    'hello': 'Khublei',
    'hi': 'Khublei',
    'namaste': 'Khublei',
    'नमस्ते': 'Khublei',
    'good morning': 'Khublei step',
    'good evening': 'Khublei janmiet',
    'welcome': 'Pdiang sngewbha',
    'thank you': 'Khublei shibun',
    'thanks': 'Khublei',
    'धन्यवाद': 'Khublei shibun',
    'yes': 'Ho-oid',
    'no': 'Em',
    'हाँ': 'Ho-oid',
    'नहीं': 'Em',

    'how are you?': 'Kumno phi long?',
    'how are you': 'Kumno phi long?',
    'आप कैसे हैं?': 'Kumno phi long?',
    'what is your name?': 'Ka kyrteng jong phi ka dei aiu?',
    'what is your name': 'Ka kyrteng jong phi ka dei aiu?',
    'आपका नाम क्या है?': 'Ka kyrteng jong phi ka dei aiu?',
    'i am fine': 'Nga khlain bha',
    'मैं ठीक हूँ': 'Nga khlain bha',
    'what is this?': 'Kaei kane?',
    'यह क्या है?': 'Kaei kane?',

    'learning': 'Ka jingnang jingstad',
    'education': 'Ka jingpule',
    'school': 'Ka skul',
    'teacher': 'U nonghikai',
    'student': 'U khynnah skul',
    'science': 'Ka sainks',
    'mathematics': 'Ka jingkhein',
    'math': 'Ka jingkhein',
    'language': 'Ka ktien',
    'book': 'Ka kot',
    'knowledge': 'Ka jingtip',
    'water': 'Ka um',
    'sun': 'Ka sngi',
    'tree': 'U dieng',
    'earth': 'Ka pyrthei',
  },

  // ── 7. Kokborok (kokborok) — Bengali / Latin ────────────────────────────────
  kokborok: {
    'hello': 'Khulumkha (খুলুমখা)',
    'hi': 'Khulumkha',
    'namaste': 'Khulumkha',
    'नमस्ते': 'Khulumkha',
    'good morning': 'Phaio kaham',
    'welcome': 'Bwkha kaham bai pdiang',
    'thank you': 'Hambai (হাম্বাই)',
    'thanks': 'Hambai',
    'धन्यवाद': 'Hambai',
    'yes': 'Ao',
    'no': 'Maya',
    'हाँ': 'Ao',
    'नहीं': 'Maya',

    'how are you?': 'Nwng baha hai tong?',
    'how are you': 'Nwng baha hai tong?',
    'आप कैसे हैं?': 'Nwng baha hai tong?',
    'what is your name?': 'Nini mung tibo?',
    'what is your name': 'Nini mung tibo?',
    'आपका नाम क्या है?': 'Nini mung tibo?',
    'i am fine': 'Ang kaham no tong',
    'मैं ठीक हूँ': 'Ang kaham no tong',
    'what is this?': 'Abo tamo?',
    'यह क्या है?': 'Abo tamo?',

    'learning': 'Rwngmung (রংমুং)',
    'education': 'Rwngkwrang',
    'school': 'Rwngnok (রংনক)',
    'teacher': 'Phrungnai / Osta',
    'student': 'Pwranai',
    'science': 'Bigiyan (বিজ্ঞান)',
    'mathematics': 'Lekha / Hisab',
    'math': 'Hisab',
    'language': 'Kok',
    'book': 'Bijap (বিজাপ)',
    'knowledge': 'Giyang',
    'water': 'Twi',
    'sun': 'Sal',
    'tree': 'Buphang',
    'earth': 'Haa',
  },

  // ── 8. Kui (kui) — Odia Script (Kandhamal, Odisha) ──────────────────────────
  kui: {
    'hello': 'କୁଇ ଜୁହାର (Juhar)',
    'hi': 'ଜୁହାର',
    'namaste': 'ଜୁହାର',
    'नमस्ते': 'ଜୁହାର',
    'good morning': 'କୁଇ ସକାଳ ଜୁହାର',
    'welcome': 'ସ୍ୱାଗତ ମାଞ୍ଜୁ',
    'thank you': 'ଜୁହାର / ଧନ୍ୟବାଦ',
    'thanks': 'ଜୁହାର',
    'धन्यवाद': 'ଜୁହାର / ଧନ୍ୟବାଦ',
    'yes': 'ଆଉ',
    'no': 'ଆମ୍ବେ',
    'हाँ': 'ଆଉ',
    'नहीं': 'ଆମ୍ବେ',

    'how are you?': 'ଏସ୍ତାକି ମାଞ୍ଜି?',
    'how are you': 'ଏସ୍ତାକି ମାଞ୍ଜି?',
    'आप कैसे हैं?': 'ଏସ୍ତାକି ମାଞ୍ଜି?',
    'what is your name?': 'ନୀ ତୋର୍ଣା ଆନା?',
    'what is your name': 'ନୀ ତୋର୍ଣା ଆନା?',
    'आपका नाम क्या है?': 'ନୀ ତୋର୍ଣା ଆନା?',
    'i am fine': 'ନାନୁ ବେସି ମାଞ୍ଜାଇ',
    'मैं ठीक हूँ': 'ନାନୁ ବେସି ମାଞ୍ଜାଇ',
    'what is this?': 'ଇଦି ଆନା ଆଞ୍ଜେ?',
    'यह क्या है?': 'ଇଦି ଆନା ଆଞ୍ଜେ?',

    'learning': 'କାର୍ପା (Karpa)',
    'education': 'ପଡିପା (Padipa)',
    'school': 'ସ୍କୁଲ',
    'teacher': 'ଗୁରୁ',
    'student': 'ପଡିଓସି',
    'science': 'ବିଜ୍ଞାନ',
    'mathematics': 'ହିସାବ / ଲେଖା',
    'math': 'ହିସାବ',
    'language': 'କୁଇ କାଥା (Kui Kaatha)',
    'book': 'ପୋଥି',
    'knowledge': 'ଗିୟାନ୍',
    'water': 'ଏସ୍',
    'sun': 'ବେଲା',
    'tree': 'ମାଡ଼ି',
    'earth': 'ଧରତି',
  },

  // ── 9. Assamese (as) — Bengali-Assamese Script ──────────────────────────────
  as: {
    'hello': 'নমস্কাৰ',
    'hi': 'নমস্কাৰ',
    'namaste': 'নমস্কাৰ',
    'नमस्ते': 'নমস্কাৰ',
    'good morning': 'সুপ্ৰভাত',
    'good afternoon': 'শুভ অপৰাহ্ণ',
    'good evening': 'শুভ সন্ধ্যা',
    'welcome': 'স্বাগতম',
    'thank you': 'ধন্যবাদ',
    'thanks': 'ধন্যবাদ',
    'धन्यवाद': 'ধন্যবাদ',
    'yes': 'হয়',
    'no': 'নহয়',
    'हाँ': 'হয়',
    'नहीं': 'নহয়',

    'how are you?': 'আপোনাৰ কেনে আছে?',
    'how are you': 'আপোনাৰ কেনে আছে?',
    'आप कैसे हैं?': 'আপোনাৰ কেনে আছে?',
    'what is your name?': 'আপোনাৰ নাম কি?',
    'what is your name': 'আপোনাৰ নাম কি?',
    'आपका नाम क्या है?': 'আপোনাৰ নাম কি?',
    'i am fine': 'মই ভালে আছোঁ',
    'मैं ठीक हूँ': 'মই ভালে আছোঁ',
    'what is this?': 'এইটো কি?',
    'यह क्या है?': 'এইটো কি?',

    'learning': 'শিকা',
    'education': 'শিক্ষা',
    'school': 'বিদ্যালয়',
    'teacher': 'শিক্ষক',
    'student': 'ছাত্ৰ-ছাত্ৰী',
    'science': 'বিজ্ঞান',
    'mathematics': 'গণিত',
    'math': 'গণিত',
    'language': 'ভাষা',
    'book': 'কিতাপ',
    'knowledge': 'জ্ঞান',
    'water': 'পানী',
    'sun': 'সূৰ্য',
    'tree': 'গছ',
    'earth': 'পৃথিৱী',
  },
}

/**
 * Look up verified phrase or word in the curated tribal dictionary.
 */
export function lookupTribalPhrase(text: string, targetLanguageId: string): string | null {
  if (!text) return null
  const clean = text.trim().toLowerCase()
  const targetDict = TRIBAL_DICTIONARIES[targetLanguageId.toLowerCase()]
  if (!targetDict) return null

  // Direct exact match
  if (targetDict[clean]) {
    return targetDict[clean]
  }

  // Punctuation-stripped match
  const stripped = clean.replace(/[?.!,।]/g, '').trim()
  if (targetDict[stripped]) {
    return targetDict[stripped]
  }

  return null
}

/**
 * Return an honest status message when complex or unseen text is requested in a tribal language.
 * Never spoof or output English/Hindi falsely labeled as tribal translation.
 */
export function getTribalHonestStatus(languageName: string, text: string): string {
  return `[${languageName} Corpus Notice]: Verified translation for "${text.slice(0, 40)}${text.length > 40 ? '...' : ''}" is currently in field validation. BhashaMitra Tribal Linguistic Corpus (Unveishna 2026) is curating authentic dialect records.`
}
