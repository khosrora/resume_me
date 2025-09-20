"use client";
import { useAuthStore } from "@/store/authStore";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ThemeSwitcher from "../ui/ThemeSwitcher";

function Header() {
  const { user, getUser, accessToken, reset } = useAuthStore();
  const router = useRouter();

  // If page loads directly, fetch user again
  useEffect(() => {
    if (accessToken && !user) {
      getUser();
    }
  }, [accessToken, user, getUser]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading user...</p>
      </div>
    );
  }

  const handleLogout = () => {
    reset(); // clear Zustand + cookies
    router.push("/login"); // redirect to login
  };

  return (
    <div className="flex justify-between items-center p-4 w-full">
      {/* Left side: user info */}
      <div className="flex justify-start items-center gap-x-4">
        <div className="avatar">
          <div className="w-16 rounded-full ring-2 ring-offset-2">
            <img src="https://avatar.iran.liara.run/public" alt="avatar" />
          </div>
        </div>
        <div className="flex flex-col">
          <p>{user.user.phone}</p>
          {/* <p className="text-xs">کارجو</p> */}
        </div>
      </div>

      {/* Right side: theme + logout */}
      <div className="flex items-center gap-x-4">
        <ThemeSwitcher />
        <button
          onClick={handleLogout}
          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
          title="خروج"
        >
          <IconLogout size={20} stroke={2} />
        </button>
      </div>
    </div>
  );
}

export default Header;
