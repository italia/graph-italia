import { useUserStore } from "../../store/user_store";
import Footer from "./Footer";
import FullHeader from "./FullHeader";
import SlimHeader from "./SlimHeader";
import { Toaster } from 'react-hot-toast';

function Layout({ children }: any) {
  const user = useUserStore((s) => s.user);

  return (
    <div
      data-theme="italia"
      className="w-full min-h-screen flex flex-col"
      style={{ overflowX: "clip" }}
    >
      {user ? <SlimHeader /> : <FullHeader />}
      <div className="flex-grow">{children}</div>
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;
