"use client"

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthButtons from "../AuthButtons";
import Sidebar from "../Sidebar";
import Cookies from "js-cookie";
import LogoutButtons from "../LogoutButtons";
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [CookieUser, setCookieUser] = useState(null);
  const [navBarKey, setNavBarKey] = useState(0);

  useEffect(() => {
    const userCookie = Cookies.get('CookieUser');
    setCookieUser(userCookie);
  }, []);

  const router = useRouter();

  const logoutClick = () => {
    Cookies.remove('CookieUser');
    router.refresh();
    setNavBarKey((prevKey) => prevKey + 1);
  };

  return (
    <nav key={navBarKey} className="flex justify-between items-center px-8 py-3">
      <Link className="text-white font-bold" href={"/"}>
        <img className="h-5 lg:h-10" src="fakedindeed.png" alt="FakedIndeed"/>
      </Link>
      <div className="flex items-center space-x-4">
        {typeof CookieUser === 'undefined' && (
          <AuthButtons />
        )}
        {typeof CookieUser !== 'undefined' && (
          <LogoutButtons Logout={logoutClick} />
        )}
        <Sidebar />
      </div>
    </nav>
  )
}
