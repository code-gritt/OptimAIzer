"use client";

import classNames from "classnames";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./button";
import { Container } from "./container";
import { Hamburger } from "./icons/hamburger";
import { Logo } from "./icons/logo";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

const navLinks = [
  { title: "Features", href: "/" },
  { title: "Workflows", href: "/" },
  { title: "Roadmaps", href: "/" },
  { title: "Integrations", href: "/" },
  { title: "Pricing", href: "/" },
  { title: "Company", href: "/" },
] as const;

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, token, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    document.querySelector("html")?.classList.toggle("overflow-hidden", isOpen);
  }, [isOpen]);

  useEffect(() => {
    const closeHamburgerMenu = () => setIsOpen(false);
    window.addEventListener("orientationchange", closeHamburgerMenu);
    window.addEventListener("resize", closeHamburgerMenu);
    return () => {
      window.removeEventListener("orientationchange", closeHamburgerMenu);
      window.removeEventListener("resize", closeHamburgerMenu);
    };
  }, []);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  // Generate avatar initials
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "";

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white-a08 bg-background/80 backdrop-blur-[12px]">
      <Container className="flex h-[var(--navigation-height)] items-center justify-between">
        <Link href="/" className="flex items-center text-lg font-semibold">
          <Logo className="mr-3 h-6 w-6" />
          OptimAIzer
        </Link>

        {user && token ? (
          <div className="hidden items-center space-x-4 md:flex">
            <span className="text-sm text-white">Credits: {user.credits}</span>
            <Link href="/dashboard" className="text-sm hover:text-white">
              Dashboard
            </Link>
            <Button onClick={handleLogout} size="small" variant="secondary">
              Logout
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ac8eff] text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        ) : (
          <div className="hidden items-center space-x-4 md:flex">
            <Link href="/login" className="text-sm hover:text-white">
              Log in
            </Link>
            <Button href="/signup" size="small">
              Sign Up
            </Button>
          </div>
        )}

        <button
          className="p-2 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle menu</span>
          <Hamburger />
        </button>
      </Container>

      <div
        className={classNames(
          "transition-max-h w-full overflow-hidden bg-background/95 backdrop-blur-md duration-300 md:hidden",
          isOpen ? "max-h-screen" : "max-h-0"
        )}
      >
        {user && token ? (
          <div className="flex flex-col space-y-3 border-t border-white-a08 px-6 py-4">
            <span className="py-2 text-center text-sm">
              Credits: {user.credits}
            </span>
            <Link
              href="/dashboard"
              className="py-2 text-center text-sm hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Button
              onClick={handleLogout}
              size="small"
              variant="secondary"
              className="w-full"
            >
              Logout
            </Button>
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#ac8eff] text-sm font-semibold text-white">
              {initials}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 border-t border-white-a08 px-6 py-4">
            <Link
              href="/login"
              className="py-2 text-center text-sm hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              Log in
            </Link>
            <Button href="/signup" size="small" className="w-full">
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
