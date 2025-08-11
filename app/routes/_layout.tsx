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
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <NavBar />
      <div style={{ 
        flex: 1, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </div>
    </div>
  );
}
