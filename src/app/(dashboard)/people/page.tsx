'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  LayoutGrid,
  Table,
  Mail,
  Search,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  projectCount: number;
  activeTasks: number;
  overdueTasks: number;
  workloadPct: number;
  chaseResponseRate: number;
  projects: string[];
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: 'usr-001',
    name: 'Ahmad Razif',
    role: 'PMO Lead',
    email: 'ahmad.razif@digitalpmo.my',
    avatar: 'AR',
    projectCount: 5,
    activeTasks: 8,
    overdueTasks: 0,
    workloadPct: 72,
    chaseResponseRate: 100,
    projects: ['MyDigital ID Platform', 'PDPA Compliance System', 'E-Perolehan Upgrade'],
  },
  {
    id: 'usr-002',
    name: 'Siti Aminah',
    role: 'Project Manager',
    email: 'siti.aminah@digitalpmo.my',
    avatar: 'SA',
    projectCount: 2,
    activeTasks: 12,
    overdueTasks: 1,
    workloadPct: 85,
    chaseResponseRate: 92,
    projects: ['MyDigital ID Platform', 'PDPA Compliance System'],
  },
  {
    id: 'usr-003',
    name: 'Farid Hassan',
    role: 'Senior Developer',
    email: 'farid.hassan@digitalpmo.my',
    avatar: 'FH',
    projectCount: 2,
    activeTasks: 9,
    overdueTasks: 2,
    workloadPct: 95,
    chaseResponseRate: 78,
    projects: ['MyDigital ID Platform', 'E-Perolehan Upgrade'],
  },
  {
    id: 'usr-004',
    name: 'Nurul Izzah',
    role: 'Business Analyst',
    email: 'nurul.izzah@digitalpmo.my',
    avatar: 'NI',
    projectCount: 3,
    activeTasks: 7,
    overdueTasks: 0,
    workloadPct: 65,
    chaseResponseRate: 96,
    projects: ['PDPA Compliance System', 'E-Perolehan Upgrade'],
  },
  {
    id: 'usr-005',
    name: 'Hafiz Abdullah',
    role: 'Technical Lead',
    email: 'hafiz.abdullah@digitalpmo.my',
    avatar: 'HA',
    projectCount: 3,
    activeTasks: 11,
    overdueTasks: 1,
    workloadPct: 92,
    chaseResponseRate: 88,
    projects: ['MyDigital ID Platform', 'PDPA Compliance System', 'E-Perolehan Upgrade'],
  },
  {
    id: 'usr-006',
    name: 'Aishah Yusof',
    role: 'QA Lead',
    email: 'aishah.yusof@digitalpmo.my',
    avatar: 'AY',
    projectCount: 2,
    activeTasks: 6,
    overdueTasks: 0,
    workloadPct: 58,
    chaseResponseRate: 100,
    projects: ['MyDigital ID Platform', 'PDPA Compliance System'],
  },
  {
    id: 'usr-007',
    name: 'Rizal Karim',
    role: 'DevOps Engineer',
    email: 'rizal.karim@digitalpmo.my',
    avatar: 'RK',
    projectCount: 3,
    activeTasks: 5,
    overdueTasks: 0,
    workloadPct: 48,
    chaseResponseRate: 94,
    projects: ['MyDigital ID Platform', 'E-Perolehan Upgrade'],
  },
  {
    id: 'usr-008',
    name: 'Mei Lin Tan',
    role: 'UI/UX Designer',
    email: 'meilin.tan@digitalpmo.my',
    avatar: 'ML',
    projectCount: 2,
    activeTasks: 8,
    overdueTasks: 1,
    workloadPct: 78,
    chaseResponseRate: 85,
    projects: ['MyDigital ID Platform', 'PDPA Compliance System'],
  },
  {
    id: 'usr-009',
    name: 'Kavitha Raj',
    role: 'Security Analyst',
    email: 'kavitha.raj@digitalpmo.my',
    avatar: 'KR',
    projectCount: 2,
    activeTasks: 4,
    overdueTasks: 1,
    workloadPct: 62,
    chaseResponseRate: 75,
    projects: ['PDPA Compliance System', 'E-Perolehan Upgrade'],
  },
  {
    id: 'usr-010',
    name: 'Arjun Nair',
    role: 'Backend Developer',
    email: 'arjun.nair@digitalpmo.my',
    avatar: 'AN',
    projectCount: 2,
    activeTasks: 10,
    overdueTasks: 2,
    workloadPct: 88,
    chaseResponseRate: 82,
    projects: ['E-Perolehan Upgrade', 'MyDigital ID Platform'],
  },
];

const allRoles = [...new Set(MOCK_TEAM.map((m) => m.role))];
const allProjects = [...new Set(MOCK_TEAM.flatMap((m) => m.projects))];

function getWorkloadColor(pct: number) {
  if (pct > 90) return { bar: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-500/10' };
  if (pct >= 70) return { bar: 'bg-amber-500', text: 'text-amber-400', bg: 'bg-amber-500/10' };
  return { bar: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-500/10' };
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-blue-500/20 text-blue-400',
    'bg-purple-500/20 text-purple-400',
    'bg-emerald-500/20 text-emerald-400',
    'bg-amber-500/20 text-amber-400',
    'bg-pink-500/20 text-pink-400',
    'bg-cyan-500/20 text-cyan-400',
    'bg-orange-500/20 text-orange-400',
    'bg-indigo-500/20 text-indigo-400',
    'bg-rose-500/20 text-rose-400',
    'bg-teal-500/20 text-teal-400',
  ];
  let hash = 0;
  for (const ch of name) hash = ch.charCodeAt(0) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export default function PeoplePage() {
  const [view, setView] = useState<'directory' | 'workload'>('directory');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [projectFilter, setProjectFilter] = useState('ALL');

  const filtered = useMemo(() => {
    return MOCK_TEAM.filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (roleFilter !== 'ALL' && m.role !== roleFilter) return false;
      if (projectFilter !== 'ALL' && !m.projects.includes(projectFilter)) return false;
      return true;
    });
  }, [search, roleFilter, projectFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            People &amp; Workload
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {MOCK_TEAM.length} team members across {allProjects.length} projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('directory')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              view === 'directory'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Directory
          </button>
          <button
            onClick={() => setView('workload')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              view === 'workload'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            )}
          >
            <Table className="h-4 w-4" />
            Workload
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary/50 pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/30 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
        >
          <option value="ALL">All Roles</option>
          {allRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="rounded-lg border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground"
        >
          <option value="ALL">All Projects</option>
          {allProjects.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Directory View */}
      {view === 'directory' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((member) => {
            const wl = getWorkloadColor(member.workloadPct);
            const avatarColor = getAvatarColor(member.name);
            return (
              <Card key={member.id} className="transition-all hover:border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                        avatarColor
                      )}
                    >
                      {member.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-foreground truncate">
                        {member.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{member.email}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-secondary/50 p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <FolderKanban className="h-3 w-3" />
                        Projects
                      </div>
                      <p className="mt-0.5 text-lg font-bold text-foreground">
                        {member.projectCount}
                      </p>
                    </div>
                    <div className="rounded-lg bg-secondary/50 p-2 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3" />
                        Tasks
                      </div>
                      <p className="mt-0.5 text-lg font-bold text-foreground">
                        {member.activeTasks}
                      </p>
                    </div>
                  </div>

                  {/* Workload bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Workload</span>
                      <span className={cn('font-semibold', wl.text)}>
                        {member.workloadPct}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-secondary/50">
                      <div
                        className={cn('h-full rounded-full transition-all', wl.bar)}
                        style={{ width: `${Math.min(member.workloadPct, 100)}%` }}
                      />
                    </div>
                  </div>

                  {member.overdueTasks > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      {member.overdueTasks} overdue task{member.overdueTasks > 1 ? 's' : ''}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Workload Table View */}
      {view === 'workload' && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Role
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Projects
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Active Tasks
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overdue
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">
                  Workload
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Chase Response
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((member) => {
                const wl = getWorkloadColor(member.workloadPct);
                const avatarColor = getAvatarColor(member.name);
                return (
                  <tr
                    key={member.id}
                    className="transition-colors hover:bg-secondary/20"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                            avatarColor
                          )}
                        >
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {member.role}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                      {member.projectCount}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                      {member.activeTasks}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {member.overdueTasks > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
                          {member.overdueTasks}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground/50">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 w-full rounded-full bg-secondary/50">
                            <div
                              className={cn('h-full rounded-full transition-all', wl.bar)}
                              style={{
                                width: `${Math.min(member.workloadPct, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span
                          className={cn(
                            'w-10 text-right text-xs font-semibold',
                            wl.text
                          )}
                        >
                          {member.workloadPct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          member.chaseResponseRate >= 90
                            ? 'text-green-400'
                            : member.chaseResponseRate >= 75
                            ? 'text-amber-400'
                            : 'text-red-400'
                        )}
                      >
                        {member.chaseResponseRate}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-10 w-10 text-muted-foreground/30" />
              <p className="mt-3 text-sm text-muted-foreground">
                No team members match your filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
