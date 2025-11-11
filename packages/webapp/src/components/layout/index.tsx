import Header from "./Header";
import Footer from "./Footer";
function Layout({ children }: any) {
  return (
    <div data-theme="italia" className="w-screen h-screen h-full flex flex-col">
      <Header />
      <div className="p-5 flex-grow">{children}</div>
      <Footer />
    </div>
  );
}

export default Layout;
