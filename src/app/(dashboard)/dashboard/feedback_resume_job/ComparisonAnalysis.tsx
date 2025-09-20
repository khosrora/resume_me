"use client";

import ScoreCircle from "@/components/ui/ScoreCircle";

interface ResumeMatcherProps {
  content: string; // متن تحلیلی کامل
}

export default function ResumeMatcher({ content }: ResumeMatcherProps) {
  // 🔎 گرفتن درصد از متن
  let matchScore: number | null = null;
  const match = content.match(/(\d{1,3})%/); // اولین درصد مثل 35%
  if (match) {
    matchScore = Math.min(100, parseInt(match[1], 10));
  }

  // --- پاکسازی متن ---
  const cleanedContent = content
    .replace(/(\d{1,3})%/g, "") // حذف درصدها از متن
    .replace(/\*\*/g, "") // حذف ** ستاره‌ها
    .trim();

  return (
    <div className="space-y-6">
      {/* Score Card */}
      {matchScore !== null && (
        <div className="card bg-base-100 border border-base-300 shadow-md p-6">
          <div className="flex items-center gap-4">
            <ScoreCircle score={matchScore} />
            <div>
              <div className="text-sm opacity-70">میزان تناسب رزومه با شغل</div>
              <div className="text-xl font-bold">{matchScore} از ۱۰۰</div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Content */}
      <div className="card bg-base-100 border border-base-300 shadow-md">
        <div className="card-body p-6">
          <div className="prose max-w-none whitespace-pre-wrap">
            {cleanedContent}
          </div>
        </div>
      </div>
    </div>
  );
}
