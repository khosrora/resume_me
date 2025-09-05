"use client";

import React, { useMemo } from "react";
import ScoreCircle from "@/components/ui/ScoreCircle"; // ⬅️ import your circle component

type ResumeJson = {
  quality?: number;
  jobChance?: number;
  [k: string]: any;
};

interface ResumeAnalysisFullProps {
  content: string;
}

function extractJsonBlocks(text: string): string[] {
  const results: string[] = [];
  const fencedRe = /```json\s*([\s\S]*?)```/gi;
  let m;
  while ((m = fencedRe.exec(text))) {
    results.push(m[1].trim());
  }
  const inlineRe = /(\{[\s\S]*?\})/g;
  while ((m = inlineRe.exec(text))) {
    const candidate = m[1].trim();
    if (!results.includes(candidate)) results.push(candidate);
  }
  return results;
}

function parseFirstValidJson(candidates: string[]): ResumeJson | null {
  for (const s of candidates) {
    try {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === "object") return parsed;
    } catch {
      continue;
    }
  }
  return null;
}

function removeJsonSubstrings(text: string, jsonCandidates: string[]) {
  let cleaned = text;
  for (const candidate of jsonCandidates) {
    cleaned = cleaned.replace(
      new RegExp("```json\\s*" + escapeRegExp(candidate) + "\\s*```", "g"),
      ""
    );
    cleaned = cleaned.replace(new RegExp(escapeRegExp(candidate), "g"), "");
  }
  cleaned = cleaned.replace(/```/g, "");
  cleaned = cleaned.replace(/\*/g, ""); // remove all stars
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
}

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function ResumeAnalysisFull({
  content,
}: ResumeAnalysisFullProps) {
  const { json, cleanedText } = useMemo(() => {
    const candidates = extractJsonBlocks(content);
    const parsed = parseFirstValidJson(candidates);
    const cleaned = removeJsonSubstrings(content, candidates);
    return { json: parsed, cleanedText: cleaned };
  }, [content]);

  const quality = Math.max(0, Math.min(100, Number(json?.quality ?? NaN) || 0));
  const jobChance = Math.max(
    0,
    Math.min(100, Number(json?.jobChance ?? NaN) || 0)
  );

  // split sections by titles
  const sections = cleanedText
    .split(/(?=^#{0,2}\s*\d+\.\s|^##\s*|^\*\*|\n\n)/m)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="card bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">تحلیل رزومه — خسرو رسولی</h2>

          {/* Circles instead of progress bars */}
          <div className="flex items-center justify-center gap-10 mb-6">
            <div className="flex flex-col items-center">
              <ScoreCircle score={quality} />
              <span className="mt-2 text-sm font-medium">کیفیت کلی رزومه</span>
              <span className="text-xs opacity-60">طراحی و محتوا</span>
            </div>
            <div className="flex flex-col items-center">
              <ScoreCircle score={jobChance} />
              <span className="mt-2 text-sm font-medium">
                شانس پیدا کردن کار
              </span>
              <span className="text-xs opacity-60">
                براساس مهارت‌ها و تجربه
              </span>
            </div>
          </div>

          {/* Sections */}
          <div className="mt-4 space-y-6">
            {sections.map((sec, i) => {
              const [titleLine, ...rest] = sec.split("\n");
              return (
                <div key={i}>
                  <h3 className="text-base font-semibold mb-2">{titleLine}</h3>
                  <div className="prose prose-sm dark:prose-invert max-w-full">
                    {rest.map((line, j) => (
                      <p key={j} className="mb-1">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
