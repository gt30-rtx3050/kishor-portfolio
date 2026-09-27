import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";

/*
  Route table for the full site. Home is implemented; the other routes
  render placeholder pages until their build ships. Pages are lazy-loaded
  so the initial bundle stays small.
*/
const HomePage = lazy(() => import("@/pages/home-page"));
const AboutPage = lazy(() => import("@/pages/about-page"));
const ProjectsPage = lazy(() => import("@/pages/projects-page"));
const SkillsPage = lazy(() => import("@/pages/skills-page"));
const ContactPage = lazy(() => import("@/pages/contact-page"));
const NotFoundPage = lazy(() => import("@/pages/not-found-page"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "skills", element: <SkillsPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
