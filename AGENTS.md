# Data Strategy Command Center - Technical Specification

## Project Context

This application operationalizes a structured CSV-based data strategy system for consulting engagements. It replaces static spreadsheet usage with a governed, multi-user web interface for McKinsey-style data transformation programs.

## System Overview

The command center manages all 46 datasets across 10 workstreams following DAMA DMBOK and TOGAF methodologies.

### Application URL
**Production**: https://hotep.zo.space

### Routes
| Path | Type | Purpose |
|------|------|---------|
| `/` | Page | Main dashboard with metrics, maturity, risks |
| `/explorer` | Page | All 46 datasets with status |
| `/stakeholders` | Page | Stakeholder registry and interviews |
| `/roadmap` | Page | Initiative timeline and wave planning |
| `/governance` | Page | KPIs, policies, forums |
| `/api/data` | API | REST endpoints for data operations |

## Architecture

### Frontend Stack
- React 18 with hooks
- Tailwind CSS for styling (dark theme, zinc palette)
- No external icon dependencies (use text/emoji)
- Component-based architecture

### Backend Stack
- Hono framework for API routes
- Bun runtime
- In-memory data store (future: SQLite)

### Key Components

#### 1. Dashboard (/)
```tsx
- Header with engagement metadata
- Tab navigation: overview, workstreams, roadmap, governance, analytics
- Metrics grid (6 KPIs)
- DAMA Maturity Assessment (progress bars)
- Risk Summary (probability/impact matrix)
- Workstream Progress (visual cards)
```

#### 2. Data Explorer (/explorer)
```tsx
- 10-button workstream selector
- Dataset cards with status indicators
- Record counts per dataset
- Visual status: Complete (green), Active (blue), In Progress (amber), Planned (gray)
```

#### 3. Stakeholder Management (/stakeholders)
```tsx
- Stats cards: total, completed, scheduled, pending, champions, skeptics
- Filter buttons: all, completed, pending, champions, skeptics
- Registry table with sortable columns
- Interview log table
```

#### 4. Roadmap (/roadmap)
```tsx
- Wave summary cards (3 waves)
- Timeline visualization (Gantt-style)
- Initiative table with cost/benefit
- Filter by wave
```

#### 5. Governance (/governance)
```tsx
- Tab views: overview, KPIs, policies, forums
- KPI cards with baseline/current/target
- Policy register table
- Forum governance cards
```

## Data Model

### Workstreams (10)
```
WS 00: Master Layer (5 tables)
WS 01: Stakeholder & Discovery (5 tables)
WS 02: As-Is Assessment (10 tables)
WS 03: Gap Analysis (3 tables)
WS 04: Use Cases (3 tables)
WS 05: Target State (6 tables)
WS 06: Roadmap (4 tables)
WS 07: Operating Model (5 tables)
WS 08: Business Case (4 tables)
WS 09: Risk & KPIs (4 tables)
```

### Key Entities
- Stakeholders (SH-XXX)
- Use Cases (UC-XXX)
- Initiatives (IN-XXX)
- KPIs (KPI-XXX)
- Risks (RISK-XXX)
- Policies (POL-XXX)

## API Design

### Endpoints
```
GET /api/data/workstreams    - List all workstreams
GET /api/data/stakeholders   - List stakeholder registry
GET /api/data/usecases      - List use cases
GET /api/data/initiatives   - List initiatives
GET /api/data/kpis          - List KPIs
GET /api/data/summary       - Aggregated summary stats
```

### Response Format
```json
{
  "workstreams": { ... },
  "stakeholders": [ ... ],
  "summary": { ... }
}
```

## Future Development

### Phase 2: Database & CRUD
1. Set up SQLite database with all 46 table schemas
2. Implement full CRUD API for each entity
3. Add validation (required fields, foreign keys, enums)
4. Implement audit trail (created_at, updated_at, created_by, updated_by)

### Phase 3: User Management
1. Authentication system
2. Role-based access (admin, architect, domain owner, analyst, viewer)
3. Row-level security by engagement

### Phase 4: Advanced Features
1. CSV import/export
2. Excel multi-sheet export
3. Dependency visualization
4. Advanced charts (Recharts integration)
5. Workflow enforcement

## Design Guidelines

### Color Palette
- Background: zinc-950 (#09090b)
- Cards: zinc-900 (#18181b)
- Borders: zinc-800 (#27272a)
- Primary: blue-500/600 (#3b82f6)
- Success: emerald (#10b981)
- Warning: amber (#f59e0b)
- Danger: rose (#f43f5e)

### Typography
- Font: System UI (default)
- Headings: font-bold
- Body: text-sm
- Labels: text-xs uppercase

### Spacing
- Page padding: px-6 py-8
- Card padding: p-6
- Grid gap: gap-4 or gap-6
- Section spacing: space-y-6 or space-y-8

## Anti-Patterns to Avoid
- Do NOT use @tabler/icons-react (causes build errors)
- Do NOT use hardcoded dataset logic
- Do NOT ignore cross-workstream relationships
- Do NOT duplicate data across tables
- Do NOT skip audit trail implementation

## Success Criteria
- 100% coverage of 46 datasets
- Full traceability via ID relationships
- Professional consulting-grade UI
- Fast load times (<2s)
- Mobile-responsive (tablet minimum)