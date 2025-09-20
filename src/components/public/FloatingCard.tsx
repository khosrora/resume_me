"use client";
import React, { useEffect } from "react";
import { Award, Briefcase, CheckCircle, Star } from "lucide-react";
import gsap from "gsap";

function FloatingCard() {
  useEffect(() => {
    const cards = gsap.utils.toArray<HTMLElement>(".floating-card");

    cards.forEach((card, i) => {
      gsap.to(card, {
        x: "+=10", // smaller drift for mobile
        y: "+=10",
        duration: 2.5 + i,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });
  }, []);

  return (
    <div className="relative w-full h-[300px] lg:h-[200px] mt-20 lg:mt-0">
      {/* Top-right card */}
      <div className="floating-card absolute -top-12 right-2 sm:top-16 sm:-right-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 border border-white/20 dark:bg-base-100 dark:border-base-200 max-w-[180px] sm:max-w-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base">
              رزومه تحلیل شد!
            </p>
            <p className="text-[10px] sm:text-xs">همین الان</p>
          </div>
        </div>
      </div>

      {/* Bottom-left card */}
      <div className="floating-card absolute bottom-2 left-2 sm:-bottom-6 sm:-left-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 border border-white/20 dark:bg-base-100 dark:border-base-200 max-w-[160px] sm:max-w-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 text-white fill-current" />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base">امتیاز: 8.5/10</p>
            <p className="text-[10px] sm:text-xs">عالی!</p>
          </div>
        </div>
      </div>

      {/* Middle-left card */}
      <div className="floating-card absolute top-10 left-10 sm:top-12 sm:left-16 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-2 sm:p-3 border border-white/20 dark:bg-base-100 dark:border-base-200 max-w-[160px] sm:max-w-sm">
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
          <span className="text-xs sm:text-sm font-medium">
            انگار مناسب این شغل هستی :))
          </span>
        </div>
      </div>

      {/* Bottom-right card */}
      <div className="floating-card absolute bottom-24 right-2 sm:-bottom-12 sm:-right-6 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 border border-white/20 dark:bg-base-100 dark:border-base-200 max-w-[280px] ">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-pink-400 to-red-500 rounded-full flex items-center justify-center">
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm sm:text-base">
              یک موقعیت شغلی پیدا شد!
            </p>
            <p className="text-[10px] sm:text-xs">بزن بریم 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloatingCard;
