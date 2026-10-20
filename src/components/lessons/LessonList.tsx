import React from 'react'
import { BookOpen, Edit2, Trash2, ChevronRight, FileText, Clock, Plus } from 'lucide-react'
import { Lesson } from '../../types/lesson'
import { useAppStore } from '../../store/useAppStore'

interface LessonListProps {
  lessons: Lesson[]
  subjectName: string
  onSelectLesson: (lesson: Lesson) => void
  isTeacher?: boolean
  onAddLesson?: () => void
  onEditLesson?: (lesson: Lesson) => void
  onDeleteLesson?: (lessonId: string) => void
}

export function LessonList({
  lessons,
  subjectName,
  onSelectLesson,
  isTeacher = false,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
}: LessonListProps) {
  const { isDarkMode } = useAppStore()

  return (
    <div className="w-full space-y-3 text-left">
      {/* ── Subheader / Teacher Feed Control ── */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-cyan-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#171717] dark:text-white">
            LESSONS ({lessons.length})
          </span>
        </div>

        {isTeacher && onAddLesson && (
          <button
            onClick={onAddLesson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white transition-all shadow-xs cursor-pointer"
          >
            <Plus size={14} />
            <span>Feed Lesson</span>
          </button>
        )}
      </div>

      {/* ── Lesson Items List ── */}
      {lessons.length === 0 ? (
        <div className="p-6 text-center rounded-2xl border border-dashed border-black/10 dark:border-white/10 space-y-1">
          <p className="text-xs font-semibold text-[#737373] dark:text-[#A3A39E]">
            No lessons added for {subjectName} yet.
          </p>
          {isTeacher && (
            <p className="text-[11px] text-violet-500">
              Click "+ Feed Lesson" to create the first module!
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`group relative p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                isDarkMode
                  ? 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.06] hover:border-cyan-400/40'
                  : 'bg-white hover:bg-cyan-50/50 border-black/[0.06] hover:border-cyan-500/30 shadow-xs'
              }`}
            >
              {/* Main Clickable Area to View Lesson */}
              <div
                onClick={() => onSelectLesson(lesson)}
                className="flex items-start gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
                  {lesson.lessonNumber}
                </div>

                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="font-display text-xs sm:text-sm font-bold text-[#171717] dark:text-[#F5F5F5] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                    {lesson.title}
                  </h4>
                  {lesson.description && (
                    <p className="text-[11px] text-[#6F6F6A] dark:text-[#A3A39E] line-clamp-1">
                      {lesson.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 pt-0.5">
                    {lesson.material && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        <FileText size={10} />
                        Resource
                      </span>
                    )}
                    {lesson.duration && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#A3A39E]">
                        <Clock size={10} />
                        {lesson.duration}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Controls (View / Teacher Edit & Delete) */}
              <div className="flex items-center gap-1 shrink-0">
                {isTeacher ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onEditLesson) onEditLesson(lesson)
                      }}
                      className="p-1.5 rounded-lg text-[#A3A39E] hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-500/10 transition-colors cursor-pointer"
                      title="Edit Lesson"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onDeleteLesson && confirm(`Delete "${lesson.title}"?`)) {
                          onDeleteLesson(lesson.id)
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#A3A39E] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete Lesson"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onSelectLesson(lesson)}
                    className="p-1.5 rounded-lg text-[#A3A39E] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
