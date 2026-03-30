'use client';

import React, { useState } from 'react';
import {
  Plus, Download, Eye, FileText, FileSpreadsheet, FileImage,
  Presentation, File,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

type DocType = 'PDF' | 'DOC' | 'XLS' | 'PPT' | 'IMG';

interface Document {
  id: string;
  name: string;
  type: DocType;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  milestone: string;
}

const typeIcon: Record<DocType, { icon: React.ElementType; color: string }> = {
  PDF: { icon: FileText, color: 'text-red-500 bg-red-500/10' },
  DOC: { icon: FileText, color: 'text-blue-500 bg-blue-500/10' },
  XLS: { icon: FileSpreadsheet, color: 'text-green-500 bg-green-500/10' },
  PPT: { icon: Presentation, color: 'text-orange-500 bg-orange-500/10' },
  IMG: { icon: FileImage, color: 'text-violet-500 bg-violet-500/10' },
};

const MILESTONES = [
  'All Milestones',
  'Project Kickoff & Planning',
  'Requirements & Design',
  'Core Development Sprint',
  'User Acceptance Testing',
  'Production Deployment & Go-Live',
];

const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'doc1', name: 'Project Charter v2.3.pdf', type: 'PDF', size: '1.2 MB',
    uploadedBy: 'Ahmad', uploadDate: '2026-01-10', milestone: 'Project Kickoff & Planning',
  },
  {
    id: 'doc2', name: 'Stakeholder Analysis.docx', type: 'DOC', size: '458 KB',
    uploadedBy: 'Siti', uploadDate: '2026-01-12', milestone: 'Project Kickoff & Planning',
  },
  {
    id: 'doc3', name: 'Business Requirements Document.pdf', type: 'PDF', size: '3.4 MB',
    uploadedBy: 'Faizal', uploadDate: '2026-02-05', milestone: 'Requirements & Design',
  },
  {
    id: 'doc4', name: 'Technical Architecture Diagram.png', type: 'IMG', size: '2.1 MB',
    uploadedBy: 'Lee', uploadDate: '2026-02-15', milestone: 'Requirements & Design',
  },
  {
    id: 'doc5', name: 'Budget Tracking Sheet Q1.xlsx', type: 'XLS', size: '892 KB',
    uploadedBy: 'Ahmad', uploadDate: '2026-03-01', milestone: 'Core Development Sprint',
  },
  {
    id: 'doc6', name: 'Sprint Review Presentation.pptx', type: 'PPT', size: '5.6 MB',
    uploadedBy: 'Siti', uploadDate: '2026-03-15', milestone: 'Core Development Sprint',
  },
  {
    id: 'doc7', name: 'UAT Test Plan v1.0.pdf', type: 'PDF', size: '1.8 MB',
    uploadedBy: 'Farah', uploadDate: '2026-03-20', milestone: 'User Acceptance Testing',
  },
  {
    id: 'doc8', name: 'Risk Register Export.xlsx', type: 'XLS', size: '340 KB',
    uploadedBy: 'Tan', uploadDate: '2026-03-25', milestone: 'Core Development Sprint',
  },
];

export function DocumentsTab() {
  const [milestoneFilter, setMilestoneFilter] = useState('All Milestones');

  const filteredDocs = milestoneFilter === 'All Milestones'
    ? MOCK_DOCUMENTS
    : MOCK_DOCUMENTS.filter((d) => d.milestone === milestoneFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="w-64">
          <Select value={milestoneFilter} onValueChange={setMilestoneFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by milestone" /></SelectTrigger>
            <SelectContent>
              {MILESTONES.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Upload Document
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Size</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Uploaded By</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Milestone</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => {
              const tIcon = typeIcon[doc.type];
              const IconComp = tIcon.icon;
              return (
                <tr key={doc.id} className="border-b border-border last:border-b-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', tIcon.color)}>
                        <IconComp className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-foreground truncate">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-[10px]">{doc.type}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{doc.size}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{doc.uploadedBy}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{doc.uploadDate}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground truncate block max-w-[160px]">{doc.milestone}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredDocs.length === 0 && (
          <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
            <File className="h-5 w-5 mr-2" />
            No documents found for this milestone.
          </div>
        )}
      </div>
    </div>
  );
}
