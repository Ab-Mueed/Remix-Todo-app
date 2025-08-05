import { redirect, href, type ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
  const response = redirect(href("/login"));

  // Clear all possible authentication cookies
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

  return response;
}

export async function loader() {
  return redirect(href("/login"));
}
