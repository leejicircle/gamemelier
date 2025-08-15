'use client';
import { useEffect, useState } from 'react';
import { fetchGenres, type Genre } from '@/lib/queries/fetchGenres';
import { saveSignupGenres } from '@/lib/queries/saveSignupGenres';
import { useProfileQuery } from '@/lib/queries/useProfileQuery';
import { useAuthStore } from '@/store/useAuthStore';

export default function PreferenceSection() {
  const user = useAuthStore((s) => s.user);
  const { data: profile } = useProfileQuery(user?.id);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    fetchGenres().then(setGenres).catch(console.error);
  }, []);
  useEffect(() => {
    setSelected(profile?.favorite_genres ?? []);
  }, [profile?.favorite_genres]);

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name],
    );

  const onSave = async () => {
    await saveSignupGenres(selected);
    alert('선호 장르가 저장되었습니다.');
  };

  if (!user) return null;

  return (
    <section className="space-y-3">
      <div className="font-semibold">선호 장르 설정</div>
      <div className="flex flex-wrap gap-2">
        {genres.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => toggle(g.name)}
            className={`px-3 py-1 rounded ${selected.includes(g.name) ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
          >
            {g.name}
          </button>
        ))}
      </div>
      <button
        onClick={onSave}
        className="px-3 py-1 rounded bg-black text-white"
      >
        저장
      </button>
    </section>
  );
}
