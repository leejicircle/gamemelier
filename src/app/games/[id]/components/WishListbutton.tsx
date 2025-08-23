'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { toggleSaved } from '@/lib/queries/savedGamesApi';

type Props = {
  gameId: number;
  initialSaved?: boolean;
};

export default function WishListButton({
  gameId,
  initialSaved = false,
}: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  const handleClick = async () => {
    if (pending || saved) return;
    setSaved(true);
    setPending(true);

    try {
      const { saved: isSaved } = await toggleSaved(gameId);
      if (isSaved) {
        toast.success('위시리스트에 저장되었습니다.');
      } else {
        setSaved(false);
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : '저장 처리 중 오류가 발생했습니다.';
      toast.error(msg);
      setSaved(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={pending || saved}
      className="w-full h-[52px] text-xl font-semibold text-white px-4 py-3 leading-7 rounded-xl"
    >
      {saved ? '저장됨' : '위시리스트 추가'}
    </Button>
  );
}
