import { useEffect, useState } from 'react';
import { createSupabaseClient } from '@/lib/supabaseClient';

export interface Exam {
  id: string;
  title: string;
  code: string;
  description: string | null;
  created_at: string;
}

export const useExams = () => {
  const [data, setData] = useState<Exam[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createSupabaseClient();
    let isMounted = true;

    const fetchExams = async () => {
      try {
        setLoading(true);
        const { data: exams, error: fetchError } = await supabase
          .from('exams')
          .select('*');

        if (fetchError) {
          throw fetchError;
        }

        if (isMounted) {
          setData(exams as Exam[]);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'An error occurred while fetching exams.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchExams();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
};
