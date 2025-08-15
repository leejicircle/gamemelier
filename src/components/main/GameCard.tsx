'use client';
import SavedButton from './SavedButton';
import type { SavedGameItem } from '@/lib/queries/savedGamesApi';

type Props = {
  item: SavedGameItem;
  showSaveButton?: boolean; // 필요 없으면 제거해도 됨
};

export default function GameCard({ item, showSaveButton = true }: Props) {
  return (
    <div className="rounded border p-2">
      <img
        src={item.cover_url ?? '/placeholder.png'}
        alt={item.name}
        className="w-full aspect-[16/9] object-cover rounded"
      />
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="text-sm font-medium">{item.name}</div>
        {showSaveButton && <SavedButton gameId={item.id} />}
      </div>
      <div className="text-xs text-neutral-400">
        MC {item.metacritic_score ?? '-'} · 리뷰 {item.reviews_total ?? '-'}
      </div>
    </div>
  );
}
