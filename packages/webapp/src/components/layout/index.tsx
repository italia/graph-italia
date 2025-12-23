import Footer from "./Footer";
import Header from "./Header";
function Layout({ children }: any) {
  return (
    <div
      data-theme="italia"
      className="w-full min-h-screen flex flex-col"
      style={{ overflowX: "clip" }}
    >
      <Header />
      <div className="p-5 flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
