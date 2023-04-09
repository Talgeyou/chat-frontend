import React, { memo, useCallback, useEffect, useState } from 'react';
import { User } from '@prisma/client';
import { ChatSocket } from '@/widgets/chat/types';
import { getSortedUsers } from '../lib';
import ChatUserCard from './ChatUserCard';

type Props = {
  socket?: ChatSocket;
};

function ChatUsers({ socket }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  const userConnectListenter = useCallback((user: User) => {
    setUsers((prev) => getSortedUsers([...prev, user]));
  }, []);

  useEffect(() => {
    socket?.on('users:connect', userConnectListenter);

    return () => {
      socket?.off('users:connect', userConnectListenter);
    };
  }, [socket, userConnectListenter]);

  const userDisconnectListener = useCallback((user: User) => {
    setUsers((prev) => prev.filter((item) => item.id !== user.id));
  }, []);

  useEffect(() => {
    socket?.on('users:disconnect', userDisconnectListener);

    return () => {
      socket?.off('users:disconnect', userDisconnectListener);
    };
  }, [socket, userDisconnectListener]);

  const usersGetListener = useCallback((users: User[]) => {
    setUsers(getSortedUsers(users));
  }, []);

  useEffect(() => {
    socket?.on('users:get', usersGetListener);

    return () => {
      socket?.off('users:get', usersGetListener);
    };
  }, [socket, usersGetListener]);

  return (
    <div className="basis-52 shrink-0 grow-0 border-r border-neutral-500 p-4 flex flex-col gap-2">
      {users.map((user) => (
        <ChatUserCard key={user.id} user={user} />
      ))}
    </div>
  );
}

export default memo(ChatUsers);
