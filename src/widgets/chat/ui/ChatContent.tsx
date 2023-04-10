import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { MessageWithUser } from '@/widgets/chat/types';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { DateTime } from 'luxon';
import Image from 'next/image';
import { classNames } from '@/shared/lib';

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

  const getDateTime = useCallback((dateTime: string) => {
    return DateTime.fromISO(dateTime).toLocaleString(DateTime.DATETIME_SHORT);
  }, []);

  return (
    <div className="p-4 flex-1 w-full overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-purple-500">
      <ul className="flex flex-col gap-8 overflow-x-hidden">
        {messages.map((message, i) => (
          <li
            ref={(element) =>
              i === messages.length - 1 && setLastMessageElement(element)
            }
            key={message.id}
            className={clsx('flex flex-col gap-2 overflow-hidden', {
              'items-end': data?.user.id === message.userId,
            })}
          >
            <span
              className={clsx('flex max-w-[50%] items-center gap-2', {
                'flex-row-reverse': message.userId === data?.user.id,
              })}
            >
              <div className="bg-purple-100 p-2 rounded-lg break-words whitespace-pre">
                {message.body}
              </div>
              <span className="text-xs text-neutral-400 min-w-max">
                {getDateTime(message.createdAt)}
              </span>
            </span>
            <div
              className={classNames('flex gap-2', {
                'flex-row-reverse': message.userId === data?.user.id,
              })}
            >
              {message.user.image ? (
                <Image
                  className="rounded-full"
                  src={message.user.image}
                  alt={`${message.user.name} avatar`}
                  width={20}
                  height={20}
                />
              ) : null}
              <span className="text-sm">{message.user.name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(ChatContent);
