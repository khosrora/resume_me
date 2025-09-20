"use client";

import { useAuthStore } from "@/store/authStore";
import React from "react";
import { useForm } from "react-hook-form";

interface FormValues {
  otp: string;
}

export default function CheckOtpForm() {
  const { phone, verifyOtp, reset } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await verifyOtp(data.otp);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-gray-600">
        کد تایید ارسال شد به شماره :{" "}
        <span className="font-medium">{phone}</span>
      </p>

      <label className="block">
        <span className="text-sm font-medium">کد تایید</span>
        <input
          type="text"
          {...register("otp", { required: "این فیلد الزامی است" })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 text-center"
          placeholder="123456"
        />
        {errors.otp && (
          <p className="text-red-500 text-sm">{errors.otp.message}</p>
        )}
      </label>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={reset}
          className="text-sm text-gray-500 hover:underline"
        >
          بازگشت
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn bg-base-300 rounded-md"
        >
          {isSubmitting ? "در حال دریافت اطلاعات" : "تایید"}
        </button>
      </div>
    </form>
  );
}
