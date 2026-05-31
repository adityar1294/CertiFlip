import { createSupabaseClient } from '@/lib/supabaseClient';

export async function saveExamAttempt({
  examId,
  score,
  totalQuestions,
  passingPercentage = 50,
}: {
  examId: string;
  score: number;
  totalQuestions: number;
  passingPercentage?: number;
}): Promise<void> {
  const supabase = createSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('exam_attempts').insert({
    user_id: user.id,
    exam_id: examId,
    score,
    total_questions: totalQuestions,
    passing_percentage: passingPercentage,
  });
}
