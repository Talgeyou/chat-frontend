import { Message, User } from '@prisma/client';
import { Socket } from 'socket.io-client';

export type MessageWithUser = Omit<Message & { user: User }, 'createdAt'> & {
  createdAt: string;
};

export type MessageCreateDTO = {
  userId: string;
  body: string;
  id: string;
};

export type ChatSocket = Socket<
  {
    'messages:post': (message: MessageWithUser, previousId: string) => void;
    'messages:post-error': (messageId: string) => void;
    'messages:get': (messages: MessageWithUser[]) => void;
    'users:connect': (user: User) => void;
    'users:disconnect': (user: User) => void;
    'users:get': (user: User[]) => void;
  },
  {
    'messages:post': (message: MessageCreateDTO, id: string) => void;
  }
>;
