import Sidebar from "./Sidebar";
import SidebarRight from "./SidebarRight";
import Navbar from "./Navbar";

const Layout = ({ children, showSidebar = false }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="flex pt-16">
        {/* LEFT SIDEBAR */}
        {showSidebar && (
          <div className="w-64 shrink-0 hidden lg:block">
            <Sidebar />
          </div>
        )}

        {/* MAIN CONTENT — FULL WIDTH */}
        <main className="flex-1  mt-10">{children}</main>

        {/* RIGHT SIDEBAR */}
        {showSidebar && (
          <div className="w-72 shrink-0 hidden lg:block">
            <SidebarRight />
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
