import { DateTimeResolver, URLResolver } from 'graphql-scalars';
import { chats, messages } from '../db';
import { Resolvers, Message } from '../types/graphql';

const resolvers: Resolvers = {
  Date: DateTimeResolver,
  URL: URLResolver,

  Chat: {
    messages(chat) {
      return messages.filter((m) => chat.messages.includes(m.id));
    },
    lastMessage(chat) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      return messages.find((m) => m.id === lastMessage) || null;
    },
  },

  Query: {
    chats() {
      return chats;
    },
    chat(root, { chatId }) {
      return chats.find((c) => c.id === chatId) || null;
    },
  },
  Mutation: {
    addMessage: function (root, { chatId, content }) {
      const chatIndex = chats.findIndex((c) => c.id === chatId);

      if (chatIndex === -1) return null;

      const chat = chats[chatIndex];

      const messageIds = messages.map((currentMessage) =>
        Number(currentMessage.id)
      );
      const messageId = String(Math.max(...messageIds) + 1);
      const message: Message = {
        id: messageId,
        createdAt: new Date(),
        content,
      };

      messages.push(message);
      chat.messages.push(messageId);

      chats.splice(chatIndex, 1);
      chats.unshift(chat);

      return message;
    },
  },
};

export default resolvers;
