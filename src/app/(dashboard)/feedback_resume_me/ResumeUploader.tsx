"use client";

import { analyzeImageWithGemini } from "@/lib/api/gemini";
import { convertPdfToImage } from "@/lib/utils/pdf2image";
import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import ResumeAnalysisFull from "./ResumeAnalysisFull";
import ScoreCircle from "@/components/ui/ScoreCircle";
import { useRouter } from "next/navigation";

export default function ResumeUploader() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [quality, setQuality] = useState<number | null>(null);
  const [jobChance, setJobChance] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  const fileSizeLabel = useMemo(() => {
    if (!selectedFile) return "";
    const kb = selectedFile.size / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
  }, [selectedFile]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      multiple: false,
      onDrop: (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
          setStatusText("❌ فقط فایل PDF مجاز است");
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setStatusText("❌ حجم فایل بیش از ۱۰ مگابایت است");
          return;
        }

        setSelectedFile(file);
        setAnalysis("");
        setPreviewUrl("");
        setQuality(null);
        setJobChance(null);
        setCurrentStep(1);
        setStatusText("فایل انتخاب شد؛ آماده پردازش");
      },
    });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setStatusText("در حال تبدیل رزومه به تصویر...");
    setCurrentStep(2);

    try {
      const imageResult = await convertPdfToImage(selectedFile);
      if (!imageResult.file) throw new Error(imageResult.error || "No image");

      setPreviewUrl(imageResult.imageUrl);
      setStatusText("در حال آماده‌سازی تصویر برای تحلیل...");

      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;

          const prompt = `
          لطفاً این رزومه را به زبان فارسی تحلیل کن:
          1. مزایا و معایب رزومه را بنویس
          2. مهارت‌ها، تجربیات و تحصیلات را خلاصه کن
          3. در پایان، دو عدد درصدی بده:
             - کیفیت کلی رزومه (۰ تا ۱۰۰)
             - شانس پیدا کردن کار در زمینه تخصصی (۰ تا ۱۰۰)
          لطفاً خروجی درصدها را دقیقاً به این شکل JSON بده:
          {"quality": 85, "jobChance": 60}
          و سپس متن تحلیلی کامل را بعد از JSON بنویس.
          `;

          setStatusText("در حال ارسال به Gemini...");
          setCurrentStep(3);
          const result = await analyzeImageWithGemini(base64Image, prompt);

          let parsedQuality: number | null = null;
          let parsedJobChance: number | null = null;
          let narrative = result || "";

          try {
            const jsonMatch = result.match(/\{[\s\S]*?\}/);
            if (jsonMatch) {
              const json = JSON.parse(jsonMatch[0]);
              parsedQuality = Number(json.quality);
              parsedJobChance = Number(json.jobChance);
              narrative = result.replace(jsonMatch[0], "").trim();
            }
          } catch {}

          if (parsedQuality !== null && !Number.isNaN(parsedQuality)) {
            setQuality(Math.max(0, Math.min(100, parsedQuality)));
          }
          if (parsedJobChance !== null && !Number.isNaN(parsedJobChance)) {
            setJobChance(Math.max(0, Math.min(100, parsedJobChance)));
          }

          setAnalysis(narrative);
          setStatusText("✅ تحلیل انجام شد");
          setCurrentStep(4);
        } catch (err) {
          console.error(err);
          setStatusText("❌ خطا در تحلیل رزومه");
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(imageResult.file);
    } catch (err) {
      console.error(err);
      setStatusText("❌ خطا در تبدیل فایل");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 rtl text-right">
      {!analysis ? (
        <>
          <div className="w-full">
            <div className="flex items-center gap-2 text-xs text-base-content/70">
              <div
                className={`badge ${currentStep >= 1 ? "badge-primary" : ""}`}
              >
                ۱
              </div>
              <span>انتخاب فایل</span>
              <div className="h-px flex-1 bg-base-300" />
              <div
                className={`badge ${currentStep >= 2 ? "badge-primary" : ""}`}
              >
                ۲
              </div>
              <span>دریافت اطلاعات</span>
              <div className="h-px flex-1 bg-base-300" />
              <div
                className={`badge ${currentStep >= 3 ? "badge-primary" : ""}`}
              >
                ۳
              </div>
              <span>تحلیل رزومه</span>
              <div className="h-px flex-1 bg-base-300" />
              <div
                className={`badge ${currentStep >= 4 ? "badge-primary" : ""}`}
              >
                ۴
              </div>
              <span>نتیجه</span>
            </div>
          </div>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${
              isDragActive
                ? "bg-base-200 border-primary"
                : "bg-base-100 border-base-300"
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-base-content">
              {isDragActive
                ? "فایل را رها کنید..."
                : "برای آپلود رزومه، فایل PDF را اینجا بکشید یا کلیک کنید"}
            </p>
            <p className="text-xs text-base-content/60 mt-2">
              فقط فایل‌های PDF مجاز هستند
            </p>
          </div>

          {fileRejections.length > 0 && (
            <div className="alert alert-error">
              فایل نامعتبر است. لطفاً فقط فایل PDF انتخاب کنید.
            </div>
          )}

          {selectedFile && (
            <div className="flex flex-col gap-3">
              <div className="alert alert-success w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>فایل انتخاب‌شده:</span>
                  <span className="font-bold">{selectedFile.name}</span>
                  <span className="opacity-70 text-xs">{fileSizeLabel}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                    setAnalysis("");
                    setPreviewUrl("");
                    setQuality(null);
                    setJobChance(null);
                    setStatusText("");
                    setCurrentStep(0);
                  }}
                  aria-label="حذف فایل"
                >
                  حذف
                </button>
              </div>

              {previewUrl && (
                <div className="card bg-base-100 border border-base-300 overflow-hidden">
                  <div className="p-3 text-sm opacity-80">
                    پیش‌نمایش صفحه اول رزومه
                  </div>
                  <img
                    src={previewUrl}
                    alt="پیش‌نمایش رزومه"
                    className="w-full max-h-[480px] object-contain bg-base-200"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  className={`btn btn-primary ${isProcessing ? "loading" : ""}`}
                  onClick={handleUpload}
                  disabled={isProcessing}
                >
                  {isProcessing ? "در حال پردازش..." : "تحلیل رزومه"}
                </button>
                {!isProcessing && currentStep >= 2 && (
                  <span className="text-xs opacity-70">
                    می‌توانید دوباره تلاش کنید
                  </span>
                )}
              </div>
            </div>
          )}

          {statusText && (
            <div className="alert alert-info">
              <span>{statusText}</span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm opacity-70">نتیجه تحلیل</div>
            <div className="flex items-center gap-2">
              <button
                className={`btn btn-primary btn-sm ${isProcessing ? "loading" : ""}`}
                onClick={handleUpload}
                disabled={isProcessing || !selectedFile}
                aria-label="تحلیل مجدد رزومه"
                title="تحلیل مجدد"
              >
                {isProcessing ? "در حال پردازش..." : "تحلیل مجدد"}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => router.back()}
                aria-label="بازگشت به صفحه قبل"
                title="بازگشت"
              >
                بازگشت
              </button>
            </div>
          </div>
          {(quality !== null || jobChance !== null) && (
            <div className="grid grid-cols-2 gap-4">
              {quality !== null && (
                <div className="card bg-base-100 border border-base-300 p-4 flex items-center gap-4">
                  <ScoreCircle score={quality} />
                  <div>
                    <div className="text-sm opacity-70">کیفیت کلی رزومه</div>
                    <div className="text-lg font-bold">{quality} از ۱۰۰</div>
                  </div>
                </div>
              )}
              {jobChance !== null && (
                <div className="card bg-base-100 border border-base-300 p-4 flex items-center gap-4">
                  <ScoreCircle score={jobChance} />
                  <div>
                    <div className="text-sm opacity-70">شانس پیدا کردن کار</div>
                    <div className="text-lg font-bold">{jobChance} از ۱۰۰</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {analysis && (
            <div className="whitespace-pre-wrap">
              <ResumeAnalysisFull content={analysis} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
