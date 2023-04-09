import { User } from '@prisma/client';
import Image from 'next/image';
import React, { memo } from 'react';

type Props = { user: Partial<User> };

function ChatUserCard({ user }: Props) {
  return (
    <div className="flex gap-2 items-center">
      <div className="rounded-full overflow-clip bg-neutral-500 w-8 h-8">
        {user.image && (
          <Image src={user.image} alt="avatar" width={32} height={32} />
        )}
      </div>
      <div>{user?.name}</div>
    </div>
  );
}

export default memo(ChatUserCard);
