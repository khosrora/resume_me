import { linksDashboard } from "@/lib/links.constance";
import { IconUpload } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

function HeaderPage() {
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
          <Link
            href={linksDashboard.link_resume_upload}
            className="btn btn-primary w-full"
          >
            شروع بررسی
          </Link>
        </div>
        <div className="card-box interactive-card shadow-md p-6 space-y-4">
          <h2 className="text-xl font-bold text-base-content">
            بررسی بر اساس شغل
          </h2>
          <p className="text-sm text-base-content/70">
            رزومه‌ام رو بر اساس شغل مورد نظرم بررسی کن
          </p>
          <Link
            href={linksDashboard.feedback_resume_job}
            className="btn btn-outline w-full"
          >
            شروع بررسی
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HeaderPage;
