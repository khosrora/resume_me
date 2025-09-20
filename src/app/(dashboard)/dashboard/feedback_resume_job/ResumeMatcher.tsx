"use client";

import { analyzeImageWithGemini } from "@/lib/api/gemini";
import baseAPI from "@/lib/base_api";
import { convertPdfToImage } from "@/lib/utils/pdf2image";
import { useAuthStore } from "@/store/authStore";
import { TypeResume } from "@/store/resumeStore";
import React, { useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import ComparisonAnalysis from "./ComparisonAnalysis";

export default function ResumeJobMatcher() {
  const { user } = useAuthStore();

  const [jobDescription, setJobDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [matchResult, setMatchResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

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
      onDrop: (files) => {
        const file = files[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
          setStatusText("❌ حجم فایل بیش از ۱۰ مگابایت است");
          return;
        }
        setSelectedFile(file);
        setAnalysis("");
        setMatchResult("");
        setPreviewUrl("");
        setStatusText("✅ فایل انتخاب شد");
        setCurrentStep(1);
      },
    });

  const handleUpload = async () => {
    if (!selectedFile || !jobDescription.trim()) {
      setStatusText("❌ لطفاً شرح شغل و فایل رزومه را وارد کنید");
      return;
    }

    setIsProcessing(true);
    setStatusText("در حال تبدیل رزومه به تصویر...");
    setCurrentStep(2);

    try {
      const imageResult = await convertPdfToImage(selectedFile);
      if (!imageResult.file) throw new Error(imageResult.error || "");

      setPreviewUrl(imageResult.imageUrl);
      setStatusText("در حال دریافت اطلاعات ...");
      setCurrentStep(3);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const prompt = `
رزومه زیر را با شرح شغل داده‌شده مقایسه کن . 
لطفاً رزومه زیر را با شرح شغلی ارائه‌شده مقایسه کن و یک پاسخ کامل و مفصل به زبان فارسی بده. تحلیل تو باید شامل این بخش‌ها باشد:
1. نقاط قوت رزومه: مهارت‌ها، تجربیات و دستاوردهای کلیدی که رزومه را برای این موقعیت شغلی قوی می‌کند.  
2. نقاط ضعف و کمبودها: مواردی که در رزومه کم هستند یا با الزامات شغل مطابقت ندارند.  
3. پیشنهادات عملی برای بهبود رزومه و افزایش شانس استخدام.  
4. در پایان، یک عدد درصدی بین 0 تا 100 بنویس که نشان دهد «میزان مناسب بودن رزومه برای این شغل» چقدر است و علت انتخاب آن درصد را به طور خلاصه توضیح بده.
شرح شغل:
${jobDescription}
        `;

        const result = await analyzeImageWithGemini(base64Image, prompt);
        setAnalysis(result);

        const match = result.match(/بله|خیر/);
        setMatchResult(match ? match[0] : "پاسخ مشخص نیست");

        setStatusText("✅ تحلیل انجام شد");
        setCurrentStep(4);

        if (imageResult.file && user) {
          try {
            const formData = new FormData();
            formData.append("result", result);
            formData.append("jobDesc", jobDescription);
            formData.append("type", TypeResume.C);
            formData.append("imageResume", imageResult.file);
            await baseAPI.post(`/resume`, formData, {
              headers: {
                Authorization: `Bearer ${user.user.id}`,
              },
            });
          } catch (error) {
            toast.error(`دوباره امتحان کنید`);
          }
        }
      };
      reader.readAsDataURL(imageResult.file);
    } catch (err) {
      console.error(err);
      setStatusText("❌ خطا در پردازش فایل یا تحلیل");
    } finally {
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
              {["انتخاب فایل", "دریافت تصویر", "مقایسه", "نتیجه"].map(
                (label, i) => (
                  <React.Fragment key={i}>
                    <div
                      className={`badge ${
                        currentStep >= i + 1 ? "badge-primary" : ""
                      }`}
                    >
                      {i + 1}
                    </div>
                    <span>{label}</span>
                    {i < 3 && <div className="h-px flex-1 bg-base-300" />}
                  </React.Fragment>
                )
              )}
            </div>
          </div>

          {/* Job Description Input */}
          <div className="card bg-base-100 border border-base-300 shadow-md p-6">
            <div className="space-y-3">
              <label className="text-sm font-medium">شرح شغل</label>
              <textarea
                className="textarea textarea-bordered w-full text-sm min-h-[100px]"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="مثلاً: توسعه‌دهنده React با Tailwind"
              />
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
              <span>فقط فایل PDF مجاز است.</span>
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
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setSelectedFile(null);
                      setAnalysis("");
                      setMatchResult("");
                      setPreviewUrl("");
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
            <div className="text-lg font-semibold">نتیجه مقایسه رزومه</div>
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
                onClick={() => {
                  setAnalysis("");
                  setMatchResult("");
                  setSelectedFile(null);
                  setPreviewUrl("");
                  setCurrentStep(0);
                }}
                aria-label="شروع مجدد"
                title="شروع مجدد"
              >
                شروع مجدد
              </button>
            </div>
          </div>

          {/* Analysis Content */}
          <ComparisonAnalysis content={analysis} />
        </>
      )}
    </div>
  );
}
