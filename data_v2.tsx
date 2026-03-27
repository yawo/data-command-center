import { useState, useEffect } from "react";

const TABLES = [
  { id: "01_01_stakeholder_registry", ws: "01", grp: "Discovery", name: "Stakeholder Registry", fields: ["stakeholder_id","full_name","title","department","level","data_role","engagement_relevance","interview_priority","interview_status","influence_level","attitude_toward_change","notes"] },
  { id: "04_01_use_case_longlist", ws: "04", grp: "Use Cases", name: "Use Case Longlist", fields: ["use_case_id","use_case_name","use_case_type","business_domain","problem_statement","expected_outcome","preliminary_feasibility","strategic_alignment","shortlist_candidate","notes"] },
  { id: "06_01_initiative_registry", ws: "06", grp: "Roadmap", name: "Initiative Registry", fields: ["initiative_id","initiative_name","description","wave","phase","status","priority","estimated_effort_days","start_date","end_date","budget_usd","owner_role","notes"] },
  { id: "09_01_risk_register", ws: "09", grp: "Risk & KPIs", name: "Risk Register", fields: ["risk_id","risk_title","risk_category","probability","impact","risk_score","risk_level","mitigation_strategy","owner_role","status","notes"] },
  { id: "09_02_kpi_framework", ws: "09", grp: "Risk & KPIs", name: "KPI Framework", fields: ["kpi_id","kpi_name","kpi_type","kpi_category","measurement_formula","measurement_unit","baseline_value","target_value_12m","owner_role","measurement_frequency","notes"] },
];

const GROUPS = ["01","04","06","09"];
const GROUP_NAMES: Record<string, string> = {"01":"Discovery","04":"Use Cases","06":"Roadmap","09":"Risk & KPIs"};

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
  use_case_type: ["Descriptive Analytics","Diagnostic Analytics","Predictive Analytics","Generative AI","Data Product","Master Data","Regulatory Compliance","Cost Reduction"],
  risk_category: ["Program Execution","Organizational Change","Technical Quality","Technology & Vendor","Regulatory & Legal","Financial & Budget","Talent & Skills"],
};

function getOptions(field: string): string[] | null {
  const key = field.replace(/_/g,'').toLowerCase();
  const map: Record<string, string> = {
    level:"level",data_role:"data_role",interview_priority:"interview_priority",interview_status:"interview_status",
    influence_level:"influence_level",attitude_toward_change:"attitude",priority:"priority",status:"status",
    phase:"phase",wave:"wave",probability:"probability",impact:"impact",kpi_type:"kpi_type",
    measurement_frequency:"frequency",measurement_unit:"unit",severity:"severity",gap_severity:"severity",
    risk_level:"severity",impact_severity:"severity",shortlist_candidate:"shortlist",
    preliminary_feasibility:"feasibility",strategic_alignment:"feasibility",technical_feasibility:"feasibility",
    implementation_complexity:"feasibility",use_case_type:"use_case_type",risk_category:"risk_category",
  };
  const optKey = map[key] || map[field.toLowerCase()];
  return optKey ? SELECT_OPTIONS[optKey] || null : null;
}

function isTextarea(field: string): boolean {
  return ["description","statement","rationale","comment","notes","objective","requirement","approach","criteria","activities","problem","outcome","solution","mitigation_strategy","measurement_formula"].some(x => field.toLowerCase().includes(x));
}

function isNumber(field: string): boolean {
  return ["cost","budget","score","count","days","usd","pct","percentage","number","effort"].some(x => field.toLowerCase().includes(x));
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
  const storageKey = `ds_full_${selectedId}`;

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) { try { setRecords(JSON.parse(stored)); } catch { setRecords([]); } }
    else { setRecords([]); }
    setEditIdx(null);
    setShowAdd(false);
  }, [selectedId, storageKey]);

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
    const opts = getOptions(field);
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
          <button onClick={() => { setShowAdd(true); setNewRecord(Object.fromEntries(table.fields.map(f => [f, ""]))); }} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm font-medium">+ Add Record</button>
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
              <div className="grid grid-cols-4 gap-3">
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
            ) : <p className="text-zinc-500 text-center py-12">No records. Click "+ Add Record" to create your first record.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
