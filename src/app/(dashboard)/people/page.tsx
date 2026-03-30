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
  if (pct > 90) return { bar: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50' };
  if (pct >= 70) return { bar: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50' };
  return { bar: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50' };
}

function getAvatarColor(name: string) {
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-emerald-100 text-emerald-700',
    'bg-amber-100 text-amber-700',
    'bg-pink-100 text-pink-700',
    'bg-cyan-100 text-cyan-700',
    'bg-orange-100 text-orange-700',
    'bg-indigo-100 text-indigo-700',
    'bg-rose-100 text-rose-700',
    'bg-teal-100 text-teal-700',
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
          <h1 className="text-2xl font-heading font-bold tracking-tight text-[var(--on-surface)]">
            People &amp; Workload
          </h1>
          <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
            {MOCK_TEAM.length} team members across {allProjects.length} projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('directory')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              view === 'directory'
                ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                : 'text-[var(--outline)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]'
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
                ? 'bg-[var(--primary)]/10 text-[var(--primary)]'
                : 'text-[var(--outline)] hover:bg-[var(--surface-container-low)] hover:text-[var(--on-surface)]'
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
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--outline)]" />
          <input
            type="text"
            placeholder="Search people..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-[var(--surface-container-low)] border-0 pl-9 pr-3 py-2 text-sm text-[var(--on-surface)] placeholder:text-[var(--outline)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]/30"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)]"
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
          className="rounded-lg bg-[var(--surface-container-low)] border-0 px-3 py-2 text-sm text-[var(--on-surface)]"
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
              <div
                key={member.id}
                className="rounded-xl bg-[var(--surface-container-lowest)] p-5 transition-all hover:translate-y-[-2px]"
                style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
              >
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
                    <h3 className="text-sm font-semibold text-[var(--on-surface)] truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-[var(--outline)]">{member.role}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-[var(--outline)]">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{member.email}</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[var(--surface-container-low)] p-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-[var(--outline)]">
                      <FolderKanban className="h-3 w-3" />
                      Projects
                    </div>
                    <p className="mt-0.5 text-lg font-bold text-[var(--on-surface)]">
                      {member.projectCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-container-low)] p-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-xs text-[var(--outline)]">
                      <CheckCircle2 className="h-3 w-3" />
                      Tasks
                    </div>
                    <p className="mt-0.5 text-lg font-bold text-[var(--on-surface)]">
                      {member.activeTasks}
                    </p>
                  </div>
                </div>

                {/* Workload bar */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--outline)]">Workload</span>
                    <span className={cn('font-semibold', wl.text)}>
                      {member.workloadPct}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-[var(--surface-container-high)]">
                    <div
                      className={cn('h-full rounded-full transition-all', wl.bar)}
                      style={{ width: `${Math.min(member.workloadPct, 100)}%` }}
                    />
                  </div>
                </div>

                {member.overdueTasks > 0 && (
                  <div className="mt-3 flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    {member.overdueTasks} overdue task{member.overdueTasks > 1 ? 's' : ''}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Workload Table View */}
      {view === 'workload' && (
        <div className="overflow-x-auto rounded-xl bg-[var(--surface-container-lowest)]" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}>
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--surface-container-low)]">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--outline)]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--outline)]">
                  Role
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--outline)]">
                  Projects
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--outline)]">
                  Active Tasks
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--outline)]">
                  Overdue
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--outline)] min-w-[180px]">
                  Workload
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--outline)]">
                  Chase Response
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, idx) => {
                const wl = getWorkloadColor(member.workloadPct);
                const avatarColor = getAvatarColor(member.name);
                return (
                  <tr
                    key={member.id}
                    className={cn(
                      'transition-colors hover:bg-[var(--surface-container-low)]/50',
                      idx % 2 === 0 ? 'bg-[var(--surface-container-lowest)]' : 'bg-[var(--surface)]'
                    )}
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
                          <p className="text-sm font-medium text-[var(--on-surface)]">
                            {member.name}
                          </p>
                          <p className="text-xs text-[var(--outline)]">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--on-surface-variant)]">
                      {member.role}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-[var(--on-surface)]">
                      {member.projectCount}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-[var(--on-surface)]">
                      {member.activeTasks}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {member.overdueTasks > 0 ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                          {member.overdueTasks}
                        </span>
                      ) : (
                        <span className="text-xs text-[var(--outline)]/50">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="h-2 w-full rounded-full bg-[var(--surface-container-high)]">
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
                            ? 'text-green-600'
                            : member.chaseResponseRate >= 75
                            ? 'text-amber-600'
                            : 'text-red-600'
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
              <Users className="h-10 w-10 text-[var(--outline)]/30" />
              <p className="mt-3 text-sm text-[var(--outline)]">
                No team members match your filters
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
