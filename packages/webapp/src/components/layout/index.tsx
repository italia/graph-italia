import { useUserStore } from "../../store/user_store";
import Footer from "./Footer";
import HeaderCompleta from "./HeaderCompleta";
import SlimHeader from "./SlimHeader";

function Layout({ children }: any) {
  const user = useUserStore((s) => s.user);

  return (
    <div
      data-theme="italia"
      className="w-full min-h-screen flex flex-col"
      style={{ overflowX: "clip" }}
    >
      {user ? <SlimHeader /> : <HeaderCompleta />}
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
