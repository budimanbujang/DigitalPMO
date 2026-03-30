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
import { mockProjects, type RAGStatus } from '@/lib/mock-data';
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
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#1a1c1e' }}
          >
            Projects
          </h1>
          <p className="mt-1 text-sm" style={{ color: '#44474e' }}>
            {mockProjects.length} projects across the portfolio
          </p>
        </div>
        <Button style={{ backgroundColor: '#001736', color: '#ffffff' }}>
          <Plus className="h-4 w-4" />
          Register New Project
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#74777f' }} />
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
        <div
          className="flex items-center gap-1 rounded-md p-0.5"
          style={{ backgroundColor: '#f3f3f6' }}
        >
          <button
            onClick={() => setViewMode('grid')}
            className="p-1.5 rounded transition-colors"
            style={{
              backgroundColor: viewMode === 'grid' ? '#ffffff' : 'transparent',
              color: viewMode === 'grid' ? '#1a1c1e' : '#74777f',
              boxShadow: viewMode === 'grid' ? '0 1px 3px rgba(26,28,30,0.08)' : 'none',
            }}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className="p-1.5 rounded transition-colors"
            style={{
              backgroundColor: viewMode === 'table' ? '#ffffff' : 'transparent',
              color: viewMode === 'table' ? '#1a1c1e' : '#74777f',
              boxShadow: viewMode === 'table' ? '0 1px 3px rgba(26,28,30,0.08)' : 'none',
            }}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-sm" style={{ color: '#74777f' }}>
          No projects match your filters.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f3f3f6' }}>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Project</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Status</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>RAG</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Progress</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Budget</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Owner</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Overdue</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9fc' }}
                  className="transition-colors"
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f3f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f9f9fc'; }}
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${p.id}`}
                      className="font-medium transition-colors"
                      style={{ color: '#1a1c1e', fontFamily: 'Inter, sans-serif' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#001736'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#1a1c1e'; }}
                    >
                      {p.name}
                    </Link>
                    <div className="text-xs" style={{ color: '#74777f' }}>{p.code}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="rounded-full">{p.status.replace('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={p.ragStatus === 'RED' ? 'rag-red' : p.ragStatus === 'AMBER' ? 'rag-amber' : 'rag-green'} className="rounded-full">
                      {p.ragStatus}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Progress value={p.percentComplete} className="flex-1" />
                      <span className="text-xs font-medium" style={{ color: '#1a1c1e' }}>{p.percentComplete}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#44474e' }}>
                    <div>{formatCurrency(p.budgetSpent)} / {formatCurrency(p.budgetAllocated)}</div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#74777f' }}>{p.owner}</td>
                  <td className="px-4 py-3">
                    {p.overdueTasks > 0 ? (
                      <span className="font-semibold" style={{ color: '#EF4444' }}>{p.overdueTasks}</span>
                    ) : (
                      <span style={{ color: '#74777f' }}>0</span>
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
