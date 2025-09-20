import { BarChart3, Brain, Briefcase, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "تحلیل هوشمند رزومه",
    description:
      "با استفاده از هوش مصنوعی پیشرفته، رزومه شما را به طور کامل تحلیل می‌کنیم",
    iconBg: "bg-gradient-to-r from-blue-400 to-purple-500",
  },
  {
    icon: BarChart3,
    title: "امتیازدهی دقیق",
    description: "امتیاز کلی رزومه و نقاط قوت و ضعف آن را مشخص می‌کنیم",
    iconBg: "bg-gradient-to-r from-green-400 to-emerald-500",
  },
  {
    icon: Briefcase,
    title: "پیشنهاد شغل",
    description:
      "بر اساس مهارت‌های شما، بهترین فرصت‌های شغلی را پیشنهاد می‌دهیم",
    iconBg: "bg-gradient-to-r from-purple-400 to-pink-500",
  },
  {
    icon: TrendingUp,
    title: "بهبود مهارت‌ها",
    description: "راهکارهای عملی برای بهبود و ارتقای مهارت‌های حرفه‌ای شما",
    iconBg: "bg-gradient-to-r from-orange-400 to-red-500",
  },
];

function Features() {
  return (
    <section id="features" className="relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold">
            چرا ما همراه ما بشی؟
          </h2>
          <p className="text-base mx-auto">
            ویژگی‌های منحصر به فرد ما که شما را به موفقیت می‌رساند
          </p>
        </div>

        <div className="features-container grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group cursor-pointer">
              <div className="h-full p-6 dark:bg-base-200 dark:border-base-300 space-y-4 rounded-md">
                <div className="text-center z-10">
                  <div
                    className={`w-15 h-15 mx-auto rounded-2xl ${feature.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="text-xl group-hover:text-purple-600 transition-colors text-center">
                  {feature.title}
                </div>
                <div className="z-10">
                  <div className="text-center leading-relaxed text-xs min-h-[40px]">
                    {feature.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
