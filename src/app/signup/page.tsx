'use client'

import { useFormStatus } from 'react-dom'
import { signupAction } from './actions'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'

// 폼 제출 버튼 컴포넌트 (useFormStatus 사용)
function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? '가입 중...' : '회원가입'}
    </button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signupAction, { error: '', success: false, user: undefined })
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  // 회원가입 성공 시 Zustand 스토어 업데이트 및 리다이렉트 처리
  useEffect(() => {
    if (state?.success && state?.user) {
      console.log('회원가입 성공: Zustand 스토어 업데이트 및 리다이렉트 실행')
      // Zustand 스토어에 사용자 정보 저장
      setUser(state.user)
      // 홈페이지로 리다이렉트
      router.push('/')
    }
  }, [state?.success, state?.user, setUser, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
        
        <form action={formAction} className="space-y-4">
          <div className="mb-4">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              이메일
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="이메일을 입력하세요"
            />
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="비밀번호를 입력하세요 (최소 6자)"
            />
          </div>
          
          {state?.error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {state.error}
            </p>
          )}
          
          <SubmitButton />
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link 
              href="/login" 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
