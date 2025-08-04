import { href, Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import NavBar from "~/components/NavBar";
import { getCurrentUser } from "~/utils/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getCurrentUser(request);
  if (!user) {
    return redirect(href("/login"));
  }
  return { user };
}

export default function Layout() {
  return (
    <main className="">
      <NavBar />
      <Outlet />
    </main>
  );
}
