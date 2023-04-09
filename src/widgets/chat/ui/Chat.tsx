import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { io } from 'socket.io-client';
import { ChatSocket, MessageWithUser } from '@/widgets/chat/types';
import SignInButton from '@/features/sign-in-button';
import { exhaustiveCheck } from '@/shared/lib';
import ChatContent from './ChatContent';
import ChatHeader from './ChatHeader';
import ChatForm from './ChatForm';
import ChatUsers from './ChatUsers';

function Chat() {
  const { status, data } = useSession();
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<ChatSocket>();
  const [messages, setMessages] = useState<MessageWithUser[]>([]);

  const initializeSocket = useCallback(() => {
    const socketClient: ChatSocket = io('http://localhost:5000/chat');
    socketClient.connect();

    socketClient.on('connect', () => {
      setConnected(true);
    });

    socketClient.on('disconnect', () => {
      setConnected(false);
    });
    return socketClient;
  }, []);

  useEffect(() => {
    const socketClient = initializeSocket();
    setSocket(socketClient);

    return () => {
      socketClient.disconnect();
      setSocket(undefined);
    };
  }, [initializeSocket]);

  const newMessageListener = useCallback(
    (message: MessageWithUser, previousId: string) => {
      console.log(message, previousId);
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
          return [...newMessages, message];
        }
      });
    },
    [],
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

  const handleSubmit = useCallback((message: MessageWithUser) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const content = useMemo(() => {
    switch (status) {
      case 'unauthenticated':
        return (
          <div className="w-full h-full flex justify-center items-center">
            <SignInButton />
          </div>
        );
      case 'authenticated':
        return (
          <div className="w-full">
            <ChatHeader />
            <ChatContent messages={messages} />
            <ChatForm socket={socket} onSubmit={handleSubmit} />
          </div>
        );
      case 'loading':
        return <div>Loading...</div>;
      default:
        return exhaustiveCheck(status);
    }
  }, [handleSubmit, messages, socket, status]);

  return (
    <div className="bg-white max-w-xl w-full drop-shadow-lg shadow flex">
      <ChatUsers />
      {content}
    </div>
  );
}

export default memo(Chat);
