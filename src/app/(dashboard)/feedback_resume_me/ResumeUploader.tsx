"use client";

import { convertPdfToImage } from "@/lib/utils/pdf2image";
import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import ResumeAnalysis from "./ResumeAnalysis";

export default function ResumeUploader() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.async = true;
    document.body.appendChild(script);
  }, []);

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
    setStatusText("Converting to image...");

    try {
      // Convert PDF → Image
      const imageFile = await convertPdfToImage(selectedFile);

      setStatusText("Extracting text with AI...");

      // Convert image → base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Image = reader.result as string;

          const extractedText = await (window as any).puter.ai.img2txt(
            base64Image
          );

          setStatusText("در حال آنالیز رزومه شما ...");

          // Step 2: AI Chat Analysis
          const result = await (window as any).puter.ai.chat(
            `Read this article in its entirety and then write down the advantages and disadvantages.Analyze in persian language this resume and summarize key skills, experiences, and education:\n\n${extractedText}`
          );

          setAnalysis(result);
          setStatusText("✅ در حال آنالیز");
        } catch (err) {
          console.error(err);
          setStatusText("❌ دوباره امتحان کنید");
        } finally {
          setIsProcessing(false);
        }
      };

      reader.readAsDataURL(imageFile!.file);
    } catch (err) {
      console.error(err);
      setStatusText("❌ دوباره امتحان کنید");
      setIsProcessing(false);
    }
  };
  console.log(analysis);
  return (
    <div className="space-y-4">
      {/* Dropzone */}
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

      {/* File Rejection */}
      {fileRejections.length > 0 && (
        <div className="alert alert-error">
          <span>فایل نامعتبر است. لطفاً فقط فایل PDF انتخاب کنید.</span>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <div className="flex flex-col items-start gap-2">
          <div className="alert alert-success w-full">
            <span>فایل انتخاب‌شده:</span>
            <span className="font-bold">{selectedFile.name}</span>
          </div>
          <button
            className={`btn btn-primary ${
              uploading || isProcessing ? "loading" : ""
            }`}
            onClick={handleUpload}
            disabled={uploading || isProcessing}
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
          {analysis && <ResumeAnalysis content={analysis.message.content} />}
        </div>
      )}
    </div>
  );
}
