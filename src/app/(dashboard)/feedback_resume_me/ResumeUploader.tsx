"use client";

import { analyzeImageWithGemini } from "@/lib/api/gemini";
import { convertPdfToImage } from "@/lib/utils/pdf2image";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import ResumeAnalysisFull from "./ResumeAnalysisFull";

export default function ResumeUploader() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          setSelectedFile(acceptedFiles[0]);
          setAnalysis("");
          setStatusText("");
        }
      },
    });

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setStatusText("در حال تبدیل رزومه به تصویر...");

    try {
      const imageResult = await convertPdfToImage(selectedFile);
      if (!imageResult.file) throw new Error(imageResult.error || "No image");

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
          const result = await analyzeImageWithGemini(base64Image, prompt);

          setAnalysis(result);
          setStatusText("✅ تحلیل انجام شد");
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
  console.log(analysis);
  return (
    <div className="space-y-4">
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
        <div className="flex flex-col items-start gap-2">
          <div className="alert alert-success w-full">
            <span>فایل انتخاب‌شده:</span>
            <span className="font-bold">{selectedFile.name}</span>
          </div>
          <button
            className={`btn btn-primary ${isProcessing ? "loading" : ""}`}
            onClick={handleUpload}
            disabled={isProcessing}
          >
            {isProcessing ? "در حال پردازش..." : "آپلود رزومه"}
          </button>
        </div>
      )}

      {statusText && (
        <div className="alert alert-info">
          <span>{statusText}</span>
        </div>
      )}

      {analysis && (
        <div className="whitespace-pre-wrap">
          <ResumeAnalysisFull content={analysis} />
        </div>
      )}
    </div>
  );
}
