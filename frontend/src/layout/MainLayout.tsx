import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar.js";
import { Footer } from "../components/Footer.js";

const MainLayout = () => {
  return (
    <div className="min-h-screen w-full bg-background text-[var(--text-color)] font-sans antialiased flex flex-col justify-between transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
