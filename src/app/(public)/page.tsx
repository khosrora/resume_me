import ThemeSwitcher from "@/components/ui/ThemeSwitcher";
import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Link href={"/dashboard"} className="btn">
        داشبورد
      </Link>
      <ThemeSwitcher />
    </div>
  );
}
