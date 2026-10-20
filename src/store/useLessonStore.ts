import { create } from 'zustand'
import { Lesson, LessonFormData } from '../types/lesson'

const STORAGE_KEY = 'bhashamitra_subject_lessons_v3'

const DEFAULT_LESSONS: Lesson[] = [
  // ── 1. Hindi (hin) ──
  {
    id: 'hin-01',
    subjectId: 'hin',
    lessonNumber: '01',
    title: 'व्याकरण एवं वर्णमाला',
    description: 'हिंदी वर्णमाला, स्वर, व्यंजन एवं वाक्य रचना की मूलभूत अवधारणाएं।',
    content: `हिंदी भाषा की सबसे छोटी इकाई ध्वनि है, जिसे वर्ण कहते हैं। वर्णों के व्यवस्थित समूह को वर्णमाला कहते हैं।

### प्रमुख विषय:
1. **स्वर एवं व्यंजन**: हिंदी वर्णमाला में 11 स्वर और 33 मुख्य व्यंजन हैं।
2. **संधि**: दो निकटवर्ती वर्णों के परस्पर मेल से जो विकार उत्पन्न होता है।
3. **शब्द भेद**: तत्सम, तद्भव, देशज और विदेशी शब्द।`,
    material: 'हिंदी वर्णमाला एवं संधि अभ्यास तालिका (PDF)',
    duration: '15 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Hindi Grammar & Alphabet',
        description: 'Basic concepts of Hindi alphabet, vowels, consonants, and sentence formation.',
        content: `The smallest unit of the Hindi language is sound, known as a Varna. A systematic group of Varnas is called the Varnamala (Alphabet).

### Key Topics:
1. **Vowels & Consonants**: The Hindi alphabet consists of 11 vowels and 33 primary consonants.
2. **Sandhi**: The sound modification resulting from the combination of two adjacent letters.
3. **Word Types**: Tatsama, Tadbhava, Deshaj, and Foreign origin words.`,
      },
      kru: {
        title: 'हिंदी कथारूप अरा वर्णमाला (Hindi Grammar & Alphabet)',
        description: 'हिंदी वर्णमाला, स्वर अरा व्यंजन गहि संचे बाना।',
        content: `हिंदी बाना गहि एकाड़े सांचा तली वर्णमाला।

### मुख्य कथारूप:
1. **स्वर अरा व्यंजन**: हिंदी वर्णमाला नु 11 स्वर अरा 33 मुख्य व्यंजन मनी।
2. **वर्ण संचे**: इन्द्रा इन्द्रा बाना अरा संचे।`,
      },
      sat: {
        title: 'ᱦᱤᱱᱫᱤ ᱨᱚᱱᱚᱲ ᱟᱨ ᱪᱤᱠᱤ (Hindi Grammar & Alphabet)',
        description: 'ᱦᱤᱱᱫᱤ ᱪᱤᱠᱤ, ᱨᱟᱦᱟ ᱟᱲᱟᱝ, ᱠᱮᱪᱮᱫ ᱟᱲᱟᱝ ᱟᱨ ᱟᱹᱭᱟᱹᱛ ᱜᱟᱵᱟᱱ ᱨᱮᱭᱟᱜ ᱢᱩᱬᱩᱛ ᱠᱟᱛᱷᱟ᱾',
        content: `ᱦᱤᱱᱫᱤ ᱯᱟᱹᱨᱥᱤ ᱨᱮᱭᱟᱜ ᱡᱚᱛᱚ ᱠᱷᱚᱱ ᱦᱩᱰᱤᱧ ᱦᱤᱸᱥ ᱫᱚ ᱥᱟᱰᱮ ᱠᱟᱱᱟ, ᱡᱟᱦᱟᱸ ᱫᱚ ᱵᱚᱨᱱᱚ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ᱾ ᱵᱚᱨᱱᱚ ᱠᱚ ᱥᱟᱡᱟᱣ ᱠᱟᱛᱮ ᱪᱤᱠᱤ ᱢᱟᱞᱟ ᱵᱮᱱᱟᱣᱜᱼᱟ᱾

### ᱢᱩᱬᱩᱛ ᱠᱟᱛᱷᱟ:
1. **ᱨᱟᱦᱟ ᱟᱲᱟᱝ ᱟᱨ ᱠᱮᱪᱮᱫ ᱟᱲᱟᱝ**: ᱦᱤᱱᱫᱤ ᱪᱤᱠᱤ ᱢᱟᱞᱟ ᱨᱮ ᱑᱑ ᱜᱚᱴᱟᱝ ᱨᱟᱦᱟ ᱟᱲᱟᱝ ᱟᱨ ᱓᱓ ᱜᱚᱴᱟᱝ ᱠᱮᱪᱮᱫ ᱟᱲᱟᱝ ᱢᱮᱱᱟᱜᱼᱟ᱾
2. **ᱟᱹᱲᱟᱹ ᱜᱟᱵᱟᱱ**: ᱟᱹᱲᱟᱹ ᱵᱮᱱᱟᱣ ᱟᱨ ᱟᱹᱭᱟᱹᱛ ᱥᱟᱡᱟᱣ᱾`,
      },
      kui: {
        title: 'ହିନ୍ଦୀ ବ୍ୟାକରଣ ଆରୁ ବର୍ଣ୍ଣମାଳା (Hindi Grammar & Alphabet)',
        description: 'ହିନ୍ଦୀ ବର୍ଣ୍ଣମାଳା, ସ୍ୱର, ବ୍ୟଞ୍ଜନ ଆରୁ ବାକ୍ୟ ଗଠନ ର ମୂଳ କଥା।',
        content: `ହିନ୍ଦୀ ଭାଷା ର ସବୁଠୁ ସାନ ଏକକ ହେଉଛି ଧ୍ୱନି, ଯାହାକୁ ବର୍ଣ୍ଣ କୁହାଯାଏ। ବର୍ଣ୍ଣମାଳା ହେଉଛି ବର୍ଣ୍ଣ ଗୁଡ଼ିକର ସଜାଣି।

### ମୁଖ୍ୟ କଥା:
1. **ସ୍ୱର ଆରୁ ବ୍ୟଞ୍ଜନ**: ହିନ୍ଦୀ ବର୍ଣ୍ଣମାଳା ରେ ୧୧ ଟି ସ୍ୱର ଆରୁ ୩୩ ଟି ମୁଖ୍ୟ ବ୍ୟଞ୍ଜନ ଅଛି।
2. **ବାକ୍ୟ ଗଠନ**: ଶବ୍ଦ ଆରୁ ବାକ୍ୟ ସଜାଣି।`,
      },
    },
  },
  {
    id: 'hin-02',
    subjectId: 'hin',
    lessonNumber: '02',
    title: 'गद्य एवं काव्य साहित्य',
    description: 'प्रसिद्ध कवियों तथा गद्यकारों की रचनाओं का पठन एवं विश्लेषण।',
    content: `हिंदी साहित्य का इतिहास अत्यंत समृद्ध है। इसे चार प्रमुख कालों में विभाजित किया गया है: आदिकाल, भक्ति काल, रीति काल और आधुनिक काल।

### मुख्य बिंदू:
- **कबीर एवं तुलसीदास**: भक्ति काल के कालजयी कवि।
- **मुंशी प्रेमचंद**: आधुनिक गद्य एवं उपन्यास सम्राट।`,
    material: 'हिंदी साहित्य प्रश्नोत्तरी एवं कविता पाठ',
    duration: '18 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Prose & Poetry Literature',
        description: 'Reading and analytical study of renowned poets and prose authors.',
        content: `Hindi literary history is rich and diverse, categorized into four eras: Adi Kaal, Bhakti Kaal, Riti Kaal, and Modern Era.

### Key Points:
- **Kabir & Tulsidas**: Legendary poets of the Bhakti movement.
- **Munshi Premchand**: Emperor of modern prose and novels.`,
      },
    },
  },

  // ── 2. English (eng) ──
  {
    id: 'eng-01',
    subjectId: 'eng',
    lessonNumber: '01',
    title: 'Grammar Fundamentals',
    description: 'Master parts of speech, tenses, subject-verb agreement, and sentence structure.',
    content: `English grammar provides the essential rules governing sentence construction and communication clarity.

### Core Concepts:
1. **Nouns, Verbs & Adjectives**: Identification and placement in sentences.
2. **Tenses**: Present, Past, and Future tense forms (Simple, Continuous, Perfect).
3. **Active vs Passive Voice**: Shifting focus between subject and action object.`,
    material: 'English Grammar Rules & Practice Exercises',
    duration: '16 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Grammar Fundamentals',
        description: 'Master parts of speech, tenses, subject-verb agreement, and sentence structure.',
        content: `English grammar provides the essential rules governing sentence construction and communication clarity.

### Core Concepts:
1. **Nouns, Verbs & Adjectives**: Identification and placement in sentences.
2. **Tenses**: Present, Past, and Future tense forms (Simple, Continuous, Perfect).
3. **Active vs Passive Voice**: Shifting focus between subject and action object.`,
      },
      kru: {
        title: 'अंग्रेजी व्याकरण अरा कथारूप (Grammar Fundamentals)',
        description: 'पड़हा-गुणी कथारूप, कुड़ुख अरा अंग्रेजी तुड़ना गहि सांचा।',
        content: `अंग्रेजी व्याकरण तुड़ना अरा बाना गहि संचे सांचा तली।

### मुख्य कथारूप:
1. **नाम (Nouns) अरा क्रिया (Verbs)**: तुड़ना अरा बाना महतव।
2. **समय (Tenses)**: ईसगुम समय, बीती समय अरा बोंओं समय।
3. **कथा सांचा**: बाना अरा पिरोआ कथारूप।`,
      },
    },
  },
  {
    id: 'eng-02',
    subjectId: 'eng',
    lessonNumber: '02',
    title: 'Reading & Comprehension',
    description: 'Critical reading strategies, passage summarizing, and inference skills.',
    content: `Comprehension involves decoding text, making logical inferences, and analyzing author intent.

### Key Skills:
- **Skimming & Scanning**: Quickly identifying key topics and specific facts.
- **Context Clues**: Inferring unknown vocabulary meanings from sentence context.`,
    material: 'Comprehension Passages & Solved Questions',
    duration: '20 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Reading & Comprehension',
        description: 'Critical reading strategies, passage summarizing, and inference skills.',
        content: `Comprehension involves decoding text, making logical inferences, and analyzing author intent.

### Key Skills:
- **Skimming & Scanning**: Quickly identifying key topics and specific facts.
- **Context Clues**: Inferring unknown vocabulary meanings from sentence context.`,
      },
    },
  },

  // ── 3. Basic Mathematics (math) ──
  {
    id: 'math-01',
    subjectId: 'math',
    lessonNumber: '01',
    title: 'Number Systems & Basic Algebra',
    description: 'Integers, rational numbers, BODMAS rules, and simple algebraic equations.',
    content: `Mathematics begins with understanding numbers and basic operations.

### Key Topics:
1. **Order of Operations (BODMAS)**: Brackets → Orders → Division → Multiplication → Addition → Subtraction.
2. **Linear Equations**: Solving single-variable equations of the form ax + b = c.
3. **Fractions & Percentages**: Conversions and practical applications.`,
    material: 'Algebra Formula Sheet & Solved Practice Problems',
    duration: '18 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Number Systems & Basic Algebra',
        description: 'Integers, rational numbers, BODMAS rules, and simple algebraic equations.',
        content: `Mathematics begins with understanding numbers and basic operations.

### Key Topics:
1. **Order of Operations (BODMAS)**: Brackets → Orders → Division → Multiplication → Addition → Subtraction.
2. **Linear Equations**: Solving single-variable equations of the form ax + b = c.
3. **Fractions & Percentages**: Conversions and practical applications.`,
      },
      kru: {
        title: 'लेखा अरा बीजगणित (Number Systems & Algebra)',
        description: 'गिनती, संचे लेखा, BODMAS सांचा अरा बीजगणित समीकरण।',
        content: `गणित गहि शुरुआत लेखा अरा जोड़-घटाव ती मनी।

### मुख्य विषय:
1. **लेखा नियम (BODMAS)**: कोष्ठक → भाग → गुणा → जोड़ → घटाव।
2. **समीकरण (Linear Equations)**: ax + b = c रूप गहि समीकरण।
3. **भिन्न अरा प्रतिशत**: लेखा संचे।`,
      },
    },
  },
  {
    id: 'math-02',
    subjectId: 'math',
    lessonNumber: '02',
    title: 'Geometry & Measurement',
    description: '2D and 3D geometric shapes, angles, perimeter, area, and volume formulas.',
    content: `Geometry examines the properties and relations of points, lines, surfaces, and solids.

### Key Formulas:
- **Perimeter of Rectangle**: 2 × (Length + Width)
- **Area of Circle**: π × r²
- **Pythagoras Theorem**: a² + b² = c² (for right-angled triangles)`,
    material: 'Geometric Shapes & Measurement Guide',
    duration: '22 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Geometry & Measurement',
        description: '2D and 3D geometric shapes, angles, perimeter, area, and volume formulas.',
        content: `Geometry examines the properties and relations of points, lines, surfaces, and solids.

### Key Formulas:
- **Perimeter of Rectangle**: 2 × (Length + Width)
- **Area of Circle**: π × r²
- **Pythagoras Theorem**: a² + b² = c² (for right-angled triangles)`,
      },
    },
  },

  // ── 4. AI (ai) ──
  {
    id: 'ai-01',
    subjectId: 'ai',
    lessonNumber: '01',
    title: 'Introduction to Artificial Intelligence',
    description: 'Core concepts of AI, machine intelligence, natural language processing, and real-world applications.',
    content: `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think and learn.

### Fundamentals:
1. **Machine Learning (ML)**: Algorithms that learn from data without explicit hardcoding.
2. **Natural Language Processing (NLP)**: Enabling computers to understand and generate human languages.
3. **Computer Vision**: Processing and analyzing visual information from images and video.`,
    material: 'AI Concepts Cheat Sheet & Interactive Architecture Diagram',
    duration: '15 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Introduction to Artificial Intelligence',
        description: 'Core concepts of AI, machine intelligence, natural language processing, and real-world applications.',
        content: `Artificial Intelligence (AI) refers to the simulation of human intelligence in machines programmed to think and learn.

### Fundamentals:
1. **Machine Learning (ML)**: Algorithms that learn from data without explicit hardcoding.
2. **Natural Language Processing (NLP)**: Enabling computers to understand and generate human languages.
3. **Computer Vision**: Processing and analyzing visual information from images and video.`,
      },
      kru: {
        title: 'आर्टिफिशियल इंटेलिजेंस गहि परिचय (Intro to AI)',
        description: 'AI गहि संचे, मशीन ज्ञान अरा क्षेत्रीय भासा समझ।',
        content: `आर्टिफिशियल इंटेलिजेंस (AI) मानवा गहि ज्ञान नू कम्प्यूटर गहि सांचा तली।

### मुख्य विषय:
1. **मशीन लर्निंग (ML)**: डेटा ती सीखन मशीन सांचा।
2. **नेचुरल लैंग्वेज प्रोसेसिंग (NLP)**: भासा समझ अरा तुड़ना।
3. **कम्प्यूटर विजन**: फोटो अरा वीडियो समझ।`,
      },
    },
  },
  {
    id: 'ai-02',
    subjectId: 'ai',
    lessonNumber: '02',
    title: 'Machine Learning & BhashaMitra',
    description: 'Neural networks, regional language synthesis, and real-time speech translation models.',
    content: `BhashaMitra combines speech recognition, neural translation, and text-to-speech engines calibrated for regional dialects.

### Workflow:
- **Speech-to-Text (STT)**: Converting audio waveforms into text transcripts.
- **Neural Translation**: Mapping source text into target Indian regional languages.
- **Text-to-Speech (TTS)**: Synthesizing natural-sounding voice responses in regional accents.`,
    material: 'BhashaMitra Pipeline & Demo Guide',
    duration: '20 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Machine Learning & BhashaMitra',
        description: 'Neural networks, regional language synthesis, and real-time speech translation models.',
        content: `BhashaMitra combines speech recognition, neural translation, and text-to-speech engines calibrated for regional dialects.

### Workflow:
- **Speech-to-Text (STT)**: Converting audio waveforms into text transcripts.
- **Neural Translation**: Mapping source text into target Indian regional languages.
- **Text-to-Speech (TTS)**: Synthesizing natural-sounding voice responses in regional accents.`,
      },
      kru: {
        title: 'मशीन लर्निंग अरा भाषा मित्र (ML & BhashaMitra)',
        description: 'न्यूरल नेटवर्क, कुड़ुख अरा क्षेत्रीय भासा अनुवाद।',
        content: `भाषा मित्र कुड़ुख अरा भारत गहि क्षेत्रीय भासा गहि अनुवाद अरा शब्द सांचा तली।

### काम गहि तरीका:
- **कथा ती तुड़ना (STT)**: बाना कथा नू तुड़ना।
- **भासा अनुवाद (Translation)**: एकाड़े भासा ती कुड़ुख नू बदलना।
- **तुड़ना ती बाना (TTS)**: तुड़ना कथा नू आवाज़ पैदा करना।`,
      },
    },
  },

  // ── 5. Science (sci) ──
  {
    id: 'sci-01',
    subjectId: 'sci',
    lessonNumber: '01',
    title: 'Matter, Energy & Forces',
    description: 'States of matter, chemical changes, energy conservation, and fundamental forces.',
    content: `Science explores the physical and biological universe through empirical observation and experimentation.

### Physics & Chemistry Foundations:
1. **States of Matter**: Solid, Liquid, Gas, and Plasma transitions.
2. **Newton's Laws of Motion**: Inertia, Force (F = ma), and Action-Reaction.
3. **Conservation of Energy**: Energy transforms between kinetic, potential, and thermal forms.`,
    material: 'Physics & Chemistry Experiments Guide (PDF)',
    duration: '17 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Matter, Energy & Forces',
        description: 'States of matter, chemical changes, energy conservation, and fundamental forces.',
        content: `Science explores the physical and biological universe through empirical observation and experimentation.

### Physics & Chemistry Foundations:
1. **States of Matter**: Solid, Liquid, Gas, and Plasma transitions.
2. **Newton's Laws of Motion**: Inertia, Force (F = ma), and Action-Reaction.
3. **Conservation of Energy**: Energy transforms between kinetic, potential, and thermal forms.`,
      },
      kru: {
        title: 'पदार्थ, ऊर्जा अरा बल (Matter, Energy & Forces)',
        description: 'पदार्थ गहि अवस्था, रासायनिक बदलाव अरा बल सांचा।',
        content: `विज्ञान प्रकृति अरा भौतिक दुनिया गहि अध्ययन तली।

### मुख्य विषय:
1. **पदार्थ गहि रूप**: ठोस, द्रव अरा गैस।
2. **न्यूटन गहि गति नियम**: बल अरा गति गहि सांचा।
3. **ऊर्जा संरक्षण**: ऊर्जा एकाड़े ती दोसरे रूप नू बदलोआ।`,
      },
    },
  },
  {
    id: 'sci-02',
    subjectId: 'sci',
    lessonNumber: '02',
    title: 'Living Organisms & Ecosystems',
    description: 'Cellular biology, plant photosynthesis, human body systems, and ecological balance.',
    content: `Biological science investigates living organisms, cellular structures, and ecological relationships.

### Core Biology Concepts:
- **Cell Structure**: Nucleus, membrane, cytoplasm, and mitochondria.
- **Photosynthesis**: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂.
- **Ecosystem Balance**: Producers, consumers, decomposers, and food webs.`,
    material: 'Ecosystems & Human Body Systems Chart',
    duration: '19 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Living Organisms & Ecosystems',
        description: 'Cellular biology, plant photosynthesis, human body systems, and ecological balance.',
        content: `Biological science investigates living organisms, cellular structures, and ecological relationships.

### Core Biology Concepts:
- **Cell Structure**: Nucleus, membrane, cytoplasm, and mitochondria.
- **Photosynthesis**: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ + 6O₂.
- **Ecosystem Balance**: Producers, consumers, decomposers, and food webs.`,
      },
    },
  },

  // ── 6. Social Science (soc) ──
  {
    id: 'soc-01',
    subjectId: 'soc',
    lessonNumber: '01',
    title: 'Geography & Environment',
    description: 'Earth surface features, climate patterns, continents, maps, and natural resources.',
    content: `Geography studies the lands, features, inhabitants, and phenomena of Earth.

### Key Topics:
1. **Physical Geography**: Landforms, river systems, weather, and climate zones.
2. **Map Reading & Coordinates**: Latitudes, longitudes, scales, and cardinal directions.
3. **Sustainable Development**: Conservation of soil, water, forests, and biodiversity.`,
    material: 'World & India Physical Maps Guide',
    duration: '16 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'Geography & Environment',
        description: 'Earth surface features, climate patterns, continents, maps, and natural resources.',
        content: `Geography studies the lands, features, inhabitants, and phenomena of Earth.

### Key Topics:
1. **Physical Geography**: Landforms, river systems, weather, and climate zones.
2. **Map Reading & Coordinates**: Latitudes, longitudes, scales, and cardinal directions.
3. **Sustainable Development**: Conservation of soil, water, forests, and biodiversity.`,
      },
      kru: {
        title: 'भूगोल अरा पर्यावरण (Geography & Environment)',
        description: 'खेले पृथ्वी, मौसम, नक्शा अरा प्राकृतिक संसाधन।',
        content: `भूगोल पृथ्वी गहि जमीन, नदी अरा मौसम गहि अध्ययन तली।

### मुख्य विषय:
1. **भौतिक भूगोल**: राजी, नदी अरा मौसम गहि सांचा।
2. **नक्शा अरा दिशा**: उत्तर, दक्षिण, पूर्व अरा पश्चिम दिशा।
3. **पर्यावरण संरक्षण**: अम, मन-खांजपा अरा प्राकृतिक धन संरक्षण।`,
      },
    },
  },
  {
    id: 'soc-02',
    subjectId: 'soc',
    lessonNumber: '02',
    title: 'History & Civics',
    description: 'Ancient Indian history, the freedom struggle, democratic constitution, and civic rights.',
    content: `History and Civics analyze past human events and democratic governance structures.

### Highlights:
- **Indian Freedom Movement**: Key milestones in modern Indian history.
- **Constitution of India**: Fundamental Rights, Fundamental Duties, and Preamble principles.
- **Democratic Governance**: Executive, Legislative, and Judiciary arms.`,
    material: 'Indian Constitution & History Summary',
    duration: '21 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    translations: {
      en: {
        title: 'History & Civics',
        description: 'Ancient Indian history, the freedom struggle, democratic constitution, and civic rights.',
        content: `History and Civics analyze past human events and democratic governance structures.

### Highlights:
- **Indian Freedom Movement**: Key milestones in modern Indian history.
- **Constitution of India**: Fundamental Rights, Fundamental Duties, and Preamble principles.
- **Democratic Governance**: Executive, Legislative, and Judiciary arms.`,
      },
    },
  },
]

function loadStoredLessons(): Lesson[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to load lessons from localStorage:', e)
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LESSONS))
  } catch (e) {
    console.error('Failed to save initial lessons to localStorage:', e)
  }
  return DEFAULT_LESSONS
}

function saveStoredLessons(lessons: Lesson[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons))
  } catch (e) {
    console.error('Failed to persist lessons to localStorage:', e)
  }
}

interface LessonState {
  lessons: Lesson[]
  getLessonsBySubject: (subjectId: string) => Lesson[]
  getLessonById: (lessonId: string) => Lesson | undefined
  addLesson: (data: LessonFormData) => Lesson
  updateLesson: (id: string, data: Partial<LessonFormData>) => void
  deleteLesson: (id: string) => void
  resetToDefaults: () => void
}

export const useLessonStore = create<LessonState>((set, get) => ({
  lessons: loadStoredLessons(),

  getLessonsBySubject: (subjectId: string) => {
    return get().lessons
      .filter((l) => l.subjectId.toLowerCase() === subjectId.toLowerCase())
      .sort((a, b) => {
        const numA = parseInt(a.lessonNumber, 10) || 0
        const numB = parseInt(b.lessonNumber, 10) || 0
        return numA - numB
      })
  },

  getLessonById: (lessonId: string) => {
    return get().lessons.find((l) => l.id === lessonId)
  },

  addLesson: (data: LessonFormData) => {
    const enTitle = data.translations?.en?.title || data.title.trim()
    const enDesc = data.translations?.en?.description || data.description.trim()
    const enContent = data.translations?.en?.content || data.content.trim()

    const newLesson: Lesson = {
      id: `${data.subjectId}-${Date.now().toString(36)}`,
      subjectId: data.subjectId,
      lessonNumber: data.lessonNumber.trim() || '01',
      title: enTitle,
      description: enDesc,
      content: enContent,
      material: data.material?.trim() || undefined,
      duration: data.duration?.trim() || '15 mins',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      translations: {
        en: {
          title: enTitle,
          description: enDesc,
          content: enContent,
        },
        ...(data.translations?.kru?.title && data.translations.kru.content
          ? {
              kru: {
                title: data.translations.kru.title.trim(),
                description: data.translations.kru.description?.trim() || '',
                content: data.translations.kru.content.trim(),
              },
            }
          : {}),
      },
    }

    const updated = [...get().lessons, newLesson]
    set({ lessons: updated })
    saveStoredLessons(updated)
    return newLesson
  },

  updateLesson: (id: string, data: Partial<LessonFormData>) => {
    const updated = get().lessons.map((lesson) => {
      if (lesson.id === id) {
        const enTitle = data.translations?.en?.title ?? (data.title ? data.title.trim() : lesson.title)
        const enDesc = data.translations?.en?.description ?? (data.description !== undefined ? data.description.trim() : lesson.description)
        const enContent = data.translations?.en?.content ?? (data.content !== undefined ? data.content.trim() : lesson.content)

        const existingKru = lesson.translations?.kru
        const updatedKru = data.translations?.kru

        let finalKru = existingKru
        if (updatedKru) {
          if (updatedKru.title || updatedKru.content) {
            finalKru = {
              title: updatedKru.title?.trim() || existingKru?.title || '',
              description: updatedKru.description?.trim() ?? existingKru?.description ?? '',
              content: updatedKru.content?.trim() || existingKru?.content || '',
            }
          }
        }

        return {
          ...lesson,
          ...(data.subjectId && { subjectId: data.subjectId }),
          ...(data.lessonNumber && { lessonNumber: data.lessonNumber.trim() }),
          title: enTitle,
          description: enDesc,
          content: enContent,
          ...(data.material !== undefined && { material: data.material.trim() || undefined }),
          ...(data.duration !== undefined && { duration: data.duration.trim() || undefined }),
          updatedAt: new Date().toISOString(),
          translations: {
            en: {
              title: enTitle,
              description: enDesc,
              content: enContent,
            },
            ...(finalKru && finalKru.title && finalKru.content ? { kru: finalKru } : {}),
          },
        }
      }
      return lesson
    })
    set({ lessons: updated })
    saveStoredLessons(updated)
  },

  deleteLesson: (id: string) => {
    const updated = get().lessons.filter((l) => l.id !== id)
    set({ lessons: updated })
    saveStoredLessons(updated)
  },

  resetToDefaults: () => {
    set({ lessons: DEFAULT_LESSONS })
    saveStoredLessons(DEFAULT_LESSONS)
  },
}))
