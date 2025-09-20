"use client";

import { create } from "zustand";
import baseAPI from "@/lib/base_api";

export enum TypeResume {
  C = "Comparison",
  A = "Analysis",
}

interface ResumeState {
  resume: Resume | null;
  resumes: Resume[];
  userResumes: Resume[];
  loading: boolean;
  error: string | null;

  fetchResumes: () => Promise<void>;
  fetchUserResumes: (userId: string) => Promise<void>;
  fetchSingleResume: (id: string) => Promise<void>;
  clearResumes: () => void;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resume: null,
  resumes: [],
  userResumes: [],
  loading: false,
  error: null,

  fetchResumes: async () => {
    set({ loading: true, error: null });
    try {
      const res = await baseAPI.get("/resume");
      set({ resumes: res.data, loading: false });
    } catch (err: any) {
      const message = err?.response?.data?.message || "خطا در دریافت رزومه‌ها";
      set({ error: message, loading: false });
    }
  },
  fetchUserResumes: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await baseAPI.get(`/resume/user/${userId}`);
      set({ userResumes: res.data, loading: false });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "خطا در دریافت رزومه‌های کاربر";
      set({ error: message, loading: false });
    }
  },
  fetchSingleResume: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const res = await baseAPI.get(`/resume/${id}`);
      set({ resume: res.data, loading: false });
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "خطا در دریافت رزومه‌های کاربر";
      set({ error: message, loading: false });
    }
  },

  clearResumes: () => set({ resumes: [], error: null }),
}));
