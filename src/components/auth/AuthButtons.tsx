"use client";

import { useAuthStore } from "@/store/useAuthStore";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";

export default function AuthButtons() {
  const user = useAuthStore((state) => state.user);

  return user ? <LogoutButton /> : <LoginButton />;
}
