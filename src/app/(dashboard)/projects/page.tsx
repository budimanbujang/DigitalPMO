'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProjectCard } from '@/components/dashboard/project-card';
import { mockProjects, type MockProject, type RAGStatus, type ProjectStatus } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils';

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = useMemo(() => {
    return mockProjects.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.code.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (priorityFilter !== 'ALL') {
        const ragMap: Record<string, RAGStatus> = { HIGH: 'RED', MEDIUM: 'AMBER', LOW: 'GREEN' };
        if (p.ragStatus !== ragMap[priorityFilter]) return false;
      }
      return true;
    });
  }, [search, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mockProjects.length} projects across the portfolio
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          Register New Project
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-44">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="AT_RISK">At Risk</SelectItem>
              <SelectItem value="ON_HOLD">On Hold</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-44">
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="HIGH">High (Red)</SelectItem>
              <SelectItem value="MEDIUM">Medium (Amber)</SelectItem>
              <SelectItem value="LOW">Low (Green)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No projects match your filters.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Project</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">RAG</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Progress</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Budget</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Owner</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Overdue</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/projects/${p.id}`} className="font-medium text-foreground hover:text-primary">
                      {p.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{p.code}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{p.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.ragStatus === 'RED' ? 'rag-red' : p.ragStatus === 'AMBER' ? 'rag-amber' : 'rag-green'}>
                      {p.ragStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Progress value={p.percentComplete} className="flex-1" />
                      <span className="text-xs font-medium">{p.percentComplete}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div>{formatCurrency(p.budgetSpent)} / {formatCurrency(p.budgetAllocated)}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{p.owner}</td>
                  <td className="px-4 py-3">
                    {p.overdueTasks > 0 ? (
                      <span className="text-red-500 font-semibold">{p.overdueTasks}</span>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
