'use client';

import { ProjectContextProvider } from '@/components/project/project-context';

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProjectContextProvider>{children}</ProjectContextProvider>;
}
