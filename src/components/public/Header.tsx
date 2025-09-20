"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import ThemeSwitcher from "../ui/ThemeSwitcher";
import { useAuthStore } from "@/store/authStore";

function Header() {
  const { user, accessToken, getUser } = useAuthStore();

  // If page loads directly, fetch user again
  useEffect(() => {
    if (accessToken && !user) {
      getUser();
    }
  }, [accessToken, user, getUser]);

  return (
    <div className="flex justify-between items-center">
      <div className="">
        <h1>joblens.ir</h1>
      </div>
      <div className="flex justify-end gap-x-4">
        {user ? (
          <Link href={"/dashboard"} className="btn">
            داشبورد
          </Link>
        ) : (
          <Link href={"/login"} className="btn">
            ورود
          </Link>
        )}
        <ThemeSwitcher />
      </div>
    </div>
  );
}

export default Header;
