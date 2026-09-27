import { TextLoop } from "@/components/animate-ui/text-loop";
import { site } from "@/lib/site";

/** Monochrome, accessible brand transition between the hero and experience. */
export function PerformanceLoop() {
  return (
    <section aria-labelledby="performance-loop-heading" className="overflow-hidden bg-bg">
      <h2 id="performance-loop-heading" className="sr-only">
        {site.marketingLoop}
      </h2>
      <TextLoop text={site.marketingLoop} />
    </section>
  );
}
