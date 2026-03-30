'use client';

import React, { useState, useCallback } from 'react';
import { Plus, List, Kanban, X, Calendar, Search, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'BLOCKED' | 'IN_REVIEW' | 'COMPLETED';
type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

interface MockTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  assignee: string;
  assigneeInitials: string;
  dueDate: string;
  stagnantDays: number;
}

const COLUMNS: { status: TaskStatus; label: string; statusColor: string }[] = [
  { status: 'TODO', label: 'Todo', statusColor: '#94a3b8' },
  { status: 'IN_PROGRESS', label: 'In Progress', statusColor: '#3B82F6' },
  { status: 'BLOCKED', label: 'Blocked', statusColor: '#EF4444' },
  { status: 'IN_REVIEW', label: 'In Review', statusColor: '#F59E0B' },
  { status: 'COMPLETED', label: 'Completed', statusColor: '#22C55E' },
];

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  CRITICAL: { color: '#EF4444', label: 'Critical' },
  HIGH: { color: '#F97316', label: 'High' },
  MEDIUM: { color: '#EAB308', label: 'Medium' },
  LOW: { color: '#3B82F6', label: 'Low' },
};

const MOCK_TASKS: MockTask[] = [
  { id: 't1', title: 'Setup CI/CD pipeline', status: 'COMPLETED', priority: 'HIGH', assignee: 'Ahmad', assigneeInitials: 'AH', dueDate: '2026-02-15', stagnantDays: 0 },
  { id: 't2', title: 'Design login page UI', status: 'COMPLETED', priority: 'MEDIUM', assignee: 'Siti', assigneeInitials: 'SI', dueDate: '2026-02-20', stagnantDays: 0 },
  { id: 't3', title: 'API endpoint for user management', status: 'COMPLETED', priority: 'HIGH', assignee: 'Lee', assigneeInitials: 'LE', dueDate: '2026-02-28', stagnantDays: 0 },
  { id: 't4', title: 'Database schema review', status: 'IN_REVIEW', priority: 'MEDIUM', assignee: 'Faizal', assigneeInitials: 'FA', dueDate: '2026-03-25', stagnantDays: 3 },
  { id: 't5', title: 'Write unit tests for auth module', status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'Farah', assigneeInitials: 'FR', dueDate: '2026-04-05', stagnantDays: 2 },
  { id: 't6', title: 'Configure monitoring dashboards', status: 'TODO', priority: 'LOW', assignee: 'Tan', assigneeInitials: 'TA', dueDate: '2026-04-20', stagnantDays: 0 },
  { id: 't7', title: 'Implement full-text search', status: 'IN_PROGRESS', priority: 'MEDIUM', assignee: 'Lee', assigneeInitials: 'LE', dueDate: '2026-04-10', stagnantDays: 7 },
  { id: 't8', title: 'Update API documentation', status: 'TODO', priority: 'LOW', assignee: 'Siti', assigneeInitials: 'SI', dueDate: '2026-04-25', stagnantDays: 0 },
  { id: 't9', title: 'Performance load testing', status: 'BLOCKED', priority: 'CRITICAL', assignee: 'Ahmad', assigneeInitials: 'AH', dueDate: '2026-03-28', stagnantDays: 8 },
  { id: 't10', title: 'Security audit preparation', status: 'IN_PROGRESS', priority: 'CRITICAL', assignee: 'Faizal', assigneeInitials: 'FA', dueDate: '2026-04-01', stagnantDays: 1 },
  { id: 't11', title: 'Data migration script', status: 'BLOCKED', priority: 'HIGH', assignee: 'Lee', assigneeInitials: 'LE', dueDate: '2026-03-30', stagnantDays: 6 },
  { id: 't12', title: 'Integration testing with ERP', status: 'IN_REVIEW', priority: 'HIGH', assignee: 'Tan', assigneeInitials: 'TA', dueDate: '2026-04-02', stagnantDays: 4 },
  { id: 't13', title: 'Firewall rule configuration', status: 'BLOCKED', priority: 'MEDIUM', assignee: 'Farah', assigneeInitials: 'FR', dueDate: '2026-03-26', stagnantDays: 10 },
  { id: 't14', title: 'Mobile responsive layout fixes', status: 'TODO', priority: 'MEDIUM', assignee: 'Siti', assigneeInitials: 'SI', dueDate: '2026-04-15', stagnantDays: 0 },
  { id: 't15', title: 'Role-based access control', status: 'IN_PROGRESS', priority: 'HIGH', assignee: 'Ahmad', assigneeInitials: 'AH', dueDate: '2026-04-08', stagnantDays: 0 },
];

export function TasksTab() {
  const [tasks, setTasks] = useState<MockTask[]>(MOCK_TASKS);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [filterPriority, setFilterPriority] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    if (!draggedId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggedId ? { ...t, status: targetStatus } : t))
    );
    setDraggedId(null);
  }, [draggedId]);

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [
      {
        id: `task-new-${Date.now()}`,
        title: newTaskTitle.trim(),
        status: 'TODO',
        priority: 'MEDIUM',
        assignee: 'Unassigned',
        assigneeInitials: 'UA',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
        stagnantDays: 0,
      },
      ...prev,
    ]);
    setNewTaskTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-36">
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-36">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                {COLUMNS.map((c) => (
                  <SelectItem key={c.status} value={c.status}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: '#74777f' }} />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div
            className="flex items-center gap-1 rounded-md p-0.5"
            style={{ backgroundColor: '#f3f3f6' }}
          >
            <button
              onClick={() => setViewMode('kanban')}
              className="p-1.5 rounded transition-colors"
              style={{
                backgroundColor: viewMode === 'kanban' ? '#ffffff' : 'transparent',
                color: viewMode === 'kanban' ? '#1a1c1e' : '#74777f',
                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(26,28,30,0.08)' : 'none',
              }}
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-1.5 rounded transition-colors"
              style={{
                backgroundColor: viewMode === 'list' ? '#ffffff' : 'transparent',
                color: viewMode === 'list' ? '#1a1c1e' : '#74777f',
                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(26,28,30,0.08)' : 'none',
              }}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button size="sm" style={{ backgroundColor: '#001736', color: '#ffffff' }} onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban view */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.status)}
                className="rounded-xl min-h-[200px] flex flex-col"
                style={{ backgroundColor: '#f3f3f6' }}
              >
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: col.statusColor }} />
                    <span className="text-sm font-semibold" style={{ fontFamily: 'Inter, sans-serif', color: '#1a1c1e' }}>{col.label}</span>
                  </div>
                  <span
                    className="text-[10px] font-medium rounded-full px-1.5 py-0.5"
                    style={{ backgroundColor: '#e8e8ea', color: '#44474e' }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Inline add form at top of Todo column */}
                {showAddForm && col.status === 'TODO' && (
                  <div className="px-2 pb-2">
                    <div
                      className="flex flex-col gap-2 p-2 rounded-lg"
                      style={{ backgroundColor: '#ffffff', boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
                    >
                      <Input
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        autoFocus
                        className="h-8 text-sm"
                      />
                      <div className="flex items-center gap-1">
                        <Button size="sm" className="h-7 text-xs" style={{ backgroundColor: '#001736', color: '#ffffff' }} onClick={addTask}>Add</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setShowAddForm(false); setNewTaskTitle(''); }}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[60vh]">
                  {colTasks.map((task) => {
                    const pCfg = priorityConfig[task.priority];
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className="rounded-lg p-3 space-y-2 cursor-grab active:cursor-grabbing transition-shadow"
                        style={{
                          backgroundColor: '#ffffff',
                          boxShadow: '0 1px 3px rgba(26,28,30,0.06)',
                          borderLeft: `3px solid ${pCfg.color}`,
                          opacity: draggedId === task.id ? 0.5 : 1,
                        }}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-sm font-medium leading-tight" style={{ fontFamily: 'Inter, sans-serif', color: '#1a1c1e' }}>{task.title}</span>
                          <span
                            className="text-[10px] font-medium rounded-full px-1.5 py-0.5 shrink-0"
                            style={{ backgroundColor: `${pCfg.color}15`, color: pCfg.color }}
                          >
                            {pCfg.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                              style={{ backgroundColor: '#f3f3f6', color: '#001736' }}
                            >
                              {task.assigneeInitials}
                            </div>
                            <span className="text-xs" style={{ color: '#44474e' }}>{task.assignee}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {task.stagnantDays > 5 && (
                              <span title={`Stagnant ${task.stagnantDays} days`}><Flame className="h-3.5 w-3.5" style={{ color: '#F97316' }} /></span>
                            )}
                            <div className="flex items-center gap-0.5 text-xs" style={{ color: '#74777f' }}>
                              <Calendar className="h-3 w-3" />
                              {task.dueDate.slice(5)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl overflow-hidden" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: '#f3f3f6' }}>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Task</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Status</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Priority</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Assignee</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Due Date</th>
                <th className="text-left px-4 py-3 font-medium" style={{ fontFamily: 'Inter, sans-serif', color: '#44474e' }}>Stagnancy</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, idx) => {
                const pCfg = priorityConfig[task.priority];
                return (
                  <tr
                    key={task.id}
                    style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9f9fc' }}
                    className="transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f3f6'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f9f9fc'; }}
                  >
                    <td className="px-4 py-3 font-medium" style={{ color: '#1a1c1e', fontFamily: 'Inter, sans-serif' }}>{task.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs rounded-full">{task.status.replace(/_/g, ' ')}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2 py-0.5"
                        style={{ backgroundColor: `${pCfg.color}15`, color: pCfg.color }}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pCfg.color }} />
                        {pCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: '#f3f3f6', color: '#001736' }}
                        >
                          {task.assigneeInitials}
                        </div>
                        <span className="text-xs" style={{ color: '#44474e' }}>{task.assignee}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#74777f' }}>{task.dueDate}</td>
                    <td className="px-4 py-3 text-xs">
                      {task.stagnantDays > 5 ? (
                        <span className="flex items-center gap-1 font-medium" style={{ color: '#F97316' }}>
                          <Flame className="h-3.5 w-3.5" />
                          {task.stagnantDays}d
                        </span>
                      ) : task.stagnantDays > 0 ? (
                        <span style={{ color: '#74777f' }}>{task.stagnantDays}d</span>
                      ) : (
                        <span style={{ color: '#74777f' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
