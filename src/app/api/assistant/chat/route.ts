import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ── Assistant System Prompt ───────────────────────────────────────────
const ASSISTANT_SYSTEM_PROMPT = `You are the AI Assistant for JCorp's Digital PMO platform. You help PMO leadership, project managers, and team members get quick answers about their project portfolio.

## Your Capabilities:
1. **Portfolio Overview**: Summarize portfolio health, project statuses, and key metrics.
2. **Project Deep Dive**: Provide detailed information about specific projects including tasks, milestones, risks, and budget.
3. **Task & Resource Queries**: Answer questions about task assignments, workload, and team allocation.
4. **Risk Assessment**: Discuss project and portfolio risks, mitigation strategies, and their potential impact.
5. **Budget Analysis**: Explain budget utilization, forecasts, variances, and spending trends.
6. **Insight Interpretation**: Explain AI-generated insights in plain language and suggest next steps.
7. **Status Reporting**: Help draft or summarize status updates.
8. **Process Guidance**: Advise on PMO best practices and processes.

## Guidelines:
- Be concise but thorough. PMO leaders are busy.
- Use specific numbers and dates when available.
- If you don't have specific data, say so and suggest where to find it.
- Proactively flag related concerns when answering questions.
- Use Malaysian business context where appropriate (JCorp is Johor Corporation).
- Format responses with markdown for readability.
- When referencing projects, include their status and key metrics.`;

// ── Types ─────────────────────────────────────────────────────────────
interface ChatRequestBody {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    currentProjectId?: string;
    currentPage?: string;
  };
}

// ── POST /api/assistant/chat ──────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json(
        { data: null, error: 'Message is required' },
        { status: 400 }
      );
    }

    if (body.message.length > 10000) {
      return NextResponse.json(
        { data: null, error: 'Message must be 10,000 characters or less' },
        { status: 400 }
      );
    }

    // Build context from current portfolio state
    // TODO: Replace with actual Prisma queries
    // const portfolioContext = await buildPortfolioContext(body.context?.currentProjectId);
    const portfolioContext = JSON.stringify({
      portfolioHealth: 68,
      activeProjects: [
        { id: 'proj-001', name: 'Cloud Migration Phase 2', rag: 'AMBER', pctComplete: 62, overdue: 3 },
        { id: 'proj-002', name: 'ERP Integration', rag: 'RED', pctComplete: 35, overdue: 8 },
        { id: 'proj-003', name: 'Customer Portal Redesign', rag: 'GREEN', pctComplete: 78, overdue: 0 },
        { id: 'proj-004', name: 'Data Analytics Platform', rag: 'GREEN', pctComplete: 5, overdue: 0 },
      ],
      totalBudget: { allocated: 5200000, spent: 2305000, forecast: 5530000 },
      criticalAlerts: 2,
      pendingChases: 3,
    });

    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...(body.conversationHistory ?? []),
      {
        role: 'user' as const,
        content: body.message,
      },
    ];

    // TODO: Use real Claude API with streaming
    // const anthropic = new Anthropic();
    // const stream = anthropic.messages.stream({
    //   model: 'claude-sonnet-4-20250514',
    //   max_tokens: 2048,
    //   system: `${ASSISTANT_SYSTEM_PROMPT}\n\n## Current Portfolio Context:\n${portfolioContext}`,
    //   messages,
    // });
    //
    // // For streaming response:
    // const encoder = new TextEncoder();
    // const readableStream = new ReadableStream({
    //   async start(controller) {
    //     for await (const event of stream) {
    //       if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
    //         controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
    //       }
    //     }
    //     controller.enqueue(encoder.encode('data: [DONE]\n\n'));
    //     controller.close();
    //   },
    // });
    //
    // return new Response(readableStream, {
    //   headers: {
    //     'Content-Type': 'text/event-stream',
    //     'Cache-Control': 'no-cache',
    //     'Connection': 'keep-alive',
    //   },
    // });

    // Mock response for development
    const userMessage = body.message.toLowerCase();
    let mockResponse: string;

    if (userMessage.includes('portfolio') || userMessage.includes('overview') || userMessage.includes('summary')) {
      mockResponse = `## Portfolio Overview

Your portfolio currently has **4 projects** with an overall health score of **68/100** (trending slightly down from 71 last week).

### Project Status Summary:
| Project | RAG | Progress | Overdue Tasks |
|---------|-----|----------|---------------|
| Cloud Migration Phase 2 | 🟡 AMBER | 62% | 3 |
| ERP Integration | 🔴 RED | 35% | 8 |
| Customer Portal Redesign | 🟢 GREEN | 78% | 0 |
| Data Analytics Platform | 🟢 GREEN | 5% | 0 |

### Key Concerns:
1. **ERP Integration** is at critical risk with 8 overdue tasks and a budget forecast overrun of $300K
2. **Cloud Migration** has a declining velocity trend that puts the App Layer Migration milestone at risk
3. **3 team members** are over-allocated at 150%+ capacity across projects

### Budget:
- **Allocated**: $5.2M | **Spent**: $2.3M | **Forecast**: $5.5M
- Portfolio forecast exceeds allocation by **6.3%** ($330K)

Would you like me to dive deeper into any specific project or concern?`;
    } else if (userMessage.includes('erp') || userMessage.includes('integration')) {
      mockResponse = `## ERP Integration - Status Deep Dive

**Status**: 🔴 AT RISK | **Progress**: 35% | **Priority**: CRITICAL

### Key Metrics:
- **Budget**: $2.5M allocated, $1.1M spent (44%), forecast $2.8M (+$300K overrun)
- **Tasks**: 76 total, 20 completed, 8 overdue
- **Team Size**: 22 members
- **Days Remaining**: 154

### Critical Issues:
1. **Budget Overrun**: Vendor costs for SAP integration exceeded estimates by 40%. The data migration consultancy line item is the primary driver.
2. **Task Backlog**: 8 overdue tasks concentrated in the data migration and API integration streams.
3. **Velocity Decline**: Team completed 12 story points/sprint vs planned 20 over the last 4 sprints.

### Next Milestone:
- **Data Migration Wave 1** - Due April 11 (12 days away)
- Current readiness: ~60% of prerequisite tasks complete

### AI Recommendations:
- Increase team capacity with 2 additional senior developers
- Descope non-critical integrations to Phase 2
- Initiate daily standup escalation reviews

Would you like me to help draft an escalation email or review the specific overdue tasks?`;
    } else if (userMessage.includes('budget')) {
      mockResponse = `## Portfolio Budget Summary

| Project | Allocated | Spent | Forecast | Variance |
|---------|-----------|-------|----------|----------|
| Cloud Migration | $1.2M | $680K | $1.15M | -$50K (under) |
| ERP Integration | $2.5M | $1.1M | $2.8M | +$300K **(over)** |
| Customer Portal | $600K | $440K | $580K | -$20K (under) |
| Data Analytics | $900K | $25K | $900K | $0 |
| **Total** | **$5.2M** | **$2.3M** | **$5.5M** | **+$330K** |

### Key Findings:
- Portfolio is **6.3% over forecast** primarily driven by ERP Integration
- ERP vendor costs are 40% above original estimates
- Customer Portal and Cloud Migration are within acceptable ranges
- Data Analytics has not ramped up spend yet (in planning phase)

### Recommendations:
1. Initiate portfolio-level budget review with finance committee
2. Evaluate ERP scope reduction to absorb $200K of the overrun
3. Request contingency release for remaining $130K from portfolio reserve

Need more detail on any project's budget breakdown?`;
    } else {
      mockResponse = `I can help you with information about your project portfolio. Here are some things I can assist with:

- **Portfolio overview** and health status
- **Project details** for any specific project
- **Budget analysis** and forecasting
- **Risk assessment** across the portfolio
- **Task and workload** queries
- **Milestone tracking** and timeline analysis
- **AI insight interpretation**

What would you like to know about? You can ask me things like:
- "What's the current portfolio status?"
- "Tell me about the ERP Integration project"
- "What are our biggest risks right now?"
- "Who is over-allocated across projects?"`;
    }

    return NextResponse.json({
      data: {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: mockResponse,
        createdAt: new Date().toISOString(),
        meta: {
          model: 'claude-sonnet-4-20250514',
          tokensUsed: mockResponse.length, // Approximate
          context: body.context ?? null,
        },
      },
    });
  } catch (error) {
    console.error('POST /api/assistant/chat error:', error);
    return NextResponse.json(
      { data: null, error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
