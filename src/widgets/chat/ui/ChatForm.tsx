import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { DateTime } from 'luxon';
import { v4 } from 'uuid';
import { Portal } from 'react-portal';
import { GrEmoji } from 'react-icons/gr';
import { AiOutlineSend } from 'react-icons/ai';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import useResizeObserver from '@react-hook/resize-observer';
import { ChatSocket, MessageWithUser } from '@/widgets/chat/types';
import { useClickOutside } from '@/shared/hooks';

type Props = {
  socket?: ChatSocket;
  onSubmit: (message: MessageWithUser) => void;
};

function ChatForm({ socket, onSubmit }: Props) {
  const { t } = useTranslation(['common']);
  const { data } = useSession();

  const containerRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiButtonElement, setEmojiButtonElement] =
    useState<HTMLButtonElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }>({ bottom: 0 });

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

      if (!message.body.trim()) {
        return;
      }

      socket?.emit('messages:post', message, message.id);

      messageRef.current.value = '';

      onSubmit({
        id: message.id,
        body: message.body,
        userId: data.user.id,
        createdAt: DateTime.now().toISO() as string,
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

  const toggleEmojiPicker = useCallback(
    (event: React.FormEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setShowEmojiPicker((prev) => !prev);
    },
    [],
  );

  const changeEmojiPickerPosition = useCallback(() => {
    if (emojiButtonElement) {
      const { x: buttonXPosition, y: buttonYPosition } =
        emojiButtonElement.getBoundingClientRect();

      setEmojiPickerPosition({
        top: buttonYPosition - 450,
        left: buttonXPosition - 435 / 2,
      });
    }
  }, [emojiButtonElement]);

  useEffect(() => {
    changeEmojiPickerPosition();
  }, [changeEmojiPickerPosition]);

  useClickOutside(emojiPickerRef, () => {
    setShowEmojiPicker(false);
  });

  useResizeObserver(containerRef, () => changeEmojiPickerPosition());

  const handleClickEmoji = useCallback((emoji: EmojiClickData) => {
    if (messageRef.current) {
      messageRef.current.value += emoji.emoji;
    }
  }, []);

  return (
    <div className="p-4 flex items-center justify-between gap-2 border-t border-neutral-500 w-full">
      <button
        ref={(element) => setEmojiButtonElement(element)}
        onClick={toggleEmojiPicker}
      >
        <GrEmoji size={32} className={'text-neutral-700'} />
      </button>
      {showEmojiPicker && typeof window !== 'undefined' && (
        <Portal>
          <div
            ref={emojiPickerRef}
            className="absolute overflow-auto shadow-xl"
            style={emojiPickerPosition}
          >
            <EmojiPicker onEmojiClick={handleClickEmoji} />
          </div>
        </Portal>
      )}
      <form
        className="flex-1 flex items-center justify-between gap-4 overflow-hidden"
        ref={containerRef}
        onSubmit={handleSubmit}
      >
        <input
          className="border-b flex-1 w-full border-neutral-500 p-2 focus:outline-none focus:border-purple-500"
          ref={messageRef}
        />
        <button
          className="bg-purple-500 text-white p-2 rounded-lg focus-visible:bg-purple-400 hover:bg-purple-400 active:bg-purple-400 flex gap-2 items-center"
          type="submit"
        >
          <span className="hidden sm:block">{t('send')}</span>
          <AiOutlineSend size={24} />
        </button>
      </form>
    </div>
  );
}

export default memo(ChatForm);
