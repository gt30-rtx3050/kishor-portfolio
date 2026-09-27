import { Link } from "react-router-dom";
import {
  Footer as FlowbiteFooter,
  FooterCopyright,
  FooterIcon,
  FooterTitle,
} from "flowbite-react";
import { navLinks, site } from "@/lib/site";
import { GitHubIcon, LinkedInIcon, MailIcon, MapPinIcon, XIcon } from "@/components/ui/icons";

/*
  Footer built on Flowbite React primitives (Footer, FooterCopyright,
  FooterIcon, FooterTitle). Class overrides keep every Flowbite surface on
  the site palette instead of Flowbite's default grays.
*/

const socialLinks = [
  { label: "GitHub", href: site.socials.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedInIcon },
  { label: "X (Twitter)", href: site.socials.x, Icon: XIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <FlowbiteFooter className="border-t border-fg/10 bg-bg dark:bg-bg">
      <div className="shell grid gap-12 py-16 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <Link
            to="/"
            aria-label={`${site.name}, back to home`}
            className="font-display text-lg font-normal tracking-tight"
          >
            {site.name}
            <span className="text-fg/40">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-fg/50">
            {site.role} crafting fast, accessible web products.
          </p>
          <div className="mt-6 flex items-center gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <FooterIcon
                key={label}
                href={href}
                aria-label={label}
                icon={Icon}
                className="rounded-full border border-fg/15 bg-transparent text-fg/60 hover:bg-fg/5 hover:text-fg dark:border-fg/15 dark:bg-transparent dark:text-fg/60 dark:hover:bg-fg/5 dark:hover:text-fg"
              />
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <FooterTitle
            title="Navigate"
            className="text-xs font-medium uppercase tracking-widest text-fg/40 dark:text-fg/40"
          />
          <ul className="space-y-3">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-fg/60 transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <FooterTitle
            title="Contact"
            className="text-xs font-medium uppercase tracking-widest text-fg/40 dark:text-fg/40"
          />
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center gap-2 text-fg/60 transition-colors hover:text-fg"
              >
                <MailIcon className="size-4" />
                {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2 text-fg/60">
              <MapPinIcon className="size-4" />
              {site.location}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-fg/10">
        <div className="shell flex flex-col items-center justify-between gap-3 py-6 sm:flex-row">
          <FooterCopyright
            href="/"
            by={site.name}
            year={year}
            className="text-xs text-fg/40 dark:text-fg/40"
          />
          <p className="text-xs text-fg/30">
            Built with React, Tailwind CSS, and Framer Motion.
          </p>
        </div>
      </div>
    </FlowbiteFooter>
  );
}
