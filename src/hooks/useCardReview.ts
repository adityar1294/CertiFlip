import { useState, useEffect, useCallback } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import type { Question } from '@/hooks/useQuestions';

/* ── Leitner intervals (days per box) ──────────────────────────────────── */
export const LEITNER_INTERVALS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30,
};

export interface ReviewCard {
  question: Question;
  currentBox: number;   // 1–5 (1 = new/unknown)
  isNew: boolean;       // true if no card state exists yet
}

export interface ReviewResult {
  questionId: string;
  correct: boolean;
  fromBox: number;
  toBox: number;
}

interface UseCardReviewReturn {
  queue: ReviewCard[];
  currentCard: ReviewCard | null;
  currentIndex: number;
  total: number;
  results: ReviewResult[];
  loading: boolean;
  error: string | null;
  /** Call after user taps Got it / Missed it */
  advance: (correct: boolean) => Promise<void>;
  /** True once all cards in the queue have been reviewed */
  sessionComplete: boolean;
}

export function useCardReview(examId: string): UseCardReviewReturn {
  const [queue, setQueue] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Load due cards on mount ─────────────────────────────────────── */
  useEffect(() => {
    if (!examId) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createSupabaseClient();

        // 1. Fetch all questions for this exam
        const { data: questions, error: qErr } = await supabase
          .from('questions')
          .select('*')
          .eq('exam_id', examId);

        if (qErr) throw qErr;
        if (!questions || questions.length === 0) {
          setQueue([]);
          setLoading(false);
          return;
        }

        const questionIds = (questions as Question[]).map(q => q.id);

        // 2. Fetch existing card states for this user
        const { data: states, error: sErr } = await supabase
          .from('user_card_state')
          .select('*')
          .in('question_id', questionIds);

        if (sErr) throw sErr;

        const stateMap = new Map(
          (states ?? []).map((s: { question_id: string; box: number; next_review_at: string }) => [
            s.question_id,
            s,
          ])
        );

        const now = new Date();

        // 3. Build queue: new cards (no state) + overdue cards
        const dueCards: ReviewCard[] = (questions as Question[])
          .map(q => {
            const state = stateMap.get(q.id) as
              | { question_id: string; box: number; next_review_at: string }
              | undefined;

            if (!state) {
              // Brand-new card — always due
              return { question: q, currentBox: 1, isNew: true };
            }

            const nextReview = new Date(state.next_review_at);
            if (nextReview <= now) {
              return { question: q, currentBox: state.box, isNew: false };
            }

            return null; // not due yet
          })
          .filter((c): c is ReviewCard => c !== null);

        // 4. Sort: overdue (lower box first) then new, then shuffle within groups
        const sorted = [
          ...dueCards.filter(c => !c.isNew).sort((a, b) => a.currentBox - b.currentBox),
          ...dueCards.filter(c => c.isNew).sort(() => Math.random() - 0.5),
        ];

        setQueue(sorted);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load review queue');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [examId]);

  /* ── Advance card after rating ───────────────────────────────────── */
  const advance = useCallback(
    async (correct: boolean) => {
      const card = queue[currentIndex];
      if (!card) return;

      const fromBox = card.currentBox;
      const toBox = correct ? Math.min(fromBox + 1, 5) : 1;
      const daysUntilReview = LEITNER_INTERVALS[toBox];
      const nextReview = new Date(
        Date.now() + daysUntilReview * 24 * 60 * 60 * 1000
      );

      // Record result locally
      setResults(prev => [
        ...prev,
        { questionId: card.question.id, correct, fromBox, toBox },
      ]);

      // Persist to Supabase
      try {
        const supabase = createSupabaseClient();
        await supabase.from('user_card_state').upsert(
          {
            question_id: card.question.id,
            box: toBox,
            next_review_at: nextReview.toISOString(),
            last_reviewed_at: new Date().toISOString(),
            correct_streak: correct ? (card.currentBox === fromBox ? 1 : 0) + 1 : 0,
          },
          { onConflict: 'user_id,question_id' }
        );
      } catch {
        // Non-blocking — session continues even if persist fails
      }

      setCurrentIndex(i => i + 1);
    },
    [queue, currentIndex]
  );

  const sessionComplete = !loading && queue.length > 0 && currentIndex >= queue.length;
  const currentCard = queue[currentIndex] ?? null;

  return {
    queue,
    currentCard,
    currentIndex,
    total: queue.length,
    results,
    loading,
    error,
    advance,
    sessionComplete,
  };
}
