import SignOutButton from '@/features/sign-out-button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { memo } from 'react';
import ChatUserCard from './ChatUserCard';

function ChatHeader() {
  const { data } = useSession();

  return (
    <div className="p-4 w-full flex items-center justify-between border-b border-neutral-500">
      {data?.user ? <ChatUserCard user={data.user} /> : <div></div>}
      <SignOutButton disabled={!data?.user} />
    </div>
  );
}

export default memo(ChatHeader);
