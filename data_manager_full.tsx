import { useState, useEffect } from "react";

const TABLES = [
  { id: "00_01_engagement_metadata", ws: "00", grp: "Master", name: "Engagement Metadata", fields: ["field", "value"] },
  { id: "00_02_file_registry", ws: "00", grp: "Master", name: "File Registry", fields: ["file_id", "file_name", "workstream_code", "workstream_name", "phase", "purpose", "primary_user", "status", "version"] },
  { id: "00_03_glossary", ws: "00", grp: "Master", name: "Glossary", fields: ["term_id", "term", "definition", "domain", "source", "approved_by"] },
  { id: "00_04_decision_log", ws: "00", grp: "Master", name: "Decision Log", fields: ["decision_id", "decision_date", "category", "description", "rationale", "made_by", "status"] },
  { id: "00_05_assumption_log", ws: "00", grp: "Master", name: "Assumption Log", fields: ["assumption_id", "description", "category", "basis", "confidence", "owner", "status"] },
  { id: "01_01_stakeholder_registry", ws: "01", grp: "Discovery", name: "Stakeholder Registry", fields: ["stakeholder_id", "full_name", "title", "department", "level", "data_role", "engagement_relevance", "interview_priority", "interview_status", "influence_level", "attitude_toward_change", "notes"] },
  { id: "01_02_interview_question_bank", ws: "01", grp: "Discovery", name: "Interview Question Bank", fields: ["question_id", "persona_type", "topic_area", "question_text", "question_type", "priority", "dama_area"] },
  { id: "01_03_interview_session_log", ws: "01", grp: "Discovery", name: "Interview Session Log", fields: ["session_id", "stakeholder_id", "interview_date", "interviewer_name", "question_id", "answer_summary", "insight_tagged", "sentiment", "follow_up_needed"] },
  { id: "01_04_document_request_tracker", ws: "01", grp: "Discovery", name: "Document Request Tracker", fields: ["request_id", "document_name", "document_type", "requested_from", "requested_by", "date_requested", "due_date", "status"] },
  { id: "01_05_workshop_planning_tracker", ws: "01", grp: "Discovery", name: "Workshop Planning", fields: ["workshop_id", "workshop_name", "objective", "workshop_type", "date_planned", "facilitator", "participants_count", "status"] },
  { id: "02_01_data_domain_inventory", ws: "02", grp: "As-Is", name: "Data Domain Inventory", fields: ["domain_id", "domain_name", "description", "owner_role", "criticality", "maturity_level"] },
  { id: "02_02_system_register", ws: "02", grp: "As-Is", name: "System Register", fields: ["system_id", "system_name", "system_type", "owner", "department", "criticality", "integration_count", "tech_stack"] },
  { id: "02_03_data_flow_inventory", ws: "02", grp: "As-Is", name: "Data Flow Inventory", fields: ["flow_id", "flow_name", "source_system", "target_system", "frequency", "data_type", "volume_estimate", "quality_score", "documentation_status"] },
  { id: "02_04_data_quality_assessment", ws: "02", grp: "As-Is", name: "Data Quality Assessment", fields: ["dq_id", "domain_id", "dimension", "metric_name", "current_score", "target_score", "root_cause", "owner"] },
  { id: "02_05_technology_tool_assessment", ws: "02", grp: "As-Is", name: "Technology Tool Assessment", fields: ["tool_id", "tool_name", "category", "vendor", "deployment_model", "annual_cost", "user_count"] },
  { id: "02_06_data_governance_assessment", ws: "02", grp: "As-Is", name: "Data Governance Assessment", fields: ["gov_id", "governance_area", "policy_exists", "policy_quality_score", "enforcement_level", "last_review_date", "owner"] },
  { id: "02_07_regulatory_compliance_gap", ws: "02", grp: "As-Is", name: "Regulatory Compliance Gap", fields: ["reg_id", "regulation", "requirement", "current_compliance", "gap", "risk_level", "remediation_effort", "owner"] },
  { id: "02_08_maturity_assessment", ws: "02", grp: "As-Is", name: "Maturity Assessment", fields: ["maturity_id", "dama_dimension", "current_level", "target_level", "gap", "gap_severity"] },
  { id: "02_09_pain_point_register", ws: "02", grp: "As-Is", name: "Pain Point Register", fields: ["pain_point_id", "title", "description", "severity", "frequency", "business_impact", "root_cause"] },
  { id: "02_10_cost_analysis", ws: "02", grp: "As-Is", name: "Cost Analysis", fields: ["cost_id", "cost_category", "cost_element", "annual_cost_usd", "headcount", "vendor_name", "cost_driver"] },
  { id: "03_01_gap_register", ws: "03", grp: "Gap Analysis", name: "Gap Register", fields: ["gap_id", "gap_name", "gap_type", "current_state", "target_state", "severity", "linked_initiative", "priority"] },
  { id: "03_02_architecture_gap_analysis", ws: "03", grp: "Gap Analysis", name: "Architecture Gap Analysis", fields: ["arch_gap_id", "architecture_area", "current_pattern", "target_pattern", "gap_type", "severity", "priority"] },
  { id: "03_03_data_flow_gap_analysis", ws: "03", grp: "Gap Analysis", name: "Data Flow Gap Analysis", fields: ["flow_gap_id", "gap_type", "source_system", "target_system", "gap_description", "business_impact", "severity"] },
  { id: "04_01_use_case_longlist", ws: "04", grp: "Use Cases", name: "Use Case Longlist", fields: ["use_case_id", "use_case_name", "use_case_type", "business_domain", "problem_statement", "expected_outcome", "preliminary_feasibility", "strategic_alignment", "shortlist_candidate"] },
  { id: "04_02_use_case_prioritization", ws: "04", grp: "Use Cases", name: "Use Case Prioritization", fields: ["use_case_id", "business_value_score", "strategic_alignment_score", "data_readiness_score", "technical_feasibility_score", "implementation_complexity_score", "total_weighted_score", "priority_tier"] },
  { id: "04_03_use_case_detail", ws: "04", grp: "Use Cases", name: "Use Case Detail", fields: ["use_case_id", "problem_statement_full", "solution_description", "data_requirements", "technical_approach", "resource_requirements", "risks", "success_criteria"] },
  { id: "05_01_target_capability_model", ws: "05", grp: "Target State", name: "Target Capability Model", fields: ["capability_id", "capability_name", "dama_area", "current_level", "target_level", "maturity_gap"] },
  { id: "05_02_target_architecture", ws: "05", grp: "Target State", name: "Target Architecture", fields: ["arch_id", "architecture_layer", "component_name", "description", "technology_choice", "integration_pattern"] },
  { id: "05_03_target_data_model", ws: "05", grp: "Target State", name: "Target Data Model", fields: ["entity_id", "entity_name", "entity_type", "description", "attributes", "relationships"] },
  { id: "05_04_target_governance_model", ws: "05", grp: "Target State", name: "Target Governance Model", fields: ["gov_model_id", "governance_element", "current_state", "target_state", "rationale", "transition_approach"] },
  { id: "05_05_target_operating_model", ws: "05", grp: "Target State", name: "Target Operating Model", fields: ["om_id", "operating_model_component", "current_description", "target_description", "gap_analysis"] },
  { id: "05_06_target_data_domain_model", ws: "05", grp: "Target State", name: "Target Data Domain Model", fields: ["domain_model_id", "domain_name", "entities_covered", "governance_approach", "steward_role"] },
  { id: "06_01_initiative_registry", ws: "06", grp: "Roadmap", name: "Initiative Registry", fields: ["initiative_id", "initiative_name", "description", "wave", "phase", "status", "priority", "estimated_effort_days", "start_date", "end_date", "budget_usd", "owner_role"] },
  { id: "06_02_initiative_dependency", ws: "06", grp: "Roadmap", name: "Initiative Dependency", fields: ["dependency_id", "initiative_id", "depends_on_initiative_id", "dependency_type", "criticality"] },
  { id: "06_03_transition_state_model", ws: "06", grp: "Roadmap", name: "Transition State Model", fields: ["transition_id", "transition_name", "from_state", "to_state", "activities", "validation_criteria"] },
  { id: "06_04_value_stream_mapping", ws: "06", grp: "Roadmap", name: "Value Stream Mapping", fields: ["vsm_id", "value_stream_name", "current_state_steps", "target_state_steps", "improvement_areas", "expected_benefits"] },
  { id: "07_01_governance_structure", ws: "07", grp: "Operating Model", name: "Governance Structure", fields: ["gov_id", "governance_body", "role_name", "responsibilities", "meeting_frequency", "decision_authority"] },
  { id: "07_02_data_policy_framework", ws: "07", grp: "Operating Model", name: "Data Policy Framework", fields: ["policy_id", "policy_name", "policy_statement", "scope", "enforcement", "owner", "review_frequency"] },
  { id: "07_03_data_stewardship_model", ws: "07", grp: "Operating Model", name: "Data Stewardship Model", fields: ["steward_id", "steward_name", "domain_responsibility", "steward_type", "responsibilities", "escalation_path"] },
  { id: "07_04_metadata_management_model", ws: "07", grp: "Operating Model", name: "Metadata Management Model", fields: ["metadata_id", "metadata_type", "current_state", "target_state", "tool_support", "owner"] },
  { id: "07_05_data_quality_standards", ws: "07", grp: "Operating Model", name: "Data Quality Standards", fields: ["standard_id", "quality_dimension", "standard_statement", "measurement_method", "tolerance_threshold"] },
  { id: "08_01_cost_estimation", ws: "08", grp: "Business Case", name: "Cost Estimation", fields: ["cost_id", "initiative_id", "cost_category", "cost_element", "year_1_usd", "year_2_usd", "year_3_usd", "total_usd"] },
  { id: "08_02_benefit_estimation", ws: "08", grp: "Business Case", name: "Benefit Estimation", fields: ["benefit_id", "initiative_id", "benefit_name", "benefit_category", "benefit_type", "year_1_usd", "year_2_usd", "year_3_usd", "total_usd"] },
  { id: "08_03_roi_summary", ws: "08", grp: "Business Case", name: "ROI Summary", fields: ["scenario_id", "scenario_name", "total_investment_3yr", "total_benefit_3yr", "net_benefit_3yr", "roi_pct", "payback_period"] },
  { id: "08_04_investment_by_wave", ws: "08", grp: "Business Case", name: "Investment by Wave", fields: ["wave_id", "wave_name", "wave_horizon", "total_initiatives", "total_investment_usd", "total_expected_benefit_usd", "net_value_usd"] },
  { id: "09_01_risk_register", ws: "09", grp: "Risk & KPIs", name: "Risk Register", fields: ["risk_id", "risk_title", "risk_category", "probability", "impact", "risk_score", "risk_level", "mitigation_strategy", "owner_role", "status"] },
  { id: "09_02_kpi_framework", ws: "09", grp: "Risk & KPIs", name: "KPI Framework", fields: ["kpi_id", "kpi_name", "kpi_type", "kpi_category", "measurement_formula", "measurement_unit", "baseline_value", "target_value_12m", "owner_role", "measurement_frequency"] },
  { id: "09_03_change_management_plan", ws: "09", grp: "Risk & KPIs", name: "Change Management Plan", fields: ["change_id", "stakeholder_group", "change_description", "impact_severity", "resistance_level", "engagement_activities", "training_required", "owner_role", "status"] },
  { id: "09_04_benefits_realization_tracker", ws: "09", grp: "Risk & KPIs", name: "Benefits Realization Tracker", fields: ["tracking_id", "benefit_id", "initiative_id", "benefit_name", "benefit_owner_role", "baseline_value", "target_value", "period_1_actual", "on_track"] },
];

const GROUP_NAMES: Record<string, string> = {
  "00": "Master Layer", "01": "Discovery", "02": "As-Is Assessment", "03": "Gap Analysis",
  "04": "Use Cases", "05": "Target State", "06": "Roadmap", "07": "Operating Model",
  "08": "Business Case", "09": "Risk & KPIs"
};

const GROUPS = ["00","01","02","03","04","05","06","07","08","09"];

const SELECT_OPTIONS: Record<string, string[]> = {
  level: ["C-suite","VP","Director","Manager","Senior IC","IC"],
  data_role: ["Sponsor","Owner","Steward","Producer","Consumer","Custodian"],
  interview_priority: ["High","Medium","Low"],
  interview_status: ["Not scheduled","Scheduled","Completed","Declined"],
  influence_level: ["High","Medium","Low"],
  attitude: ["Champion","Neutral","Skeptic","Resistor"],
  priority: ["Critical","High","Medium","Low"],
  status: ["Not started","In Progress","Active","On Hold","Completed"],
  phase: ["Discovery","Analysis","Design","Delivery","Steady State"],
  wave: ["Wave 1","Wave 2","Wave 3"],
  probability: ["High","Medium","Low"],
  impact: ["High","Medium","Low"],
  kpi_type: ["Leading Indicator","Lagging Indicator"],
  frequency: ["Daily","Weekly","Monthly","Quarterly"],
  unit: ["Percentage","Count","USD","Days","Score","Ratio"],
  severity: ["Critical","High","Medium","Low"],
  shortlist: ["Yes","No"],
  feasibility: ["High","Medium","Low"],
  documentation_status: ["Documented","Partial","Undocumented"],
  deployment_model: ["On-premise","Cloud","Hybrid","SaaS"],
  questionnaire_type: ["Open ended","Hypothesis-testing","Rating scale","Document request"],
  priority_ask: ["Must ask","Should ask","Nice to have"],
  document_type: ["Org chart","Data catalog","Architecture diagram","Data dictionary","Data policy","System inventory"],
  workshop_type: ["Strategy","Design","Validation","Training","Working Session"],
  system_type: ["Source System","Target System","Integration Hub","Analytics Platform","Data Warehouse","Data Lake"],
  frequency2: ["Real-time","Hourly","Daily","Weekly","Monthly","On-demand"],
  dimension: ["Accuracy","Completeness","Consistency","Timeliness","Uniqueness","Validity"],
  tool_category: ["ETL/ELT","Data Quality","Metadata","Business Intelligence","Advanced Analytics","ML Platform"],
  governance_area: ["Data Ownership","Data Quality","Metadata","Privacy","Security","Lifecycle","Architecture"],
  regulation: ["GDPR","CCPA","HIPAA","SOX","PCI-DSS","Basel III","Solvency II","DORA"],
  gap_type: ["Missing capability","Technical debt","Scalability limitation","Security exposure","Integration gap"],
  use_case_type: ["Descriptive Analytics","Diagnostic Analytics","Predictive Analytics","Generative AI","Data Product","Master Data","Regulatory Compliance","Cost Reduction"],
  persona_type: ["CDO","CIO","CISO","CFO","COO","Chief Data Steward","Business Unit Leader","Data Engineer","Data Analyst","Data Scientist","BI Developer","Enterprise Architect","Legal & Compliance","HR"],
  topic_area: ["Data Strategy","Data Culture","Data Organization","Data Governance","Data Quality","Data Architecture","Analytics & BI","AI/ML Readiness","Tools & Technology","Data Costs","Regulatory Compliance","Pain Points"],
  risk_category: ["Program Execution","Organizational Change","Technical Quality","Technology & Vendor","Regulatory & Legal","Financial & Budget","Talent & Skills"],
  compliance: ["Compliant","Partially compliant","Non-compliant"],
  maturity_level: ["Level 1","Level 2","Level 3","Level 4","Level 5"],
  cost_category: ["Technology","People","Consulting","Licensing","Infrastructure","Training"],
  benefit_type: ["Direct Financial","Indirect Financial","Non-financial"],
  benefit_category: ["Revenue Increase","Cost Avoidance","Cost Reduction","Productivity Gain","Risk Mitigation"],
};

function getFieldOptions(field: string): string[] | null {
  const key = field.replace(/_/g,'').toLowerCase();
  const map: Record<string, string> = {
    level:"level",data_role:"data_role",interview_priority:"interview_priority",interview_status:"interview_status",
    influence_level:"influence_level",attitude_toward_change:"attitude",priority:"priority",status:"status",
    phase:"phase",wave:"wave",probability:"probability",impact:"impact",kpi_type:"kpi_type",
    measurement_frequency:"frequency",measurement_unit:"unit",severity:"severity",gap_severity:"severity",
    risk_level:"severity",impact_severity:"severity",current_compliance:"compliance",
    maturity_level:"maturity_level",current_level:"maturity_level",target_level:"maturity_level",
    cost_category:"cost_category",benefit_type:"benefit_type",benefit_category:"benefit_category",
    shortlist_candidate:"shortlist",preliminary_feasibility:"feasibility",strategic_alignment:"feasibility",
    technical_feasibility:"feasibility",implementation_complexity:"feasibility",
    documentation_status:"documentation_status",deployment_model:"deployment_model",
    questionnaire_type:"questionnaire_type",priority_ask:"priority_ask",document_type:"document_type",
    workshop_type:"workshop_type",system_type:"system_type",frequency:"frequency2",dimension:"dimension",
    tool_category:"tool_category",governance_area:"governance_area",regulation:"regulation",
    gap_type:"gap_type",use_case_type:"use_case_type",persona_type:"persona_type",
    topic_area:"topic_area",risk_category:"risk_category",confidence:"feasibility",
  };
  const optKey = map[key] || map[field.toLowerCase()];
  return optKey ? SELECT_OPTIONS[optKey] || null : null;
}

function isTextarea(field: string): boolean {
  const t = ["description","statement","rationale","comment","notes","objective","requirement","approach","criteria","activities","problem","outcome","solution"];
  return t.some(x => field.toLowerCase().includes(x));
}

function isNumber(field: string): boolean {
  const n = ["cost","budget","score","count","days","usd","pct","percentage","number"];
  return n.some(x => field.toLowerCase().includes(x));
}

export default function DataManager() {
  const [selectedId, setSelectedId] = useState(TABLES[0].id);
  const [records, setRecords] = useState<Record<string, string>[]>([]);
  const [filter, setFilter] = useState("");
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newRecord, setNewRecord] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const table = TABLES.find(t => t.id === selectedId)!;
  const storageKey = `ds_${selectedId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) { try { setRecords(JSON.parse(stored)); } catch { setRecords([]); } }
    else { setRecords([]); }
    setEditIdx(null);
    setShowAdd(false);
  }, [selectedId]);

  const save = (data: Record<string, string>[]) => {
    localStorage.setItem(storageKey, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleAdd = () => {
    const empty = Object.fromEntries(table.fields.map(f => [f, ""]));
    const updated = [...records, { ...empty, ...newRecord }];
    setRecords(updated);
    save(updated);
    setNewRecord({});
    setShowAdd(false);
  };

  const handleUpdate = (i: number, field: string, val: string) => {
    const updated = records.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    setRecords(updated);
    save(updated);
  };

  const handleDelete = (i: number) => {
    const updated = records.filter((_, idx) => idx !== i);
    setRecords(updated);
    save(updated);
  };

  const exportCSV = () => {
    const csv = [table.fields.join(","), ...records.map(r => table.fields.map(f => `"${(r[f] || "").replace(/"/g, "\"")}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${selectedId}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const importCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return;
      const fields = lines[0].split(",").map(f => f.trim().replace(/"/g,""));
      const data = lines.slice(1).map(line => {
        const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g,""));
        return Object.fromEntries(fields.map((f, i) => [f, vals[i] || ""]));
      });
      setRecords(data);
      save(data);
    };
    reader.readAsText(file);
  };

  const filtered = filter ? records.filter(r => Object.values(r).some(v => v.toLowerCase().includes(filter.toLowerCase()))) : records;

  const renderInput = (field: string, value: string, onChange: (v: string) => void) => {
    const opts = getFieldOptions(field);
    if (opts) return (<select value={value} onChange={e => onChange(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs text-white"><option value="">-</option>{opts.map(o => <option key={o} value={o}>{o}</option>)}</select>);
    if (isTextarea(field)) return <textarea value={value} onChange={e => onChange(e.target.value)} rows={2} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs text-white resize-none" />;
    if (isNumber(field)) return <input type="number" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs text-white" />;
    return <input type="text" value={value} onChange={e => onChange(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs text-white" />;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div><h1 className="text-xl font-bold">Data Manager</h1><p className="text-zinc-400 text-xs">{GROUP_NAMES[table.ws]} / {table.name}</p></div>
          <div className="flex items-center gap-2">
            {saved && <span className="text-emerald-400 text-xs font-medium">Saved!</span>}
            <span className="text-zinc-500 text-xs">{filtered.length} records</span>
            <button onClick={exportCSV} className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 rounded text-xs">Export CSV</button>
            <label className="bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded text-xs cursor-pointer"><span>Import CSV</span><input type="file" accept=".csv" onChange={importCSV} className="hidden" /></label>
          </div>
        </div>
        <div className="flex gap-3 mb-4">
          <input placeholder="Filter records..." value={filter} onChange={e => setFilter(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm" />
          <button onClick={() => { setShowAdd(true); setNewRecord(Object.fromEntries(table.fields.map(f => [f, ""]))); }} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm font-medium">+ Add</button>
        </div>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {GROUPS.map(g => (
            <div key={g} className="bg-zinc-900 border border-zinc-800 rounded p-3">
              <h3 className="text-xs font-semibold text-zinc-400 mb-2">{GROUP_NAMES[g]}</h3>
              <div className="space-y-1">
                {TABLES.filter(t => t.ws === g).map(t => (
                  <button key={t.id} onClick={() => setSelectedId(t.id)} className={`w-full text-left text-xs px-2 py-1.5 rounded transition-colors ${selectedId === t.id ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {showAdd && (
            <div className="bg-zinc-800 border-b border-zinc-700 p-4">
              <h4 className="text-sm font-medium text-emerald-400 mb-3">New Record</h4>
              <div className="grid grid-cols-5 gap-3">
                {table.fields.map(f => (
                  <div key={f}><label className="text-xs text-zinc-400 mb-1 block">{f}</label>{renderInput(f, newRecord[f] || "", v => setNewRecord({ ...newRecord, [f]: v }))}</div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm">Save</button>
                <button onClick={() => setShowAdd(false)} className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded text-sm">Cancel</button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto">
            {filtered.length > 0 ? (
              <table className="w-full text-sm">
                <thead><tr className="border-b border-zinc-700 bg-zinc-800">{table.fields.map(f => <th key={f} className="text-left px-3 py-2 text-zinc-400 text-xs font-medium uppercase">{f}</th>)}<th className="text-right px-3 py-2"></th></tr></thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                      {table.fields.map(f => <td key={f} className="px-3 py-2">{editIdx === i ? renderInput(f, r[f] || "", v => handleUpdate(i, f, v)) : <span className="text-zinc-300">{r[f] || "-"}</span>}</td>)}
                      <td className="px-3 py-2 text-right"><button onClick={() => setEditIdx(editIdx === i ? null : i)} className="text-blue-400 hover:text-blue-300 text-xs mr-2">{editIdx === i ? "Done" : "Edit"}</button><button onClick={() => handleDelete(i)} className="text-rose-400 hover:text-rose-300 text-xs">Del</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="text-zinc-500 text-center py-12">No records. Click "+ Add" to create your first record.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
