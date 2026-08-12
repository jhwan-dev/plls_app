import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      isCurator: boolean;
      nickname: string | null;
    } & DefaultSession["user"];
  }
}
