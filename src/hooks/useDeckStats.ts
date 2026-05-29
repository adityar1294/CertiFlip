import { useState, useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';
import type { Exam } from '@/hooks/useExams';

export interface DeckStats {
  exam: Exam;
  totalCards: number;
  dueCount: number;
  newCount: number;
  /** [box1, box2, box3, box4, box5] card counts */
  boxDistribution: [number, number, number, number, number];
  lastReviewedAt: string | null;
}

export function useDeckStats() {
  const [decks, setDecks] = useState<DeckStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const supabase = createSupabaseClient();

        // 1. Fetch all exams
        const { data: exams, error: eErr } = await supabase
          .from('exams')
          .select('*');
        if (eErr) throw eErr;

        const examList = (exams ?? []) as Exam[];
        if (examList.length === 0) {
          setDecks([]);
          setLoading(false);
          return;
        }

        // 2. For each exam, get question count + card states
        const now = new Date();

        const deckStats = await Promise.all(
          examList.map(async exam => {
            // Total question count for this exam
            const { count: totalCards } = await supabase
              .from('questions')
              .select('id', { count: 'exact', head: true })
              .eq('exam_id', exam.id);

            const total = totalCards ?? 0;

            // Card states for this exam's questions
            const { data: states } = await supabase
              .from('user_card_state')
              .select('box, next_review_at, last_reviewed_at')
              .in(
                'question_id',
                // sub-select question IDs for this exam
                (
                  await supabase
                    .from('questions')
                    .select('id')
                    .eq('exam_id', exam.id)
                ).data?.map((q: { id: string }) => q.id) ?? []
              );

            const stateRows = (states ?? []) as {
              box: number;
              next_review_at: string;
              last_reviewed_at: string | null;
            }[];

            // Box distribution
            const boxDist: [number, number, number, number, number] = [0, 0, 0, 0, 0];
            let dueCount = 0;
            let latestReview: string | null = null;

            for (const s of stateRows) {
              const boxIdx = Math.max(0, Math.min(4, s.box - 1));
              boxDist[boxIdx]++;
              if (new Date(s.next_review_at) <= now) dueCount++;
              if (s.last_reviewed_at) {
                if (!latestReview || s.last_reviewed_at > latestReview) {
                  latestReview = s.last_reviewed_at;
                }
              }
            }

            // New cards = total questions - questions that have any state
            const newCount = Math.max(0, total - stateRows.length);
            // New cards are always "due"
            const totalDue = dueCount + newCount;

            return {
              exam,
              totalCards: total,
              dueCount: totalDue,
              newCount,
              boxDistribution: boxDist,
              lastReviewedAt: latestReview,
            } satisfies DeckStats;
          })
        );

        setDecks(deckStats);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to load deck stats');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { decks, loading, error };
}

/* ── Formatting helper ─────────────────────────────────────────────────── */
export function formatLastReviewed(iso: string | null): string {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return mins <= 1 ? 'Just now' : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
