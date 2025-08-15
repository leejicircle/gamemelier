'use client';
import { useEffect, useState } from 'react';
import { fetchIsSaved, toggleSaved } from '@/lib/queries/savedGamesApi';
import { supabase } from '@/lib/supabase/client';

export default function SavedButton({ gameId }: { gameId: number }) {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: session } = await supabase.auth.getSession();
      const token = session.session?.access_token;
      if (!token) return setLoading(false);
      try {
        const { is_saved } = await fetchIsSaved(gameId);
        setSaved(is_saved);
      } finally {
        setLoading(false);
      }
    })();
  }, [gameId]);

  const onClick = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return alert('로그인이 필요합니다.');
    const prev = saved;
    setSaved(!prev); // 옵티미스틱
    try {
      const { saved: serverSaved } = await toggleSaved(gameId);
      setSaved(serverSaved);
    } catch (e) {
      setSaved(prev);
      alert('저장 처리 중 오류가 발생했습니다.');
      console.error(e);
    }
  };

  if (loading)
    return (
      <button disabled className="px-3 py-1 rounded bg-neutral-700">
        ...
      </button>
    );
  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      className={`px-3 py-1 rounded ${saved ? 'bg-amber-500' : 'bg-neutral-700'}`}
      title={saved ? '저장됨' : '저장하기'}
    >
      {saved ? '★ 저장됨' : '☆ 저장'}
    </button>
  );
}
