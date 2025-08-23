// src/app/recommend/client.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CardsGrid } from '@/app/shared/components/CardsGrid';
import { Input } from '@/components/ui/input';
import { useRecommendCards } from '@/lib/hooks/useRecommendCards';
import { Slider } from '@/components/ui/slider';

function useDebounced<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function formatKRW(cents?: number) {
  if (cents == null) return '제한 없음';
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(cents);
}

type Props = {
  ssrUserId?: string;
  ssrBudgetCents?: number;
  ssrLimit?: number;
  ssrExcludeUpcoming?: boolean;
};

export default function RecommendClient({
  ssrUserId,
  ssrBudgetCents,
  ssrLimit = 30,
  ssrExcludeUpcoming = true,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialBudget =
    ssrBudgetCents ??
    (searchParams.get('budgetCents')
      ? Number(searchParams.get('budgetCents'))
      : undefined);

  const [budget, setBudget] = useState<number | undefined>(initialBudget);
  const debouncedBudget = useDebounced(budget, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedBudget == null || Number.isNaN(debouncedBudget)) {
      params.delete('budgetCents');
    } else {
      params.set('budgetCents', String(debouncedBudget));
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`, { scroll: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedBudget]);

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useRecommendCards(
    ssrUserId,
    debouncedBudget,
    ssrLimit,
    ssrExcludeUpcoming,
  );

  const min = 0;
  const max = 1_000_000;
  const step = 1_000;

  // UI
  return (
    <section className="space-y-6">
      {!ssrUserId && (
        <p className="text-sm text-muted-foreground">
          로그인 후 추천을 받아보세요.
        </p>
      )}

      <div className="rounded-xl border p-4">
        <h1 className="text-white">금액별 설정</h1>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium">예산</span>
          <span className="text-sm">{formatKRW(budget)}</span>
        </div>

        <div className="flex items-center gap-3">
          <Slider
            value={[budget ?? max]}
            min={min}
            max={max}
            step={step}
            onValueChange={([v]) => setBudget(v)}
            className="w-full"
          />
          <Input
            type="number"
            inputMode="numeric"
            className="w-36"
            value={budget ?? ''}
            onChange={(e) => {
              const v = e.currentTarget.value;
              setBudget(
                v === '' ? undefined : Math.max(min, Math.min(max, Number(v))),
              );
            }}
            placeholder="제한 없음"
          />
          <button
            className="text-sm underline text-muted-foreground"
            onClick={() => setBudget(undefined)}
          >
            초기화
          </button>
        </div>

        {isPending && (
          <p className="mt-2 text-xs text-muted-foreground">필터 적용 중…</p>
        )}
      </div>

      <CardsGrid title="개인 맞춤 추천" items={data} isLoading={isLoading} />
      {isError && (
        <p className="text-sm text-red-400">
          에러: {(error as Error)?.message}
        </p>
      )}
    </section>
  );
}
