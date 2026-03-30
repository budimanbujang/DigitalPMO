'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { mockProjects, mockInsights, type MockProject, type AIInsight } from '@/lib/mock-data';

export interface ProjectContextValue {
  project: MockProject;
  insights: AIInsight[];
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function useProjectContext() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectContext must be used within ProjectContextProvider');
  return ctx;
}

export function ProjectContextProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const id = params.id as string;

  const project = useMemo(() => mockProjects.find((p) => p.id === id), [id]);
  const insights = useMemo(() => mockInsights.filter((i) => i.projectId === id), [id]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <h2 className="text-lg font-semibold text-foreground">Project not found</h2>
          <p className="text-sm text-muted-foreground">No project with ID &quot;{id}&quot; exists.</p>
        </div>
      </div>
    );
  }

  return (
    <ProjectContext.Provider value={{ project, insights }}>
      {children}
    </ProjectContext.Provider>
  );
}
