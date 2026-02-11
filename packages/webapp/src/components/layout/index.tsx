import Footer from "./Footer";
import SlimHeader from "./SlimHeader";

function Layout({ children }: any) {
  return (
    <div
      data-theme="italia"
      className="w-full min-h-screen flex flex-col"
      style={{ overflowX: "clip" }}
    >
      <SlimHeader />
      <div className="flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
