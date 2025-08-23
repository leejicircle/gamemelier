'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type Props = {
  appId: number;
};

export default function ConfirmBuy({ appId }: Props) {
  const handleConfirm = () => {
    window.open(
      `https://store.steampowered.com/app/${appId}`,
      '_blank',
      'noopener,noreferrer',
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="gradient"
          className="w-full h-[52px] text-xl font-semibold text-white px-4 py-3 leading-7 rounded-xl"
        >
          구입하기
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-white">
            스팀 구매창으로 이동하시겠습니까?
          </DialogTitle>
          <DialogDescription className="text-white">
            외부 사이트(스팀 스토어)로 이동합니다. 새 창에서 열립니다.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="white">취소</Button>
          </DialogClose>

          <Button onClick={handleConfirm}>이동</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
