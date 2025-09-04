"use client";

import { linksDashboard } from "@/lib/links.constance";
import {
  IconDownload,
  IconEye,
  IconUpload,
  IconChevronLeft,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// for test

const resumes = [
  {
    title: "رزومه مهندس نرم‌افزار",
    date: "۱/۲/۱۴۰۴",
    status: "بررسی شده",
    image:
      "https://cvbuilder.storage.c2.liara.space/Files/RawResumeTemplate_Thumbnail/4/MyResume-Technician-588[www.cvbuilder.me]-1.jpg",
  },
  {
    title: "رزومه مهندس نرم‌افزار",
    date: "۱/۲/۱۴۰۴",
    status: "بررسی شده",
    image:
      "https://cvbuilder.storage.c2.liara.space/Files/RawResumeTemplate_Thumbnail/4/MyResume-Technician-588[www.cvbuilder.me]-1.jpg",
  },
  {
    title: "رزومه مهندس نرم‌افزار",
    date: "۱/۲/۱۴۰۴",
    status: "بررسی شده",
    image:
      "https://cvbuilder.storage.c2.liara.space/Files/RawResumeTemplate_Thumbnail/4/MyResume-Technician-588[www.cvbuilder.me]-1.jpg",
  },
];

export default function ResumePage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="card-box interactive-card shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold text-primary">سلام! 👋</h1>
            <p className="text-base-content/70">
              آماده‌ای رزومه‌ات رو بررسی کنیم؟
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={linksDashboard.link_resume_upload}
              className="btn btn-primary gap-2"
            >
              <IconUpload size={18} />
              آپلود رزومه
            </Link>
            <button className="btn btn-ghost gap-2">
              <IconChevronLeft size={18} />
              راهنما
            </button>
          </div>
        </div>
      </div>

      {/* Quick Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-box interactive-card shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-base-content">
            بررسی سریع رزومه
          </h2>
          <p className="text-sm text-base-content/70">
            فقط می‌خوام رزومه خودم رو بررسی کنم
          </p>
          <button className="btn btn-primary w-full">شروع بررسی</button>
        </div>
        <div className="card-box interactive-card shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-base-content">
            بررسی بر اساس شغل
          </h2>
          <p className="text-sm text-base-content/70">
            رزومه‌ام رو بر اساس شغل مورد نظرم بررسی کن
          </p>
          <button className="btn btn-outline w-full">شروع بررسی</button>
        </div>
      </div>

      {/* Resume Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* My Resumes */}
        <div className="card-box shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold text-base-content">
            رزومه‌های اخیر من
          </h3>
          {resumes.map((resume, i) => (
            <div
              key={i}
              className="group flex items-center justify-between p-3 rounded-md hover:bg-base-100 transition cursor-pointer"
            >
              <div className="flex items-stretch gap-3">
                <Image
                  src={resume.image}
                  alt="عکس رزومه"
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-col justify-between">
                  <h4 className="font-semibold truncate">{resume.title}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="badge badge-success badge-xs p-2">
                      {resume.status}
                    </div>
                    <span className="text-base-content/60">{resume.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-sm" aria-label="مشاهده">
                  <IconEye size={18} />
                </button>
                <button className="btn btn-ghost btn-sm" aria-label="دانلود">
                  <IconDownload size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Others' Resumes */}
        <div className="card-box shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold text-base-content">
            رزومه‌های اخیر دیگران
          </h3>
          {resumes.map((resume, i) => (
            <div
              key={i}
              className="group flex items-center justify-between p-3 rounded-md hover:bg-base-100 transition cursor-pointer"
            >
              <div className="flex items-stretch gap-3">
                <Image
                  src={resume.image}
                  alt="عکس رزومه"
                  width={56}
                  height={56}
                  className="rounded-md object-cover"
                />
                <div className="flex flex-col justify-between">
                  <h4 className="font-semibold truncate">{resume.title}</h4>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="badge badge-success badge-xs p-2">
                      {resume.status}
                    </div>
                    <span className="text-base-content/60">{resume.date}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-ghost btn-sm" aria-label="مشاهده">
                  <IconEye size={18} />
                </button>
                <button className="btn btn-ghost btn-sm" aria-label="دانلود">
                  <IconDownload size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
