"use client";

import { create } from "zustand";
import baseAPI from "@/lib/base_api";
import Cookies from "js-cookie";

interface User {
  message: string;
  user: {
    id: string;
    phone: string;
    name?: string;
    [key: string]: any;
  };
}

interface AuthState {
  phone: string;
  step: "getOtp" | "checkOtp";
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  setPhone: (phone: string) => void;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  getAccessToken: () => Promise<void>;
  getUser: () => Promise<void>;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  phone: "",
  step: "getOtp",
  accessToken: Cookies.get("accessToken") || null,
  refreshToken: Cookies.get("refreshToken") || null,
  user: null,

  setPhone: (phone) => set({ phone }),

  sendOtp: async (phone) => {
    await baseAPI.post("/auth/get_phone", { phone });
    set({ phone, step: "checkOtp" });
  },

  verifyOtp: async (otp) => {
    const res = await baseAPI.post("/auth/check_otp", {
      phone: get().phone,
      otp,
    });

    const refreshToken = res.data.refreshToken;
    set({ refreshToken });

    // Save refresh token for 7 days
    Cookies.set("refreshToken", refreshToken, { expires: 7 });

    // Immediately fetch access token
    await get().getAccessToken();
    await get().getUser();
  },

  getAccessToken: async () => {
    const { refreshToken } = get();
    if (!refreshToken) throw new Error("No refreshToken available");

    const res = await baseAPI.post("/auth/get_accessToken", { refreshToken });
    const accessToken = res.data.accessToken;

    set({ accessToken });

    // Save access token for 15 minutes
    Cookies.set("accessToken", accessToken, { expires: 0.0105 }); // ~15min
  },

  getUser: async () => {
    try {
      const { accessToken } = get();
      if (!accessToken) throw new Error("No access token available");
      const res = await baseAPI.get("/auth/me");
      set({ user: res.data });
    } catch (err) {
      // Optionally reset on 401
      get().reset();
    }
  },

  reset: () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    set({
      phone: "",
      step: "getOtp",
      accessToken: null,
      refreshToken: null,
      user: null,
    });
  },
}));
