"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "علی محمدی",
    role: "توسعه‌دهنده نرم‌افزار",
    content:
      "این سیستم کمک زیادی به بهبود رزومه من کرد. امتیاز من از 6 به 9 رسید!",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ali",
  },
  {
    name: "سارا احمدی",
    role: "مدیر بازاریابی",
    content: "پیشنهادات شغلی عالی بود. خیلی زود شغل مناسبی پیدا کردم.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
  },
  {
    name: "رضا کریمی",
    role: "طراح UI/UX",
    content: "تحلیل دقیق و حرفه‌ای. واقعاً نقاط ضعف رزومه‌ام رو شناختم.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reza",
  },
  {
    name: "مریم موسوی",
    role: "کارشناس منابع انسانی",
    content:
      "رزومه من خیلی حرفه‌ای‌تر شد و تونستم در یک شرکت معتبر استخدام بشم.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mariam",
  },
  {
    name: "حسین رضوی",
    role: "مدیر پروژه",
    content:
      "پیشنهادهای کاربردی سیستم واقعاً کمک کرد تا نقاط قوت رزومه‌ام پررنگ‌تر بشه.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hossein",
  },
  {
    name: "نگین شریفی",
    role: "تحلیلگر داده",
    content:
      "به لطف این سیستم تونستم رزومه‌ام رو به استانداردهای بین‌المللی برسونم.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Negin",
  },
  {
    name: "امیر حسنی",
    role: "برنامه‌نویس بک‌اند",
    content:
      "رزومه‌ام بعد از تحلیل خیلی شفاف‌تر شد و تاثیر خوبی روی کارفرما گذاشت.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amir",
  },
  {
    name: "فاطمه یوسفی",
    role: "مدرس دانشگاه",
    content:
      "پیشنهادهای سیستم خیلی علمی و دقیق بود. به بهبود جایگاه شغلیم کمک کرد.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatemeh",
  },
  {
    name: "پرهام نادری",
    role: "مهندس شبکه",
    content:
      "رزومه‌ام ساختار بهتری پیدا کرد و باعث شد در مصاحبه موفق‌تر عمل کنم.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Parham",
  },
  {
    name: "الهام رضایی",
    role: "کارشناس فروش",
    content: "خیلی سریع تونستم نقاط ضعفم رو اصلاح کنم و شغل بهتری پیدا کنم.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elham",
  },
  {
    name: "کیوان شمس",
    role: "مهندس عمران",
    content: "تحلیل رزومه باعث شد تجربه‌هام به شکل بهتری نمایش داده بشه.",
    rating: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Keyvan",
  },
  {
    name: "ندا سلطانی",
    role: "طراح گرافیک",
    content: "نکات پیشنهادی خیلی کاربردی بود. حالا رزومه‌ام خیلی جذاب‌تر شده.",
    rating: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neda",
  },
];

function Comments() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".testimonial-row").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%", // row enters viewport
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // split testimonials into rows of 3
  const rows = [];
  for (let i = 0; i < testimonials.length; i += 3) {
    rows.push(testimonials.slice(i, i + 3));
  }

  return (
    <section ref={sectionRef} className="py-16">
      <div className="text-center space-y-6 mb-16">
        <h2 className="text-4xl lg:text-6xl font-bold">آخرین نظرات کاربران</h2>
        <p className="text-xl max-w-3xl mx-auto">
          ببینید کاربران ما چه می‌گویند
        </p>
      </div>

      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="testimonial-row grid md:grid-cols-3 gap-8 mb-12"
        >
          {row.map((testimonial, index) => (
            <div key={index}>
              <div className="h-full bg-base-200 p-4 rounded-md border-base-200">
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-purple-200"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <div className="text-base z-10">"{testimonial.content}"</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

export default Comments;
