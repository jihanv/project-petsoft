import type { DefaultSession, User } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    hasAccess: boolean;
  }
}

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
  }
  interface Session {
    user: User & {
      id: string;
      hasAccess: boolean;
    };
  }
}
