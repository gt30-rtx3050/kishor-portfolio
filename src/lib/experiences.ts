/*
  The artwork files are bound with `new URL(..., import.meta.url)` instead of
  bare `import` statements. Vite rewrites that pattern into a hashed, built
  asset URL exactly as it does for a static import, but it also keeps this
  module loadable by plain Node (`node --experimental-strip-types --test`),
  which is how the orbit test imports the data below. The paths must stay
  static string literals for Vite to rewrite them.
*/

export interface Experience {
  company: string;
  role: string;
  years: string;
  /**
   * Short label for the timeline's ribbon station. The station label is set at
   * 34px inside a ~210px cell, so it has to stay short; the full legal-ish
   * name lives on the card below it.
   */
  shortName: string;
  /**
   * PLACEHOLDER COPY — TO BE REPLACED.
   *
   * The real responsibilities were not supplied, so every entry below is an
   * obvious placeholder that keeps the timeline's line rhythm visible. Replace
   * each string with a real, verifiable responsibility for that role; three
   * short lines per company is what the cards are designed around (they
   * tolerate two to four).
   */
  responsibilities: string[];
  /**
   * Decorative background artwork, self-hosted from `src/assets/experience/`
   * so the cards never depend on a third-party request. Each image was
   * generated to match its company's industry; it is illustrative only and is
   * not represented as work made for the employer.
   */
  artwork: string;
}

export const experiences: Experience[] = [
  {
    company: "SB Web Technology",
    role: "Content Writer",
    years: "2018–2020",
    shortName: "SB Web",
    // PLACEHOLDER COPY — replace with the real responsibilities for this role.
    responsibilities: [
      "Placeholder — responsibility one.",
      "Placeholder — responsibility two.",
      "Placeholder — responsibility three.",
    ],
    // Web development: source code on a studio monitor.
    artwork: new URL("../assets/experience/experience-sb-web.jpg", import.meta.url).href,
  },
  {
    company: "KPO & Company",
    role: "Content Manager",
    years: "2020–2022",
    shortName: "KPO & Co.",
    // PLACEHOLDER COPY — replace with the real responsibilities for this role.
    responsibilities: [
      "Placeholder — responsibility one.",
      "Placeholder — responsibility two.",
      "Placeholder — responsibility three.",
    ],
    // Editorial planning: manuscripts and a content calendar on a desk.
    artwork: new URL("../assets/experience/experience-kpo.jpg", import.meta.url).href,
  },
  {
    company: "Daraz [Alibaba Group]",
    role: "Content Lead/Digital Marketing",
    years: "2023–2024",
    shortName: "Daraz",
    // PLACEHOLDER COPY — replace with the real responsibilities for this role.
    responsibilities: [
      "Placeholder — responsibility one.",
      "Placeholder — responsibility two.",
      "Placeholder — responsibility three.",
    ],
    // E-commerce: fulfilment warehouse shelving and a parcel conveyor.
    artwork: new URL("../assets/experience/experience-daraz.jpg", import.meta.url).href,
  },
  {
    company: "Himalayan Dream Treks [Remote]",
    role: "SEO Content Manager",
    years: "2023–2024",
    shortName: "Himalayan Treks",
    // PLACEHOLDER COPY — replace with the real responsibilities for this role.
    responsibilities: [
      "Placeholder — responsibility one.",
      "Placeholder — responsibility two.",
      "Placeholder — responsibility three.",
    ],
    // Trekking operator: Himalayan ridge trail and a prayer-flag cairn.
    artwork: new URL("../assets/experience/experience-treks.jpg", import.meta.url).href,
  },
  {
    company: "AFC Urgent Care [Remote]",
    role: "Growth Marketing Manager",
    years: "2024–2026",
    shortName: "AFC Urgent Care",
    // PLACEHOLDER COPY — replace with the real responsibilities for this role.
    responsibilities: [
      "Placeholder — responsibility one.",
      "Placeholder — responsibility two.",
      "Placeholder — responsibility three.",
    ],
    // Healthcare: a calm, empty urgent-care treatment corridor.
    artwork: new URL("../assets/experience/experience-afc.jpg", import.meta.url).href,
  },
];
