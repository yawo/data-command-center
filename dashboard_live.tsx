import React from "react";
import { useState, useEffect } from "react";

const NAV=[
  {h:"/",l:"Dashboard"},
  {h:"/explorer",l:"Explorer"},
  {h:"/data",l:"Data Manager"},
  {h:"/stakeholders",l:"Stakeholders"},
  {h:"/roadmap",l:"Roadmap"},
  {h:"/governance",l:"Governance"},
  {h:"/bulk-import",l:"Bulk Import"},
];

function DonutChart({d,title}){const t=d.reduce((a,c)=>a+c.v,0);let cu=0;const p=d.map((c,i)=>{const sa=(cu/t)*360-90;cu+=c.v;const ea=(cu/t)*360-90;const x1=100+85*Math.cos(sa*Math.PI/180);const y1=100+85*Math.sin(sa*Math.PI/180);const x2=100+85*Math.cos(ea*Math.PI/180);const y2=100+85*Math.sin(ea*Math.PI/180);const la=ea-sa>180?1:0;return{path:"M"+x1+" "+y1+"A85 85 0 "+la+" 1 "+x2+" "+y2,c:c.c,l:c.l,pct:Math.round(c.v/t*100)};});return(<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><h3 className="text-sm font-semibold text-zinc-300 mb-3">{title}</h3><div className="flex items-center gap-4"><svg viewBox="0 0 200 200" className="w-36 h-36"><circle cx="100" cy="100" r="85" fill="none" stroke="#27272a" strokeWidth="20"/>{p.map((pp,i)=><path key={i} d={pp.path} fill="none" stroke={pp.c} strokeWidth="18" strokeLinecap="round"/>)}<text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-bold">"+t+"</text></svg><div className="space-y-1">{"+d.map((c,i)=><div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor:c.c}}/><span className="text-xs text-zinc-300">"+c.l+"</span><span className="text-xs text-zinc-500 ml-auto">"+p[i].pct+"%</span></div>)}</div></div></div>);}

function BarChart({d,title,c="#3b82f6"}){const m=Math.max(...d.map(x=>x.v));return(<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><h3 className="text-sm font-semibold text-zinc-300 mb-3">{title}</h3><div className="flex items-end gap-2 h-32">{"+d.map((x,i)=><div key={i} className="flex-1 flex flex-col items-center gap-1"><div className="w-full rounded-t relative" style={{height:Math.max((x.v/m)*110,4)+"px",background:"linear-gradient(to top,"+c+"dd,"+c+"88)"}}/><span className="text-[10px] text-zinc-500">"+x.l+"</span></div>)}</div></div>);}

function ProgressBar({d,title}){return(<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><h3 className="text-sm font-semibold text-zinc-300 mb-3">{title}</h3><div className="space-y-2">{"+d.map((x,i)=><div key={i}><div className="flex justify-between text-xs mb-1"><span className="text-zinc-300">"+x.l+"</span><span className="text-zinc-500">"+x.v+"%</span></div><div className="h-2 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:x.v+"%",background:"linear-gradient(to right,"+x.c+"dd,"+x.c+"88)"}}/></div></div>)}</div></div>);}

function GaugeChart({v,title}){const angle=(v/100)*180;const c=v>=70?"#10b981":v>=40?"#eab308":"#ef4444";return(<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><h3 className="text-sm font-semibold text-zinc-300 mb-2">{title}</h3><div className="flex justify-center"><svg viewBox="0 0 120 70" className="w-28"><path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round"/><path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" strokeDasharray={angle/180*157+" 157"}/><text x="60" y="55" textAnchor="middle" className="fill-white text-lg font-bold">"+v+"</text></svg></div></div>);}

export default function Dashboard(){
const [tab,setTab]=useState("overview");
const [stats,setStats]=useState({uc:0,dom:0,init:0,pp:0,risks:0,kpis:0,sh:0,complete:0,scheduled:0});

useEffect(()=>{
const getCount=(k)=>{const d=localStorage.getItem(k);return d?JSON.parse(d).length:0};
setStats({
uc:getCount("ds_04_01_use_case_longlist"),
dom:getCount("ds_02_01_data_domain_inventory"),
init:getCount("ds_06_01_initiative_registry"),
pp:getCount("ds_02_09_pain_point_register"),
risks:getCount("ds_09_01_risk_register"),
kpis:getCount("ds_09_02_kpi_framework"),
sh:getCount("ds_01_01_stakeholder_registry"),
});
const sh=localStorage.getItem("ds_01_01_stakeholder_registry");
if(sh){const arr=JSON.parse(sh);setStats(s=>({...s,complete:arr.filter(x=>x.interview_status=="Completed").length,scheduled:arr.filter(x=>x.interview_status=="Scheduled").length}));}
},[]);

const ucType=[{l:"Analytics",v:45,c:"#3b82f6"},{l:"AI/ML",v:28,c:"#8b5cf6"},{l:"Governance",v:18,c:"#10b981"},{l:"Compliance",v:12,c:"#f59e0b"}];
const maturity=[{l:"Strategy",v:65},{l:"Governance",v:48},{l:"Architecture",v:55},{l:"Quality",v:42},{l:"Analytics",v:72},{l:"Security",v:58}];
const kpis=[{l:"Data Quality",v:stats.kpis?62:0,target:85},{l:"Governance Adoption",v:stats.risks?38:0,target:80},{l:"Platform Maturity",v:stats.init?45:0,target:75},{l:"Stakeholder Coverage",v:stats.sh?(Math.round(stats.complete/stats.sh*100)):0,target:95}];

return(<div className="min-h-screen bg-zinc-950 text-white"><nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-3"><div className="flex gap-1">{"+NAV.map((n,i)=>(<a key={i} href={n.h} className={"+"`px-4 py-2 rounded text-sm font-medium ${i===0?\"bg-blue-600 text-white\":\"bg-zinc-800 text-zinc-300 hover:bg-zinc-700\"}`+"}"+">{"+n.l+"}</a>))}"+"</div></nav><main className="p-6 max-w-7xl mx-auto space-y-6">{"+tab==="overview"&&(<><div className="grid grid-cols-6 gap-4"><div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Use Cases</p><p className="text-3xl font-bold text-white mt-1">"+stats.uc+"</p></div><div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Data Domains</p><p className="text-3xl font-bold text-white mt-1">"+stats.dom+"</p></div><div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Initiatives</p><p className="text-3xl font-bold text-white mt-1">"+stats.init+"</p></div><div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Pain Points</p><p className="text-3xl font-bold text-white mt-1">"+stats.pp+"</p></div><div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Risks</p><p className="text-3xl font-bold text-white mt-1">"+stats.risks+"</p></div><div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Stakeholders</p><p className="text-3xl font-bold text-white mt-1">"+stats.sh+"</p></div></div><div className="grid grid-cols-4 gap-6">{"+kpis.map((k,i)=><GaugeChart key={i} v={k.v} title={k.l}/>)}</div><div className="grid grid-cols-2 gap-6"><DonutChart d={ucType} title="Use Cases by Type"/><ProgressBar d={maturity.map(m=>({...m,c:"#3b82f6"}))} title="DAMA Maturity Score"/></div></>)}"+"</main></div>");}