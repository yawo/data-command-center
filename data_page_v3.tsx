import { useState, useEffect } from "react";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/explorer", label: "Explorer" },
  { href: "/data", label: "Data Manager", active: true },
  { href: "/stakeholders", label: "Stakeholders" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/governance", label: "Governance" },
];

export default function DataManager() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-3">
        <div className="flex gap-1">
          {NAV.map((n, i) => (
            <a key={i} href={n.href}
              className={`px-4 py-2 rounded text-sm font-medium ${n.active ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}>
              {n.label}
            </a>
          ))}
        </div>
      </nav>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Data Manager</h1>
        <p className="text-zinc-400">Add navigation menu - 46 datasets with full CRUD</p>
      </main>
    </div>
  );
}
