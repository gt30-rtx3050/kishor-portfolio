export interface Experience {
  company: string;
  role: string;
  years: string;
  /** Decorative reference artwork, not a claim of work made for the employer. */
  artwork: string;
}

const referenceImage = (id: string) =>
  `https://framerusercontent.com/images/${id}.png?width=1448&height=1086`;

export const experiences: Experience[] = [
  {
    company: "SB Web Technology",
    role: "Content Writer",
    years: "2018–2020",
    artwork: referenceImage("SEOak8b7xQp3Iazq9VAGNE5Juxg"),
  },
  {
    company: "KPO & Company",
    role: "Content Manager",
    years: "2020–2022",
    artwork: referenceImage("g3Ab3Q1G3cSqhHt0fxK4axnTo"),
  },
  {
    company: "Daraz [Alibaba Group]",
    role: "Content Lead/Digital Marketing",
    years: "2023–2024",
    artwork: referenceImage("oEGc0lf8afz6D421mUMovk6X1U"),
  },
  {
    company: "Himalayan Dream Treks [Remote]",
    role: "SEO Content Manager",
    years: "2023–2024",
    artwork: referenceImage("84M5sNg02mtc5DemtXXJ37RrU"),
  },
  {
    company: "AFC Urgent Care [Remote]",
    role: "Growth Marketing Manager",
    years: "2024–2026",
    artwork: referenceImage("NVnkeC9tzFL2VdpAsgVcVU4dcU"),
  },
];
