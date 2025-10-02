import Link from 'next/link';
import { Container } from './container';
import { GithubIcon } from './icons/github';
import { Logo } from './icons/logo';
import { SlackIcon } from './icons/slack';
import { TwitterIcon } from './icons/twitter';

export const Footer = () => {
  const footerLinks = [
    {
      title: 'Products',
      links: [
        { title: 'Features', href: '#' },
        { title: 'Integrations', href: '#' },
        { title: 'Pricing', href: '#' },
        { title: 'Changelog', href: '#' },
        { title: 'Docs', href: '#' },
        { title: 'Dashboard', href: '#' },
        { title: 'Download App', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { title: 'About Us', href: '#' },
        { title: 'Blog', href: '#' },
        { title: 'Careers', href: '#' },
        { title: 'Customers', href: '#' },
        { title: 'Brand', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { title: 'Community', href: '#' },
        { title: 'Contact', href: '#' },
        { title: 'Data Processing Addendum', href: '#' },
        { title: 'Terms of Service', href: '#' },
        { title: 'Report a Vulnerability', href: '#' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { title: 'API', href: '#' },
        { title: 'Status', href: '#' },
        { title: 'GitHub', href: '#' },
      ],
    },
  ];

  return (
    <footer className="border-t border-white-a08 px-8 py-[5.6rem] text-sm">
      <Container className="flex flex-col justify-between lg:flex-row">
        <div>
          <div className="flex h-full flex-row lg:flex-col">
            <div className="flex cursor-pointer items-center text-grey transition-colors duration-300 hover:text-white">
              <Logo className="mr-2 h-4 w-4" /> OptimAIzer – Smarter Code Review
            </div>
            <div className="ml-auto mt-auto flex space-x-6 text-grey lg:ml-0">
              <TwitterIcon />
              <GithubIcon />
              <SlackIcon />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap">
          {footerLinks.map((column, idx) => (
            <div
              key={idx}
              className="mt-10 min-w-[50%] lg:mt-0 lg:min-w-[18rem]"
            >
              <h3 className="mb-[1.4rem] font-medium text-off-white">
                {column.title}
              </h3>
              <ul>
                {column.links.map((link, idx) => (
                  <li
                    key={idx}
                    className="[&_a]:transition-colors [&_a]:duration-200 [&_a]:last:mb-0 [&_a]:hover:text-white"
                  >
                    <Link
                      href={link.href}
                      className="mb-[1.4rem] inline-block text-grey"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </footer>
  );
};
