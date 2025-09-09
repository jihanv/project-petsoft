import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        //This will run on every login attempt
        const { email, password } = credentials;

        //Check with the database
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (!user) {
          console.log("No user found.");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword
        );

        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ request }) => {
      // Runs on every request with middleware
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      if (isTryingToAccessApp) {
        return false;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn } = NextAuth(config);
