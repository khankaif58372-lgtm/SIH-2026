import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Plus, UploadCloud, BookOpen, Sparkles, Loader2, Globe } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { Lesson, LessonFormData } from '../../types/lesson'
import { translateTextAuto } from '../../services/translator'

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

  // Kurukh Fields
  const [kruTitle, setKruTitle] = useState('')
  const [kruDescription, setKruDescription] = useState('')
  const [kruContent, setKruContent] = useState('')

  const [isTranslating, setIsTranslating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    if (editingLesson) {
      setSubjectId(editingLesson.subjectId)
      setLessonNumber(editingLesson.lessonNumber)
      setMaterial(editingLesson.material || '')
      setDuration(editingLesson.duration || '15 mins')

      setEnTitle(editingLesson.translations?.en?.title || editingLesson.title || '')
      setEnDescription(editingLesson.translations?.en?.description || editingLesson.description || '')
      setEnContent(editingLesson.translations?.en?.content || editingLesson.content || '')

      setKruTitle(editingLesson.translations?.kru?.title || '')
      setKruDescription(editingLesson.translations?.kru?.description || '')
      setKruContent(editingLesson.translations?.kru?.content || '')
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

      setKruTitle('')
      setKruDescription('')
      setKruContent('')
    }
  }, [editingLesson, selectedSubjectId, isOpen])

  const handleAutoTranslate = async () => {
    if (!enTitle.trim() && !enContent.trim()) return
    setIsTranslating(true)
    try {
      const titleRes = enTitle ? await translateTextAuto({ text: enTitle, targetLanguageId: 'kru' }) : ''
      const descRes = enDescription ? await translateTextAuto({ text: enDescription, targetLanguageId: 'kru' }) : ''
      const contentRes = enContent ? await translateTextAuto({ text: enContent, targetLanguageId: 'kru' }) : ''

      setKruTitle(titleRes)
      setKruDescription(descRes)
      setKruContent(contentRes)
    } catch (err) {
      console.error('Auto translation failed:', err)
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
            en: {
              title: enTitle.trim(),
              description: enDescription.trim(),
              content: enContent.trim(),
            },
            ...(kruTitle.trim() && kruContent.trim()
              ? {
                  kru: {
                    title: kruTitle.trim(),
                    description: kruDescription.trim(),
                    content: kruContent.trim(),
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={`w-full max-w-2xl p-6 sm:p-8 rounded-3xl border text-left shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-[#141418] border-white/[0.08] text-[#F5F5F5]' : 'bg-[#FAFAF8] border-black/[0.08] text-[#171717]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-black/[0.06] dark:border-white/[0.08]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500 block">
                TEACHER CURRICULUM MANAGEMENT
              </span>
              <h3 className="font-display text-lg sm:text-xl font-bold flex items-center gap-2">
                <BookOpen size={18} className="text-violet-500" />
                <span>{editingLesson ? 'Edit Lesson' : '+ Feed Lesson'}</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#A3A39E] hover:text-[#171717] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Check size={24} />
              </div>
              <p className="font-display text-base font-bold">
                {editingLesson ? 'Lesson Successfully Updated' : 'Lesson Synchronized & Published'}
              </p>
              <p className="text-xs text-[#A3A39E]">
                Both English and Kurukh versions are live for students.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
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

              {/* ---------------------------------------------------- */}
              {/* ENGLISH CONTENT SECTION                              */}
              {/* ---------------------------------------------------- */}
              <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-cyan-500/20">
                  <Globe size={14} className="text-cyan-500" />
                  <span className="font-display text-xs font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                    English Content
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

              {/* ---------------------------------------------------- */}
              {/* KURUKH CONTENT SECTION                               */}
              {/* ---------------------------------------------------- */}
              <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-violet-500/20">
                  <div className="flex items-center gap-2">
                    <Globe size={14} className="text-violet-500" />
                    <span className="font-display text-xs font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                      Kurukh Content (कुड़ुख़)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoTranslate}
                    disabled={isTranslating || (!enTitle && !enContent)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-300 border border-violet-500/30 hover:bg-violet-500/20 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isTranslating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    <span>Auto-Draft Kurukh</span>
                  </button>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Title (Kurukh):
                  </label>
                  <input
                    type="text"
                    value={kruTitle}
                    onChange={(e) => setKruTitle(e.target.value)}
                    placeholder="e.g. आर्टिफिशियल इंटेलिजेंस गहि परिचय (Optional if not translated yet)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Description (Kurukh):
                  </label>
                  <input
                    type="text"
                    value={kruDescription}
                    onChange={(e) => setKruDescription(e.target.value)}
                    placeholder="e.g. AI गहि संचे अरा भासा समझ।"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-medium outline-none ${
                      isDarkMode
                        ? 'bg-white/[0.04] border-white/[0.08] text-white'
                        : 'bg-white border-black/[0.08] text-[#171717]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-[#6F6F6A] dark:text-[#A3A39E]">
                    Content (Kurukh):
                  </label>
                  <textarea
                    rows={4}
                    value={kruContent}
                    onChange={(e) => setKruContent(e.target.value)}
                    placeholder="Enter Kurukh translated content here (or leave empty if unavailable)..."
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

