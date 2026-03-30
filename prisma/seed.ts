import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create organization
  const org = await prisma.organization.create({
    data: {
      id: 'org-jcorp',
      name: 'JCorp',
    },
  })

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: { id: 'user-ahmad', email: 'ahmad.razif@jcorp.com', name: 'Ahmad Razif', role: 'PMO_LEAD', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-siti', email: 'siti.nur@jcorp.com', name: 'Siti Nurhaliza', role: 'PROJECT_MANAGER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-farid', email: 'farid.hassan@jcorp.com', name: 'Farid Hassan', role: 'PROJECT_MANAGER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-nurul', email: 'nurul.aisyah@jcorp.com', name: 'Nurul Aisyah', role: 'MEMBER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-hafiz', email: 'hafiz.ibrahim@jcorp.com', name: 'Hafiz Ibrahim', role: 'MEMBER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-meilin', email: 'meilin.tan@jcorp.com', name: 'Mei Lin Tan', role: 'MEMBER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-kavitha', email: 'kavitha.raj@jcorp.com', name: 'Kavitha Rajendran', role: 'MEMBER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-arjun', email: 'arjun.singh@jcorp.com', name: 'Arjun Singh', role: 'STAKEHOLDER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-aishah', email: 'aishah.yusof@jcorp.com', name: 'Aishah Yusof', role: 'PROJECT_MANAGER', organizationId: org.id },
    }),
    prisma.user.create({
      data: { id: 'user-rizal', email: 'rizal.karim@jcorp.com', name: 'Rizal Karim', role: 'MEMBER', organizationId: org.id },
    }),
  ])

  // Create projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        id: 'proj-mydigital',
        name: 'MyDigital Portal',
        description: 'Public-facing digital services portal for citizen engagement and government services.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        organizationId: org.id,
        managerId: 'user-siti',
        startDate: new Date('2026-01-15'),
        targetEndDate: new Date('2026-07-30'),
        tags: 'digital,portal,citizen-services',
      },
    }),
    prisma.project.create({
      data: {
        id: 'proj-erp',
        name: 'JCorp ERP Migration',
        description: 'Migration from legacy ERP system to cloud-based SAP S/4HANA.',
        status: 'AT_RISK',
        priority: 'CRITICAL',
        organizationId: org.id,
        managerId: 'user-farid',
        startDate: new Date('2025-10-01'),
        targetEndDate: new Date('2026-06-30'),
        tags: 'erp,migration,sap,cloud',
      },
    }),
    prisma.project.create({
      data: {
        id: 'proj-smartcity',
        name: 'Iskandar Smart City Hub',
        description: 'IoT-enabled smart city management platform for Iskandar region.',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        organizationId: org.id,
        managerId: 'user-aishah',
        startDate: new Date('2026-02-01'),
        targetEndDate: new Date('2026-12-31'),
        tags: 'iot,smart-city,iskandar',
      },
    }),
    prisma.project.create({
      data: {
        id: 'proj-hr',
        name: 'HR Transformation',
        description: 'End-to-end HR process digitization and talent management system implementation.',
        status: 'DELAYED',
        priority: 'MEDIUM',
        organizationId: org.id,
        managerId: 'user-siti',
        startDate: new Date('2025-11-01'),
        targetEndDate: new Date('2026-05-31'),
        tags: 'hr,transformation,talent',
      },
    }),
    prisma.project.create({
      data: {
        id: 'proj-cyber',
        name: 'Cybersecurity Uplift',
        description: 'Enterprise-wide cybersecurity enhancement including SOC setup and zero-trust architecture.',
        status: 'IN_PROGRESS',
        priority: 'CRITICAL',
        organizationId: org.id,
        managerId: 'user-farid',
        startDate: new Date('2026-01-01'),
        targetEndDate: new Date('2026-09-30'),
        tags: 'security,soc,zero-trust',
      },
    }),
    prisma.project.create({
      data: {
        id: 'proj-datalake',
        name: 'Data Lake Initiative',
        description: 'Centralized data lake for enterprise analytics and AI/ML workloads.',
        status: 'COMPLETED',
        priority: 'MEDIUM',
        organizationId: org.id,
        managerId: 'user-aishah',
        startDate: new Date('2025-06-01'),
        targetEndDate: new Date('2026-02-28'),
        actualEndDate: new Date('2026-03-05'),
        tags: 'data,analytics,ai,ml',
      },
    }),
  ])

  // Create budgets
  for (const proj of projects) {
    const budgetAmounts: Record<string, { allocated: number; spent: number; forecast: number }> = {
      'proj-mydigital': { allocated: 2500000, spent: 1200000, forecast: 2400000 },
      'proj-erp': { allocated: 8500000, spent: 6800000, forecast: 9200000 },
      'proj-smartcity': { allocated: 5000000, spent: 1500000, forecast: 4800000 },
      'proj-hr': { allocated: 1800000, spent: 1400000, forecast: 2100000 },
      'proj-cyber': { allocated: 3500000, spent: 1200000, forecast: 3400000 },
      'proj-datalake': { allocated: 2000000, spent: 1950000, forecast: 1950000 },
    }
    const b = budgetAmounts[proj.id]!
    await prisma.budget.create({
      data: {
        projectId: proj.id,
        allocatedAmount: b.allocated,
        spentAmount: b.spent,
        forecastAmount: b.forecast,
        currency: 'MYR',
        lineItems: {
          create: [
            { category: 'Personnel', description: 'Team salaries and contractors', planned: b.allocated * 0.4, actual: b.spent * 0.42 },
            { category: 'Infrastructure', description: 'Cloud hosting and hardware', planned: b.allocated * 0.2, actual: b.spent * 0.18 },
            { category: 'Software Licenses', description: 'Third-party software', planned: b.allocated * 0.15, actual: b.spent * 0.16 },
            { category: 'Consulting', description: 'External consultants', planned: b.allocated * 0.12, actual: b.spent * 0.14 },
            { category: 'Training', description: 'Team training and certifications', planned: b.allocated * 0.05, actual: b.spent * 0.04 },
            { category: 'Contingency', description: 'Risk contingency buffer', planned: b.allocated * 0.08, actual: b.spent * 0.06 },
          ],
        },
      },
    })
  }

  // Create milestones for MyDigital Portal
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        id: 'ms-1', projectId: 'proj-mydigital', name: 'Requirements & Design',
        description: 'Complete requirements gathering and UI/UX design', dueDate: new Date('2026-02-28'),
        completedDate: new Date('2026-03-02'), status: 'COMPLETED',
        deliverables: { create: [
          { name: 'Requirements Document', status: 'COMPLETED', dueDate: new Date('2026-02-15') },
          { name: 'UI/UX Wireframes', status: 'COMPLETED', dueDate: new Date('2026-02-28') },
          { name: 'Technical Architecture Document', status: 'COMPLETED', dueDate: new Date('2026-02-25') },
        ]},
      },
    }),
    prisma.milestone.create({
      data: {
        id: 'ms-2', projectId: 'proj-mydigital', name: 'Development Sprint 1',
        description: 'Core platform and authentication modules', dueDate: new Date('2026-04-15'),
        status: 'IN_PROGRESS',
        deliverables: { create: [
          { name: 'Authentication Module', status: 'COMPLETED', dueDate: new Date('2026-03-20') },
          { name: 'Core Platform API', status: 'IN_PROGRESS', dueDate: new Date('2026-04-05') },
          { name: 'Admin Dashboard', status: 'TODO', dueDate: new Date('2026-04-15') },
        ]},
      },
    }),
    prisma.milestone.create({
      data: {
        id: 'ms-3', projectId: 'proj-mydigital', name: 'System Integration',
        description: 'Integration with external systems and APIs', dueDate: new Date('2026-05-30'),
        status: 'NOT_STARTED',
        deliverables: { create: [
          { name: 'API Integration Tests', status: 'TODO', dueDate: new Date('2026-05-15') },
          { name: 'External System Connectors', status: 'TODO', dueDate: new Date('2026-05-25') },
          { name: 'Integration Test Report', status: 'TODO', dueDate: new Date('2026-05-30') },
        ]},
      },
    }),
    prisma.milestone.create({
      data: {
        id: 'ms-4', projectId: 'proj-mydigital', name: 'UAT & Go-Live',
        description: 'User acceptance testing and production deployment', dueDate: new Date('2026-07-30'),
        status: 'NOT_STARTED',
        deliverables: { create: [
          { name: 'UAT Test Scripts', status: 'TODO', dueDate: new Date('2026-06-30') },
          { name: 'User Training Material', status: 'TODO', dueDate: new Date('2026-07-15') },
          { name: 'Go-Live Checklist', status: 'TODO', dueDate: new Date('2026-07-25') },
          { name: 'Production Deployment', status: 'TODO', dueDate: new Date('2026-07-30') },
        ]},
      },
    }),
  ])

  // Create tasks for MyDigital Portal
  const taskData = [
    { title: 'Set up CI/CD pipeline', status: 'COMPLETED' as const, priority: 'HIGH' as const, milestoneId: 'ms-1', dueDate: '2026-02-10', assignee: 'user-hafiz' },
    { title: 'Design database schema', status: 'COMPLETED' as const, priority: 'HIGH' as const, milestoneId: 'ms-1', dueDate: '2026-02-20', assignee: 'user-meilin' },
    { title: 'Implement OAuth2 authentication', status: 'COMPLETED' as const, priority: 'CRITICAL' as const, milestoneId: 'ms-2', dueDate: '2026-03-15', assignee: 'user-siti' },
    { title: 'Build user registration flow', status: 'COMPLETED' as const, priority: 'HIGH' as const, milestoneId: 'ms-2', dueDate: '2026-03-20', assignee: 'user-nurul' },
    { title: 'Develop REST API endpoints', status: 'IN_PROGRESS' as const, priority: 'HIGH' as const, milestoneId: 'ms-2', dueDate: '2026-04-01', assignee: 'user-siti' },
    { title: 'Frontend component library', status: 'IN_PROGRESS' as const, priority: 'MEDIUM' as const, milestoneId: 'ms-2', dueDate: '2026-04-05', assignee: 'user-nurul' },
    { title: 'API Integration Testing', status: 'IN_PROGRESS' as const, priority: 'HIGH' as const, milestoneId: 'ms-3', dueDate: '2026-03-25', assignee: 'user-siti', stagnant: 12 },
    { title: 'Admin dashboard layout', status: 'TODO' as const, priority: 'MEDIUM' as const, milestoneId: 'ms-2', dueDate: '2026-04-10', assignee: 'user-nurul' },
    { title: 'Payment gateway integration', status: 'TODO' as const, priority: 'CRITICAL' as const, milestoneId: 'ms-3', dueDate: '2026-05-10', assignee: 'user-hafiz' },
    { title: 'Performance load testing', status: 'BLOCKED' as const, priority: 'HIGH' as const, milestoneId: 'ms-3', dueDate: '2026-05-20', assignee: 'user-hafiz' },
    { title: 'Security audit preparation', status: 'TODO' as const, priority: 'CRITICAL' as const, milestoneId: 'ms-4', dueDate: '2026-06-15', assignee: 'user-kavitha' },
    { title: 'Write UAT test scripts', status: 'TODO' as const, priority: 'HIGH' as const, milestoneId: 'ms-4', dueDate: '2026-06-30', assignee: 'user-hafiz' },
    { title: 'Prepare user training materials', status: 'TODO' as const, priority: 'MEDIUM' as const, milestoneId: 'ms-4', dueDate: '2026-07-15', assignee: 'user-kavitha' },
    { title: 'Data migration scripts', status: 'IN_REVIEW' as const, priority: 'HIGH' as const, milestoneId: 'ms-3', dueDate: '2026-04-20', assignee: 'user-meilin' },
    { title: 'Mobile responsive design', status: 'IN_PROGRESS' as const, priority: 'MEDIUM' as const, milestoneId: 'ms-2', dueDate: '2026-04-08', assignee: 'user-nurul' },
  ]

  for (const t of taskData) {
    const stagnantDays = (t as any).stagnant || 0
    const lastActivity = stagnantDays > 0 ? new Date(Date.now() - stagnantDays * 24 * 60 * 60 * 1000) : new Date()
    await prisma.task.create({
      data: {
        projectId: 'proj-mydigital',
        milestoneId: t.milestoneId,
        title: t.title,
        status: t.status,
        priority: t.priority,
        dueDate: new Date(t.dueDate),
        completedDate: t.status === 'COMPLETED' ? new Date(t.dueDate) : undefined,
        stagnantDays,
        lastActivityAt: lastActivity,
        estimatedHours: Math.floor(Math.random() * 40) + 8,
        assignments: { create: { userId: t.assignee, role: 'assignee' } },
      },
    })
  }

  // Create risks
  await Promise.all([
    prisma.risk.create({ data: { projectId: 'proj-mydigital', title: 'Third-party API rate limiting', description: 'External payment gateway may impose rate limits affecting peak usage', likelihood: 'MEDIUM', impact: 'HIGH', status: 'OPEN', mitigation: 'Implement caching layer and request queuing', owner: 'Siti Nurhaliza' } }),
    prisma.risk.create({ data: { projectId: 'proj-mydigital', title: 'Data migration data loss', description: 'Risk of data corruption during legacy system migration', likelihood: 'LOW', impact: 'CRITICAL', status: 'MITIGATING', mitigation: 'Implement full backup and rollback procedures', owner: 'Mei Lin Tan' } }),
    prisma.risk.create({ data: { projectId: 'proj-mydigital', title: 'Key developer availability', description: 'Lead developer may be pulled to ERP project', likelihood: 'HIGH', impact: 'HIGH', status: 'OPEN', owner: 'Ahmad Razif', aiGenerated: true } }),
    prisma.risk.create({ data: { projectId: 'proj-erp', title: 'SAP license cost overrun', description: 'License costs may exceed initial estimates due to additional modules', likelihood: 'HIGH', impact: 'CRITICAL', status: 'OPEN', mitigation: 'Negotiate enterprise license agreement', owner: 'Farid Hassan' } }),
    prisma.risk.create({ data: { projectId: 'proj-erp', title: 'Legacy data quality issues', description: 'Legacy ERP data may have inconsistencies affecting migration', likelihood: 'HIGH', impact: 'HIGH', status: 'MITIGATING', mitigation: 'Running data quality audit and cleansing scripts', owner: 'Mei Lin Tan', aiGenerated: true } }),
    prisma.risk.create({ data: { projectId: 'proj-cyber', title: 'Zero-day vulnerability during transition', description: 'New security architecture may have exposure window during transition', likelihood: 'LOW', impact: 'CRITICAL', status: 'OPEN', mitigation: 'Maintain dual security layers during transition', owner: 'Farid Hassan' } }),
  ])

  // Create AI insights
  await Promise.all([
    prisma.aIInsight.create({ data: { projectId: 'proj-erp', type: 'BUDGET_DRIFT', severity: 'CRITICAL', title: 'ERP Migration budget projected to exceed allocation by 8.2%', summary: 'Current burn rate of RM 1.13M/month against RM 944K planned. Consulting costs 23% over plan due to extended vendor engagement.', details: 'At current trajectory, final spend will be RM 9.2M against RM 8.5M allocated. Primary driver is consulting line item.', recommendations: JSON.stringify(['Negotiate fixed-price arrangement with SAP consulting partner', 'Review scope for Phase 2 deferral opportunities', 'Request RM 700K budget augmentation from steering committee']) } }),
    prisma.aIInsight.create({ data: { projectId: 'proj-mydigital', type: 'STAGNANT_TASK', severity: 'HIGH', title: 'API Integration Testing stagnant for 12 days', summary: 'Task assigned to Siti Nurhaliza has no activity since 18 Mar. This blocks Milestone 3 (System Integration) due 30 May.', details: 'No commits, comments, or status updates detected. Task is on the critical path.', recommendations: JSON.stringify(['Contact Siti to identify blockers', 'Consider adding Hafiz as backup resource', 'Evaluate parallel testing approach']) } }),
    prisma.aIInsight.create({ data: { projectId: 'proj-hr', type: 'TIMELINE_RISK', severity: 'HIGH', title: 'HR Transformation likely to miss May deadline by 3-4 weeks', summary: 'Only 52% of tasks complete with 62 days remaining. Velocity has dropped 30% in last 2 sprints.', details: 'Team is split across HR and ERP projects. Resource contention is the primary cause of velocity drop.', recommendations: JSON.stringify(['Dedicate Nurul full-time to HR project for next 4 weeks', 'Consider scope reduction for Phase 1', 'Engage PMO Lead for resource arbitration']) } }),
    prisma.aIInsight.create({ data: { type: 'PORTFOLIO_HEALTH', severity: 'MEDIUM', title: 'Portfolio health score declined from 78 to 72 this week', summary: '2 projects moved to at-risk status. Budget utilization across portfolio is at 68% with 55% of timeline elapsed.', details: 'Key drivers: ERP budget drift, HR timeline delay, and resource conflicts affecting MyDigital and Cybersecurity projects.', recommendations: JSON.stringify(['Schedule portfolio review meeting this week', 'Address ERP budget issue as priority', 'Resolve resource conflicts between projects']), isPortfolioLevel: true } }),
    prisma.aIInsight.create({ data: { projectId: 'proj-mydigital', type: 'GAP_ANALYSIS', severity: 'LOW', title: 'No rollback plan documented for MyDigital go-live', summary: 'Standard deployment practice includes rollback procedures. None found in UAT & Go-Live milestone deliverables.', details: 'Recommend adding rollback plan, data recovery procedure, and communication template.', recommendations: JSON.stringify(['Add Rollback Plan deliverable to Go-Live milestone', 'Assign to infrastructure lead', 'Review with operations team']) } }),
    prisma.aIInsight.create({ data: { projectId: 'proj-cyber', type: 'MILESTONE_AT_RISK', severity: 'MEDIUM', title: 'Cybersecurity SOC setup milestone may slip by 1 week', summary: 'Hardware procurement delayed by vendor. SOC tooling installation dependent on hardware delivery.', details: 'Vendor confirmed delivery by 15 Apr (original: 8 Apr). Downstream tasks need rescheduling.', recommendations: JSON.stringify(['Update timeline for SOC setup tasks', 'Explore temporary cloud-based SOC while hardware arrives', 'Escalate to vendor account manager']) } }),
  ])

  // Create notifications
  await Promise.all([
    prisma.notification.create({ data: { userId: 'user-ahmad', type: 'MILESTONE_AT_RISK', title: 'Milestone at risk: System Integration', message: 'MyDigital Portal Milestone 3 has incomplete dependencies with 61 days remaining', channel: 'in_app,email', actionUrl: '/projects/proj-mydigital' } }),
    prisma.notification.create({ data: { userId: 'user-siti', type: 'TASK_OVERDUE', title: 'Task overdue: API Integration Testing', message: 'This task is 5 days overdue and blocking downstream work', channel: 'in_app,email', actionUrl: '/projects/proj-mydigital' } }),
    prisma.notification.create({ data: { userId: 'user-ahmad', type: 'BUDGET_ALERT', title: 'Budget warning: JCorp ERP Migration', message: 'Budget utilization at 80%. Projected to exceed allocation.', channel: 'in_app,email,slack', actionUrl: '/projects/proj-erp' } }),
    prisma.notification.create({ data: { userId: 'user-ahmad', type: 'AI_INSIGHT', title: 'New AI insight: Portfolio health declined', message: 'Portfolio health score dropped from 78 to 72. 2 projects moved to at-risk.', channel: 'in_app', actionUrl: '/dashboard/insights' } }),
    prisma.notification.create({ data: { userId: 'user-farid', type: 'CHASE_REQUEST', title: 'Follow-up: ERP data migration status', message: 'PMO Agent requesting update on data migration progress', channel: 'in_app,email', actionUrl: '/projects/proj-erp' } }),
  ])

  // Create status updates
  await Promise.all([
    prisma.statusUpdate.create({ data: { projectId: 'proj-mydigital', authorId: 'user-siti', content: 'Sprint 2 in progress. Authentication module completed. API development on track. One task (API Integration Testing) needs attention due to stagnation.', ragStatus: 'AMBER' } }),
    prisma.statusUpdate.create({ data: { projectId: 'proj-erp', authorId: 'user-farid', content: 'Data migration phase facing challenges. Budget running ahead of plan due to extended consulting engagement. Escalated to PMO Lead.', ragStatus: 'RED' } }),
    prisma.statusUpdate.create({ data: { projectId: 'proj-smartcity', authorId: 'user-aishah', content: 'IoT sensor procurement completed. Platform development progressing well. On track for Q2 milestones.', ragStatus: 'GREEN' } }),
  ])

  // Create dependencies
  await prisma.dependency.create({
    data: { dependentProjectId: 'proj-mydigital', dependencyProjectId: 'proj-cyber', description: 'MyDigital Portal security requirements depend on Cybersecurity architecture decisions', isCritical: false },
  })
  await prisma.dependency.create({
    data: { dependentProjectId: 'proj-smartcity', dependencyProjectId: 'proj-datalake', description: 'Smart City data pipeline depends on Data Lake infrastructure', isCritical: true },
  })

  console.log('Seed completed successfully!')
  console.log(`Created: 1 org, ${users.length} users, ${projects.length} projects, ${milestones.length} milestones, ${taskData.length} tasks`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
