import {
  OrganizationSwitcher,
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const TopBar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Thread</p>
      </Link>
      <div className="flex items-center gap-1">
        <div className="block md:hidden">
          <SignedIn>
            <div className="flex cursor-pointer gap-4">
              <UserButton />
              
              <SignOutButton>
                <Image
                  src="/assets/logout.svg"
                  alt="logo"
                  width={24}
                  height={24}
                />
              </SignOutButton>
            
            </div>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded border-none text-white   px-4 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
