import type { ContentItem } from '../types'

export interface MockContentItem extends ContentItem {
  description: string
  tags: string[]
  viewCount: number
  isPublished: boolean
}

export const MOCK_CONTENT: MockContentItem[] = [
  {
    id: 'content-001',
    type: 'lesson',
    titleKey: 'Animals Around Us',
    languageId: 'hi',
    grade: 2,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-07-01T00:00:00Z',
    description: 'A beginner lesson introducing common animal names in Hindi.',
    tags: ['animals', 'vocabulary', 'beginner'],
    viewCount: 142,
    isPublished: true,
  },
  {
    id: 'content-002',
    type: 'lesson',
    titleKey: 'My Family',
    languageId: 'hi',
    grade: 2,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-07-03T00:00:00Z',
    description: 'Learn family relationship vocabulary in Hindi.',
    tags: ['family', 'vocabulary', 'beginner'],
    viewCount: 118,
    isPublished: true,
  },
  {
    id: 'content-003',
    type: 'story',
    titleKey: 'A Day at School',
    languageId: 'hi',
    grade: 3,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-07-10T00:00:00Z',
    description: 'A short story about school life to build reading comprehension.',
    tags: ['story', 'reading', 'school'],
    viewCount: 89,
    isPublished: true,
  },
  {
    id: 'content-004',
    type: 'exercise',
    titleKey: 'Colour Identification',
    languageId: 'hi',
    grade: 2,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-07-15T00:00:00Z',
    description: 'Interactive colour-matching exercise in Hindi.',
    tags: ['colours', 'exercise', 'interactive'],
    viewCount: 75,
    isPublished: true,
  },
  {
    id: 'content-005',
    type: 'quiz',
    titleKey: 'Santali Numbers Quiz',
    languageId: 'sat',
    grade: 1,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-07-20T00:00:00Z',
    description: 'Test knowledge of Santali numbers (1–10) in Ol Chiki script.',
    tags: ['numbers', 'quiz', 'Santali', 'Ol Chiki'],
    viewCount: 203,
    isPublished: true,
  },
  {
    id: 'content-006',
    type: 'lesson',
    titleKey: 'Gondi Kinship Words',
    languageId: 'gon',
    grade: 2,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-07-22T00:00:00Z',
    description: 'Learn Gondi kinship vocabulary for family and community.',
    tags: ['family', 'vocabulary', 'Gondi'],
    viewCount: 96,
    isPublished: true,
  },
  {
    id: 'content-007',
    type: 'lesson',
    titleKey: 'Greetings in Kurukh',
    languageId: 'kru',
    grade: 1,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-08-01T00:00:00Z',
    description: 'Common Kurukh greetings and morning phrases.',
    tags: ['greetings', 'Kurukh', 'beginner'],
    viewCount: 54,
    isPublished: true,
  },
  {
    id: 'content-008',
    type: 'exercise',
    titleKey: 'Hindi Pronunciation Practice',
    languageId: 'hi',
    grade: 3,
    createdByTeacherId: 'teacher-001',
    createdAt: '2026-08-10T00:00:00Z',
    description: 'Record and compare pronunciation of common Hindi words.',
    tags: ['pronunciation', 'speaking', 'Hindi'],
    viewCount: 67,
    isPublished: true,
  },
]

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  lesson: 'Lesson',
  story: 'Story',
  exercise: 'Exercise',
  quiz: 'Quiz',
}

export const CONTENT_TYPE_COLORS: Record<string, string> = {
  lesson: 'cyan',
  story: 'violet',
  exercise: 'emerald',
  quiz: 'amber',
}
