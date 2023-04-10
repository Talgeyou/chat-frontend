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
import Button from '@/shared/ui/button';

type Props = {
  socket?: ChatSocket;
  onSubmit: (message: MessageWithUser) => void;
};

function isShift(code: string) {
  return code === 'ShiftLeft' || code === 'ShiftRight';
}

function ChatForm({ socket, onSubmit }: Props) {
  const { t } = useTranslation(['common']);
  const { data } = useSession();

  const containerRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLInputElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiButtonElement, setEmojiButtonElement] =
    useState<HTMLButtonElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  const [emojiPickerPosition, setEmojiPickerPosition] = useState<{
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }>({ bottom: 0 });

  const sendMessage = useCallback(() => {
    if (!data?.user?.email) {
      throw new Error('Unauthentificated');
    }

    if (!messageRef.current) {
      throw new Error('No input field');
    }

    if (!messageRef.current.textContent) {
      return;
    }

    const message = {
      userId: data.user.id,
      body: messageRef.current.innerText.trim(),
      id: v4(),
    };

    if (!message.body.trim()) {
      return;
    }

    socket?.emit('messages:post', message, message.id);

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

    messageRef.current.innerHTML = '';
  }, [
    data?.user.email,
    data?.user.emailVerified,
    data?.user.id,
    data?.user.image,
    data?.user.name,
    onSubmit,
    socket,
  ]);

  const handleKeyboardDownEvent = useCallback(
    (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (showEmojiPicker && event.code === 'Escape') {
        setShowEmojiPicker(false);
      }

      if (isShift(event.code)) {
        setIsShiftPressed(true);
      }

      if (event.code === 'Enter' && !isShiftPressed) {
        sendMessage();
      }
    },
    [isShiftPressed, sendMessage, showEmojiPicker],
  );

  const handleKeyboardUpEvent = useCallback(
    (event: React.KeyboardEvent<HTMLFormElement>) => {
      if (isShift(event.code)) {
        setIsShiftPressed(false);
      }

      if (!isShiftPressed && event.code === 'Enter' && messageRef.current) {
        messageRef.current.innerText = '';
      }
    },
    [isShiftPressed],
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      sendMessage();
    },
    [sendMessage],
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
      messageRef.current.textContent += emoji.emoji;
    }
  }, []);

  return (
    <div className="p-4 flex items-center justify-between gap-2 border-t border-neutral-500">
      <form
        className="w-full flex items-start justify-between gap-4"
        ref={containerRef}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyboardDownEvent}
        onKeyUp={handleKeyboardUpEvent}
      >
        <Button
          type="button"
          ref={(element) => setEmojiButtonElement(element)}
          variant="ghost"
          onClick={toggleEmojiPicker}
        >
          <GrEmoji size={24} />
        </Button>
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
        <div
          role="textbox"
          contentEditable
          className="border-b overflow-x-hidden overflow-y-auto max-h-48 w-full border-neutral-500 p-2 focus:outline-none focus:border-purple-500 whitespace-break-spaces scrollbar-thin scrollbar-thumb-purple-500"
          ref={messageRef}
        />
        <Button type="submit" addonAfter={<AiOutlineSend size={16} />}>
          <span className="hidden sm:block">{t('send')}</span>
        </Button>
      </form>
    </div>
  );
}

export default memo(ChatForm);
