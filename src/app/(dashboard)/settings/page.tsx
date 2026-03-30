'use client';

import React, { useState } from 'react';
import { User, Bell, Bot, ShieldAlert, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotifPref {
  label: string;
  email: boolean;
  slack: boolean;
  inApp: boolean;
}

const defaultNotifPrefs: NotifPref[] = [
  { label: 'Task Overdue', email: true, slack: false, inApp: true },
  { label: 'Milestone at Risk', email: true, slack: true, inApp: true },
  { label: 'Budget Alert', email: true, slack: true, inApp: true },
  { label: 'Chase Request', email: false, slack: false, inApp: true },
  { label: 'AI Insight', email: false, slack: false, inApp: true },
  { label: 'Status Update Due', email: true, slack: false, inApp: true },
  { label: 'Escalation', email: true, slack: true, inApp: true },
];

const defaultAlertRules = [
  { id: 'r1', name: 'Task overdue > 3 days', enabled: true },
  { id: 'r2', name: 'Budget utilization > 90%', enabled: true },
  { id: 'r3', name: 'Milestone at risk (< 7 days)', enabled: true },
  { id: 'r4', name: 'Task stagnant > 5 days', enabled: true },
  { id: 'r5', name: 'Critical risk count > 3', enabled: false },
  { id: 'r6', name: 'Project RAG turns RED', enabled: true },
  { id: 'r7', name: 'Missing status update > 7 days', enabled: true },
  { id: 'r8', name: 'Resource over-allocation > 90%', enabled: false },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
        checked ? 'bg-[#001736]' : 'bg-[#e8e8ea]'
      )}
    >
      <span
        className={cn(
          'inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform',
          checked ? 'translate-x-[18px]' : 'translate-x-[3px]'
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState({ name: 'Ahmad Faizal bin Razak', email: 'ahmad.faizal@digitalpmo.gov.my', role: 'PMO Lead' });
  const [notifPrefs, setNotifPrefs] = useState(defaultNotifPrefs);
  const [agentConfig, setAgentConfig] = useState({ stagnantDays: 5, budgetDriftPct: 10, chaseTimingDays: 3 });
  const [alertRules, setAlertRules] = useState(defaultAlertRules);
  const [saved, setSaved] = useState<string | null>(null);

  const handleSave = (section: string) => {
    setSaved(section);
    setTimeout(() => setSaved(null), 2000);
  };

  const updateNotifPref = (index: number, channel: 'email' | 'slack' | 'inApp', value: boolean) => {
    setNotifPrefs((prev) => prev.map((p, i) => (i === index ? { ...p, [channel]: value } : p)));
  };

  const toggleAlertRule = (id: string) => {
    setAlertRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold tracking-tight text-[#1a1c1e]">Settings</h1>
        <p className="mt-1 text-sm text-[#44474e]">Manage your profile, notifications, and agent configuration</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl bg-white p-6" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}>
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-[#001736]" />
          <h2 className="text-lg font-semibold text-[#1a1c1e]">Profile</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#74777f]">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] focus:outline-none focus:ring-1 focus:ring-[#001736]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#74777f]">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] focus:outline-none focus:ring-1 focus:ring-[#001736]/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#74777f]">Role</label>
            <input
              type="text"
              value={profile.role}
              disabled
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#74777f]"
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {saved === 'profile' && <span className="text-xs text-green-600">Saved!</span>}
          <button onClick={() => handleSave('profile')} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#001736] to-[#002b5b] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Save className="h-4 w-4" /> Save Profile
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-xl bg-white p-6" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}>
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#001736]" />
          <h2 className="text-lg font-semibold text-[#1a1c1e]">Notification Preferences</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[#74777f]">Type</th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#74777f]">Email</th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#74777f]">Slack</th>
                <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-[#74777f]">In-App</th>
              </tr>
            </thead>
            <tbody>
              {notifPrefs.map((pref, i) => (
                <tr key={pref.label} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f9f9fc]'}>
                  <td className="py-3 text-sm text-[#1a1c1e]">{pref.label}</td>
                  <td className="py-3 text-center"><Toggle checked={pref.email} onChange={(v) => updateNotifPref(i, 'email', v)} /></td>
                  <td className="py-3 text-center"><Toggle checked={pref.slack} onChange={(v) => updateNotifPref(i, 'slack', v)} /></td>
                  <td className="py-3 text-center"><Toggle checked={pref.inApp} onChange={(v) => updateNotifPref(i, 'inApp', v)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {saved === 'notifications' && <span className="text-xs text-green-600">Saved!</span>}
          <button onClick={() => handleSave('notifications')} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#001736] to-[#002b5b] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Save className="h-4 w-4" /> Save Notifications
          </button>
        </div>
      </div>

      {/* Agent Configuration */}
      <div className="rounded-xl bg-white p-6" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}>
        <div className="mb-4 flex items-center gap-2">
          <Bot className="h-5 w-5 text-[#7c3aed]" />
          <h2 className="text-lg font-semibold text-[#1a1c1e]">Agent Configuration</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#74777f]">Stagnant Task Threshold (days)</label>
            <input
              type="number"
              min={1}
              max={30}
              value={agentConfig.stagnantDays}
              onChange={(e) => setAgentConfig({ ...agentConfig, stagnantDays: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] focus:outline-none focus:ring-1 focus:ring-[#001736]/30"
            />
            <p className="mt-1 text-[11px] text-[#74777f]">Flag tasks with no activity for this many days</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#74777f]">Budget Drift Alert (%)</label>
            <input
              type="number"
              min={1}
              max={50}
              value={agentConfig.budgetDriftPct}
              onChange={(e) => setAgentConfig({ ...agentConfig, budgetDriftPct: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] focus:outline-none focus:ring-1 focus:ring-[#001736]/30"
            />
            <p className="mt-1 text-[11px] text-[#74777f]">Alert when forecast exceeds budget by this %</p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#74777f]">Chase Timing (days after due)</label>
            <input
              type="number"
              min={1}
              max={14}
              value={agentConfig.chaseTimingDays}
              onChange={(e) => setAgentConfig({ ...agentConfig, chaseTimingDays: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg bg-[#f3f3f6] border-0 px-3 py-2 text-sm text-[#1a1c1e] focus:outline-none focus:ring-1 focus:ring-[#001736]/30"
            />
            <p className="mt-1 text-[11px] text-[#74777f]">Send first chase message this many days after due date</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {saved === 'agent' && <span className="text-xs text-green-600">Saved!</span>}
          <button onClick={() => handleSave('agent')} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#001736] to-[#002b5b] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Save className="h-4 w-4" /> Save Agent Config
          </button>
        </div>
      </div>

      {/* Alert Rules */}
      <div className="rounded-xl bg-white p-6" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}>
        <div className="mb-4 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-500" />
          <h2 className="text-lg font-semibold text-[#1a1c1e]">Alert Rules</h2>
        </div>
        <div className="space-y-3">
          {alertRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between rounded-lg bg-[#f3f3f6] px-4 py-3">
              <span className={cn('text-sm', rule.enabled ? 'text-[#1a1c1e]' : 'text-[#74777f]')}>{rule.name}</span>
              <Toggle checked={rule.enabled} onChange={() => toggleAlertRule(rule.id)} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-end gap-3">
          {saved === 'alerts' && <span className="text-xs text-green-600">Saved!</span>}
          <button onClick={() => handleSave('alerts')} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#001736] to-[#002b5b] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            <Save className="h-4 w-4" /> Save Alert Rules
          </button>
        </div>
      </div>
    </div>
  );
}
