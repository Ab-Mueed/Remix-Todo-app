import { Outlet } from "react-router";
import NavBar from "~/components/NavBar";


export default function Layout() {
  return (
    <main className="">
      <NavBar />
      <Outlet />
    </main>
  );
}
