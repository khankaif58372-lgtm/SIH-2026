import { create } from 'zustand'

export interface FeedbackRecord {
  id: string
  responseId: string
  context: 'student' | 'teacher' | 'monitoring'
  type: 'positive' | 'negative'
  reason?: string
  comment?: string
  timestamp: string
}

const STORAGE_KEY = 'bhashamitra_feedback_records_v1'

function loadStoredFeedback(): Record<string, FeedbackRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to load feedback records from localStorage:', e)
  }
  return {}
}

function saveStoredFeedback(records: Record<string, FeedbackRecord>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch (e) {
    console.error('Failed to save feedback records to localStorage:', e)
  }
}

interface FeedbackState {
  records: Record<string, FeedbackRecord>
  submitFeedback: (record: Omit<FeedbackRecord, 'id' | 'timestamp'>) => void
  getFeedback: (responseId: string) => FeedbackRecord | undefined
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  records: loadStoredFeedback(),

  submitFeedback: (data) => {
    const timestamp = new Date().toISOString()
    const id = `fb-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`
    
    const record: FeedbackRecord = {
      ...data,
      id,
      timestamp,
    }

    const updated = {
      ...get().records,
      [data.responseId]: record,
    }

    set({ records: updated })
    saveStoredFeedback(updated)
  },

  getFeedback: (responseId: string) => {
    return get().records[responseId]
  },
}))
