import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      // By default Auth.js copies the Google account's photo into `User.image`
      // on first sign-in, which silently overrides our own default-avatar
      // design. Leave it unset so new users start blank and only get a photo
      // through our own upload flow (`/api/account/avatar`).
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: null,
        };
      },
    }),
  ],
  session: { strategy: "database" },
  pages: {
    // Auth.js redirects here right after a brand-new account is created —
    // i.e. exactly "다음부터 구글로 로그인할 때 닉네임 설정부터".
    newUser: "/onboarding/nickname",
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      // The adapter's `user` param only carries the AdapterUser shape
      // (id/name/email/image) — fetch custom fields ourselves.
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { isCurator: true, nickname: true },
      });
      session.user.isCurator = dbUser?.isCurator ?? false;
      session.user.nickname = dbUser?.nickname ?? null;
      return session;
    },
  },
});
