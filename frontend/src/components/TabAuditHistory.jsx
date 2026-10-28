import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Database, 
  Trash2, 
  Download, 
  RefreshCw, 
  Search, 
  UtensilsCrossed, 
  Apple, 
  ShieldCheck, 
  ChefHat, 
  CalendarRange 
} from "lucide-react";
import { getHistoryApi, getStatsApi } from "../api";

export default function TabAuditHistory() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterModule, setFilterModule] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [histData, statsData] = await Promise.all([
        getHistoryApi().catch(() => []),
        getStatsApi().catch(() => null)
      ]);
      setHistory(histData || []);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `foodverse_audit_log_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredHistory = history.filter((item) => {
    const matchesModule = filterModule === "all" || item.module === filterModule;
    const matchesQuery = !searchQuery || item.input_title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModule && matchesQuery;
  });

  const getModuleIcon = (mod) => {
    switch (mod) {
      case "nutrition": return <UtensilsCrossed className="w-4 h-4 text-emerald-400" />;
      case "freshness": return <Apple className="w-4 h-4 text-teal-400" />;
      case "hygiene": return <ShieldCheck className="w-4 h-4 text-blue-400" />;
      case "recipe": return <ChefHat className="w-4 h-4 text-amber-400" />;
      case "mealplan": return <CalendarRange className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/80 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold mb-3">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Epic 6: Persistent SQLite Audit Trail & Analytics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
              Food Intelligence Audit Log
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Complete historical record of food recognitions, freshness diagnostics, kitchen hygiene violations, and generated plans.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Refresh Records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleExportJson}
              disabled={history.length === 0}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Aggregate Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Audits</div>
            <div className="text-2xl font-black text-white font-display mt-1">{stats.total_audits || history.length}</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Nutrition Scans</div>
            <div className="text-2xl font-black text-emerald-400 font-display mt-1">{stats.nutrition_scans}</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Freshness Tests</div>
            <div className="text-2xl font-black text-teal-400 font-display mt-1">{stats.freshness_diagnostics}</div>
          </div>
          <div className="glass-card p-4 rounded-xl border border-slate-800">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Avg Hygiene Compliance</div>
            <div className="text-2xl font-black text-blue-400 font-display mt-1">{stats.avg_hygiene_score}%</div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit titles, dishes, items..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex space-x-1 overflow-x-auto pb-1">
          {[
            { id: "all", label: "All Events" },
            { id: "nutrition", label: "Nutrition" },
            { id: "freshness", label: "Freshness" },
            { id: "hygiene", label: "Hygiene" },
            { id: "recipe", label: "Recipes" },
            { id: "mealplan", label: "Meal Plans" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setFilterModule(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap transition ${
                filterModule === m.id
                  ? "bg-slate-700 text-white border-slate-600"
                  : "bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        {filteredHistory.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {filteredHistory.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                    {getModuleIcon(item.module)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{item.input_title}</span>
                      <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {item.module}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(item.timestamp).toLocaleString()} • ID #{item.id}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-center">
                  {item.score !== null && (
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-400">{item.score}</div>
                      <div className="text-[10px] text-slate-500">Metric / Cal</div>
                    </div>
                  )}
                  {item.status && (
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-semibold text-slate-300 border border-slate-700">
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Activity className="w-8 h-8 mx-auto text-slate-600" />
            <div className="text-sm font-semibold">No audit logs found</div>
            <p className="text-xs">Run a food recognition, freshness diagnostic, or hygiene audit to populate records.</p>
          </div>
        )}
      </div>
    </div>
  );
}
