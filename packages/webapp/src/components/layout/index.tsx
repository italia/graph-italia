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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-content focus:rounded focus:text-sm focus:font-semibold"
      >
        Vai al contenuto principale
      </a>
      {user ? <SlimHeader /> : <FullHeader />}
      <main id="main-content" className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;
