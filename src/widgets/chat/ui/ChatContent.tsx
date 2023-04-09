import React, { memo } from 'react';
import { MessageWithUser } from '@/widgets/chat/types';

type Props = {
  messages: MessageWithUser[];
};

function ChatContent({ messages }: Props) {
  return (
    <div className="p-4 h-[50vh] overflow-y-auto">
      <ul>
        {messages.map((message) => (
          <li key={message.id} className="flex gap-2">
            <span className="font-bold">{message.user.name}:</span>
            <span>{message.body}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(ChatContent);
