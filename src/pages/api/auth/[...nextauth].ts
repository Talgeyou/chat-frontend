import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

const githubId = process.env.GITHUB_CLIENT_ID;
const githubSecret = process.env.GITHUB_CLIENT_SECRET;
const discordId = process.env.DISCORD_CLIENT_ID;
const discordSecret = process.env.DISCORD_CLIENT_SECRET;

if (!githubId) {
  throw new Error('You should specify GITHUB_CLIENT_ID in the env variables');
}

if (!githubSecret) {
  throw new Error(
    'You should specify GUTHUB_CLIENT_SECRET in the env variables',
  );
}

if (!discordId) {
  throw new Error('You should specify DISCORD_CLIENT_ID in the env variables');
}

if (!discordSecret) {
  throw new Error(
    'You should specify DISCORD_CLIENT_SECRET in the env variables',
  );
}

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: githubId,
      clientSecret: githubSecret,
    }),
    DiscordProvider({
      clientId: discordId,
      clientSecret: discordSecret,
    }),
  ],
  callbacks: {
    session: async ({ session, token, user }) => {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
