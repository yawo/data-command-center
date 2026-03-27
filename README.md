# Data Strategy Command Center

## Overview

A comprehensive enterprise dashboard application for managing McKinsey-style data strategy engagements. Built as a Zo Space application with React frontend and Hono API routes.

## Architecture

- **Frontend**: React with Tailwind CSS (dark theme)
- **Backend**: Hono API routes (Bun runtime)
- **Hosting**: Zo Space (auto-deployed, HTTPS)

## Application Structure

```
https://hotep.zo.space/
├── /                    - Main dashboard (metrics, maturity, risks, workstream progress)
├── /explorer            - Data explorer (all 46 datasets across 10 workstreams)
├── /stakeholders        - Stakeholder registry and interview tracking
├── /roadmap             - Initiative timeline and wave planning
├── /governance          - KPI tracking, policies, and governance forums
└── /api/data            - REST API for data operations
```

## Workstream Coverage (46 Datasets)

| Workstream | Name | Tables |
|------------|------|--------|
| WS 00 | Master Layer | 5 (metadata, glossary, decisions, assumptions) |
| WS 01 | Stakeholder & Discovery | 5 (stakeholders, interviews, documents, workshops) |
| WS 02 | As-Is Assessment | 10 (domains, sources, flows, people, processes, tools, quality, maturity) |
| WS 03 | Gap Analysis | 3 (capability, architecture, data flow gaps) |
| WS 04 | Use Cases | 3 (longlist, prioritization, detail) |
| WS 05 | Target State | 6 (capability model, architecture, org, governance) |
| WS 06 | Roadmap | 4 (initiatives, dependencies, milestones, quick wins) |
| WS 07 | Operating Model | 5 (RACI, forums, ownership, policies, ways of working) |
| WS 08 | Business Case | 4 (costs, benefits, ROI, investment) |
| WS 09 | Risk & KPIs | 4 (risks, KPIs, change management, benefits tracking) |

## Features

### Dashboard (/)
- 6 key metrics with trend indicators
- DAMA maturity assessment progress bars
- Risk summary with probability/impact
- Workstream progress overview

### Data Explorer (/explorer)
- Visual grid of all 46 datasets
- Status indicators (Complete, Active, In Progress, Planned)
- Record counts per dataset
- Filter by workstream

### Stakeholder Management (/stakeholders)
- Stakeholder registry with filtering
- Interview tracking with sentiment
- Influence and attitude analysis
- Coverage statistics

### Roadmap (/roadmap)
- Timeline visualization (Gantt-style)
- Wave-based initiative grouping
- Cost/benefit tracking
- Priority indicators

### Governance (/governance)
- KPI dashboard with baseline/current/target
- Policy register with status
- Governance forum tracking
- Category filtering

## Technology Stack

- React 18
- Tailwind CSS 4
- Hono (API routes)
- Bun runtime
- TypeScript

## Future Enhancements

1. **Database Integration**: Connect to SQLite with full CRUD APIs for all 46 tables
2. **Authentication**: Role-based access control (admin, architect, analyst, viewer)
3. **Data Import**: CSV upload capability for populating datasets
4. **Export**: Excel multi-sheet export functionality
5. **Real Charts**: Integrate Recharts or similar for advanced visualizations
6. **Dependency Graph**: Visualize cross-dataset relationships
7. **Audit Trail**: Track all changes with timestamps and user attribution
8. **Workflow Engine**: Enforce dependencies (Discovery → Diagnosis → Target → Roadmap → Business Case)

## Design Principles

1. **Schema-Driven**: UI generated from schema definitions
2. **Traceability**: Every record linked via IDs across workstreams
3. **Consulting-Grade**: Professional dark theme suitable for executive presentations
4. **Responsive**: Works on desktop and tablet
5. **Fast Loading**: Static React with minimal API calls