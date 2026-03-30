'use client';

import React, { useState, useCallback } from 'react';
import { Plus, List, Kanban, X, Calendar, Search, Flame } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

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

const COLUMNS: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'TODO', label: 'Todo', color: 'border-t-slate-400' },
  { status: 'IN_PROGRESS', label: 'In Progress', color: 'border-t-blue-500' },
  { status: 'BLOCKED', label: 'Blocked', color: 'border-t-red-500' },
  { status: 'IN_REVIEW', label: 'In Review', color: 'border-t-amber-500' },
  { status: 'COMPLETED', label: 'Completed', color: 'border-t-green-500' },
];

const priorityDot: Record<Priority, string> = {
  CRITICAL: 'bg-red-500',
  HIGH: 'bg-orange-500',
  MEDIUM: 'bg-yellow-500',
  LOW: 'bg-blue-500',
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
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn('p-1.5 rounded', viewMode === 'kanban' ? 'bg-secondary text-foreground' : 'text-muted-foreground')}
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn('p-1.5 rounded', viewMode === 'list' ? 'bg-secondary text-foreground' : 'text-muted-foreground')}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button size="sm" onClick={() => setShowAddForm(true)}>
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
                className={cn('rounded-xl border border-border bg-muted/30 min-h-[200px] flex flex-col border-t-4', col.color)}
              >
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{col.label}</span>
                  <Badge variant="secondary" className="text-[10px]">{colTasks.length}</Badge>
                </div>

                {/* Inline add form at top of Todo column */}
                {showAddForm && col.status === 'TODO' && (
                  <div className="px-2 pb-2">
                    <div className="flex flex-col gap-2 p-2 rounded-lg border border-primary/30 bg-primary/5">
                      <Input
                        placeholder="Task title..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        autoFocus
                        className="h-8 text-sm"
                      />
                      <div className="flex items-center gap-1">
                        <Button size="sm" className="h-7 text-xs" onClick={addTask}>Add</Button>
                        <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setShowAddForm(false); setNewTaskTitle(''); }}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[60vh]">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={cn(
                        'rounded-lg border bg-card p-3 space-y-2 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors',
                        draggedId === task.id ? 'opacity-50' : '',
                        'border-border'
                      )}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-sm font-medium text-foreground leading-tight">{task.title}</span>
                        <div className={cn('h-2.5 w-2.5 rounded-full shrink-0 mt-1', priorityDot[task.priority])} title={task.priority} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                            {task.assigneeInitials}
                          </div>
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {task.stagnantDays > 5 && (
                            <span title={`Stagnant ${task.stagnantDays} days`}><Flame className="h-3.5 w-3.5 text-orange-500" /></span>
                          )}
                          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {task.dueDate.slice(5)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List view */
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Task</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Assignee</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stagnancy</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <tr key={task.id} className="border-b border-border hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{task.title}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">{task.status.replace(/_/g, ' ')}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={cn('h-2.5 w-2.5 rounded-full', priorityDot[task.priority])} />
                      <span className="text-xs">{task.priority}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                        {task.assigneeInitials}
                      </div>
                      <span className="text-xs">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{task.dueDate}</td>
                  <td className="px-4 py-3 text-xs">
                    {task.stagnantDays > 5 ? (
                      <span className="flex items-center gap-1 text-orange-500 font-medium">
                        <Flame className="h-3.5 w-3.5" />
                        {task.stagnantDays}d
                      </span>
                    ) : task.stagnantDays > 0 ? (
                      <span className="text-muted-foreground">{task.stagnantDays}d</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
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
