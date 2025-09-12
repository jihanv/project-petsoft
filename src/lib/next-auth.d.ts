import type { DefaultSession } from "next-auth";

// import { DefaultSession } from "next-auth";
// declare module "next-auth" {
//   interface Session {
//     user: {
//       userId: string;
//     } & DefaultSession["user"];
//   }

//   interface Account {
//     id: string;
//   }

//   interface User {
//     userId: string;
//   }
// }

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
  }
}
