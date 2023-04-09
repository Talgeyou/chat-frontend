import React, { memo, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { ChatSocket, MessageWithUser } from '@/widgets/chat/types';
import { v4 } from 'uuid';

type Props = {
  socket?: ChatSocket;
  onSubmit: (message: MessageWithUser) => void;
};

function ChatForm({ socket, onSubmit }: Props) {
  const { data } = useSession();

  const messageRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!data?.user?.email) {
        throw new Error('Unauthentificated');
      }

      if (!messageRef.current) {
        throw new Error('No input field');
      }

      if (!messageRef.current.value) {
        return;
      }

      const message = {
        userId: data.user.id,
        body: messageRef.current.value,
        id: v4(),
      };

      socket?.emit('messages:post', message, message.id);

      messageRef.current.value = '';

      onSubmit({
        id: message.id,
        body: message.body,
        userId: data.user.id,
        user: {
          id: data.user.id,
          email: data.user.email,
          emailVerified: data.user.emailVerified,
          image: data.user.image ?? null,
          name: data.user.name ?? null,
        },
      });
    },
    [
      data?.user.email,
      data?.user.emailVerified,
      data?.user.id,
      data?.user.image,
      data?.user.name,
      onSubmit,
      socket,
    ],
  );

  return (
    <form
      className="p-4 flex items-center justify-between gap-2 border-t border-neutral-500"
      onSubmit={handleSubmit}
    >
      <input
        className="border-b border-neutral-500 w-full p-2 focus:outline-none focus:border-blue-500"
        ref={messageRef}
      />
      <button
        className="min-w-[4rem] bg-blue-500 text-white p-2 rounded-lg focus-visible:bg-blue-400 hover:bg-blue-400 active:bg-blue-400"
        type="submit"
      >
        Send
      </button>
    </form>
  );
}

export default memo(ChatForm);
