"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginButton() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    
    const { error } = await login(email, password);
    if (!error) {
      setShowForm(false);
      setEmail("");
      setPassword("");
    }
  };

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        style={{
          padding: "8px 16px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        로그인
      </button>
    );
  }

  return (
    <div style={{
      padding: "16px",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      backgroundColor: "white",
      maxWidth: "300px"
    }}>
      <h3 style={{ margin: "0 0 16px 0" }}>로그인</h3>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "12px" }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              boxSizing: "border-box"
            }}
            disabled={isLoading}
          />
        </div>
        <div style={{ marginBottom: "16px" }}>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              boxSizing: "border-box"
            }}
            disabled={isLoading}
          />
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            disabled={isLoading}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
