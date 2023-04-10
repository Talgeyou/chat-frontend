import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import useSound from 'use-sound';
import { ChatSocket, MessageWithUser } from '@/widgets/chat/types';
import SignInButton from '@/features/sign-in-button';
import { exhaustiveCheck } from '@/shared/lib';
import { useNotifications } from '@/shared/hooks';
import ChatContent from './ChatContent';
import ChatHeader from './ChatHeader';
import ChatForm from './ChatForm';
import ChatUsers from './ChatUsers';
import ChatSkeleton from './ChatSkeleton';

function Chat() {
  const { t } = useTranslation(['common']);
  const { status, data } = useSession();
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<ChatSocket>();
  const [messages, setMessages] = useState<MessageWithUser[]>([]);
  const [playSound] = useSound('/sounds/message.wav');
  const showNotification = useNotifications();

  const initializeSocket = useCallback(() => {
    if (data?.user.id) {
      const socketClient: ChatSocket = io(
        `${process.env.NEXT_PUBLIC_API_URL}chat`,
        { query: { userId: data?.user.id } },
      );
      socketClient.connect();

      socketClient.on('connect', () => {
        setConnected(true);
      });

      socketClient.on('disconnect', () => {
        setConnected(false);
      });
      return socketClient;
    }
  }, [data?.user.id]);

  useEffect(() => {
    const socketClient = initializeSocket();
    setSocket(socketClient);

    return () => {
      socketClient?.disconnect();
      setSocket(undefined);
    };
  }, [initializeSocket]);

  const newMessageListener = useCallback(
    (message: MessageWithUser, previousId: string) => {
      console.log({ message });
      setMessages((prev) => {
        let changedId = false;

        const newMessages = prev.map((item) => {
          if (item.id === previousId) {
            changedId = true;
            return { ...message };
          }

          return item;
        });

        if (changedId) {
          return newMessages;
        } else {
          playSound();
          showNotification(
            t('new_message', {
              username: message.user.name,
              text: message.body,
            }),
          );
          return [...newMessages, message];
        }
      });
    },
    [playSound, showNotification, t],
  );

  useEffect(() => {
    socket?.on('messages:post', newMessageListener);

    return () => {
      socket?.off('messages:post', newMessageListener);
    };
  }, [newMessageListener, socket]);

  const newMessageErrorListener = useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((message) => message.id !== messageId));
  }, []);

  useEffect(() => {
    socket?.on('messages:post-error', newMessageErrorListener);

    return () => {
      socket?.off('messages:post-error', newMessageErrorListener);
    };
  }, [newMessageErrorListener, socket]);

  const getMessagesListener = useCallback((messages: MessageWithUser[]) => {
    setMessages(messages);
  }, []);

  useEffect(() => {
    socket?.on('messages:get', getMessagesListener);

    return () => {
      socket?.off('messages:get', getMessagesListener);
    };
  }, [getMessagesListener, socket]);

  const handleSubmit = useCallback((message: MessageWithUser) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const content = useMemo(() => {
    switch (status) {
      case 'unauthenticated':
        return (
          <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <SignInButton provider="github" />
            <SignInButton provider="discord" />
          </div>
        );
      case 'authenticated':
        return (
          <>
            <ChatHeader />
            <div className="flex-1 flex overflow-hidden">
              <ChatUsers socket={socket} />
              <div className="flex-1 h-full flex w-full overflow-hidden flex-col ">
                <ChatContent messages={messages} />
                <ChatForm socket={socket} onSubmit={handleSubmit} />
              </div>
            </div>
          </>
        );
      case 'loading':
        return (
          <>
            <ChatHeader />
            <ChatSkeleton />
          </>
        );
      default:
        return exhaustiveCheck(status);
    }
  }, [handleSubmit, messages, socket, status]);

  return (
    <div className="bg-white w-full h-full drop-shadow-lg shadow flex flex-col">
      {content}
    </div>
  );
}

export default memo(Chat);
