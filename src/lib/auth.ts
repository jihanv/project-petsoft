import NextAuth, { NextAuthConfig } from "next-auth";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {},
} satisfies NextAuthConfig;

export const { auth } = NextAuth(config);
