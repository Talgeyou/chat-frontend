import queries from '@/shared/api';
import { Queries } from '@/shared/api/types';
import { User } from '@prisma/client';
import React, { memo } from 'react';
import { useQuery } from 'react-query';

function ChatUsers() {
  const { data, isLoading } = useQuery<User[]>(
    Queries.Users,
    queries[Queries.Users],
  );
  return (
    <div className="border-r border-neutral-500 p-4">
      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}

export default memo(ChatUsers);
