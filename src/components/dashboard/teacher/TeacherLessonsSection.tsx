import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Plus, ArrowLeft } from 'lucide-react'
import { useAppStore } from '../../../store/useAppStore'
import { useLessonStore } from '../../../store/useLessonStore'
import { OFFICIAL_SUBJECTS, ROW_1_SUBJECTS, ROW_2_SUBJECTS, SubjectItem } from '../../../data/subjects'
import { LessonList } from '../../lessons/LessonList'
import { LessonView } from '../../lessons/LessonView'
import { FeedLessonModal } from '../../lessons/FeedLessonModal'
import { Lesson, LessonFormData } from '../../../types/lesson'

export function TeacherLessonsSection() {
  const { isDarkMode } = useAppStore()
  const { getLessonsBySubject, addLesson, updateLesson, deleteLesson } = useLessonStore()

  const [isRow1Paused, setIsRow1Paused] = useState(false)
  const [isRow2Paused, setIsRow2Paused] = useState(false)
  const [activeFeedingSubject, setActiveFeedingSubject] = useState<SubjectItem | null>(null)
  const [activeLessonView, setActiveLessonView] = useState<Lesson | null>(null)
  const [isFeedModalOpen, setIsFeedModalOpen] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return OFFICIAL_SUBJECTS
    return OFFICIAL_SUBJECTS.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.nativeName.toLowerCase().includes(query) ||
        s.id.toLowerCase().includes(query)
    )
  }, [searchQuery])

  const isSearching = searchQuery.trim().length > 0

  // Current lessons for selected subject
  const currentLessons = useMemo(() => {
    if (!activeFeedingSubject) return []
    return getLessonsBySubject(activeFeedingSubject.id)
  }, [activeFeedingSubject, getLessonsBySubject])

  const handleOpenFeedModal = (subject?: SubjectItem) => {
    if (subject) {
      setActiveFeedingSubject(subject)
    }
    setEditingLesson(null)
    setIsFeedModalOpen(true)
  }

  const handleOpenEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setIsFeedModalOpen(true)
  }

  const handleModalSubmit = (formData: LessonFormData, editingId?: string) => {
    if (editingId) {
      updateLesson(editingId, formData)
    } else {
      addLesson(formData)
    }
  }

  const handleDeleteLesson = (lessonId: string) => {
    deleteLesson(lessonId)
    if (activeLessonView?.id === lessonId) {
      setActiveLessonView(null)
    }
  }

  return (
    <section id="lessons" className="w-full max-w-6xl mx-auto space-y-8 pt-4 pb-24 text-left">
      
      {/* ── Section Title & Search Input ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.25em] uppercase border ${
              isDarkMode
                ? 'bg-white/[0.04] border-white/[0.08] text-violet-400'
                : 'bg-white/70 border-black/[0.05] text-violet-700 shadow-subtle'
            }`}
          >
            CURRICULUM ARCHITECTURE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
            TEACHER LESSON MANAGEMENT
          </h2>
          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-[#A3A39E]' : 'text-[#6F6F6A]'}`}>
            Feed, edit, and manage pedagogical lesson modules for the 6 official subjects.
          </p>
        </div>

        {/* ── Search Input Box ── */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A3A39E]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects (e.g. Hindi, AI, Science...)"
            className={`w-full pl-10 pr-9 py-2.5 rounded-2xl text-xs font-medium border theme-transition outline-none ${
              isDarkMode
                ? 'bg-white/[0.04] focus:bg-white/[0.08] border-white/[0.08] focus:border-violet-400/40 text-white placeholder-[#737373]'
                : 'bg-white focus:bg-white border-black/[0.08] focus:border-violet-500/40 text-[#171717] placeholder-[#9E9E9E] shadow-subtle'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A39E] hover:text-[#171717] dark:hover:text-white cursor-pointer"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* ── Lesson View OR Active Subject Management Container ── */}
      <AnimatePresence mode="wait">
        {activeLessonView && activeFeedingSubject ? (
          <LessonView
            key={`view-${activeLessonView.id}`}
            lesson={activeLessonView}
            subjectName={activeFeedingSubject.name}
            subjectNativeName={activeFeedingSubject.nativeName}
            onBack={() => setActiveLessonView(null)}
          />
        ) : activeFeedingSubject ? (
          <motion.div
            key={`teacher-subject-${activeFeedingSubject.id}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`p-6 sm:p-7 rounded-3xl border text-left theme-transition shadow-lg ${
              isDarkMode
                ? 'bg-[#141418]/95 border-white/[0.08] text-[#F5F5F5]'
                : 'bg-[#FAFAF8] border-black/[0.08] text-[#171717]'
            }`}
          >
            {/* Subject Container Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-2xl bg-violet-600 text-white font-bold shadow-xs">
                  <activeFeedingSubject.icon size={22} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                      {activeFeedingSubject.nativeName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-[#A3A39E]">
                      {currentLessons.length} Modules Managed
                    </span>
                  </div>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-[#171717] dark:text-[#F5F5F5]">
                    {activeFeedingSubject.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleOpenFeedModal(activeFeedingSubject)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-xs cursor-pointer"
                >
                  <Plus size={14} />
                  <span>+ Feed Lesson</span>
                </button>

                <button
                  onClick={() => setActiveFeedingSubject(null)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-[#A3A39E] hover:text-[#171717] dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.05] cursor-pointer transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Dismiss</span>
                </button>
              </div>
            </div>

            {/* Lesson List with Teacher Controls (Edit / Delete) */}
            <LessonList
              lessons={currentLessons}
              subjectName={activeFeedingSubject.name}
              onSelectLesson={(lesson) => setActiveLessonView(lesson)}
              isTeacher={true}
              onAddLesson={() => handleOpenFeedModal(activeFeedingSubject)}
              onEditLesson={(lesson) => handleOpenEditModal(lesson)}
              onDeleteLesson={(lessonId) => handleDeleteLesson(lessonId)}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* ── Content View: Marquee or Filtered Search Grid ── */}
      {!activeFeedingSubject && (
        !isSearching ? (
          <div className="space-y-6 overflow-hidden py-2">
            {/* ROW 1: Moves RIGHT -> LEFT */}
            <div
              className="relative w-full overflow-hidden"
              onMouseEnter={() => setIsRow1Paused(true)}
              onMouseLeave={() => setIsRow1Paused(false)}
              onTouchStart={() => setIsRow1Paused(true)}
              onTouchEnd={() => setIsRow1Paused(false)}
            >
              <motion.div
                animate={{
                  x: isRow1Paused ? undefined : ['0%', '-50%'],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 24,
                    ease: 'linear',
                  },
                }}
                className="flex gap-4 w-max cursor-grab active:cursor-grabbing"
              >
                {[...ROW_1_SUBJECTS, ...ROW_1_SUBJECTS, ...ROW_1_SUBJECTS].map((subject, idx) => {
                  const Icon = subject.icon
                  const count = getLessonsBySubject(subject.id).length
                  return (
                    <div
                      key={`${subject.id}-${idx}`}
                      onClick={() => setActiveFeedingSubject(subject)}
                      className={`group w-64 p-5 rounded-3xl border text-left shrink-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-xl ${
                        isDarkMode
                          ? 'bg-[#141418]/85 hover:bg-[#1c1c22] border-white/[0.08] hover:border-violet-400/40 shadow-lg'
                          : 'bg-white/75 hover:bg-white border-black/[0.06] hover:border-violet-500/40 shadow-subtle hover:shadow-editorial'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] text-violet-600 dark:text-violet-400">
                          <Icon size={18} />
                        </div>
                        <span className="text-[10px] font-mono text-[#A3A39E]">
                          {count} {count === 1 ? 'Lesson' : 'Lessons'}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                        {subject.nativeName}
                      </p>
                      <h3 className="font-display text-base font-bold tracking-tight text-[#171717] dark:text-[#F5F5F5] mb-2">
                        {subject.name}
                      </h3>

                      <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#A3A39E] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          Manage & Feed Lessons
                        </span>
                        <span className="text-[10px] text-violet-500 font-bold">
                          +
                        </span>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </div>

            {/* ROW 2: Moves LEFT -> RIGHT */}
            <div
              className="relative w-full overflow-hidden"
              onMouseEnter={() => setIsRow2Paused(true)}
              onMouseLeave={() => setIsRow2Paused(false)}
              onTouchStart={() => setIsRow2Paused(true)}
              onTouchEnd={() => setIsRow2Paused(false)}
            >
              <motion.div
                animate={{
                  x: isRow2Paused ? undefined : ['-50%', '0%'],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 26,
                    ease: 'linear',
                  },
                }}
                className="flex gap-4 w-max cursor-grab active:cursor-grabbing"
              >
                {[...ROW_2_SUBJECTS, ...ROW_2_SUBJECTS, ...ROW_2_SUBJECTS].map((subject, idx) => {
                  const Icon = subject.icon
                  const count = getLessonsBySubject(subject.id).length
                  return (
                    <div
                      key={`${subject.id}-${idx}`}
                      onClick={() => setActiveFeedingSubject(subject)}
                      className={`group w-64 p-5 rounded-3xl border text-left shrink-0 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-xl ${
                        isDarkMode
                          ? 'bg-[#141418]/85 hover:bg-[#1c1c22] border-white/[0.08] hover:border-cyan-400/40 shadow-lg'
                          : 'bg-white/75 hover:bg-white border-black/[0.06] hover:border-cyan-500/40 shadow-subtle hover:shadow-editorial'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] text-cyan-600 dark:text-cyan-400">
                          <Icon size={18} />
                        </div>
                        <span className="text-[10px] font-mono text-[#A3A39E]">
                          {count} {count === 1 ? 'Lesson' : 'Lessons'}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                        {subject.nativeName}
                      </p>
                      <h3 className="font-display text-base font-bold tracking-tight text-[#171717] dark:text-[#F5F5F5] mb-2">
                        {subject.name}
                      </h3>

                      <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#A3A39E] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          Manage & Feed Lessons
                        </span>
                        <span className="text-[10px] text-cyan-500 font-bold">
                          +
                        </span>
                      </div>
                    </div>
                  )
                })}
              </motion.div>
            </div>
          </div>
        ) : (
          /* Filtered Search Results Grid */
          <div className="py-2">
            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {filteredSubjects.map((subject) => {
                  const Icon = subject.icon
                  const count = getLessonsBySubject(subject.id).length
                  return (
                    <motion.div
                      key={subject.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onClick={() => setActiveFeedingSubject(subject)}
                      className={`group p-5 rounded-3xl border text-left transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-xl ${
                        isDarkMode
                          ? 'bg-[#141418]/85 hover:bg-[#1c1c22] border-white/[0.08] hover:border-violet-400/40 shadow-lg'
                          : 'bg-white/75 hover:bg-white border-black/[0.06] hover:border-violet-500/40 shadow-subtle hover:shadow-editorial'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] text-violet-600 dark:text-violet-400">
                          <Icon size={18} />
                        </div>
                        <span className="text-[10px] font-mono text-[#A3A39E]">
                          {count} {count === 1 ? 'Lesson' : 'Lessons'}
                        </span>
                      </div>

                      <p className="text-[11px] font-semibold text-violet-600 dark:text-violet-400">
                        {subject.nativeName}
                      </p>
                      <h3 className="font-display text-base font-bold tracking-tight text-[#171717] dark:text-[#F5F5F5] mb-2">
                        {subject.name}
                      </h3>

                      <div className="pt-2 border-t border-black/[0.05] dark:border-white/[0.06] flex items-center justify-between">
                        <span className="text-[11px] font-medium text-[#A3A39E] group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          Manage & Feed Lessons
                        </span>
                        <span className="text-[10px] text-violet-500 font-bold">
                          +
                        </span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-12 text-center rounded-3xl border space-y-2 ${
                  isDarkMode ? 'bg-[#141418]/50 border-white/[0.08]' : 'bg-[#FAFAF8] border-black/[0.06]'
                }`}
              >
                <p className="font-display text-base font-bold text-[#171717] dark:text-[#F5F5F5]">
                  No subjects found
                </p>
                <p className="text-xs text-[#6F6F6A] dark:text-[#A3A39E]">
                  No matching subjects for "{searchQuery}". Try searching for Hindi, English, Basic Mathematics, AI, Science, or Social Science.
                </p>
              </motion.div>
            )}
          </div>
        )
      )}

      {/* ── Feed & Edit Lesson Modal Form ── */}
      <FeedLessonModal
        isOpen={isFeedModalOpen}
        onClose={() => setIsFeedModalOpen(false)}
        onSubmit={handleModalSubmit}
        selectedSubjectId={activeFeedingSubject?.id}
        subjectsList={OFFICIAL_SUBJECTS}
        editingLesson={editingLesson}
      />

    </section>
  )
}
