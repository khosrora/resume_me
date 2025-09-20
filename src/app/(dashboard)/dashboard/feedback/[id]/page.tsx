"use client";
import { TypeResume, useResumeStore } from "@/store/resumeStore";
import React, { use, useEffect } from "react";
import ResumeMatcher from "../../feedback_resume_job/ComparisonAnalysis";
import ResumeAnalysisFull from "../../feedback_resume_me/ResumeAnalysisFull";
import Image from "next/image";

function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { fetchSingleResume, resume } = useResumeStore();

  useEffect(() => {
    if (id) {
      fetchSingleResume(id);
    }
  }, [id]);
  console.log(resume);
  return (
    <div>
      {!!resume && (
        <>
          <div className="flex justify-center items-center">
            <Image src={resume.imageResume} alt="" width={164} height={164} />
          </div>
          {resume.type === TypeResume.C ? (
            <ResumeMatcher content={resume.result} />
          ) : (
            <ResumeAnalysisFull content={resume.result} />
          )}
        </>
      )}
    </div>
  );
}

export default page;
