import React, { memo, useEffect, useRef, useState } from 'react';
import { MessageWithUser } from '@/widgets/chat/types';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

type Props = {
  messages: MessageWithUser[];
};

function ChatContent({ messages }: Props) {
  const { data } = useSession();

  const [lastMessageElement, setLastMessageElement] =
    useState<HTMLLIElement | null>(null);

  useEffect(() => {
    if (lastMessageElement) {
      lastMessageElement.scrollIntoView();
    }
  }, [lastMessageElement]);

  return (
    <div className="p-4 flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-purple-500">
      <ul className="flex flex-col gap-8 overflow-x-hidden">
        {messages.map((message, i) => (
          <li
            ref={(element) =>
              i === messages.length - 1 && setLastMessageElement(element)
            }
            key={message.id}
            className={clsx('flex flex-col gap-2', {
              'items-end': data?.user.id === message.userId,
            })}
          >
            <span className="block max-w 50vw bg-purple-100 p-2 rounded-lg max-w-[50%] break-words">
              {message.body}
            </span>
            <span className="text-sm">{message.user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(ChatContent);
