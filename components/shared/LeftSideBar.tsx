"use client";
import Link from "next/link";
import React from "react";
import { sidebarLinks } from "../../constants";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton, SignedIn, UserButton ,useAuth} from "@clerk/nextjs";

const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
            if (link.route === "/profile") link.route = `${link.route}/${userId}`;
          
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
              />
              <span className="text-light-1 font-sm max-lg:hidden">
                {link.label}
              </span>
            </Link>
          );
        })}
          </div>
          <div className="mt-10 px-6">
          <SignedIn>

            
              
              <SignOutButton signOutCallback={()=>router.push('/sign-in')}>
                          <div className="flex gap-4 p-4 cursor-pointer">
                          <Image
                  src="/assets/logout.svg"
                  alt="logo"
                  width={20}
                  height={20}
                              />
                                <p className="text-light-2 font-sm  max-lg:hidden">Logout</p>
               </div>

              </SignOutButton>
            
            
                
          </SignedIn>
          </div>
    </section>
  );
};

export default LeftSideBar;
