import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NicknameOnboardingForm } from "@/components/profile/nickname-onboarding-form";

export const metadata: Metadata = {
  title: "닉네임 설정",
};

export default async function NicknameOnboardingPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/onboarding/nickname");
  }

  if (session.user.nickname) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">닉네임을 설정해 주세요</h1>
      <p className="text-sm text-muted-foreground">
        PLLS에서 사용할 고유한 닉네임을 정해주세요. 나중에 프로필에서 다시 바꿀 수 있어요.
      </p>
      <NicknameOnboardingForm />
    </div>
  );
}
