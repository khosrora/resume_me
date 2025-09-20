import Comments from "@/components/public/Comments";
import Features from "@/components/public/Features";
import FloatingCard from "@/components/public/FloatingCard";
import Header from "@/components/public/Header";
import { Shield, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="lg:space-y-24">
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-12">
        <div className="col-span-1">
          <h1 className="text-5xl lg:text-7xl font-black leading-tight bg-gradient-to-r ">
            رزومه‌ات رو
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              هوشمندانه
            </span>
            <br />
            تحلیل کن!
          </h1>

          <p className="text-xl lg:text-2xl lg:max-w-1xl dark:text-zinc-400">
            با استفاده از هوش مصنوعی پیشرفته، رزومه خود را تحلیل کنید و بهترین
            فرصت‌های شغلی را پیدا کنید.
          </p>
        </div>

        <FloatingCard />
      </div>

      {/* Features Section */}
      <Features />

      <section className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 relative overflow-hidden rounded-3xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
              آماده‌اید رزومه‌تون رو
              <br />
              تحلیل کنید؟
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              همین الان شروع کنی بهتره ...
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={"/login"}
                className="btn text-purple-600 px-8 py-6 text-lg font-semibold shadow-2xl rounded-md"
              >
                <Zap className="mr-2 h-5 w-5" />
                شروع رایگان
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Comments />
      <div className="h-[300px]"></div>
    </div>
  );
}
