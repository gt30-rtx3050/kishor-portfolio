import { Link } from "react-router-dom";
import kishorLogo from "../../../Kishor LOGO.png";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

interface SiteLogoProps {
  className?: string;
  imageClassName?: string;
}

export function SiteLogo({ className, imageClassName }: SiteLogoProps) {
  return (
    <Link
      to="/"
      aria-label={`${site.name}, back to home`}
      className={cn("inline-flex items-center", className)}
    >
      <img
        src={kishorLogo}
        alt="Kishor"
        className={cn("h-8 w-auto object-contain md:h-9", imageClassName)}
      />
    </Link>
  );
}
