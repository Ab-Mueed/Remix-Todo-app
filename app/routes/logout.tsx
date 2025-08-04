import { redirect, href, type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  console.log("🚪 LOGOUT ACTION CALLED!");

  // Clear both access and refresh token cookies
  // We'll update these cookie names once you confirm them
  const response = redirect(href("/login"));

  // Clear multiple cookies by setting multiple Set-Cookie headers
  response.headers.append(
    "Set-Cookie",
    "access_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict"
  );
  response.headers.append(
    "Set-Cookie",
    "refresh_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict"
  );
  response.headers.append(
    "Set-Cookie",
    "directus_session_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict"
  );

  console.log("🚪 Clearing access and refresh tokens, redirecting to login");
  return response;
}

export async function loader() {
  return redirect(href("/login"));
}
