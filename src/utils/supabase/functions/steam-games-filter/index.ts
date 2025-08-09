// import { createClient } from "npm:@supabase/supabase-js@2";

// // Steam API에서 가져온 게임 인터페이스 정의
// interface SteamGame {
//   appid: number;
//   name: string;
//   playtime_forever: number;
//   genres?: string[];
// }

// // 엣지 함수 메인 로직
// Deno.serve(async (req: Request) => {
//   try {
//     // Supabase 클라이언트 초기화
//     const supabase = createClient(
//       Deno.env.get("SUPABASE_URL")!,
//       Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
//     );

//     // 인증 토큰 확인
//     const authHeader = req.headers.get("Authorization")?.replace("Bearer ", "");
//     if (!authHeader) {
//       return new Response(JSON.stringify({ error: "인증 토큰이 제공되지 않았습니다" }), { status: 401 });
//     }

//     // 유저 인증 검증
//     const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader);
//     if (userError || !user) {
//       return new Response(JSON.stringify({ error: "인증되지 않은 사용자입니다" }), { status: 401 });
//     }

//     // 프로필에서 Steam API 키와 선호 장르 조회
//     const { data: profile, error: profileError } = await supabase
//       .from("profiles")
//       .select("steam_api_key, favorite_genres")
//       .eq("id", user.id)
//       .single();

//     if (profileError || !profile?.steam_api_key) {
//       return new Response(JSON.stringify({ error: "Steam API 키를 찾을 수 없습니다" }), { status: 400 });
//     }

//     // Steam API 호출
//     const steamRes = await fetch(
//       `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${profile.steam_api_key}&steamid=${user.id}&include_appinfo=true&format=json`
//     );

//     if (!steamRes.ok) {
//       return new Response(JSON.stringify({ error: "Steam API 요청에 실패했습니다" }), { status: 500 });
//     }

//     // Steam API 응답 파싱
//     const steamData = await steamRes.json();

//     // 선호 장르 기반 게임 필터링
//     const filteredGames = steamData.response.games.filter((game: SteamGame) =>
//       profile.favorite_genres.some((genre: string) =>
//         game.genres?.some(gameGenre => gameGenre.toLowerCase().includes(genre.toLowerCase()))
//       )
//     );

//     // 필터링된 게임 목록 응답
//     return new Response(JSON.stringify({
//       total_games: steamData.response.game_count,
//       filtered_games: filteredGames,
//       favorite_genres: profile.favorite_genres
//     }), {
//       status: 200,
//       headers: {
//         'Content-Type': 'application/json',
//         'Cache-Control': 'no-store, no-cache, must-revalidate'
//       }
//     });

//   } catch (err) {
//     // 예상치 못한 오류 처리
//     console.error("엣지 함수 실행 중 오류 발생:", err);
//     return new Response(JSON.stringify({
//       error: "서버 내부 오류가 발생했습니다",
//       details: err.message
//     }), { status: 500 });
//   }
// });
