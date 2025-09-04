"use client";

import React from "react";

interface ResumeAnalysisProps {
  content: string;
}

export default function ResumeAnalysis({ content }: ResumeAnalysisProps) {
  // --- Parse sections by markers ---
  const advantagesMatch = content.match(/\*\*مزایای رزومه:\*\*([\s\S]*?)\*\*/);
  const disadvantagesMatch = content.match(/\*\*معایب رزومه:\*\*([\s\S]*?)(---|$)/);
  const keywordsMatch = content.match(/\*\*تحلیل و خلاصه کلیدواژه‌ها و مهارت‌ها:\*\*([\s\S]*?)(---|$)/);
  const conclusionMatch = content.split("---").pop();

  // --- Helpers ---
  const renderNumberedList = (text: string) =>
    text
      .split(/\d+\.\s/) // split by "1. " , "2. "
      .filter((line) => line.trim())
      .map((line, i) => (
        <li key={i} className="text-base-content">
          {line.trim()}
        </li>
      ));

  const renderBulletList = (text: string) =>
    text
      .split("\n")
      .filter((line) => line.trim().startsWith("-"))
      .map((line, i) => (
        <li key={i} className="text-base-content">
          {line.replace("-", "").trim()}
        </li>
      ));

  return (
    <div className="grid gap-4 mt-6">
      {/* Advantages */}
      {advantagesMatch && (
        <div className="card bg-green-50 shadow-xl border border-green-200 dark:bg-base-100 dark:border-base-200">
          <div className="card-body">
            <h3 className="card-title text-green-700">✅ مزایای رزومه</h3>
            <ul className="list-decimal list-inside space-y-1">
              {renderNumberedList(advantagesMatch[1])}
            </ul>
          </div>
        </div>
      )}

      {/* Disadvantages */}
      {disadvantagesMatch && (
        <div className="card bg-red-50 shadow-xl border border-red-200 dark:bg-base-100 dark:border-base-200">
          <div className="card-body">
            <h3 className="card-title text-red-700">⚠️ معایب رزومه</h3>
            <ul className="list-decimal list-inside space-y-1">
              {renderNumberedList(disadvantagesMatch[1])}
            </ul>
          </div>
        </div>
      )}

      {/* Keywords & Skills */}
      {keywordsMatch && (
        <div className="card bg-blue-50 shadow-xl border border-blue-200 dark:bg-base-100 dark:border-base-200">
          <div className="card-body">
            <h3 className="card-title text-blue-700">🔑 کلیدواژه‌ها و مهارت‌ها</h3>
            <ul className="list-disc list-inside space-y-1">
              {renderBulletList(keywordsMatch[1])}
            </ul>
          </div>
        </div>
      )}

      {/* Conclusion */}
      {conclusionMatch && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title text-primary">📌 جمع‌بندی</h3>
            <p className="text-base-content whitespace-pre-wrap">{conclusionMatch.trim()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
