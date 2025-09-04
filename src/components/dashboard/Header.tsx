import React from "react";
import ThemeSwitcher from "../ui/ThemeSwitcher";

function Header() {
  return (
    <>
      <div className="flex justify-between items-center p-4 w-full">
        <div className="flex justify-start items-center gap-x-4">
          <div className="avatar">
            <div className="w-16 rounded-full ring-2 ring-offset-2">
              <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
            </div>
          </div>
          <div className="flex flex-col">
            <p>خسرو رسولی</p>
            <p className="text-xs">کارجو</p>
          </div>
        </div>
        <ThemeSwitcher />
      </div>
    </>
  );
}

export default Header;
