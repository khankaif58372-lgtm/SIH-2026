import { BookOpen, Languages, Calculator, Cpu, Sparkles, Globe } from 'lucide-react'

export interface SubjectItem {
  id: string
  name: string
  nativeName: string
  icon: any
  chaptersCount: number
  color: string
}

export const OFFICIAL_SUBJECTS: SubjectItem[] = [
  {
    id: 'hin',
    name: 'Hindi',
    nativeName: 'हिन्दी साहित्य',
    icon: Languages,
    chaptersCount: 18,
    color: 'amber',
  },
  {
    id: 'eng',
    name: 'English',
    nativeName: 'English Language',
    icon: BookOpen,
    chaptersCount: 15,
    color: 'blue',
  },
  {
    id: 'math',
    name: 'Basic Mathematics',
    nativeName: 'प्रारंभिक गणित',
    icon: Calculator,
    chaptersCount: 16,
    color: 'indigo',
  },
  {
    id: 'ai',
    name: 'AI',
    nativeName: 'कृत्रिम बुद्धिमत्ता',
    icon: Cpu,
    chaptersCount: 12,
    color: 'violet',
  },
  {
    id: 'sci',
    name: 'Science',
    nativeName: 'सामान्य विज्ञान',
    icon: Sparkles,
    chaptersCount: 14,
    color: 'cyan',
  },
  {
    id: 'soc',
    name: 'Social Science',
    nativeName: 'सामाजिक विज्ञान',
    icon: Globe,
    chaptersCount: 13,
    color: 'emerald',
  },
]

export const ROW_1_SUBJECTS = OFFICIAL_SUBJECTS.slice(0, 3) // Hindi, English, Basic Mathematics
export const ROW_2_SUBJECTS = OFFICIAL_SUBJECTS.slice(3, 6) // AI, Science, Social Science
