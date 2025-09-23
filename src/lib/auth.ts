import NextAuth, { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "./server-utils";
import { authSchema } from "@/lib/validations";
import { sleep } from "./utils";
import { redirect } from "next/dist/server/api-utils";

const config = {
  pages: {
    signIn: "/login",
  },
  providers: [
    credentials({
      async authorize(credentials) {
        const validatedFormData = authSchema.safeParse(credentials);

        // Validate object
        if (!validatedFormData.success) {
          return null;
        }

        //This will run on every login attempt
        const { email, password } = validatedFormData.data;

        //Check with the database

        const user = await findUserByEmail(email);

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
    authorized: ({ auth, request }) => {
      // Runs on every request with middleware
      const isLoggedIn = Boolean(auth?.user);
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");
      if (!isLoggedIn && isTryingToAccessApp) {
        return false;
      }
      if (isLoggedIn && isTryingToAccessApp && !auth?.user.hasAccess) {
        return Response.redirect(new URL("/payment", request.nextUrl));
      }

      if (isLoggedIn && isTryingToAccessApp && auth?.user.hasAccess) {
        return true;
      }

      if (
        isLoggedIn &&
        (request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")) &&
        auth?.user.hasAccess
      ) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }
      if (isLoggedIn && !isTryingToAccessApp && !auth?.user.hasAccess) {
        if (
          request.nextUrl.pathname.includes("/login") ||
          request.nextUrl.pathname.includes("/signup")
        ) {
          return Response.redirect(new URL("/payment", request.nextUrl));
        }
        return true;
      }

      if (!isLoggedIn && !isTryingToAccessApp) {
        return true;
      }

      return false;
    },
    jwt: async ({ token, user, trigger }) => {
      //on sign in we grab id from the user and attach it to the token
      if (user) {
        //on sign in
        token.userId = user.id;
        token.email = user.email!;
        token.hasAccess = user.hasAccess;
      }

      // Updated token
      if (trigger === "update") {
        await sleep();
        const userFromDb = await findUserByEmail(token.email!);
        if (userFromDb) {
          token.hasAccess = userFromDb.hasAccess;
        }
      }
      // this is encrypted
      return token;
    },
    //accessing user information from the client, attach things to session so we can read from the client
    session: ({ session, token }) => {
      session.user.id = token.userId as string;
      session.user.hasAccess = token.hasAccess as boolean;

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
