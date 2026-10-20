import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Globe, Layers, ArrowRight, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { useAppStore } from '../../store/useAppStore'
import { getLanguageById } from '../../data/languages'
import { speechService } from '../../services/speech'
import { useExperienceScroll } from '../../components/cinematic/ScrollContext'
import type { EducationLevel } from '../../types'

interface DemoPayload {
  level: EducationLevel
  levelLabel: string
  badge: string
  calibration: string
  keywords: string[]
  explanations: Record<string, { question: string; text: string }>
}

const DEMO_CONCEPTS: Record<EducationLevel, DemoPayload> = {
  primary: {
    level: 'primary',
    levelLabel: 'Primary',
    badge: 'Grades 1–5 · Visual Metaphors',
    calibration: 'Calibrated for visual & tangible real-world metaphors with simplified everyday vocabulary.',
    keywords: ['Sunlight (धूप)', 'Water (पानी)', 'Leaves (पत्तियां)', 'Food (भोजन)'],
    explanations: {
      en: {
        question: 'What is photosynthesis?',
        text: 'Plants make their own delicious food using sunlight, water from the soil, and air. The green leaves act like tiny solar kitchens that give off fresh oxygen for us to breathe! 🌱',
      },
      hi: {
        question: 'प्रकाश संश्लेषण (Photosynthesis) क्या है?',
        text: 'पौधे धूप, पानी और हवा की मदद से अपना भोजन खुद बनाते हैं। हरी पत्तियां नन्ही रसोई की तरह काम करती हैं और हमें सांस लेने के लिए ताज़ा ऑक्सीजन देती हैं! 🌱',
      },
      sat: {
        question: 'ᱯᱷᱚᱴᱚᱥᱤᱱᱛᱷᱮᱥᱤᱥ (Photosynthesis) ᱫᱚ ᱪᱮᱫ ᱠᱟᱱᱟ?',
        text: 'ᱫᱟᱨᱮ ᱱᱟᱹᱬᱤ ᱫᱚ ᱥᱤᱛᱩᱝ, ᱫᱟᱜ ᱟᱨ ᱦᱚᱭ ᱛᱮ ᱟᱠᱚᱣᱟᱜ ᱡᱚᱢᱟᱜ ᱟᱠᱚ ᱛᱮᱜᱮ ᱠᱚ ᱵᱮᱱᱟᱣᱟ᱾ ᱥᱟᱠᱟᱢ ᱫᱚ ᱦᱩᱰᱤᱧ ᱪᱩᱞᱦᱟᱹ ᱞᱮᱠᱟ ᱠᱟᱹᱢᱤᱭᱟ ᱟᱨ ᱟᱵᱚ ᱥᱟᱦᱮᱫ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱷᱟ ᱚᱠᱥᱤᱡᱮᱱ ᱮᱢᱚᱜᱼᱟ! 🌱',
      },
      kru: {
        question: 'प्रकाश संश्लेषण (Photosynthesis) इन्द्रा तली?',
        text: 'मन-मसा बीड़ी गहि धूपा, अम अरा हवा ती तंगहै मंडी तंगय कमअनर। हरियर पतई ड़िबा नु रांधा-घर लेखा कनर अरा नमगे सांस ओंना गे ताज़ा ऑक्सीजन चीनर! 🌱',
      },
      as: {
        question: 'সালোকসংশ্লেষণ (Photosynthesis) কি?',
        text: 'উদ্ভিদে সূৰ্যৰ পোহৰ, মাটিৰ পানী আৰু বতাহ ব্যৱহাৰ কৰি নিজৰ খাদ্য নিজে প্ৰস্তুত কৰে। সেউজীয়া পাতবোৰে ক্ষুদ্ৰ ৰান্ধনিঘৰৰ দৰে কাম কৰি আমাক উশাহ ল’বলৈ বিশুদ্ধ অক্সিজেন দিয়ে! 🌱',
      },
    },
  },
  secondary: {
    level: 'secondary',
    levelLabel: 'Secondary',
    badge: 'Grades 6–10 · Conceptual Formulae',
    calibration: 'Calibrated for biochemical terminology, cellular organelles, and balanced chemical transformations.',
    keywords: ['Chloroplast', 'Glucose', 'Carbon Dioxide', 'Cellular Energy'],
    explanations: {
      en: {
        question: 'Explain the mechanism of photosynthesis.',
        text: 'Photosynthesis is the endothermic biochemical process by which chlorophyll pigments in plant chloroplasts convert light energy into chemical energy, synthesizing glucose (C₆H₁₂O₆) from carbon dioxide and water.',
      },
      hi: {
        question: 'प्रकाश संश्लेषण की प्रक्रिया समझाइए।',
        text: 'प्रकाश संश्लेषण वह जैव-रासायनिक प्रक्रिया है जिसमें पौधों के क्लोरोप्लास्ट में मौजूद क्लोरोफिल प्रकाश ऊर्जा को रासायनिक ऊर्जा में बदलकर कार्बन डाइऑक्साइड और पानी से ग्लूकोज बनाते हैं।',
      },
      sat: {
        question: 'ᱯᱷᱚᱴᱚᱥᱤᱱᱛᱷᱮᱥᱤᱥ ᱦᱚᱨᱟ ᱵᱩᱡᱷᱟᱹᱣ ᱢᱮ᱾',
        text: 'ᱯᱷᱚᱴᱚᱥᱤᱱᱛᱷᱮᱥᱤᱥ ᱫᱚ ᱢᱤᱫ ᱡᱤᱣᱤ-ᱨᱟᱥᱟᱭᱚᱱᱤᱠ ᱦᱚᱨᱟ ᱠᱟᱱᱟ ᱡᱟᱦᱟᱸ ᱨᱮ ᱫᱟᱨᱮ ᱨᱮᱭᱟᱜ ᱠᱞᱳᱨᱳᱯᱷᱤᱞ ᱥᱤᱛᱩᱝ ᱫᱟᱲᱮ ᱫᱚ ᱨᱟᱥᱟᱭᱚᱱᱤᱠ ᱫᱟᱲᱮ ᱨᱮ ᱵᱚᱫᱚᱞ ᱠᱟᱛᱮ ᱜᱞᱩᱠᱳᱡᱽ ᱵᱮᱱᱟᱣᱟ᱾',
      },
      kru: {
        question: 'प्रकाश संश्लेषण गहि सांचा बाना।',
        text: 'प्रकाश संश्लेषण अद्दि जैविक-रासायनिक सांचा तली एकसन मन-मसा गहि क्लोरोप्लास्ट नु क्लोरोफिल बीड़ी गहि शक्ति ती रासायनिक शक्ति कमनर अरा ग्लूकोज तयार करनर।',
      },
      as: {
        question: 'সালোকসংশ্লেষণৰ কাৰ্যপ্ৰণালী ব্যাখ্যা কৰা।',
        text: 'সালোকসংশ্লেষণ হৈছে এক জৈৱ-ৰাসায়নিক প্ৰক্ৰিয়া য’ত উদ্ভিদে ক্ল’ৰ’ফিলৰ সহায়ত আলোক শক্তিক ৰাসায়নিক শক্তিলৈ ৰূপান্তৰ কৰি গ্লুক’জ উৎপাদন কৰে।',
      },
    },
  },
  higher_secondary: {
    level: 'higher_secondary',
    levelLabel: 'Higher Sec',
    badge: 'Grades 11–12 · Molecular Pathways',
    calibration: 'Calibrated for molecular reaction pathways, light & dark phases, and thylakoid photolysis.',
    keywords: ['Thylakoid Membrane', 'Calvin Cycle', 'Photolysis', 'ATP / NADPH'],
    explanations: {
      en: {
        question: 'Describe light reactions and dark reactions in photosynthesis.',
        text: 'Photosynthesis comprises two coupled phases: light-dependent reactions in the thylakoid membrane generating ATP and NADPH via water photolysis, and the light-independent Calvin Cycle in the stroma fixing CO₂ into triose phosphates via RuBisCO.',
      },
      hi: {
        question: 'प्रकाशिक और अप्रकाशिक अभिक्रियाओं का वर्णन करें।',
        text: 'प्रकाश संश्लेषण दो चरणों में होता है: थायलाकोइड झिल्ली में प्रकाश-निर्भर अभिक्रियाएं जो जल अपघटन (Photolysis) द्वारा ATP और NADPH बनाती हैं, तथा स्ट्रोमा में केल्विन चक्र जो CO₂ का स्थिरीकरण करता है।',
      },
      sat: {
        question: 'ᱢᱟᱨᱥᱟᱞ ᱟᱨ ᱧᱩᱛ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ ᱵᱤᱥᱲᱤ ᱢᱮ᱾',
        text: 'ᱯᱷᱚᱴᱚᱥᱤᱱᱛᱷᱮᱥᱤᱥ ᱫᱚ ᱵᱟᱨ ᱦᱟᱹᱴᱤᱧ ᱨᱮ ᱦᱩᱭᱩᱜᱼᱟ: ᱛᱷᱟᱭᱞᱟᱠᱳᱭᱮᱰ ᱨᱮ ᱢᱟᱨᱥᱟᱞ ᱠᱟᱹᱢᱤᱦᱚᱨᱟ (ATP ᱟᱨ NADPH ᱵᱮᱱᱟᱣ) ᱟᱨ ᱥᱴᱨᱳᱢᱟ ᱨᱮ ᱠᱮᱞᱵᱷᱤᱱ ᱪᱚᱠᱨᱚ᱾',
      },
      kru: {
        question: 'बीड़ी अरा अंधरिया सांचा गहि बयारा।',
        text: 'प्रकाश संश्लेषण इरबंट सांचा नु मनी: थाइलाकोइड नु बीड़ी-आधारित सांचा एकसन ATP अरा NADPH मनी, अरा स्ट्रोमा नु केल्विन चक्र एकसन CO₂ गहि सांचा मनी।',
      },
      as: {
        question: 'আলোক বিক্ৰিয়া আৰু অন্ধকাৰ বিক্ৰিয়া বৰ্ণনা কৰা।',
        text: 'সালোকসংশ্লেষণ দুটা পৰ্যায়ত সংঘটিত হয়: থাইলাকইড আৱৰণীত আলোক-নিৰ্ভৰশীল বিক্ৰিয়া (ATP আৰু NADPH উৎপাদন) আৰু ষ্ট্ৰ’মাত কেলভিন চক্ৰ।',
      },
    },
  },
  college: {
    level: 'college',
    levelLabel: 'College',
    badge: 'Undergraduate · Biophysical Kinetics',
    calibration: 'Calibrated for quantum resonance energy transfer, Z-scheme redox potentials, and RuBisCO kinetics.',
    keywords: ['Photosystem II / I', 'Resonance Transfer', 'RuBisCO Oxygenase', 'Chemiosmosis'],
    explanations: {
      en: {
        question: 'Analyze quantum coherence and non-photochemical quenching in Photosystem II.',
        text: 'Exciton migration across light-harvesting antenna complexes (LHCII) exhibits ultrafast Förster resonance energy transfer to P680 reaction centers with ~98% quantum efficiency. Non-photochemical quenching (NPQ) modulates thermal dissipation under high photon flux.',
      },
      hi: {
        question: 'फोटोसिस्टम II में क्वांटम रेजोनेंस और इलेक्ट्रॉन प्रवाह का विश्लेषण करें।',
        text: 'LHCII एंटीना कॉम्प्लेक्स में एक्सिटॉन ट्रांसफर P680 रिएक्शन सेंटर तक ~98% क्वांटम दक्षता से ऊर्जा स्थानांतरित करता है। उच्च प्रकाश तीव्रता में NPQ थर्मल ऊर्जा के रूप में अतिरिक्त ऊर्जा को सुरक्षित नष्ट करता है।',
      },
      sat: {
        question: 'Z-scheme ᱤᱞᱮᱠᱴᱨᱚᱱ ᱦᱮᱡ-ᱥᱮᱱ ᱵᱤᱪᱟᱹᱨ ᱢᱮ᱾',
        text: 'P680 ᱟᱨ P700 ᱨᱮ ᱢᱟᱨᱥᱟᱞ ᱴᱟᱱᱟᱣ ᱠᱟᱛᱮ ᱥᱟᱭᱴᱳᱠᱨᱳᱢ b₆f ᱛᱟᱞᱟ ᱛᱮ ᱤᱞᱮᱠᱴᱨᱚᱱ ᱥᱮᱱᱚᱜᱼᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱯᱨᱳᱴᱳᱱ ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ ATP ᱵᱮᱱᱟᱣ ᱫᱟᱲᱮᱭᱟᱜᱼᱟ᱾',
      },
      kru: {
        question: 'Z-स्कीम इलेक्ट्रॉन सांचा अरा केमियोस्मोसिस समझ।',
        text: 'P680 अरा P700 नु बीड़ी खीचन ती साइटोक्रोम b₆f ती इलेक्ट्रॉन गहि बहाव मनी, अद्दि प्रोटॉन ग्रेडिएंट कमनर अरा ATP सिंथेस गे शक्ति चीनर।',
      },
      as: {
        question: 'Z-স্কিম ইলেক্ট্ৰন পৰিবহণ আৰু কেমিঅ’স্মটিক সংশ্লেষণ বিশ্লেষণ কৰা।',
        text: 'P680 আৰু P700 বিক্ৰিয়া কেন্দ্ৰত আলোক শোষণে ছাইট’ক্ৰ’ম b₆f জটিলৰ মাজেৰে ইলেক্ট্ৰন প্ৰৱাহ চলায়, যিয়ে প্ৰটন গ্ৰেডিয়েণ্ট স্থাপন কৰি ATP চিন্থেজক শক্তি যোগায়।',
      },
    },
  },
  professional: {
    level: 'professional',
    levelLabel: 'Professional',
    badge: 'Research & Applied · Synthetic Biology',
    calibration: 'Calibrated for synthetic carbon fixation pathways, artificial photocatalytic water splitting, and metabolic engineering.',
    keywords: ['CETCH Cycle', 'Artificial Leaf', 'Quantum Electrodynamics', 'Electrocatalytic CO2'],
    explanations: {
      en: {
        question: 'Evaluate synthetic carbon-fixing bypasses to overcome RuBisCO oxygenation.',
        text: 'Engineering non-natural carbon-concentrating mechanisms via in-vitro enzyme cascades (such as the CETCH cycle) achieves a 20% higher ATP-to-biomass conversion efficiency compared to natural C3 pathways, circumventing photorespiration losses.',
      },
      hi: {
        question: 'RuBisCO की सीमाओं को दूर करने के लिए सिंथेटिक कार्बन फिक्सेशन का मूल्यांकन करें।',
        text: 'सिंथेटिक एंजाइम कैस्केड (जैसे CETCH चक्र) द्वारा इन-विट्रो कार्बन-कंसंट्रेटिंग सिस्टम प्राकृतिक C3 मार्गों की तुलना में 20% अधिक ATP-से-बायोमास दक्षता प्राप्त करते हैं, जिससे फोटोरेस्पिरेशन का नुकसान समाप्त होता है।',
      },
      sat: {
        question: 'ᱠᱣᱟᱱᱴᱟᱢ ᱫᱟᱲᱮ ᱟᱨ ᱥᱤᱱᱛᱷᱮᱴᱤᱠ ᱯᱷᱚᱴᱚᱥᱤᱱᱛᱷᱮᱥᱤᱥ ᱵᱤᱪᱟᱹᱨ ᱢᱮ᱾',
        text: 'LHCII ᱠᱚᱢᱯᱞᱮᱠᱥ ᱨᱮ FRET ᱦᱚᱛᱮᱛᱮ ᱠᱣᱟᱱᱴᱟᱢ ᱠᱳᱦᱮᱨᱮᱱᱥ ᱧᱮᱞᱚᱜᱼᱟ᱾ ᱱᱟᱦᱟᱜ ᱵᱟᱭᱳ-ᱤᱧᱡᱤᱱᱤᱭᱟᱨᱤᱝ RuBisCO ᱫᱟᱲᱮ ᱵᱟᱹᱲᱛᱤ ᱠᱟᱛᱮ ᱡᱚᱢᱟᱜ ᱟᱨᱡᱟᱣ ᱵᱟᱹᱲᱛᱤ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱹᱢᱤ ᱠᱟᱱᱟ᱾',
      },
      kru: {
        question: 'क्वांटम शक्ति अरा सिंथेटिक प्रकाश संश्लेषण समझ।',
        text: 'LHCII कॉम्प्लेक्स नु FRET ती क्वांटम कोहेरेंस सांचा ईनर। आधुनिक बायोइंजीनियरिंग RuBisCO गहि क्षमता बढ़ाबा गे अरा फसल पैदावार बढ़ाबा गे काम करनर।',
      },
      as: {
        question: 'কোৱাণ্টাম শক্তি পৰিবহণ আৰু সংশ্লেষিত সালোকসংশ্লেষণ প্ৰণালী পৰীক্ষা।',
        text: 'LHCII কমপ্লেক্সত FRET ৰ জৰিয়তে কোৱাণ্টাম সংগতি প্ৰদৰ্শিত হয়। আধুনিক জৈৱ-প্ৰযুক্তিয়ে RuBisCO-ৰ কাৰ্যক্ষমতা বৃদ্ধি কৰি শস্য উৎপাদন উন্নত কৰিবলৈ গৱেষণা চলাইছে।',
      },
    },
  },
}

export function AdaptiveScene() {
  const { progress } = useExperienceScroll()
  const { educationLevel, setEducationLevel, selectedLanguageId, setSelectedLanguageId, setAssistantState } = useAppStore()
  const [selectedDemoLevel, setSelectedDemoLevel] = useState<EducationLevel>(educationLevel)

  let opacity = 0
  if (progress >= 0.58 && progress <= 0.84) {
    if (progress < 0.66) {
      opacity = (progress - 0.58) / 0.08
    } else if (progress > 0.76) {
      opacity = 1 - (progress - 0.76) / 0.08
    } else {
      opacity = 1
    }
  }

  const currentLevel = selectedDemoLevel || educationLevel || 'primary'
  const currentContent = DEMO_CONCEPTS[currentLevel] ?? DEMO_CONCEPTS.primary
  const currentExplanation =
    currentContent.explanations[selectedLanguageId] ??
    currentContent.explanations.en ??
    currentContent.explanations.hi

  const handleLevelChange = (lvl: EducationLevel) => {
    setSelectedDemoLevel(lvl)
    setEducationLevel(lvl)
    setAssistantState({ mode: 'thinking', message: `Adapting to ${lvl}` })
    setTimeout(() => {
      setAssistantState({ mode: 'idle', message: null })
    }, 1000)
  }

  const handleSpeak = () => {
    if (!currentExplanation) return
    const lang = getLanguageById(selectedLanguageId)
    speechService.speak(currentExplanation.text, lang?.locale || 'en-IN')
  }

  const handleNextSection = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    window.scrollTo({
      top: 0.88 * scrollHeight,
      behavior: 'smooth',
    })
  }

  const levels: EducationLevel[] = ['primary', 'secondary', 'higher_secondary', 'college', 'professional']

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
            <span>Adaptive Intelligence</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#171717]">
            Same question. Different level-appropriate explanation.
          </h2>
          <p className="font-serif text-base sm:text-lg text-[#525252] max-w-lg mx-auto">
            Experience how BhashaMitra instantly shifts explanation models from elementary stories to research mechanics.
          </p>
        </div>

        {/* Interactive Adaptive Demo Console */}
        <GlassCard variant="default" padding="lg" className="text-left border-black/[0.08] shadow-editorial">
          
          {/* Level Switcher Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-black/[0.06]">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F5F4EF] border border-black/[0.06] overflow-x-auto no-scrollbar w-full sm:w-auto">
              {levels.map((lvl) => {
                const isActive = currentLevel === lvl
                return (
                  <button
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={[
                      'px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
                      isActive
                        ? 'bg-[#171717] text-white font-semibold shadow-sm'
                        : 'text-[#525252] hover:text-[#171717] hover:bg-white/60',
                    ].join(' ')}
                  >
                    {DEMO_CONCEPTS[lvl].levelLabel}
                  </button>
                )
              })}
            </div>

            {/* Language Selection Pills */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              <Globe size={13} className="text-indigo-600 shrink-0" />
              <div className="flex items-center gap-1 bg-[#F5F4EF] p-1 rounded-lg border border-black/[0.06] overflow-x-auto max-w-xs sm:max-w-md">
                {['hi', 'en', 'sat', 'kru', 'bhili', 'as'].map((code) => {
                  const l = getLanguageById(code)
                  if (!l) return null
                  const isSelected = selectedLanguageId === code
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedLanguageId(code)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all shrink-0 ${
                        isSelected
                          ? 'bg-[#171717] text-white font-semibold shadow-xs'
                          : 'text-[#525252] hover:text-[#171717]'
                      }`}
                    >
                      {l.nativeName}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="pt-4 pb-2">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Depth Calibration & Vernacular Translation
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentContent.badge}
              </span>
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#171717] tracking-tight">
              "{currentExplanation.question}"
            </h3>
          </div>

          {/* Dynamic Explanation Crossfade */}
          <div className="relative min-h-[110px] p-4 sm:p-5 rounded-xl bg-[#FAF9F6] border border-black/[0.05] my-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentLevel}-${selectedLanguageId}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="space-y-3"
              >
                <p className="text-xs sm:text-sm text-[#262626] leading-relaxed">
                  {currentExplanation.text}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-black/[0.05]">
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-[#737373]">
                    Keywords:
                  </span>
                  {currentContent.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-black/[0.06] text-[10px] font-medium text-[#404040] shadow-xs"
                    >
                      <CheckCircle2 size={10} className="text-indigo-600" />
                      {kw}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 text-[11px] text-[#737373]">
            <div className="flex items-center gap-1.5">
              <Layers size={12} className="text-violet-600 shrink-0" />
              <span>{currentContent.calibration}</span>
            </div>

            <button
              onClick={handleSpeak}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-[#F5F4EF] border border-black/[0.08] text-xs text-[#171717] transition-all font-medium cursor-pointer shadow-xs shrink-0"
              title="Listen to Vernacular Audio"
            >
              <Volume2 size={13} className="text-indigo-600" />
              <span>Audio Voice</span>
            </button>
          </div>
        </GlassCard>

        {/* Continue to Tutor Scene */}
        <div className="pt-2">
          <Button
            variant="primary"
            size="md"
            onClick={handleNextSection}
            icon={<ArrowRight size={16} />}
            iconPosition="right"
          >
            Enter Full AI Tutor
          </Button>
        </div>
      </div>
    </section>
  )
}
