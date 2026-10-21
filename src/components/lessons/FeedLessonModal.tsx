import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Plus, UploadCloud, BookOpen, Sparkles, Loader2, Globe, Languages as LanguagesIcon } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { Lesson, LessonFormData } from '../../types/lesson'
import { translateTextAuto } from '../../services/translator'
import { LANGUAGES, getLanguageById } from '../../data/languages'

interface SubjectOption {
  id: string
  name: string
  nativeName?: string
}

interface FeedLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: LessonFormData, editingId?: string) => void
  selectedSubjectId?: string
  subjectsList: SubjectOption[]
  editingLesson?: Lesson | null
}

// Vernacular target options (excluding English which is primary source)
const VERNACULAR_OPTIONS = LANGUAGES.filter((l) => l.id !== 'en')

export function FeedLessonModal({
  isOpen,
  onClose,
  onSubmit,
  selectedSubjectId,
  subjectsList,
  editingLesson,
}: FeedLessonModalProps) {
  const { isDarkMode } = useAppStore()

  const [subjectId, setSubjectId] = useState(selectedSubjectId || subjectsList[0]?.id || 'bio')
  const [lessonNumber, setLessonNumber] = useState('01')
  const [duration, setDuration] = useState('15 mins')
  const [material, setMaterial] = useState('')

  // English Fields
  const [enTitle, setEnTitle] = useState('')
  const [enDescription, setEnDescription] = useState('')
  const [enContent, setEnContent] = useState('')

  // Selected Vernacular Target Language & Fields
  const [vernacularLangId, setVernacularLangId] = useState<string>('sat')
  const [vernacularTitle, setVernacularTitle] = useState('')
  const [vernacularDescription, setVernacularDescription] = useState('')
  const [vernacularContent, setVernacularContent] = useState('')

  const [isTranslating, setIsTranslating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const selectedVernacularObj = getLanguageById(vernacularLangId) || VERNACULAR_OPTIONS[0]

  // Load language translation when editingLesson or vernacularLangId changes
  useEffect(() => {
    if (editingLesson) {
      setSubjectId(editingLesson.subjectId)
      setLessonNumber(editingLesson.lessonNumber)
      setMaterial(editingLesson.material || '')
      setDuration(editingLesson.duration || '15 mins')

      setEnTitle(editingLesson.translations?.en?.title || editingLesson.title || '')
      setEnDescription(editingLesson.translations?.en?.description || editingLesson.description || '')
      setEnContent(editingLesson.translations?.en?.content || editingLesson.content || '')

      const trans = editingLesson.translations?.[vernacularLangId]
      setVernacularTitle(trans?.title || '')
      setVernacularDescription(trans?.description || '')
      setVernacularContent(trans?.content || '')
    } else {
      if (selectedSubjectId) {
        setSubjectId(selectedSubjectId)
      }
      setLessonNumber('01')
      setMaterial('')
      setDuration('15 mins')

      setEnTitle('')
      setEnDescription('')
      setEnContent('')

      setVernacularTitle('')
      setVernacularDescription('')
      setVernacularContent('')
    }
  }, [editingLesson, selectedSubjectId, isOpen, vernacularLangId])

  const handleAutoTranslate = async () => {
    if (!enTitle.trim() && !enContent.trim()) return
    setIsTranslating(true)
    try {
      const titleRes = enTitle
        ? await translateTextAuto({ text: enTitle, targetLanguageId: vernacularLangId })
        : ''
      const descRes = enDescription
        ? await translateTextAuto({ text: enDescription, targetLanguageId: vernacularLangId })
        : ''
      const contentRes = enContent
        ? await translateTextAuto({ text: enContent, targetLanguageId: vernacularLangId })
        : ''

      setVernacularTitle(titleRes)
      setVernacularDescription(descRes)
      setVernacularContent(contentRes)
    } catch (err) {
      console.error('Vernacular auto-draft failed:', err)
    } finally {
      setIsTranslating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!enTitle.trim() || !enContent.trim()) return

    setIsSuccess(true)
    setTimeout(() => {
      onSubmit(
        {
          subjectId,
          lessonNumber,
          title: enTitle.trim(),
          description: enDescription.trim(),
          content: enContent.trim(),
          material: material.trim(),
          duration: duration.trim(),
          translations: {
            ...(editingLesson?.translations || {}),
            en: {
              title: enTitle.trim(),
              description: enDescription.trim(),
              content: enContent.trim(),
            },
            ...(vernacularTitle.trim() && vernacularContent.trim()
              ? {
                  [vernacularLangId]: {
                    title: vernacularTitle.trim(),
                    description: vernacularDescription.trim(),
                    content: vernacularContent.trim(),
                  },
                }
              : {}),
          },
        },
        editingLesson?.id
      )
      setIsSuccess(false)
      onClose()
    }, 600)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className={`relative w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl border shadow-2xl theme-transition text-left ${
            isDarkMode
              ? 'bg-[#141418] border-white/[0.1] text-[#F5F5F5]'
              : 'bg-[#FAFAF8] border-black/[0.1] text-[#171717]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-violet-500/10 text-violet-500">
                <BookOpen size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight">
                  {editingLesson ? 'Edit Subject Lesson' : 'Feed New Subject Lesson'}
                </h3>
                <p className="text-xs text-[#6F6F6A] dark:text-[#A3A39E]">
                  Create curriculum modules with verified regional vernacular support.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-black/[0.05] dark:hover:bg-white/[0.08] text-[#A3A39E] cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                <Check size={24} />
              </div>
              <p className="font-display text-base font-bold text-emerald-500">
                Lesson Published Successfully
              </p>
              <p className="text-xs text-[#A3A39E]">
                Module translations are live for rural & regional learners.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs mt-4">
              {/* General Metadata */}
              <div className="p-4 rounded-2xl border bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.05] dark:border-white/[0.06] space-y-3">
                {/* Subject Selection Dropdown */}
                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Subject:
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  >
                    {subjectsList.map((sub) => (
                      <option key={sub.id} value={sub.id} className="dark:bg-[#141418] text-black dark:text-white">
                        {sub.name} {sub.nativeName ? `(${sub.nativeName})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lesson Number & Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                      Lesson Number:
                    </label>
                    <input
                      type="text"
                      required
                      value={lessonNumber}
                      onChange={(e) => setLessonNumber(e.target.value)}
                      placeholder="e.g. 01"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-mono outline-none ${
                        isDarkMode
                          ? 'bg-white/[0.04] border-white/[0.08] text-white'
                          : 'bg-white border-black/[0.08] text-[#171717]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                      Estimated Duration:
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="e.g. 15 mins"
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                        isDarkMode
                          ? 'bg-white/[0.04] border-white/[0.08] text-white'
                          : 'bg-white border-black/[0.08] text-[#171717]'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* ENGLISH CONTENT SECTION */}
              <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-cyan-500/20">
                  <Globe size={14} className="text-cyan-500" />
                  <span className="font-display text-xs font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    English Content (Primary Source)
                  </span>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Title (English):
                  </label>
                  <input
                    type="text"
                    required
                    value={enTitle}
                    onChange={(e) => setEnTitle(e.target.value)}
                    placeholder="e.g. Introduction to Artificial Intelligence"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Description (English):
                  </label>
                  <input
                    type="text"
                    value={enDescription}
                    onChange={(e) => setEnDescription(e.target.value)}
                    placeholder="e.g. Learn basic AI concepts and applications."
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Content (English):
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={enContent}
                    onChange={(e) => setEnContent(e.target.value)}
                    placeholder="Enter detailed English lesson content..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none resize-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>
              </div>

              {/* VERNACULAR CONTENT SECTION (SELECTABLE FOR ANY SUPPORTED REGIONAL / TRIBAL LANGUAGE) */}
              <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-violet-500/20">
                  <div className="flex items-center gap-2">
                    <LanguagesIcon size={14} className="text-violet-500 shrink-0" />
                    <span className="font-display text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      Vernacular Target:
                    </span>
                    <select
                      value={vernacularLangId}
                      onChange={(e) => setVernacularLangId(e.target.value)}
                      className={`px-3 py-1 rounded-xl border text-xs font-bold outline-none cursor-pointer ${
                        isDarkMode
                          ? 'bg-[#1C1C22] border-white/[0.1] text-violet-300'
                          : 'bg-white border-black/[0.1] text-violet-700 shadow-xs'
                      }`}
                    >
                      {VERNACULAR_OPTIONS.map((lang) => (
                        <option key={lang.id} value={lang.id} className="dark:bg-[#141418] text-black dark:text-white">
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating || (!enTitle && !enContent)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    <span>Auto-Draft {selectedVernacularObj.name}</span>
                  </button>
                </div>

                <div className="text-[11px] text-[#A3A39E] flex items-center gap-2">
                  <span>Script: <strong>{selectedVernacularObj.script}</strong></span>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Title ({selectedVernacularObj.name} — {selectedVernacularObj.nativeName}):
                  </label>
                  <input
                    type="text"
                    value={vernacularTitle}
                    onChange={(e) => setVernacularTitle(e.target.value)}
                    placeholder={`e.g. ${selectedVernacularObj.name} title translation...`}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Description ({selectedVernacularObj.name}):
                  </label>
                  <input
                    type="text"
                    value={vernacularDescription}
                    onChange={(e) => setVernacularDescription(e.target.value)}
                    placeholder={`e.g. ${selectedVernacularObj.name} short summary...`}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Content ({selectedVernacularObj.name}):
                  </label>
                  <textarea
                    rows={4}
                    value={vernacularContent}
                    onChange={(e) => setVernacularContent(e.target.value)}
                    placeholder={`Enter ${selectedVernacularObj.name} content...`}
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none resize-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>
              </div>

              {/* Optional Lesson Material / Resource */}
              <div>
                <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                  Optional: Lesson Material / Resource:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    placeholder="e.g. Lesson Diagrams & Practice Guide (PDF)"
                    className={`w-full pl-9 pr-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                  <UploadCloud size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A39E]" />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-black/[0.04] dark:hover:bg-white/[0.05] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{editingLesson ? 'Save Changes' : 'Feed Lesson'}</span>
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
