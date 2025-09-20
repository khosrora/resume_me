"use client";

import { useAuthStore } from "@/store/authStore";
import CheckOtpForm from "./CheckOtpForm";
import GetOtpForm from "./GetOtpForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { step, accessToken } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (accessToken) {
      router.push("/dashboard");
    }
  }, [accessToken, router]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-4">
      <div className="w-full p-6 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">
          {step === "getOtp" ? "دریافت کد تایید" : "ثبت کد تایید"}
        </h1>
        {step === "getOtp" && <GetOtpForm />}
        {step === "checkOtp" && <CheckOtpForm />}
      </div>
    </div>
  );
}
