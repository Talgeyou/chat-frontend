import React, { memo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function ChatSkeleton() {
  return (
    <div className="flex-1 h-full flex w-full overflow-hidden gap-2">
      <Skeleton className="block" height={'100%'} width={200} />
      <Skeleton containerClassName="block w-full" height={'100%'} />
    </div>
  );
}

export default memo(ChatSkeleton);
