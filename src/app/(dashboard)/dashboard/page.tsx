"use client";

import { useAuthStore } from "@/store/authStore";
import { useResumeStore } from "@/store/resumeStore";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect } from "react";
import HeaderPage from "./HeaderPage";

export default function ResumePage() {
  const { user } = useAuthStore();
  const { resumes, fetchResumes, fetchUserResumes, userResumes } =
    useResumeStore();

  useEffect(() => {
    fetchResumes();
    if (!!user) {
      fetchUserResumes(user.user.id);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <HeaderPage />
      {/* Resume Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Resumes */}
        <div className="card-box shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-base-content">
              رزومه‌های اخیر من
            </h3>
            {userResumes.length > 3 && (
              <Link
                href="/dashboard/my_resumes"
                className="link link-primary text-sm"
              >
                مشاهده همه
              </Link>
            )}
          </div>
          {userResumes.slice(0, 3).map((resume: Resume) => (
            <div
              key={resume._id}
              className="group flex items-center justify-between p-3 rounded-md hover:bg-base-100 transition cursor-pointer"
            >
              <div className="flex items-stretch gap-3">
                <img
                  src={resume.imageResume || "/images/images.png"}
                  alt="عکس رزومه"
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-xs">
                    {new Intl.DateTimeFormat("fa-IR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    }).format(new Date(resume.createdAt))}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="badge badge-success badge-xs p-2">
                      انجام شده است
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/feedback/${resume._id}`}
                  className="btn btn-ghost btn-sm"
                  aria-label="مشاهده"
                >
                  <IconEye size={18} />
                </Link>
                {/* <button className="btn btn-ghost btn-sm" aria-label="دانلود">
                  <IconDownload size={18} />
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {/* Others' Resumes */}
        <div className="card-box shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-base-content">
              رزومه‌های اخیر دیگران
            </h3>
            {resumes.length > 3 && (
              <Link
                href="/dashboard/resumes"
                className="link link-primary text-sm"
              >
                مشاهده همه
              </Link>
            )}
          </div>
          {resumes.slice(0, 3).map((resume: Resume) => (
            <div
              key={resume._id}
              className="group flex items-center justify-between p-3 rounded-md hover:bg-base-100 transition cursor-pointer"
            >
              <div className="flex items-stretch gap-3">
                <img
                  src={resume.imageResume || "/images/images.png"}
                  alt="عکس رزومه"
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-col justify-between">
                  <p className="text-xs">
                    {new Intl.DateTimeFormat("fa-IR", {
                      dateStyle: "full",
                      timeStyle: "short",
                    }).format(new Date(resume.createdAt))}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="badge badge-success badge-xs p-2">
                      انجام شده است
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/feedback/${resume._id}`}
                  className="btn btn-ghost btn-sm"
                  aria-label="مشاهده"
                >
                  <IconEye size={18} />
                </Link>
                {/* <button className="btn btn-ghost btn-sm" aria-label="دانلود">
                  <IconDownload size={18} />
                </button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
