import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set(name, value, options);
        } catch (error) {
          // Server Component에서 set이 호출될 때 예상되는 에러
          if (process.env.NODE_ENV === "development") {
            console.error(`[Supabase Cookie Error] set(${name}):`, error);
          }
          // 프로덕션에서는 조용히 무시
        }
      },
    },
  });
};
