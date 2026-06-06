import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, BookOpen, FileText, Plane, CreditCard, 
  Calendar, ChevronDown, MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const stats = [
    { label: 'Registered Patients',  value: '2,847,391', icon: Users,       trend: '+ 3.2%',  color: 'blue',   data: [40, 30, 45, 35, 50, 40, 60] },
    { label: 'Facilities Online',    value: '1,204',     icon: BookOpen,    trend: '+ 1.8%',  color: 'green',  data: [30, 40, 35, 50, 45, 55, 65] },
    { label: 'AI Interventions Today',value: '14,823',   icon: FileText,    trend: '+ 9.4%',  color: 'purple', data: [20, 30, 25, 35, 30, 40, 45] },
    { label: 'Active Alerts',        value: '3',         icon: Plane,       trend: '- 2',     color: 'orange', data: [10, 15, 12, 18, 15, 20, 25] },
    { label: 'Avg Wellness Score',   value: '62.4%',     icon: CreditCard,  trend: '+ 1.4%',  color: 'red',    data: [50, 45, 60, 55, 70, 65, 80] },
  ];

  const revenueData = [
    { name: 'Jan', value: 58 }, { name: 'Feb', value: 61 }, { name: 'Mar', value: 59 },
    { name: 'Apr', value: 63 }, { name: 'May', value: 62 }, { name: 'Jun', value: 65 },
    { name: 'Jul', value: 64 }, { name: 'Aug', value: 67 }, { name: 'Sep', value: 66 },
    { name: 'Oct', value: 69 }, { name: 'Nov', value: 68 }, { name: 'Dec', value: 71 },
  ];

  const countryData = [
    { name: 'Addis Ababa', value: 35, color: '#3b82f6' },
    { name: 'Oromia',      value: 28, color: '#8b5cf6' },
    { name: 'Amhara',      value: 18, color: '#22c55e' },
    { name: 'SNNPR',       value: 12, color: '#f59e0b' },
    { name: 'Others',      value: 7,  color: '#ef4444' },
  ];

  const visaData = [
    { name: 'Low Risk',      value: 1240, color: '#22c55e' },
    { name: 'Medium Risk',   value: 890,  color: '#f59e0b' },
    { name: 'High Risk',     value: 420,  color: '#ef4444' },
    { name: 'Critical',      value: 85,   color: '#dc2626' },
  ];

  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showVisaOptions, setShowVisaOptions] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Review high-risk patient alerts', desc: '14 flagged today',     tag: 'Urgent',    tagColor: 'red',    checked: false },
    { id: 2, title: 'Sync Afar region FHIR records',  desc: '3 facilities offline',  tag: 'Today',     tagColor: 'orange', checked: false },
    { id: 3, title: 'Send TB follow-up SMS nudges',   desc: '87 patients overdue',   tag: 'May 26',    tagColor: 'blue',   checked: false },
    { id: 4, title: 'Validate Oromia outbreak data',  desc: 'Diarrhea — 342 cases',  tag: 'May 27',    tagColor: 'purple', checked: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">Good Morning, MoH Analyst 👋</h1>
          <p className="welcome-subtitle">Here's Ethiopia's national health status for today.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <button className="date-picker-btn card" onClick={() => setShowDatePicker(!showDatePicker)}>
            <Calendar size={16} />
            <span>May 24, 2025</span>
            <ChevronDown size={16} />
          </button>
          {showDatePicker && (
            <div className="dropdown-menu">
              <button>Today</button>
              <button>This Week</button>
              <button>This Month</button>
            </div>
          )}
        </div>
      </div>

      {/* Top Stats */}
      <div className="stats-row">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-top">
              <div className={`stat-icon-wrapper bg-${stat.color}-light text-${stat.color}`}>
                <stat.icon size={20} strokeWidth={2.5} />
              </div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
            </div>
            <div className="stat-middle">
              <span className={`stat-trend text-${stat.color}`}>↑ {stat.trend}</span>
              <span className="stat-vs">vs last month</span>
            </div>
            <div className="stat-sparkline">
              <ResponsiveContainer width="100%" height={40}>
                <AreaChart data={stat.data.map(v => ({ value: v }))}>
                  <Area type="monotone" dataKey="value" stroke={`var(--color-${stat.color})`} fill={`var(--color-${stat.color})`} fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Charts */}
      <div className="charts-row">
        {/* Revenue Overview */}
        <div className="chart-card card col-span-2">
          <div className="card-header">
            <div>
              <h3>National Wellness Trend</h3>
              <div className="revenue-total">
                <h2>62.4%</h2>
                <span className="text-green text-sm font-medium">↑ 1.4% vs last month</span>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <button className="dropdown-btn" onClick={() => setShowRevenueDropdown(!showRevenueDropdown)}>
                This Year <ChevronDown size={14} />
              </button>
              {showRevenueDropdown && (
                <div className="dropdown-menu right">
                  <button>This Year</button>
                  <button>Last Year</button>
                </div>
              )}
            </div>
          </div>
          <div className="chart-body" style={{ height: 200, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5c59f0" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#5c59f0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8492a6' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8492a6' }} tickFormatter={(value) => `$${value}K`} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#5c59f0" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clients by Country */}
        <div className="chart-card card">
          <div className="card-header">
            <h3>Patients by Region</h3>
            <div style={{ position: 'relative' }}>
              <button className="dropdown-btn" onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
                All Countries <ChevronDown size={14} />
              </button>
              {showCountryDropdown && (
                <div className="dropdown-menu right">
                  <button>All Countries</button>
                  <button>Top 5</button>
                </div>
              )}
            </div>
          </div>
          <div className="donut-chart-wrapper">
            <div className="donut-inner">
              <h2>2.8M</h2>
              <span>Total</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={countryData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {countryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {countryData.map((item, i) => (
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Visa Status Overview */}
        <div className="chart-card card">
          <div className="card-header">
            <h3>Wellness Risk Overview</h3>
            <div style={{ position: 'relative' }}>
              <button className="icon-btn" onClick={() => setShowVisaOptions(!showVisaOptions)}>
                <MoreHorizontal size={18} />
              </button>
              {showVisaOptions && (
                <div className="dropdown-menu right">
                  <button>Export Data</button>
                  <button>Print Report</button>
                </div>
              )}
            </div>
          </div>
          <div className="donut-chart-wrapper">
            <div className="donut-inner">
              <h2>2,635</h2>
              <span>Assessed</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={visaData} innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                  {visaData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            {visaData.map((item, i) => (
              <div key={i} className="legend-item">
                <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
                <span className="legend-label">{item.name}</span>
                <span className="legend-value">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Widgets */}
      <div className="widgets-row">
        {/* Upcoming Departures */}
        <div className="widget-card card col-span-2">
          <div className="card-header">
            <h3>Active Disease Alerts</h3>
            <button className="view-all-btn" onClick={() => navigate('/dashboard/alerts')}>View All</button>
          </div>
          <div className="list-group">
            {[
              { region: 'Oromia', zone: 'East Hararghe', disease: 'Diarrhea',     cases: 342, severity: 'warning', day: 'MAY', date: 24 },
              { region: 'Afar',   zone: 'Zone 1',        disease: 'Malaria',      cases: 89,  severity: 'watch',   day: 'MAY', date: 25 },
              { region: 'Tigray', zone: 'South Tigray',  disease: 'Tuberculosis', cases: 27,  severity: 'emergency', day: 'MAY', date: 23 },
              { region: 'SNNPR',  zone: 'Wolayita',      disease: 'Cholera',      cases: 14,  severity: 'watch',   day: 'MAY', date: 22 },
            ].map((alert, i) => (
              <div key={i} className="list-item">
                <div className="list-date">
                  <span className="month">{alert.day}</span>
                  <span className="day">{alert.date}</span>
                </div>
                <div className="list-details">
                  <h4>{alert.disease} — {alert.region}</h4>
                  <div className="list-meta">
                    <span>📍 {alert.zone}</span>
                    <span>🦠 {alert.cases} cases</span>
                  </div>
                </div>
                <div className="list-flight">
                  <span className={`task-tag text-${ alert.severity === 'emergency' ? 'red' : alert.severity === 'warning' ? 'orange' : 'blue' }`}>
                    {alert.severity}
                  </span>
                </div>
                <ChevronDown size={18} className="list-chevron" style={{ transform: 'rotate(-90deg)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="widget-card card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <button className="view-all-btn" onClick={() => navigate('/dashboard/reports')}>View All</button>
          </div>
          <div className="timeline-group">
            <div className="timeline-item">
              <div className="timeline-icon bg-blue-light text-blue"><Users size={14} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>New patient registered</h4>
                  <span>10 min ago</span>
                </div>
                <p>Abebe Haile (ET8823710293) registered via Fayda ID.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon bg-purple-light text-purple"><FileText size={14} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>High risk score flagged</h4>
                  <span>1 hour ago</span>
                </div>
                <p>Patient Tigist Bekele scored 78/100 — AI sent SMS nudge.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon bg-green-light text-green"><CreditCard size={14} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>FHIR record synced</h4>
                  <span>2 hours ago</span>
                </div>
                <p>Tikur Anbessa Hospital synced 42 new FHIR records.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks & Reminders */}
        <div className="widget-card card">
          <div className="card-header">
            <h3>Tasks & Reminders</h3>
            <button className="view-all-btn" onClick={() => navigate('/dashboard/tasks')}>View All</button>
          </div>
          <div className="tasks-group">
            {tasks.map((task) => (
              <div key={task.id} className="task-item">
                <input 
                  type="checkbox" 
                  className="task-checkbox" 
                  checked={task.checked}
                  onChange={() => toggleTask(task.id)}
                />
                <div className={`task-content ${task.checked ? 'completed' : ''}`}>
                  <h4>{task.title}</h4>
                  <p>{task.desc}</p>
                </div>
                <span className={`task-tag text-${task.tagColor}`}>{task.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
