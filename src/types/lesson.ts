export interface LessonTranslation {
  title: string
  description?: string
  content: string
}

export interface LessonTranslations {
  en?: LessonTranslation
  sat?: LessonTranslation
  kru?: LessonTranslation
  bhili?: LessonTranslation
  bhilodi?: LessonTranslation
  gon?: LessonTranslation
  as?: LessonTranslation
  brx?: LessonTranslation
  kha?: LessonTranslation
  kokborok?: LessonTranslation
  hi?: LessonTranslation
  [languageId: string]: LessonTranslation | undefined
}

export interface Lesson {
  id: string
  subjectId: string
  lessonNumber: string
  title: string
  description: string
  content: string
  material?: string
  duration?: string
  createdAt?: string
  updatedAt?: string
  translations?: LessonTranslations
}

export interface SubjectItem {
  id: string
  name: string
  nativeName: string
  icon?: any
  chaptersCount?: number
  color?: string
}

export interface LessonFormData {
  subjectId: string
  lessonNumber: string
  title: string
  description: string
  content: string
  material?: string
  duration?: string
  translations?: LessonTranslations
}
