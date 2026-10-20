import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Volume2, Globe, Layers, Brain, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { useAppStore } from '../../store/useAppStore'
import { getLanguageById } from '../../data/languages'
import { speechService } from '../../services/speech'

export type EducationLevel = 'Primary' | 'Secondary' | 'Higher Secondary' | 'College' | 'Professional'

interface ExplanationContent {
  level: EducationLevel
  badge: string
  calibration: string
  keywords: string[]
  explanations: Record<string, { question: string; text: string }>
}

const ADAPTIVE_DATA: Record<EducationLevel, ExplanationContent> = {
  Primary: {
    level: 'Primary',
    badge: 'Grades 1–5 · Foundation',
    calibration: 'Calibrated for visual & tangible real-world metaphors with simplified vocabulary.',
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
  Secondary: {
    level: 'Secondary',
    badge: 'Grades 6–10 · Conceptual',
    calibration: 'Calibrated for biochemical terminology, cellular organelles, and balanced reactions.',
    keywords: ['Chloroplast', 'Glucose', 'Carbon Dioxide', 'Cellular Energy'],
    explanations: {
      en: {
        question: 'Explain the mechanism of photosynthesis.',
        text: 'Photosynthesis is the endothermic biochemical process by which chlorophyll pigments in plant chloroplasts convert light energy into chemical energy, synthesizing glucose (C₆H₁₂O₆) from carbon dioxide and water.',
      },
      hi: {
        question: 'प्रकाश संश्लेषण की प्रक्रिया समझाइए।',
        text: 'प्रकाश संश्लेषण वह जैव-रासायनिक प्रक्रिया है जिसमें पौधों के क्लोरोप्लास्ट में मौजूद क्लोरोफिल प्रकाश ऊर्जा को रासायनिक ऊर्जा में बदलकर कार्बन डाइऑक्साइड और पानी से ग्लूकोज (ऊर्जा) बनाते हैं।',
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
  'Higher Secondary': {
    level: 'Higher Secondary',
    badge: 'Grades 11–12 · Advanced',
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
  College: {
    level: 'College',
    badge: 'Undergraduate · Specialized',
    calibration: 'Calibrated for biophysical electron transport, Z-scheme kinetics, and enzyme thermodynamics.',
    keywords: ['Photosystem I & II', 'RuBisCO Kinetics', 'Proton Gradient', 'Chemiosmosis'],
    explanations: {
      en: {
        question: 'Analyze the Z-scheme electron transport and chemiosmotic ATP synthesis.',
        text: 'Light absorption by P680 and P700 reaction centers drives non-cyclic electron flow through the cytochrome b₆f complex. This establishes a transmembrane electrochemical proton gradient (ΔpH) across the thylakoid lumen that powers CF₀-CF₁ ATP synthase.',
      },
      hi: {
        question: 'Z-स्कीम इलेक्ट्रॉन परिवहन तथा कीमियोस्मोसिस का विश्लेषण करें।',
        text: 'P680 तथा P700 अभिक्रिया केंद्रों द्वारा फोटॉन अवशोषण से साइटोक्रोम b₆f कॉम्प्लेक्स के माध्यम से नॉन-साइक्लिक इलेक्ट्रॉन प्रवाह होता है, जो थायलाकोइड ल्यूमेन में प्रोटॉन ग्रेडिएंट (ΔpH) स्थापित कर ATP सिंथेस को ऊर्जा प्रदान करता है।',
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
  Professional: {
    level: 'Professional',
    badge: 'Research & Applied Engineering',
    calibration: 'Calibrated for quantum coherence in LHC complexes and genetic engineering of C4/CAM synthetic pathways.',
    keywords: ['Quantum Coherence', 'LHCII Complexes', 'RuBisCO Oxygenase Ratio', 'Synthetic Carbon Fixation'],
    explanations: {
      en: {
        question: 'Examine quantum excitation transfer and catalytic optimizations in synthetic photosynthetic systems.',
        text: 'Excitonic coupling in trimeric LHCII complexes demonstrates room-temperature quantum coherence in Förster resonance energy transfer (FRET). Current bioengineering targets altering the carboxylation-to-oxygenation specificity of RuBisCO to circumvent photorespiratory energy penalties in transgenic crops.',
      },
      hi: {
        question: 'सिंथेटिक प्रकाश संश्लेषक प्रणालियों में क्वांटम ऊर्जा स्थानांतरण का विश्लेषण।',
        text: 'LHCII कॉम्प्लेक्स में एक्साइटोनिक कपलिंग FRET के अंतर्गत क्वांटम कोहेरेंस प्रदर्शित करती है। आधुनिक बायोइंजीनियरिंग ट्रांसजेनिक फसलों में प्रकाश-श्वसन (photorespiration) के नुकसान को कम करने हेतु RuBisCO की उत्प्रेरक दक्षता को पुनः इंजीनियर कर रही है।',
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

export function AdaptiveLearningDemo() {
  const { selectedLanguageId, setSelectedLanguageId, setAssistantState } = useAppStore()
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>('Primary')

  // Fallback to English if active language doesn't have custom copy
  const activeLangId = ADAPTIVE_DATA[selectedLevel].explanations[selectedLanguageId]
    ? selectedLanguageId
    : 'en'

  const currentLang = getLanguageById(selectedLanguageId)
  const currentContent = ADAPTIVE_DATA[selectedLevel]
  const currentExplanation = currentContent.explanations[activeLangId] ?? currentContent.explanations.en

  const levels: EducationLevel[] = ['Primary', 'Secondary', 'Higher Secondary', 'College', 'Professional']

  const handleSpeak = async () => {
    setAssistantState({ mode: 'speaking', message: currentExplanation.text })
    try {
      await speechService.speak(currentExplanation.text, currentLang?.locale ?? 'en-IN')
    } catch (e) {
      console.warn(e)
    } finally {
      setAssistantState({ mode: 'idle', message: null })
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3 shadow-glass-subtle">
          <Sparkles size={13} className="text-cyan-400" />
          Interactive Pedagogy Demonstration
        </div>
        <h2 className="text-heading sm:text-4xl font-extrabold text-white tracking-tight">
          One Question. <span className="gradient-text-cyan">Infinite Adaptations.</span>
        </h2>
        <p className="text-secondary sm:text-base max-w-xl mx-auto mt-2 text-slate-400">
          Switch education levels or languages below to see how BhashaMitra dynamically calibrates explanation depth, vocabulary, and conceptual frameworks.
        </p>
      </div>

      {/* Demo Container */}
      <GlassCard variant="highlighted" padding="lg" className="border-cyan-500/30">
        {/* Top Control Bar: Education Level Segments */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          {/* Level Segmented Buttons */}
          <div className="w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-cinema-900/90 border border-white/[0.08] backdrop-blur-xl">
              {levels.map((lvl) => {
                const isActive = selectedLevel === lvl
                return (
                  <button
                    key={lvl}
                    onClick={() => setSelectedLevel(lvl)}
                    className={[
                      'px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-cinema-950 font-bold shadow-glow-cyan'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]',
                    ].join(' ')}
                  >
                    {lvl}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Language Switcher Dropdown / Pills */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <Globe size={14} className="text-cyan-400 shrink-0" />
            <span className="text-xs text-slate-400 font-medium">Demo Language:</span>
            <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.07] overflow-x-auto max-w-xs sm:max-w-md">
              {['hi', 'en', 'sat', 'kru', 'bhili', 'as'].map((code) => {
                const l = getLanguageById(code)
                if (!l) return null
                const isSelected = selectedLanguageId === code
                return (
                  <button
                    key={code}
                    onClick={() => setSelectedLanguageId(code)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.nativeName}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Question Prompt Header */}
        <div className="pt-6 pb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Brain size={13} /> Concept Query
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              {currentContent.badge}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            "{currentExplanation.question}"
          </h3>
        </div>

        {/* Dynamic Explanation Content Box with Crossfade */}
        <div className="relative min-h-[140px] p-5 sm:p-6 rounded-2xl bg-cinema-900/70 border border-white/[0.06] backdrop-blur-2xl my-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedLevel}-${selectedLanguageId}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              {/* Explanation Text */}
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
                {currentExplanation.text}
              </p>

              {/* Keywords / Concept Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.05]">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mr-1">
                  Core Entities:
                </span>
                {currentContent.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/[0.07] border border-cyan-500/20 text-[11px] font-medium text-cyan-300"
                  >
                    <CheckCircle2 size={11} className="text-cyan-400" />
                    {kw}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer info: Calibration Rationale & Listen button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Layers size={13} className="text-violet-400 shrink-0" />
            <span>{currentContent.calibration}</span>
          </div>

          <button
            onClick={handleSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-400/40 text-xs text-cyan-300 transition-all font-medium cursor-pointer shrink-0"
            title="Listen to Vernacular Speech"
          >
            <Volume2 size={14} />
            Listen (Audio AI)
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
