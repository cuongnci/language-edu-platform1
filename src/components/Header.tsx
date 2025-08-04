import Image from "next/image";

export default function Header() {
  return (
    <header className="bg-background-primary text-white px-24 py-3">
      <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center">
            <Image
              width={140}
              height={28}
              src="lingo_icon.svg"
              alt="LingoTalk icon"
            />
          </div>
          <nav className="flex gap-11">
            <a href="#" className="cursor-pointer text-white transition-colors font-bold">
              Classes
            </a>
            <a href="#" className="cursor-pointer text-orange-inactive transition-colors">
              Calendar
            </a>
            <a href="#" className="cursor-pointer text-orange-inactive transition-colors">
              Setting
            </a>
            <a href="#" className="cursor-pointer text-orange-inactive transition-colors">
              Requests
            </a>
          </nav>
          <div className="flex-1 flex items-center gap-10 justify-end">
            <div className="relative">
              <Image
                width={24}
                height={27}
                src="bell_icon.svg"
                alt="Bell icon"
              />
              <span className="absolute -top-1 -right-3 bg-background-third text-darkblue rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <div>
                <Image
                  width={35}
                  height={35}
                  src="avatar.svg"
                  alt="User avatar"
                />
              </div>
              <div>Sign out</div>
            </div>
          </div>
      </div>
    </header>
  );
}
