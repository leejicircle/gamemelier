"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(
  prevState: { error: string },
  formData: FormData
) {
  const supabase = await createClient();

  // 폼 데이터에서 이메일과 비밀번호 추출
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // 입력값 검증
  if (!data.email || !data.password) {
    return {
      error: "이메일과 비밀번호를 입력해주세요.",
    };
  }

  // Supabase 로그인 시도
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return {
      error: "로그인에 실패했습니다. 이메일과 비밀번호를 확인하세요.",
    };
  }

  // 성공 시 홈페이지로 리다이렉트

  redirect("/");
}
