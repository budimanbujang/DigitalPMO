'use client';

import React, { useState } from 'react';
import { Plus, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
  avatarColor: string;
  assignedTasks: number;
  completedTasks: number;
  overdueTasks: number;
  chaseResponseRate: number;
  workloadPercent: number;
}

const MOCK_MEMBERS: TeamMember[] = [
  {
    id: 'tm1', name: 'Ahmad Razak', initials: 'AR', role: 'Project Manager', email: 'ahmad.r@company.my',
    avatarColor: '#3B82F6', assignedTasks: 8, completedTasks: 5, overdueTasks: 1, chaseResponseRate: 92, workloadPercent: 85,
  },
  {
    id: 'tm2', name: 'Siti Aminah', initials: 'SA', role: 'Lead Developer', email: 'siti.a@company.my',
    avatarColor: 'var(--ai-accent)', assignedTasks: 12, completedTasks: 9, overdueTasks: 0, chaseResponseRate: 98, workloadPercent: 95,
  },
  {
    id: 'tm3', name: 'Faizal Ibrahim', initials: 'FI', role: 'Business Analyst', email: 'faizal.i@company.my',
    avatarColor: '#22C55E', assignedTasks: 6, completedTasks: 4, overdueTasks: 1, chaseResponseRate: 85, workloadPercent: 60,
  },
  {
    id: 'tm4', name: 'Lee Wei Ming', initials: 'LW', role: 'Senior Developer', email: 'lee.wm@company.my',
    avatarColor: '#F59E0B', assignedTasks: 10, completedTasks: 6, overdueTasks: 2, chaseResponseRate: 78, workloadPercent: 100,
  },
  {
    id: 'tm5', name: 'Farah Nadia', initials: 'FN', role: 'QA Engineer', email: 'farah.n@company.my',
    avatarColor: '#EC4899', assignedTasks: 7, completedTasks: 5, overdueTasks: 0, chaseResponseRate: 95, workloadPercent: 70,
  },
  {
    id: 'tm6', name: 'Tan Kai Lun', initials: 'TK', role: 'DevOps Engineer', email: 'tan.kl@company.my',
    avatarColor: '#06B6D4', assignedTasks: 9, completedTasks: 7, overdueTasks: 1, chaseResponseRate: 88, workloadPercent: 80,
  },
];

function workloadColor(pct: number): string {
  if (pct >= 90) return '#EF4444';
  if (pct >= 70) return '#F59E0B';
  return '#22C55E';
}

function workloadLabel(pct: number): string {
  if (pct >= 90) return 'Overloaded';
  if (pct >= 70) return 'High';
  return 'Normal';
}

export function TeamTab() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_MEMBERS);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const addMember = () => {
    if (!newName.trim()) return;
    const initials = newName.trim().split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
    const colors = ['#3B82F6', 'var(--ai-accent)', '#22C55E', '#F59E0B', '#EC4899', '#06B6D4'];
    setMembers((prev) => [
      ...prev,
      {
        id: `tm-new-${Date.now()}`,
        name: newName.trim(),
        initials,
        role: newRole.trim() || 'Team Member',
        email: newEmail.trim() || `${newName.trim().toLowerCase().replace(/\s/g, '.')}@company.my`,
        avatarColor: colors[prev.length % colors.length],
        assignedTasks: 0,
        completedTasks: 0,
        overdueTasks: 0,
        chaseResponseRate: 0,
        workloadPercent: 0,
      },
    ]);
    setNewName('');
    setNewRole('');
    setNewEmail('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--on-surface)' }}>
          Team Members ({members.length})
        </h3>
        <Button size="sm" style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }} onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Member
        </Button>
      </div>

      {showAdd && (
        <div
          className="flex items-center gap-2 p-3 rounded-lg flex-wrap"
          style={{ backgroundColor: 'var(--surface-container-low)' }}
        >
          <Input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-40" autoFocus />
          <Input placeholder="Role" value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-40" />
          <Input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="w-48" onKeyDown={(e) => e.key === 'Enter' && addMember()} />
          <Button size="sm" style={{ backgroundColor: 'var(--primary)', color: '#ffffff' }} onClick={addMember}>Add</Button>
          <Button size="sm" variant="ghost" onClick={() => { setShowAdd(false); setNewName(''); setNewRole(''); setNewEmail(''); }}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => {
          const wlColor = workloadColor(m.workloadPercent);
          return (
            <div
              key={m.id}
              className="rounded-xl p-4 space-y-4 transition-shadow"
              style={{
                backgroundColor: 'var(--surface-container-lowest)',
                boxShadow: '0 12px 40px rgba(26,28,30,0.06)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,28,30,0.10)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,28,30,0.06)'; }}
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                  style={{ backgroundColor: m.avatarColor, color: '#ffffff' }}
                >
                  {m.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--on-surface)' }}>{m.name}</div>
                  <div className="text-xs" style={{ color: 'var(--on-surface-variant)' }}>{m.role}</div>
                  <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: 'var(--outline)' }}>
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{m.email}</span>
                  </div>
                </div>
              </div>

              {/* Workload bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ color: 'var(--on-surface-variant)' }}>Workload</span>
                  <span className="font-medium" style={{ color: wlColor }}>
                    {m.workloadPercent}% - {workloadLabel(m.workloadPercent)}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: 'var(--surface-container-high)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${Math.min(m.workloadPercent, 100)}%`, backgroundColor: wlColor }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2">
                <StatBox label="Assigned" value={m.assignedTasks} />
                <StatBox label="Done" value={m.completedTasks} color="#22C55E" />
                <StatBox label="Overdue" value={m.overdueTasks} color={m.overdueTasks > 0 ? '#EF4444' : undefined} />
                <StatBox label="Chase %" value={`${m.chaseResponseRate}%`} color={m.chaseResponseRate >= 90 ? '#22C55E' : m.chaseResponseRate >= 75 ? '#F59E0B' : '#EF4444'} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div className="text-center">
      <div className="text-base font-bold" style={{ fontFamily: 'Inter, sans-serif', color: color || 'var(--on-surface)' }}>{value}</div>
      <div className="text-[10px]" style={{ color: 'var(--outline)' }}>{label}</div>
    </div>
  );
}
