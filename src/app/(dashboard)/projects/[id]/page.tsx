import ProjectDetailClient from './project-detail-client';

export function generateStaticParams() {
  return [
    { id: 'proj-001' },
    { id: 'proj-002' },
    { id: 'proj-003' },
    { id: 'proj-004' },
    { id: 'proj-005' },
    { id: 'proj-006' },
  ];
}

export default function ProjectDetailPage() {
  return <ProjectDetailClient />;
}
