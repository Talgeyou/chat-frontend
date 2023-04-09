import { Message, User } from '@prisma/client';
import { Socket } from 'socket.io-client';

export type MessageWithUser = Message & { user: User };

export type MessageCreateDTO = {
  userId: string;
  body: string;
  id: string;
};

export type ChatSocket = Socket<
  {
    'messages:post': (message: MessageWithUser, previousId: string) => void;
    'messages:post-error': (messageId: string) => void;
  },
  {
    'messages:post': (message: MessageCreateDTO, id: string) => void;
  }
>;
