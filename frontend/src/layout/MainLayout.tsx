import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex h-screen w-full bg-black overflow-hidden text-white font-sans">
      <main className="relative z-10 flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
