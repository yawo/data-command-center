import { useState, useEffect } from "react";
const T = [
  { id: "01_01_stakeholder_registry", g: "Discovery", n: "Stakeholder Registry" },
  { id: "04_01_use_case_longlist", g: "Use Cases", n: "Use Case Longlist" },
  { id: "06_01_initiative_registry", g: "Roadmap", n: "Initiative Registry" },
  { id: "09_01_risk_register", g: "Risk & KPIs", n: "Risk Register" },
  { id: "09_02_kpi_framework", g: "Risk & KPIs", n: "KPI Framework" },
];
const INIT = {
  "01_01_stakeholder_registry": [
    { id: "SH-001", name: "Sarah Chen", title: "Chief Data Officer", dept: "Technology", level: "C-suite", role: "Sponsor", priority: "High", status: "Completed" },
    { id: "SH-002", name: "Michael Torres", title: "VP Engineering", dept: "Engineering", level: "VP", role: "Owner", priority: "Medium", status: "Scheduled" },
    { id: "SH-003", name: "Emily Watson", title: "Director Finance", dept: "Finance", level: "Director", role: "Consumer", priority: "High", status: "Completed" },
  ],
  "04_01_use_case_longlist": [
    { id: "UC-001", name: "Customer 360 View", type: "Data Product", domain: "Customer", problem: "Fragmented customer data", outcome: "Single customer view", feasibility: "High", shortlist: "Yes" },
    { id: "UC-002", name: "Predictive Maintenance", type: "Predictive Analytics", domain: "Operations", problem: "Equipment downtime", outcome: "30% reduction", feasibility: "Medium", shortlist: "Yes" },
  ],
  "06_01_initiative_registry": [
    { id: "IN-001", name: "Data Governance Framework", desc: "Policies and governance", wave: "Wave 1", phase: "Design", status: "Active", priority: "High", effort: "60", budget: "250000" },
    { id: "IN-002", name: "Customer Data Platform", desc: "Unify customer data", wave: "Wave 2", phase: "Discovery", status: "Not started", priority: "High", effort: "120", budget: "450000" },
  ],
  "09_01_risk_register": [
    { id: "R-001", title: "Data Integration Complexity", category: "Technical", probability: "High", impact: "High", score: "9", level: "Critical", mitigation: "Phased approach", status: "Open" },
    { id: "R-002", title: "Change Management Resistance", category: "Organizational", probability: "Medium", impact: "High", score: "6", level: "High", mitigation: "Early engagement", status: "Open" },
  ],
  "09_02_kpi_framework": [
    { id: "KPI-001", name: "Data Quality Index", type: "Lagging Indicator", category: "Data Quality", formula: "(Accuracy+Completeness)/2", unit: "Percentage", baseline: "62", target: "85", frequency: "Monthly" },
    { id: "KPI-002", name: "Governance Adoption Rate", type: "Leading Indicator", category: "Governance", formula: "Policies followed/Total", unit: "Percentage", baseline: "38", target: "80", frequency: "Monthly" },
  ],
};
const F = {
  "01_01_stakeholder_registry": ["id","name","title","dept","level","role","priority","status"],
  "04_01_use_case_longlist": ["id","name","type","domain","problem","outcome","feasibility","shortlist"],
  "06_01_initiative_registry": ["id","name","desc","wave","phase","status","priority","effort","budget"],
  "09_01_risk_register": ["id","title","category","probability","impact","score","level","mitigation","status"],
  "09_02_kpi_framework": ["id","name","type","category","formula","unit","baseline","target","frequency"],
};
const OP = {
  level: ["C-suite","VP","Director","Manager","Senior IC","IC"],
  role: ["Sponsor","Owner","Steward","Producer","Consumer"],
  priority: ["Critical","High","Medium","Low"],
  status: ["Not started","In Progress","Active","On Hold","Completed"],
  feasibility: ["High","Medium","Low"],
  shortlist: ["Yes","No"],
  wave: ["Wave 1","Wave 2","Wave 3"],
  phase: ["Discovery","Analysis","Design","Delivery"],
  probability: ["High","Medium","Low"],
  impact: ["High","Medium","Low"],
  kpi_type: ["Leading Indicator","Lagging Indicator"],
  frequency: ["Daily","Weekly","Monthly","Quarterly"],
};
const FT = { level:"select",role:"select",priority:"select",status:"select",feasibility:"select",shortlist:"select",wave:"select",phase:"select",probability:"select",impact:"select",kpi_type:"select",frequency:"select",effort:"number",budget:"number",score:"number",problem:"textarea",outcome:"textarea",desc:"textarea",mitigation:"textarea",formula:"text",baseline:"text",target:"text" };
function FO(f){ const m={level:"level",role:"role",priority:"priority",status:"status",feasibility:"feasibility",shortlist:"shortlist",wave:"wave",phase:"phase",probability:"probability",impact:"impact",kpi_type:"kpi_type",frequency:"frequency"}; return OP[m[f]||""]||null; }
function render(field,val,onChange){
  const opts=FO(field);
  if(opts) return <select value={val} onChange={e=>onChange(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs"><option value="">-</option>{opts.map(o=><option key={o}>{o}</option>)}</select>;
  if(FT[field]==="textarea") return <textarea value={val} onChange={e=>onChange(e.target.value)} rows={2} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs resize-none"/>;
  if(FT[field]==="number") return <input type="number" value={val} onChange={e=>onChange(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs"/>;
  return <input type="text" value={val} onChange={e=>onChange(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs"/>;
}
export default function DataManager(){
  const [sel,setSel]=useState(T[0].id);
  const [recs,setRecs]=useState([]);
  const [editIdx,setEditIdx]=useState(null);
  const [newR,setNewR]=useState({});
  const [filter,setFilter]=useState("");
  const [showAdd,setShowAdd]=useState(false);
  const [saved,setSaved]=useState(false);
  const sk=`dscc_${sel}`;
  useEffect(()=>{
    const s=localStorage.getItem(sk);
    if(s){try{setRecs(JSON.parse(s));}catch{setRecs(INIT[sel]||[]);}}
    else{setRecs(INIT[sel]||[]);}
    setEditIdx(null);setShowAdd(false);
  },[sel]);
  const save=(data)=>{localStorage.setItem(sk,JSON.stringify(data));setSaved(true);setTimeout(()=>setSaved(false),1500);};
  const add=()=>{const flds=F[sel]||["id","name"];const empty=Object.fromEntries(flds.map(f=>[f,""]));const d=[...recs,{...empty,...newR}];setRecs(d);save(d);setNewR({});setShowAdd(false);};
  const upd=(i,f,val)=>{const d=recs.map((r,idx)=>idx===i?{...r,[f]:val}:r);setRecs(d);save(d);};
  const del=(i)=>{const d=recs.filter((_,idx)=>idx!==i);setRecs(d);save(d);};
  const expCSV=()=>{const flds=F[sel]||[];const csv=[flds.join(","),...recs.map(r=>flds.map(f=>`"${(r[f]||"").replace(/"/g,'""')}"`).join(","))].join("\n");const b=new Blob([csv],{type:"text/csv"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download=`${sel}.csv`;a.click();URL.revokeObjectURL(u);};
  const impCSV=(e)=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=(ev)=>{const text=ev.target.result;const lines=text.split("\n").filter(l=>l.trim());if(lines.length<2)return;const flds=lines[0].split(",").map(f=>f.trim().replace(/"/g,""));const data=lines.slice(1).map(line=>{const vals=line.split(",").map(v=>v.trim().replace(/^"|"$/g,""));return Object.fromEntries(flds.map((f,i)=>[f,vals[i]||""]));});setRecs(data);save(data);};reader.readAsText(file);};
  const flds=F[sel]||["id","name"];
  const filtered=filter?recs.filter(r=>Object.values(r).some(v=>v.toLowerCase().includes(filter.toLowerCase()))):recs;
  const grp=T.find(t=>t.id===sel)?.g||"";
  const nm=T.find(t=>t.id===sel)?.n||"";
  return(
    <div className="min-h-screen bg-zinc-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div><h1 className="text-xl font-bold">Data Manager</h1><p className="text-zinc-400 text-xs">{grp} / {nm}</p></div>
          <div className="flex items-center gap-2">{saved&&<span className="text-emerald-400 text-xs">Saved!</span>}<button onClick={expCSV} className="bg-zinc-700 hover:bg-zinc-600 px-3 py-1.5 rounded text-xs">Export CSV</button><label className="bg-blue-700 hover:bg-blue-600 px-3 py-1.5 rounded text-xs cursor-pointer"><span>Import CSV</span><input type="file" accept=".csv" onChange={impCSV} className="hidden"/></label></div>
        </div>
        <div className="flex gap-3 mb-4"><input placeholder="Filter..." value={filter} onChange={e=>setFilter(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm"/><button onClick={()=>{setShowAdd(true);setNewR(Object.fromEntries(flds.map(f=>[f,""])));}} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm">+ Add</button></div>
        <div className="grid grid-cols-5 gap-3 mb-4">
          {["Discovery","Use Cases","Roadmap","Risk & KPIs"].map(g=><div key={g} className="bg-zinc-900 border border-zinc-800 rounded p-3"><h3 className="text-xs font-semibold text-zinc-400 mb-2">{g}</h3><div className="space-y-1">{T.filter(t=>t.g===g).map(t=><button key={t.id} onClick={()=>setSel(t.id)} className={`w-full text-left text-xs px-2 py-1.5 rounded ${sel===t.id?"bg-blue-600":"bg-zinc-800 hover:bg-zinc-700"}`}>{t.n}</button>)}</div></div>)}
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {showAdd&&(<div className="bg-zinc-800 border-b border-zinc-700 p-4"><h4 className="text-sm font-medium text-emerald-400 mb-3">New Record</h4><div className="grid grid-cols-5 gap-3">{flds.map(f=><div key={f}><label className="text-xs text-zinc-400 mb-1 block">{f}</label>{render(f,newR[f]||"",v=>setNewR({...newR,[f]:v}))}</div>)}</div><div className="flex gap-2 mt-4"><button onClick={add} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm">Save</button><button onClick={()=>setShowAdd(false)} className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded text-sm">Cancel</button></div></div>)}
          <div className="overflow-x-auto">
            {filtered.length>0?(<table className="w-full text-sm"><thead><tr className="border-b border-zinc-700 bg-zinc-800">{flds.map(f=><th key={f} className="text-left px-3 py-2 text-zinc-400 text-xs">{f}</th>)}<th></th></tr></thead><tbody>{filtered.map((r,i)=><tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">{flds.map(f=><td key={f} className="px-3 py-2">{editIdx===i?render(f,r[f]||"",v=>upd(i,f,v)):<span className="text-zinc-300">{r[f]||"-"}</span>}</td>)}<td className="px-3 py-2 text-right"><button onClick={()=>setEditIdx(editIdx===i?null:i)} className="text-blue-400 hover:text-blue-300 text-xs mr-2">{editIdx===i?"Done":"Edit"}</button><button onClick={()=>del(i)} className="text-rose-400 hover:text-rose-300 text-xs">Del</button></td></tr>)}</tbody></table>):<p className="text-zinc-500 text-center py-8">No records. Click "+ Add" to create.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}