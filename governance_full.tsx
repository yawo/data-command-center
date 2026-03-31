import { useState, useEffect } from "react";

const NAV = [
  {h:'/',l:'Dashboard'},
  {h:'/explorer',l:'Explorer'},
  {h:'/data',l:'Data Manager'},
  {h:'/stakeholders',l:'Stakeholders'},
  {h:'/roadmap',l:'Roadmap'},
  {h:'/governance',l:'Governance',active:true},
];

const KPI_FIELDS = ['kpi_id','kpi_name','kpi_type','baseline_value','target_value_12m','owner_role'];
const RISK_FIELDS = ['risk_id','risk_title','probability','impact','risk_score','owner_role'];

export default function Governance() {
  const [tab, setTab] = useState('kpis');
  const [kpis, setKpis] = useState([{kpi_id:'KPI-001',kpi_name:'Data Quality Index',kpi_type:'Lagging Indicator',baseline_value:'62',target_value_12m:'80',owner_role:'CDO Office'}]);
  const [risks, setRisks] = useState([{risk_id:'RISK-001',risk_title:'Data Integration Complexity',probability:'High',impact:'High',risk_score:'9',owner_role:'CTO'}]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const k = localStorage.getItem('ds_kpis');
    if(k) setKpis(JSON.parse(k));
    const r = localStorage.getItem('ds_risks');
    if(r) setRisks(JSON.parse(r));
  }, []);

  const saveKpis = (d: any[]) => { localStorage.setItem('ds_kpis',JSON.stringify(d)); setSaved(true); setTimeout(()=>setSaved(false),1500); };
  const saveRisks = (d: any[]) => { localStorage.setItem('ds_risks',JSON.stringify(d)); setSaved(true); setTimeout(()=>setSaved(false),1500); };
  const addKpi = () => setKpis([...kpis, Object.fromEntries(KPI_FIELDS.map(f=>[f,'']))]);
  const addRisk = () => setRisks([...risks, Object.fromEntries(RISK_FIELDS.map(f=>[f,'']))]);
  const upd = (set: any, save: any, i: number, f: string, v: string) => { const u = tab === 'kpis' ? kpis.map((r:any,idx:number)=>idx===i?{...r,[f]:v}:r) : risks.map((r:any,idx:number)=>idx===i?{...r,[f]:v}:r); set(u); save(u); };
  const del = (set: any, save: any, i: number) => { if(confirm('Delete?')) { const u = tab === 'kpis' ? kpis.filter((_:any,idx:number)=>idx!==i) : risks.filter((_:any,idx:number)=>idx!==i); set(u); save(u); }};
  const inp = (f: string, v: string, onChange: any) => <input type='text' value={v} onChange={e=>onChange(e.target.value)} className='w-full bg-zinc-700 border border-zinc-600 rounded px-2 py-1 text-xs text-white' />;
  const render = (data: any[], fields: string[], setter: any, saver: any) => data.length === 0 
    ? <p className='text-zinc-500 text-center py-12'>No records. Click + ADD.</p>
    : data.map((r: any, i: number) => (
        <div key={i} className='bg-zinc-800 rounded-lg p-4 mb-3'>
          <div className='grid grid-cols-6 gap-3 mb-3'>
            {fields.map(f => <div key={f}><label className='text-xs text-zinc-400 block mb-1'>{f}</label>{inp(f, r[f]||'', (v:string) => upd(setter, saver, i, f, v))}</div>)}
          </div>
          <div className='flex gap-2'>
            <button onClick={() => del(setter, saver, i)} className='bg-rose-600 hover:bg-rose-500 px-4 py-1 rounded text-xs font-bold'>DEL</button>
          </div>
        </div>
      ));

  return (
    <div className='min-h-screen bg-zinc-950 text-white'>
      <nav className='bg-zinc-900 border-b border-zinc-800 px-6 py-3'>
        <div className='flex gap-1 max-w-7xl mx-auto'>
          {NAV.map((n,i) => <a key={i} href={n.h} className={`px-4 py-2 rounded text-sm font-medium ${n.active ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>{n.l}</a>)}
        </div>
      </nav>
      <main className='p-6 max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <h1 className='text-2xl font-bold'>Governance</h1>
          {saved && <span className='text-emerald-400 text-sm font-medium'>Saved!</span>}
        </div>
        <div className='flex gap-2 mb-4'>
          <button onClick={()=>setTab('kpis')} className={`px-4 py-2 rounded text-sm font-medium ${tab==='kpis' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>KPIs</button>
          <button onClick={()=>setTab('risks')} className={`px-4 py-2 rounded text-sm font-medium ${tab==='risks' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>Risks</button>
          <div className='flex-1'/>
          <button onClick={tab==='kpis'?addKpi:addRisk} className='bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded text-sm font-bold'>+ ADD</button>
        </div>
        {tab === 'kpis' ? render(kpis, KPI_FIELDS, setKpis, saveKpis) : render(risks, RISK_FIELDS, setRisks, saveRisks)}
      </main>
    </div>
  );
}
