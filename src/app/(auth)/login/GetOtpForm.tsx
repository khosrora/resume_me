"use client";

import { useAuthStore } from "@/store/authStore";
import { useForm } from "react-hook-form";

interface FormValues {
  phone: string;
}

export default function GetOtpForm() {
  const { sendOtp } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    await sendOtp(data.phone);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <label className="block">
        <span className="text-sm font-medium">شماره تماس</span>
        <input
          type="tel"
          {...register("phone", { required: "این فیلد الزامی است." })}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 text-center"
          placeholder="****0915340"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn bg-base-300 "
      >
        {isSubmitting ? "در حال دریافت اطلاعات" : "ارسال"}
      </button>
    </form>
  );
}
