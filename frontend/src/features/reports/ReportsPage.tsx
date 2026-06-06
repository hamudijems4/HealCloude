import React from 'react';
import { Download, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import './ReportsPage.css';

export const ReportsPage: React.FC = () => {
  const revenueData = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 8500 },
    { name: 'May', revenue: 12400 },
    { name: 'Jun', revenue: 9000 },
  ];

  const visaData = [
    { name: 'Saudi Arabia', count: 120 },
    { name: 'UAE', count: 85 },
    { name: 'Qatar', count: 40 },
    { name: 'Oman', count: 25 },
  ];

  const professionData = [
    { name: 'Drivers', value: 45, color: '#3b82f6' },
    { name: 'Construction', value: 35, color: '#f59e0b' },
    { name: 'Nurses', value: 25, color: '#22c55e' },
    { name: 'Domestic', value: 15, color: '#8b5cf6' },
  ];

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Comprehensive data insights for your agency's performance.</p>
        </div>
        <div className="flex-center gap-1">
          <button className="btn-secondary">
            <CalendarIcon size={16} /> Last 6 Months
          </button>
          <button className="btn-primary">
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      <div className="reports-grid">
        {/* Revenue Chart */}
        <div className="report-card card col-span-2">
          <div className="r-card-header">
            <h3>Revenue Growth</h3>
            <button className="icon-btn"><Filter size={16} /></button>
          </div>
          <div className="r-chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5c59f0" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#5c59f0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dx={-10} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#5c59f0" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visas by Country */}
        <div className="report-card card">
          <div className="r-card-header">
            <h3>Visas by Country</h3>
          </div>
          <div className="r-chart-container" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visaData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={90} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Professions Breakdown */}
        <div className="report-card card">
          <div className="r-card-header">
            <h3>Top Professions</h3>
          </div>
          <div className="r-chart-container flex-center" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={professionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {professionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
