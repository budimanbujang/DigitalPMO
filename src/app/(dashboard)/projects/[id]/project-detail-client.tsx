'use client';

import React, { useState } from 'react';
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectTabs } from '@/components/project/project-tabs';
import { OverviewTab } from '@/components/project/overview-tab';
import { TasksTab } from '@/components/project/tasks-tab';
import { MilestonesTab } from '@/components/project/milestones-tab';
import { BudgetTab } from '@/components/project/budget-tab';
import { RisksTab } from '@/components/project/risks-tab';
import { TimelineTab } from '@/components/project/timeline-tab';
import { TeamTab } from '@/components/project/team-tab';
import { InsightsTab } from '@/components/project/insights-tab';
import { DocumentsTab } from '@/components/project/documents-tab';

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  overview: OverviewTab,
  tasks: TasksTab,
  milestones: MilestonesTab,
  budget: BudgetTab,
  risks: RisksTab,
  timeline: TimelineTab,
  team: TeamTab,
  insights: InsightsTab,
  documents: DocumentsTab,
};

export default function ProjectDetailClient() {
  const [activeTab, setActiveTab] = useState('overview');
  const ActiveComponent = TAB_COMPONENTS[activeTab] || OverviewTab;

  return (
    <div className="space-y-6" style={{ backgroundColor: 'var(--surface)', minHeight: '100vh' }}>
      <ProjectHeader />
      <ProjectTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <ActiveComponent />
    </div>
  );
}
