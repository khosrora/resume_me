"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { IconEye } from "@tabler/icons-react";

export default function MyResumesPage() {
  const { userResumes, fetchUserResumes, loading, error } = useResumeStore();
  const userId = useAuthStore.getState().user?.user.id;

  useEffect(() => {
    if (userId) fetchUserResumes(userId);
  }, [userId]);

  return (
    <div className="space-y-6 rtl text-right">
      <h1 className="text-xl font-bold text-base-content">رزومه‌های من</h1>

      {loading && <div className="loading loading-spinner text-primary" />}
      {error && <div className="alert alert-error">{error}</div>}

      {userResumes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {userResumes.map((resume) => (
            <div
              key={resume._id}
              className="card bg-base-100 shadow-md p-4 flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={resume.imageResume || "/images/images.png"}
                  alt="رزومه"
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
                <div>
                  <p className="text-xs">
                    {new Intl.DateTimeFormat("fa-IR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    }).format(new Date(resume.createdAt))}
                  </p>
                  <div className="badge badge-success badge-xs p-2 mt-1">
                    انجام شده است
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Link
                  href={`/dashboard/feedback/${resume._id}`}
                  className="btn btn-ghost btn-sm"
                  aria-label="مشاهده"
                >
                  <IconEye size={18} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && (
          <p className="text-sm text-base-content/70">هیچ رزومه‌ای یافت نشد.</p>
        )
      )}
    </div>
  );
}
