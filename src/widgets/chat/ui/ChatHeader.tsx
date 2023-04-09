import SignOutButton from '@/features/sign-out-button';
import { useSession } from 'next-auth/react';
import React, { memo } from 'react';

function ChatHeader() {
  const { data } = useSession();

  return (
    <div className="p-4 w-full flex items-center justify-between border-b border-neutral-500">
      <div>{data?.user?.name}</div>
      <SignOutButton />
    </div>
  );
}

export default memo(ChatHeader);
