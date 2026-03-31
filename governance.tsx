import { useState, useEffect } from "react";

const NAV = [
  {h:"/",l:"Dashboard"},
  {h:"/explorer",l:"Explorer"},
  {h:"/data",l:"Data Manager"},
  {h:"/stakeholders",l:"Stakeholders"},
  {h:"/roadmap",l:"Roadmap"},
  {h:"/governance",l:"Governance"},
];

const KPI_FIELDS = ["kpi_id","kpi_name","kpi_type","baseline_value","target_value_12m","owner_role"];
const RISK_FIELDS = ["risk_id","risk_title","probability","impact","risk_score","owner_role"];

export default function Governance() {
  const [tab, setTab] = useState("kpis");
  const [kpis, setKpis] = useState([{kpi_id:"KPI-001",kpi_name:"Data Quality Index",kpi_type:"Lagging Indicator",baseline_value:"62",target_value_12m:"80",owner_role:"CDO Office"}]);
  const [risks, setRisks] = useState([{risk_id:"RISK-001",risk_title:"Data Integration Complexity",probability:"High",impact:"High",risk_score:"9",owner_role:"CTO"}]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem("ds_kpis");
    if(k) setKpis(JSON.parse(k));
    const r = localStorage.getItem("ds_risks");
    if(r) setRisks(JSON.parse(r));
  }, []);

  const saveKpis = (d: any[]) => { localStorage.setItem("ds_kpis",JSON.stringify(d)); setSaved(true); setTimeout(()=>setSaved(false),1500); };
  const saveRisks = (d: any[]) => { localStorage.setItem("ds_risks",JSON.stringify(d)); setSaved(true); setTimeout(()=>setSaved(false),1500); };

  const addKpi = () => setKpis([...kpis, Object.fromEntries(KPI_FIELDS.map(f=>[f,""]))]);
  const addRisk = () => setRisks([...risks, Object.fromEntries(RISK_FIELDS.map(f=>[f,""]))]);

  const updKpi = (i: number, f: string, v: string) => {
    const u = kpis.map((r: any, idx: number) => idx===i ? {...r,[f]:v} : r);
    setKpis(u); saveKpis(u);
  };
  const updRisk = (i: number, f: string, v: string) => {
    const u = risks.map((r: any, idx: number) => idx===i ? {...r,[f]:v} : r);
    setRisks(u); saveRisks(u);
  };

  const delKpi = (i: number) => { if(confirm("Delete?")) { const u = kpis.filter((_: any, idx: number) => idx!==i); setKpis(u); saveKpis(u); }};
  const delRisk = (i: number) => { if(confirm("Delete?")) { const u = risks.filter((_: any, idx: number) => idx!==i); setRisks(u); saveRisks(u); }};

  const inp = (f: string, v: string, onChange: (v: string) => void) => (
    <input type="text" value={v} onChange={e=>onChange(e.target.value)} className="w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs" />
  );

  const renderTable = (data: any[], fields: string[], upd: any, del: any, empty: any) => (
    data.length === 0 ? <p className="text-zinc-500 text-center py-12">No records. Click + ADD.</p> :
    <table className="w-full text-sm">
      <thead><tr className="border-b border-zinc-700 bg-zinc-800">{fields.map(f => <th key={f} className="text-left px-3 py-2 text-zinc-400 text-xs font-medium uppercase">{f}</th>)}<th className="px-3 py-2 bg-zinc-800 w-48">ACTIONS</th></tr></thead>
      <tbody>
        {data.map((r: any, i: number) => (
          <tr key={i} className="border-b border-zinc-700 hover:bg-zinc-800/50">
            {fields.map(f => <td key={f} className="px-3 py-2">{inp(f, r[f]||"", (v:string) => upd(i,f,v))}</td>)}
            <td className="px-3 py-2"><button onClick={()=>del(i)} className="bg-rose-600 hover:bg-rose-500 px-4 py-1 rounded text-xs font-bold">DEL</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-3">
        <div className="flex gap-1 max-w-7xl mx-auto">
          {NAV.map((n,i) => (
            <a key={i} href={n.h} className={`px-4 py-2 rounded text-sm font-medium ${n.h.includes("governance") ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>
              {n.l}
            </a>
          ))}
        </div>
      </nav>
      <main className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Governance</h1>
          {saved && <span className="text-emerald-400 text-sm font-medium">Saved!</span>}
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setTab("kpis")} className={`px-4 py-2 rounded text-sm font-medium ${tab==="kpis" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300"}`}>KPIs</button>
          <button onClick={()=>setTab("risks")} className={`px-4 py-2 rounded text-sm font-medium ${tab==="risks" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300"}`}>Risks</button>
          <div className="flex-1"/>
          <button onClick={tab==="kpis"?addKpi:addRisk} className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm font-bold">+ ADD</button>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
          {tab === "kpis" ? renderTable(kpis, KPI_FIELDS, updKpi, delKpi, addKpi) : renderTable(risks, RISK_FIELDS, updRisk, delRisk, addRisk)}
        </div>
      </main>
    </div>
  );
}
