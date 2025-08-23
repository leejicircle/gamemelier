'use client';

import { useEffect, useMemo, useState } from 'react';
import { saveSignupGenres } from '@/lib/queries/fetchGenres';
import { useProfileQuery } from '@/lib/queries/useProfileQuery';
import { useAuthStore } from '@/store/useAuthStore';
import { Toggle } from '@/components/ui/toggle';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Loader2, SlidersHorizontal } from 'lucide-react';

import {
  PARENT_CATEGORIES,
  type ParentCategory,
} from '@/lib/constants/categories';
import { cn } from '@/lib/utils';

export default function GenreModal() {
  const user = useAuthStore((s) => s.user);
  const { data: profile, isLoading: loadingProfile } = useProfileQuery(
    user?.id,
  );

  const baseline: string[] = useMemo(() => {
    const fav = (profile?.favorite_genres ?? []) as string[];

    return fav.filter((g) => PARENT_CATEGORIES.includes(g as ParentCategory));
  }, [profile?.favorite_genres]);

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setSelected(baseline);
  }, [open, baseline]);

  const toggle = (name: string) =>
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name],
    );

  const dirty = useMemo(() => {
    if (baseline.length !== selected.length) return true;
    const a = [...baseline].sort();
    const b = [...selected].sort();
    return a.some((v, i) => v !== b[i]);
  }, [baseline, selected]);

  const onSave = async () => {
    try {
      setSaving(true);
      await saveSignupGenres(selected);
      setOpen(false);
    } catch (e) {
      console.error(e);

      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold">선호 장르</h3>
        {loadingProfile && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="gray" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            선호 장르 설정
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[560px] bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">선호 장르 선택</DialogTitle>
            <DialogDescription className="text-gray-400">
              가입/추천에 사용할 대표 장르를 선택하세요. 언제든 변경할 수
              있어요.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2 py-2">
            {PARENT_CATEGORIES.map((name) => {
              const pressed = selected.includes(name);
              return (
                <Toggle
                  key={name}
                  pressed={pressed}
                  onPressedChange={() => toggle(name)}
                  disabled={saving}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-sm bg-gray-200',
                    'hover:bg-gray-950',
                    'data-[state=on]:bg-gray-950 data-[state=on]:text-white data-[state=on]:border-transparent',
                  )}
                  aria-label={name}
                >
                  {name}
                </Toggle>
              );
            })}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="white"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              취소
            </Button>
            <Button
              variant="gray"
              onClick={onSave}
              disabled={!dirty || saving}
              className="gap-2 bg-gray-950"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
