'use client';

import Link from 'next/link';
import { Bot, Eye, Brain, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: Eye,
    title: 'Portfolio Visibility',
    description: 'Real-time dashboards across all projects with RAG status, budget tracking, and milestone monitoring.',
  },
  {
    icon: Brain,
    title: 'AI Gap Analysis',
    description: 'Claude-powered detection of stagnant tasks, budget drift, timeline risks, and resource conflicts.',
  },
  {
    icon: MessageCircle,
    title: 'Proactive Chase',
    description: 'Autonomous stakeholder follow-ups with escalation ladders and intelligent response tracking.',
  },
];

export default function LandingPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#f9f9fc] to-white px-4">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/4 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-[#7c3aed]/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-[#001736]/5 blur-[100px]" />

      {/* Main content */}
      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        {/* Logo & title */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#001736] to-[#002b5b]" style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.12)' }}>
          <Bot className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-heading text-5xl font-bold tracking-tight text-[#001736] sm:text-6xl">
          Digital <span className="bg-gradient-to-r from-[#001736] to-[#7c3aed] bg-clip-text text-transparent">PMO</span>
        </h1>
        <p className="mt-3 text-lg font-medium text-[#7c3aed]">
          AI-Powered Project Management Office
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#44474e]">
          Intelligent portfolio visibility, proactive gap analysis, and autonomous stakeholder engagement
        </p>

        {/* Feature cards */}
        <div className="mt-12 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-xl bg-white p-6 text-left transition-all hover:translate-y-[-2px]"
                style={{ boxShadow: '0 12px 40px rgba(26,28,30,0.06)' }}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#7c3aed]/10">
                  <Icon className="h-5 w-5 text-[#7c3aed]" />
                </div>
                <h3 className="text-sm font-semibold text-[#1a1c1e]">{feature.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[#44474e]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Auth buttons */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#001736] to-[#002b5b] px-8 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ boxShadow: '0 12px 40px rgba(0,23,54,0.15)' }}
          >
            Sign In to Dashboard
          </Link>
          <button
            disabled
            className="inline-flex items-center gap-2 rounded-lg bg-[#f3f3f6] px-8 py-3 text-sm font-medium text-[#74777f] cursor-not-allowed"
          >
            Sign in with Azure AD
            <span className="rounded-full bg-[#e8e8ea] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-[#44474e]">
              Coming Soon
            </span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 text-xs text-[#74777f]">
        Powered by Anthropic Claude
      </div>
    </div>
  );
}
