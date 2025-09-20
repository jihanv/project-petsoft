import type { DefaultSession, User } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    email: string;
    hasAccess: boolean;
  }
}

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
    email: string;
  }
  interface Session {
    user: User & {
      id: string;
    };
  }
}
