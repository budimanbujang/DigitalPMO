'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { StepProps } from './wizard-shell'

const MOCK_USERS = [
  { id: 'u1', name: 'Ahmad Razak', email: 'ahmad.razak@gov.my', avatar: 'AR' },
  { id: 'u2', name: 'Siti Nurhaliza', email: 'siti.n@gov.my', avatar: 'SN' },
  { id: 'u3', name: 'Tan Wei Ming', email: 'tan.wm@gov.my', avatar: 'TW' },
  { id: 'u4', name: 'Priya Devi', email: 'priya.d@gov.my', avatar: 'PD' },
  { id: 'u5', name: 'Muhammad Faizal', email: 'mfaizal@gov.my', avatar: 'MF' },
  { id: 'u6', name: 'Lim Kai Wen', email: 'lim.kw@gov.my', avatar: 'LK' },
  { id: 'u7', name: 'Nurul Izzah', email: 'nurul.i@gov.my', avatar: 'NI' },
  { id: 'u8', name: 'Rajesh Kumar', email: 'rajesh.k@gov.my', avatar: 'RK' },
]

const ROLES = ['Lead', 'Developer', 'Analyst', 'Designer', 'Tester', 'Stakeholder']

const ROLE_COLORS: Record<string, string> = {
  Lead: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
  Developer: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  Analyst: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Designer: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
  Tester: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Stakeholder: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
}

export function StepTeam({ formData, setFormData }: StepProps) {
  const [selectedUser, setSelectedUser] = React.useState('')
  const [selectedRole, setSelectedRole] = React.useState('')

  function addTeamMember() {
    if (!selectedUser || !selectedRole) return
    const exists = formData.teamMembers.some(m => m.name === selectedUser && m.role === selectedRole)
    if (exists) return
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { name: selectedUser, role: selectedRole }],
    }))
    setSelectedUser('')
    setSelectedRole('')
  }

  function removeTeamMember(index: number) {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }))
  }

  const userObj = (name: string) => MOCK_USERS.find(u => u.name === name)

  return (
    <div className="space-y-6">
      {/* Project Manager */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Project Manager <span className="text-red-500">*</span>
        </label>
        <Select
          value={formData.projectManager}
          onValueChange={v => setFormData(prev => ({ ...prev, projectManager: v }))}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Select project manager" />
          </SelectTrigger>
          <SelectContent>
            {MOCK_USERS.map(user => (
              <SelectItem key={user.id} value={user.name}>
                <span className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 text-xs font-bold flex items-center justify-center">
                    {user.avatar}
                  </span>
                  {user.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {formData.projectManager && (
          <div className="flex items-center gap-3 p-3 bg-violet-50 dark:bg-violet-900/10 rounded-lg border border-violet-200 dark:border-violet-800/30">
            <div className="h-10 w-10 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-sm">
              {userObj(formData.projectManager)?.avatar || formData.projectManager.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-foreground text-sm">{formData.projectManager}</div>
              <div className="text-xs text-muted-foreground">{userObj(formData.projectManager)?.email || 'Project Manager'}</div>
            </div>
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">
              PM
            </span>
          </div>
        )}
      </div>

      {/* Add Team Members */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Team Members</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_USERS.filter(u => u.name !== formData.projectManager).map(user => (
                  <SelectItem key={user.id} value={user.name}>
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center">
                        {user.avatar}
                      </span>
                      {user.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-40">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={addTeamMember}
            disabled={!selectedUser || !selectedRole}
            size="default"
          >
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add
          </Button>
        </div>
      </div>

      {/* Team Member Cards */}
      {formData.teamMembers.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border-2 border-dashed border-muted-foreground/20 rounded-lg">
          <svg className="h-8 w-8 mx-auto mb-2 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-sm">No team members added yet. Build your project team above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {formData.teamMembers.map((member, index) => {
            const user = userObj(member.name)
            return (
              <Card key={index} className="border-muted-foreground/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {user?.avatar || member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">{member.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{user?.email || ''}</div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${ROLE_COLORS[member.role] || 'bg-muted text-muted-foreground'}`}>
                      {member.role}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTeamMember(index)}
                      className="text-muted-foreground hover:text-red-500 transition-colors shrink-0"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Team Summary */}
      {formData.teamMembers.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Team size: <span className="font-semibold text-foreground">{formData.teamMembers.length + (formData.projectManager ? 1 : 0)}</span>
          {formData.projectManager && <span>(including PM)</span>}
          <span className="mx-1">|</span>
          Roles: {[...new Set(formData.teamMembers.map(m => m.role))].join(', ')}
        </div>
      )}
    </div>
  )
}
