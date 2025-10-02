'use client';

import classNames from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { Container } from './container';
import { Hamburger } from './icons/hamburger';
import { Logo } from './icons/logo';

const navLinks = [
  { title: 'Features', href: '/' },
  { title: 'Workflows', href: '/' },
  { title: 'Roadmaps', href: '/' },
  { title: 'Integrations', href: '/' },
  { title: 'Pricing', href: '/' },
  { title: 'Company', href: '/' },
] as const;

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.querySelector('html')?.classList.toggle('overflow-hidden', isOpen);
  }, [isOpen]);

  useEffect(() => {
    const closeHamburgerMenu = () => setIsOpen(false);
    window.addEventListener('orientationchange', closeHamburgerMenu);
    window.addEventListener('resize', closeHamburgerMenu);

    return () => {
      window.removeEventListener('orientationchange', closeHamburgerMenu);
      window.removeEventListener('resize', closeHamburgerMenu);
    };
  }, []);

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-white-a08 bg-background/80 backdrop-blur-[12px]">
      <Container className="flex h-[var(--navigation-height)] items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center text-lg font-semibold">
          <Logo className="mr-3 h-6 w-6" />
          OptimAIzer
        </Link>

        {/* Desktop nav */}
        {/* <nav className="hidden space-x-8 text-sm font-medium md:flex">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              href={link.href}
              className="transition-colors hover:text-white"
            >
              {link.title}
            </Link>
          ))}
        </nav> */}

        {/* Desktop actions */}
        <div className="hidden items-center space-x-4 md:flex">
          <Link href="/login" className="text-sm hover:text-white">
            Log in
          </Link>
          <Button href="/signup" size="small">
            Sign Up
          </Button>
        </div>

        {/* Hamburger button */}
        <button
          className="p-2 md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Toggle menu</span>
          <Hamburger />
        </button>
      </Container>

      {/* Mobile menu */}
      <div
        className={classNames(
          'transition-max-h w-full overflow-hidden bg-background/95 backdrop-blur-md duration-300 md:hidden',
          isOpen ? 'max-h-screen' : 'max-h-0'
        )}
      >
        {/* <ul className="flex flex-col space-y-4 px-6 py-4 text-lg font-medium">
          {navLinks.map((link, idx) => (
            <li key={idx}>
              <Link
                href={link.href}
                className="block w-full py-2 transition-colors hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul> */}

        <div className="flex flex-col space-y-3 border-t border-white-a08 px-6 py-4">
          <Link
            href="/login"
            className="py-2 text-center text-sm transition-colors hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            Log in
          </Link>
          <Button href="/signup" size="small" className="w-full">
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};
