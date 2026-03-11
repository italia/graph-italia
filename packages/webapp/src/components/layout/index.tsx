import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useUserStore } from "../../store/user_store";
import Footer from "./Footer";
import FullHeader from "./FullHeader";
import SlimHeader from "./SlimHeader";

function Layout({ children }: any) {
  const user = useUserStore((s) => s.user);
  const { t } = useTranslation();
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
        {t(`components.layout.sr.label`)}
      </a>
      {user ? <SlimHeader /> : <FullHeader />}
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default Layout;
