import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Check, Globe, Sparkles, ArrowRight } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { LANGUAGES, getLanguageById } from '../../data/languages'
import { useAppStore } from '../../store/useAppStore'
import { speechService } from '../../services/speech'
import { useExperienceScroll } from '../../components/cinematic/ScrollContext'
import type { Language } from '../../types'

const CONFIRMATION_MESSAGES: Record<string, string> = {
  sat: 'ᱡᱚᱦᱟᱨ! ᱵᱷᱟᱥᱟᱢᱤᱛᱨᱚ ᱨᱮ ᱟᱢᱟᱜ ᱥᱟᱹᱜᱩᱱ ᱫᱟᱨᱟᱢ, ᱱᱤᱛᱚᱜ ᱟᱢᱟᱜ ᱯᱟᱹᱨᱥᱤ ᱛᱮ ᱥᱮᱪᱮᱫ ᱦᱩᱭᱩᱜᱼᱟ᱾',
  kru: 'जय धरमे! ईन्के कुड़ुख़ कत्था नु सिखना शुरू ननहइया।',
  bhili: 'राम राम! भीली भाषा मां भणवा मा स्वागत हे।',
  bhilodi: 'राम राम! भीलोड़ी भाषा मां भणवा मा स्वागत हे।',
  gon: 'सेवा जोहार! गोंडी कत्था ते सिके कीटो।',
  as: 'নমস্কাৰ! অসমীয়া ভাষাত শিক্ষা লাভ কৰিবলৈ স্বাগতম।',
  brx: 'खुलुमबाय! बड़ो रावजों सोलोंथाय लानो बरायबाय।',
  kha: 'Khublei! Pdiang sngewbha sha ka jingpule ha ka ktien Khasi.',
  kokborok: 'Khulumkha! Kokborok bai rwngmung no borom rwkha.',
  hi: 'नमस्ते! अब मैं आपकी मातृभाषा में सीखने में आपकी पूरी मदद करूँगा।',
  en: 'Welcome! I will now guide your learning journey in English.',
}

export function LanguageScene() {
  const { progress } = useExperienceScroll()
  const { selectedLanguageId, setSelectedLanguageId, setAssistantState } = useAppStore()

  let opacity = 0
  if (progress >= 0.24 && progress <= 0.56) {
    if (progress < 0.34) {
      opacity = (progress - 0.24) / 0.10
    } else if (progress > 0.46) {
      opacity = 1 - (progress - 0.46) / 0.10
    } else {
      opacity = 1
    }
  }

  const selectedLang = getLanguageById(selectedLanguageId)
  const confirmationText = selectedLang
    ? (CONFIRMATION_MESSAGES[selectedLang.id] ?? `Selected ${selectedLang.name}.`)
    : null

  const handleSelect = (lang: Language) => {
    setSelectedLanguageId(lang.id)
    setAssistantState({ mode: 'success', message: `Selected ${lang.name}` })
    setTimeout(() => {
      setAssistantState({ mode: 'idle', message: null })
    }, 1500)
  }

  const handlePronounce = (e: React.MouseEvent, lang: Language) => {
    e.stopPropagation()
    speechService.speak(lang.nativeName, lang.locale)
  }

  const handleNextSection = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: 0.56 * scrollHeight,
      behavior: 'smooth',
    })
  }

  return (
    <section
      style={{ opacity }}
      className={`min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-12 py-12 text-center transition-opacity duration-300 ${
        opacity > 0.05 ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div className="max-w-4xl mx-auto w-full space-y-6">
        
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/[0.06] text-[#525252] text-xs font-semibold uppercase tracking-wider backdrop-blur-xl shadow-sm">
            <Globe size={13} className="text-indigo-600" />
            <span>Regional Language Intelligence</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#171717]">
            What language feels natural to you?
          </h2>
          <p className="font-serif text-base sm:text-lg text-[#525252] max-w-md mx-auto">
            Choose your mother tongue. The AI recalibrates its syntax and vocabulary in real-time.
          </p>
        </div>

        {/* Floating Language Tiles */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto pt-2"
          role="radiogroup"
          aria-label="Select your mother tongue"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguageId === lang.id

            return (
              <GlassCard
                key={lang.id}
                variant={isSelected ? 'highlighted' : 'interactive'}
                padding="md"
                onClick={() => handleSelect(lang)}
                className={`relative flex flex-col items-center justify-center text-center group cursor-pointer transition-all duration-300 ${
                  isSelected ? 'ring-2 ring-indigo-500 bg-white/95 shadow-editorial' : ''
                }`}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(lang)
                  }
                }}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#171717] flex items-center justify-center text-white shadow-sm font-bold"
                  >
                    <Check size={12} strokeWidth={3} />
                  </motion.div>
                )}

                <span className={`text-2xl sm:text-3xl font-extrabold mb-1 tracking-tight ${isSelected ? 'text-[#171717]' : 'text-[#262626]'}`}>
                  {lang.nativeName}
                </span>

                <span className={`text-xs sm:text-sm font-medium ${isSelected ? 'text-indigo-600 font-semibold' : 'text-[#737373]'}`}>
                  {lang.name}
                </span>

                <button
                  type="button"
                  onClick={(e) => handlePronounce(e, lang)}
                  aria-label={`Hear ${lang.name} pronunciation`}
                  title={`Pronounce ${lang.nativeName}`}
                  className="mt-2.5 p-1.5 rounded-lg bg-black/[0.03] hover:bg-black/[0.08] text-[#737373] hover:text-[#171717] transition-colors"
                >
                  <Volume2 size={13} />
                </button>
              </GlassCard>
            )
          })}
        </div>

        {/* Localized Confirmation Strip */}
        <div className="min-h-[46px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {confirmationText && (
              <motion.div
                key={selectedLanguageId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 border border-black/[0.06] text-xs sm:text-sm text-[#171717] backdrop-blur-xl shadow-editorial"
              >
                <Sparkles size={14} className="text-indigo-600 shrink-0" />
                <span>{confirmationText}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Next Step */}
        <div>
          <Button
            variant="primary"
            size="md"
            onClick={handleNextSection}
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Calibrate Education Depth
          </Button>
        </div>
      </div>
    </section>
  )
}
