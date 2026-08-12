import { z } from "zod";

export const nicknameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(2, "닉네임은 2자 이상이어야 해요.")
    .max(20, "닉네임은 20자 이하여야 해요.")
    .regex(
      /^[\p{L}\p{N}_]+$/u,
      "닉네임에는 문자, 숫자, 밑줄(_)만 사용할 수 있어요.",
    ),
});

export type NicknameInput = z.infer<typeof nicknameSchema>;
