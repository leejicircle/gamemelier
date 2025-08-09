'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

import { User } from '@/store/useAuthStore'

export async function signupAction(prevState: { error: string; success?: boolean; user?: User }, formData: FormData) {
  const supabase = await createClient()

  // 폼 데이터에서 이메일과 비밀번호 추출
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // 입력값 검증
  if (!data.email || !data.password) {
    return {
      error: '이메일과 비밀번호를 입력해주세요.',
      success: false
    }
  }

  if (data.password.length < 6) {
    return {
      error: '비밀번호는 최소 6자 이상이어야 합니다.',
      success: false
    }
  }

  // Supabase 회원가입 시도
  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    return {
      error: error.message,
      success: false
    }
  }

  // 성공 시 캐시 재검증
  revalidatePath('/', 'layout')
  
  // 성공 상태와 사용자 정보 반환
  return {
    error: '',
    success: true,
    user: authData.user ? {
      id: authData.user.id,
      email: authData.user.email!
    } : undefined
  }
}
