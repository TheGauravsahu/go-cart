import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import ProfileSidebar from "./ProfileSidebar";

const ProfileLayout = () => {
  return (
    <SidebarProvider>
      <ProfileSidebar />
      <div className="px-4 w-full  pt-4">
        <h2 className="text-xl font-semibold flex items-center gap-1 mb-8">
          <SidebarTrigger />
          Your Profile
        </h2>
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default ProfileLayout;
