import React from "react";
import { useState, useEffect } from "react";

const NAV=[
  {h:"/",l:"Dashboard"},
  {h:"/explorer",l:"Explorer"},
  {h:"/data",l:"Data Manager"},
  {h:"/stakeholders",l:"Stakeholders"},
  {h:"/roadmap",l:"Roadmap"},
  {h:"/governance",l:"Governance"},
];

function DonutChart({d,title}){
  const t=d.reduce((a,c)=>a+c.v,0);
  let cu=0;
  const p=d.map((c,i)=>{
    const sa=(cu/t)*360-90;
    cu+=c.v;
    const ea=(cu/t)*360-90;
    const x1=100+85*Math.cos(sa*Math.PI/180);
    const y1=100+85*Math.sin(sa*Math.PI/180);
    const x2=100+85*Math.cos(ea*Math.PI/180);
    const y2=100+85*Math.sin(ea*Math.PI/180);
    const la=ea-sa>180?1:0;
    return{path:"M"+x1+" "+y1+"A85 85 0 "+la+" 1 "+x2+" "+y2,c:c.c,l:c.l,pct:Math.round(c.v/t*100)};
  });
  return(<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
    <h3 className="text-sm font-semibold text-zinc-300 mb-3">{title}</h3>
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 200 200" className="w-36 h-36">
        <circle cx="100" cy="100" r="85" fill="none" stroke="#27272a" strokeWidth="20"/>
        {p.map((pp,i)=><path key={i} d={pp.path} fill="none" stroke={pp.c} strokeWidth="18" strokeLinecap="round"/>)}
        <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" className="fill-white text-lg font-bold">{"+t+"}</text>
      </svg>
      <div className="space-y-1">
        {"+d.map((c,i)=><div key={i} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor:c.c}}/><span className="text-xs text-zinc-300">{"+c.l+"}</span><span className="text-xs text-zinc-500 ml-auto">{"+p[i].pct+"}%</span></div>)}
      </div>
    </div>
  </div>);
}

function GaugeChart({v,title}){
  const angle=(v/100)*180;
  const c=v>=70?"#10b981":v>=40?"#eab308":"#ef4444";
  return(<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
    <h3 className="text-sm font-semibold text-zinc-300 mb-2">{title}</h3>
    <div className="flex justify-center">
      <svg viewBox="0 0 120 70" className="w-28">
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke="#27272a" strokeWidth="8" strokeLinecap="round"/>
        <path d="M 10 60 A 50 50 0 0 1 110 60" fill="none" stroke={c} strokeWidth="8" strokeLinecap="round" strokeDasharray={"+angle/180*157+" 157"}/>
        <text x="60" y="55" textAnchor="middle" className="fill-white text-lg font-bold">{"+v+"}</text>
      </svg>
    </div>
  </div>);
}

function BarChart({d,title,c="#3b82f6"}){
  const m=Math.max(...d.map(x=>x.v),1);
  return(<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
    <h3 className="text-sm font-semibold text-zinc-300 mb-3">{title}</h3>
    <div className="flex items-end gap-2 h-32">
      {"+d.map((x,i)=><div key={i} className="flex-1 flex flex-col items-center gap-1">
        <div className="w-full rounded-t" style={{height:Math.max((x.v/m)*110,4)+"px",background:"linear-gradient(to top,"+c+"dd,"+c+"88)"}}/>
        <span className="text-[10px] text-zinc-500">{"+x.l+"}</span>
      </div>)}
    </div>
  </div>);
}

export default function Dashboard(){
  const [stats,setStats]=useState({uc:0,dom:0,init:0,pp:0,risks:0,kpis:0,sh:0,complete:0,champions:0,gaps:0});
  const [ucData,setUcData]=useState([]);
  const [initData,setInitData]=useState([]);
  const [gapData,setGapData]=useState([]);

  useEffect(()=>{
    const get=(k)=>{const d=localStorage.getItem(k);return d?JSON.parse(d):[]};
    const uc=get("ds_04_01_use_case_longlist");
    const init=get("ds_06_01_initiative_registry");
    const sh=get("ds_01_01_stakeholder_registry");
    const gap=get("ds_03_01_gap_register");
    setUcData(uc);setInitData(init);setGapData(gap);
    setStats({
      uc:uc.length,
      dom:(localStorage.getItem("ds_02_01_data_domain_inventory")||"[]").length?JSON.parse(localStorage.getItem("ds_02_01_data_domain_inventory")).length:0,
      init:init.length,
      pp:(localStorage.getItem("ds_02_09_pain_point_register")||"[]").length?JSON.parse(localStorage.getItem("ds_02_09_pain_point_register")).length:0,
      risks:(localStorage.getItem("ds_09_01_risk_register")||"[]").length?JSON.parse(localStorage.getItem("ds_09_01_risk_register")).length:0,
      kpis:(localStorage.getItem("ds_09_02_kpi_framework")||"[]").length?JSON.parse(localStorage.getItem("ds_09_02_kpi_framework")).length:0,
      sh:sh.length,
      complete:sh.filter(x=>x.interview_status==="Completed").length,
      champions:sh.filter(x=>x.attitude_toward_change==="Champion").length,
      gaps:gap.length,
    });
  },[]);

  const completionPct=stats.sh>0?Math.round(stats.complete/stats.sh*100):0;
  const w1=initData.filter(i=>i.wave==="Wave 1").length;
  const w2=initData.filter(i=>i.wave==="Wave 2").length;
  const w3=initData.filter(i=>i.wave==="Wave 3").length;

  const ucByDomain={};
  ucData.forEach(u=>{if(u.business_domain){ucByDomain[u.business_domain]=(ucByDomain[u.business_domain]||0)+1;}});
  const ucDomainD=Object.entries(ucByDomain).map(([l,v],i)=>({l,v,c:["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899"][i%6]}));

  const gapSev={};
  gapData.forEach(g=>{if(g.severity){gapSev[g.severity]=(gapSev[g.severity]||0)+1;}});
  const gapSevD=Object.entries(gapSev).map(([l,v],i)=>({l,v,c:l==="Critical"?"#ef4444":l==="High"?"#f97316":l==="Medium"?"#eab308":"#6b7280"}));

  return(<div className="min-h-screen bg-zinc-950 text-white">
    <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-3"><div className="flex gap-1">{"+NAV.map((n,i)=>(<a key={i} href={n.h} className={"+"`px-4 py-2 rounded text-sm font-medium ${i===0?"bg-blue-600 text-white":"bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`+"}>{"+n.l+"}</a>))}</div></nav>
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Data Strategy Command Center</h1>
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Use Cases</p><p className="text-3xl font-bold text-white mt-1">{"+stats.uc}</p></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Initiatives</p><p className="text-3xl font-bold text-white mt-1">{"+stats.init}</p><p className="text-xs text-zinc-500">{"+w1+"}W1 / {"+w2+"}W2 / {"+w3+"}W3</p></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Data Domains</p><p className="text-3xl font-bold text-white mt-1">{"+stats.dom}</p></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Pain Points</p><p className="text-3xl font-bold text-white mt-1">{"+stats.pp}</p></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Risks</p><p className="text-3xl font-bold text-white mt-1">{"+stats.risks}</p></div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4"><p className="text-zinc-400 text-xs uppercase">Stakeholders</p><p className="text-3xl font-bold text-white mt-1">{"+stats.sh}</p><p className="text-xs text-zinc-500">{"+stats.complete} done</p></div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">Interview Progress</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#27272a" strokeWidth="8"/>
                <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={"+completionPct*2.51+" 251"} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold">{"+completionPct+"}%</span></div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-400">Completed</span><span className="text-emerald-400 font-medium">{"+stats.complete}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Champions</span><span className="text-emerald-400 font-medium">{"+stats.champions}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Gaps</span><span className="text-amber-400 font-medium">{"+stats.gaps}</span></div>
            </div>
          </div>
        </div>
        {"+ucDomainD.length>0?<DonutChart d={ucDomainD} title="Use Cases by Domain"/>:<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><h3 className="text-sm font-semibold text-zinc-300 mb-3">Use Cases by Domain</h3><p className="text-zinc-500 text-center py-8">Add use cases in Data Manager</p></div>}
        {"+gapSevD.length>0?<DonutChart d={gapSevD} title="Gaps by Severity"/>:<div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"><h3 className="text-sm font-semibold text-zinc-300 mb-3">Gaps by Severity</h3><p className="text-zinc-500 text-center py-8">Add gaps in Data Manager</p></div>}
        <BarChart d={[{l:"Wave 1",v:w1},{l:"Wave 2",v:w2},{l:"Wave 3",v:w3}]} title="Initiatives by Wave"/>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <GaugeChart v={completionPct} title="Interview Coverage"/>
        <GaugeChart v={stats.kpis>0?Math.min(100,stats.kpis*5):0} title="KPI Framework"/>
        <GaugeChart v={stats.gaps>0?Math.max(0,100-stats.gaps*10):100} title="Gap Resolution"/>
        <GaugeChart v={stats.pp>0?Math.max(0,100-stats.pp*5):100} title="Pain Point Mitigation"/>
      </div>
    </main>
  </div>);
}