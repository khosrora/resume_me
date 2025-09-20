"use client";

import { analyzeImageWithGemini } from "@/lib/api/gemini";
import { convertPdfToImage } from "@/lib/utils/pdf2image";
import { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import ResumeAnalysisFull from "./ResumeAnalysisFull";
import ScoreCircle from "@/components/ui/ScoreCircle";
import { useRouter } from "next/navigation";
import baseAPI from "@/lib/base_api";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { TypeResume } from "@/store/resumeStore";

export default function ResumeUploader() {
  const { user } = useAuthStore();
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
          {"quality": تو بگو, "jobChance": تو بگو}
          و سپس متن تحلیلی کامل را بعد از JSON بنویس.
          `;

          setStatusText("در حال دریافت اطلاعات ...");
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

          if (imageResult.file && user) {
            try {
              const formData = new FormData();
              formData.append("result", result);
              formData.append("imageResume", imageResult.file);
              formData.append("type", TypeResume.A);
              await baseAPI.post(`/resume`, formData, {
                headers: {
                  Authorization: `Bearer ${user.user.id}`,
                },
              });
            } catch (error) {
              toast.error(`دوباره امتحان کنید`);
            }
          }
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
    <div className="space-y-6 rtl text-right">
      {!analysis ? (
        <>
          {/* Progress Steps */}
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

          {/* File Drop Zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? "bg-primary/5 border-primary shadow-lg"
                : "bg-base-100 border-base-300 hover:border-primary/50 hover:bg-base-50"
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-2">
              <div className="text-4xl opacity-40">📄</div>
              <p className="text-base-content font-medium">
                {isDragActive
                  ? "فایل را رها کنید..."
                  : "برای آپلود رزومه، فایل PDF را اینجا بکشید یا کلیک کنید"}
              </p>
              <p className="text-xs text-base-content/60">
                فقط فایل‌های PDF مجاز هستند • حداکثر حجم ۱۰ مگابایت
              </p>
            </div>
          </div>

          {/* File Rejection Alert */}
          {fileRejections.length > 0 && (
            <div className="alert alert-error">
              <span>فایل نامعتبر است. لطفاً فقط فایل PDF انتخاب کنید.</span>
            </div>
          )}

          {/* Selected File Section */}
          {selectedFile && (
            <div className="space-y-4">
              <div className="alert alert-success">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✅</span>
                    <div>
                      <div className="font-bold">{selectedFile.name}</div>
                      <div className="text-xs opacity-70">{fileSizeLabel}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
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
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="card bg-base-100 border border-base-300 shadow-md overflow-hidden">
                  <div className="card-body p-4">
                    <div className="text-sm font-medium opacity-80 mb-3">
                      پیش‌نمایش صفحه اول رزومه
                    </div>
                    <img
                      src={previewUrl}
                      alt="پیش‌نمایش رزومه"
                      className="w-full max-h-[400px] object-contain bg-base-200 rounded-lg"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between">
                <button
                  className={`btn btn-primary btn-lg ${isProcessing ? "loading" : ""}`}
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

          {/* Status Message */}
          {statusText && (
            <div className="alert alert-info">
              <span>{statusText}</span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Result Header */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">نتیجه تحلیل رزومه</div>
            <div className="flex items-center gap-2">
              <button
                className={`btn btn-primary btn-sm ${
                  isProcessing ? "loading" : ""
                }`}
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

          {/* Score Cards */}
          {(quality !== null || jobChance !== null) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quality !== null && (
                <div className="card bg-base-100 border border-base-300 shadow-md p-6">
                  <div className="flex items-center gap-4">
                    <ScoreCircle score={quality} />
                    <div>
                      <div className="text-sm opacity-70">کیفیت کلی رزومه</div>
                      <div className="text-xl font-bold">{quality} از ۱۰۰</div>
                    </div>
                  </div>
                </div>
              )}
              {jobChance !== null && (
                <div className="card bg-base-100 border border-base-300 shadow-md p-6">
                  <div className="flex items-center gap-4">
                    <ScoreCircle score={jobChance} />
                    <div>
                      <div className="text-sm opacity-70">شانس پیدا کردن کار</div>
                      <div className="text-xl font-bold">{jobChance} از ۱۰۰</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analysis Content */}
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
