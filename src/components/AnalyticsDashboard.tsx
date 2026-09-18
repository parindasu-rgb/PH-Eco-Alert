import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Building2,
  Filter,
} from 'lucide-react';
import { Language, Ticket } from '../types';
import { getTranslation } from '../i18n';
import { FACULTIES } from '../seedData';

interface AnalyticsDashboardProps {
  tickets: Ticket[];
  lang: Language;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tickets, lang }) => {
  const t = getTranslation(lang);
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');

  const filteredTickets = tickets.filter(
    (tk) => selectedFaculty === 'all' || tk.location.faculty === selectedFaculty
  );

  const totalCount = filteredTickets.length;
  const pendingCount = filteredTickets.filter((tk) => tk.status !== 'resolved').length;
  const resolvedCount = filteredTickets.filter((tk) => tk.status === 'resolved').length;

  // Monthly trend mock aggregate
  const monthlyData = [
    { month: 'Mar', reports: 12, resolved: 10 },
    { month: 'Apr', reports: 19, resolved: 17 },
    { month: 'May', reports: 15, resolved: 14 },
    { month: 'Jun', reports: 22, resolved: 20 },
    { month: 'Jul', reports: 28, resolved: 25 },
    { month: 'Aug', reports: totalCount, resolved: resolvedCount },
  ];

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  filteredTickets.forEach((tk) => {
    categoryCounts[tk.category] = (categoryCounts[tk.category] || 0) + 1;
  });

  const categoryPieData = Object.keys(categoryCounts).map((cat) => ({
    name: cat.toUpperCase(),
    value: categoryCounts[cat],
  }));

  const PIE_COLORS = ['#3498DB', '#38BDF8', '#A855F7', '#F59E0B', '#16A085', '#F43F5E', '#64748B'];

  // Faculty distribution
  const facultyCounts: Record<string, number> = {};
  tickets.forEach((tk) => {
    const shortName = tk.location.faculty.split('(')[0].trim();
    facultyCounts[shortName] = (facultyCounts[shortName] || 0) + 1;
  });

  const facultyBarData = Object.keys(facultyCounts).map((fac) => ({
    faculty: fac.length > 18 ? fac.substring(0, 18) + '...' : fac,
    count: facultyCounts[fac],
  }));

  return (
    <div className="space-y-6 max-w-6xl mx-auto my-4">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-3xl shadow-md border border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{t.dashboardTitle}</h2>
          <p className="text-xs text-slate-500">{t.dashboardSub}</p>
        </div>

        {/* Faculty Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#16A085]" />
          <select
            value={selectedFaculty}
            onChange={(e) => setSelectedFaculty(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none"
          >
            <option value="all">{lang === 'th' ? 'ทุกคณะ/หน่วยงาน' : 'All Faculties'}</option>
            {FACULTIES.map((fac) => (
              <option key={fac} value={fac}>
                {fac}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Reports */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.totalReports}
            </span>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</h3>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12% from last month
            </span>
          </div>
          <div className="p-3 bg-[#16A085]/10 text-[#16A085] rounded-2xl">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        {/* Pending */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.pendingReports}
            </span>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</h3>
            <span className="text-[11px] text-slate-400 font-medium mt-1 block">
              In progress & queued
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Resolved */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.resolvedReports}
            </span>
            <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</h3>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              {totalCount > 0 ? ((resolvedCount / totalCount) * 100).toFixed(0) : 100}% resolution rate
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Avg Resolution Time */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t.avgResolutionTime}
            </span>
            <h3 className="text-2xl font-extrabold text-sky-600 mt-1">18.5 {t.hours}</h3>
            <span className="text-[11px] text-sky-600 font-medium mt-1 block">
              Target &lt; 24 {t.hours}
            </span>
          </div>
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="p-6 bg-white rounded-3xl shadow-md border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {t.chartMonthly}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="reports" fill="#3498DB" radius={[6, 6, 0, 0]} name="Reports" />
                <Bar dataKey="resolved" fill="#16A085" radius={[6, 6, 0, 0]} name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Donut */}
        <div className="p-6 bg-white rounded-3xl shadow-md border border-slate-200 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            {t.chartCategory}
          </h3>
          <div className="h-64 w-full flex items-center justify-center">
            {categoryPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">No data for this filter</p>
            )}
          </div>
        </div>
      </div>

      {/* Faculty Ranking Bar */}
      <div className="p-6 bg-white rounded-3xl shadow-md border border-slate-200 space-y-4">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          {t.chartFaculty}
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={facultyBarData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="faculty" type="category" width={140} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#16A085" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
