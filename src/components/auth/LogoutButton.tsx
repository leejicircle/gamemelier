"use client";

import { useAuthStore } from "@/store/useAuthStore";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      style={{
        padding: "8px 16px",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.6 : 1,
      }}
    >
      {isLoading ? "로그아웃 중..." : "로그아웃"}
    </button>
  );
}
