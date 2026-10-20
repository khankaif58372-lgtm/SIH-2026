import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThumbsUp, ThumbsDown, Check, Send } from 'lucide-react'
import { useFeedbackStore } from '../../store/useFeedbackStore'
import { useAppStore } from '../../store/useAppStore'

interface FeedbackButtonsProps {
  responseId: string
  context: 'student' | 'teacher' | 'monitoring'
  className?: string
}

const REASONS_CHAT = [
  'Incorrect',
  'Not relevant',
  'Too complicated',
  'Missing information',
  'Other',
]

const REASONS_MONITORING = [
  'Incorrect',
  'Translation issue',
  'Not relevant',
  'Other',
]

export function FeedbackButtons({ responseId, context, className = '' }: FeedbackButtonsProps) {
  const { isDarkMode } = useAppStore()
  const { submitFeedback, getFeedback } = useFeedbackStore()

  const existingFeedback = getFeedback(responseId)

  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(
    existingFeedback?.type || null
  )
  const [showReasonSection, setShowReasonSection] = useState<boolean>(false)
  const [selectedReason, setSelectedReason] = useState<string>(existingFeedback?.reason || '')
  const [customComment, setCustomComment] = useState<string>(existingFeedback?.comment || '')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(!!existingFeedback)

  useEffect(() => {
    const existing = getFeedback(responseId)
    if (existing) {
      setFeedbackType(existing.type)
      setSelectedReason(existing.reason || '')
      setCustomComment(existing.comment || '')
      setIsSubmitted(true)
    }
  }, [responseId, getFeedback])

  const reasonsList = context === 'monitoring' ? REASONS_MONITORING : REASONS_CHAT

  // Handle Positive Feedback (Thumbs Up)
  const handleThumbsUp = () => {
    if (feedbackType === 'positive') return // Already positive

    setFeedbackType('positive')
    setShowReasonSection(false)
    setIsSubmitted(true)

    submitFeedback({
      responseId,
      context,
      type: 'positive',
    })
  }

  // Handle Negative Feedback (Thumbs Down)
  const handleThumbsDown = () => {
    setFeedbackType('negative')
    setIsSubmitted(false)
    setShowReasonSection(true)
  }

  // Submit Negative Feedback Reason
  const handleSubmitReason = (e: React.FormEvent) => {
    e.preventDefault()

    submitFeedback({
      responseId,
      context,
      type: 'negative',
      reason: selectedReason || 'Not specified',
      comment: selectedReason === 'Other' ? customComment.trim() : undefined,
    })

    setShowReasonSection(false)
    setIsSubmitted(true)
  }

  return (
    <div className={`space-y-2 mt-2 ${className}`}>
      {/* ── Main Thumbs Up / Thumbs Down Controls ── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleThumbsUp}
          aria-label="Helpful"
          title="Helpful"
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
            feedbackType === 'positive'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold shadow-xs'
              : isDarkMode
              ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] text-[#A3A39E] hover:text-white'
              : 'bg-black/[0.02] hover:bg-black/[0.05] border-black/[0.05] text-[#6F6F6A] hover:text-[#171717]'
          }`}
        >
          <ThumbsUp size={12} className={feedbackType === 'positive' ? 'fill-emerald-500/20' : ''} />
          <span>Helpful</span>
        </button>

        <button
          type="button"
          onClick={handleThumbsDown}
          aria-label="Not helpful"
          title="Not helpful"
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[11px] font-medium border transition-all cursor-pointer ${
            feedbackType === 'negative'
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400 font-bold shadow-xs'
              : isDarkMode
              ? 'bg-white/[0.02] hover:bg-white/[0.06] border-white/[0.06] text-[#A3A39E] hover:text-white'
              : 'bg-black/[0.02] hover:bg-black/[0.05] border-black/[0.05] text-[#6F6F6A] hover:text-[#171717]'
          }`}
        >
          <ThumbsDown size={12} className={feedbackType === 'negative' ? 'fill-rose-500/20' : ''} />
          <span>Not helpful</span>
        </button>

        {isSubmitted && !showReasonSection && (
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5 ml-1">
            <Check size={11} />
            <span>Recorded</span>
          </span>
        )}
      </div>

      {/* ── Compact Negative Reason Selection Section ── */}
      <AnimatePresence>
        {showReasonSection && (
          <motion.form
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmitReason}
            className={`p-3 rounded-2xl border text-xs space-y-2.5 max-w-sm ${
              isDarkMode
                ? 'bg-[#18181c] border-white/[0.08] text-[#F5F5F5]'
                : 'bg-[#FAFAF8] border-black/[0.08] text-[#171717]'
            }`}
          >
            <p className="font-semibold text-[11px] text-[#737373] dark:text-[#A3A39E]">
              Why wasn't this helpful?
            </p>

            {/* Quick Reason Pills */}
            <div className="flex flex-wrap gap-1.5">
              {reasonsList.map((reason) => {
                const isSelected = selectedReason === reason
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedReason(reason)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-300 font-bold'
                        : isDarkMode
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.06] text-[#A3A39E]'
                        : 'bg-white hover:bg-black/[0.02] border-black/[0.06] text-[#6F6F6A]'
                    }`}
                  >
                    {reason}
                  </button>
                )
              })}
            </div>

            {/* Tiny "Other" Custom Input */}
            {selectedReason === 'Other' && (
              <input
                type="text"
                value={customComment}
                onChange={(e) => setCustomComment(e.target.value)}
                placeholder="Tell us briefly why..."
                className={`w-full px-3 py-1.5 rounded-xl text-xs border outline-none font-medium ${
                  isDarkMode
                    ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-[#737373]'
                    : 'bg-white border-black/[0.08] text-[#171717] placeholder-[#9E9E9E]'
                }`}
              />
            )}

            {/* Submit Reason Action */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowReasonSection(false)}
                className="px-2.5 py-1 rounded-lg text-[11px] text-[#A3A39E] hover:text-[#171717] dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedReason}
                className="px-3 py-1 rounded-xl text-[11px] font-bold bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Send size={10} />
                <span>Submit</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Confirmation Note after submitting Negative Feedback */}
      {isSubmitted && feedbackType === 'negative' && !showReasonSection && (
        <p className="text-[11px] italic text-[#A3A39E]">
          Thanks for your feedback.
        </p>
      )}
    </div>
  )
}
