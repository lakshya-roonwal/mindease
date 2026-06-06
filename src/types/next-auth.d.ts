import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      examType?: string | null;
      examDate?: Date | null;
    } & DefaultSession["user"];
  }

  interface User {
    examType?: string | null;
    examDate?: Date | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    examType?: string | null;
    examDate?: Date | null;
  }
}
