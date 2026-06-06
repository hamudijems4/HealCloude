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
    { label: 'Total Clients', value: '3,580', icon: Users, trend: '+ 12.5%', color: 'blue', data: [40, 30, 45, 35, 50, 40, 60] },
    { label: 'Passports', value: '2,945', icon: BookOpen, trend: '+ 8.3%', color: 'green', data: [30, 40, 35, 50, 45, 55, 65] },
    { label: 'Visas Processing', value: '1,248', icon: FileText, trend: '+ 5.7%', color: 'purple', data: [20, 30, 25, 35, 30, 40, 45] },
    { label: 'Upcoming Departures', value: '18', icon: Plane, trend: '+ 20.0%', color: 'orange', data: [10, 15, 12, 18, 15, 20, 25] },
    { label: 'Revenue (This Month)', value: '$128,430', icon: CreditCard, trend: '+ 15.3%', color: 'red', data: [50, 45, 60, 55, 70, 65, 80] },
  ];

  const revenueData = [
    { name: 'Jan', value: 50 }, { name: 'Feb', value: 80 }, { name: 'Mar', value: 60 },
    { name: 'Apr', value: 100 }, { name: 'May', value: 128 }, { name: 'Jun', value: 110 },
    { name: 'Jul', value: 140 }, { name: 'Aug', value: 130 }, { name: 'Sep', value: 160 },
    { name: 'Oct', value: 150 }, { name: 'Nov', value: 180 }, { name: 'Dec', value: 170 },
  ];

  const countryData = [
    { name: 'Pakistan', value: 45, color: '#3b82f6' },
    { name: 'India', value: 20, color: '#8b5cf6' },
    { name: 'Bangladesh', value: 15, color: '#22c55e' },
    { name: 'Nepal', value: 10, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#ef4444' },
  ];

  const visaData = [
    { name: 'Approved', value: 658, color: '#22c55e' },
    { name: 'Processing', value: 356, color: '#3b82f6' },
    { name: 'Pending', value: 134, color: '#f59e0b' },
    { name: 'Rejected', value: 100, color: '#ef4444' },
  ];

  const navigate = useNavigate();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRevenueDropdown, setShowRevenueDropdown] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showVisaOptions, setShowVisaOptions] = useState(false);

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Follow up with visa applications', desc: '12 Pending', tag: 'Today', tagColor: 'red', checked: false },
    { id: 2, title: 'Passport expiry check', desc: '8 Passports', tag: 'Tomorrow', tagColor: 'orange', checked: false },
    { id: 3, title: 'Confirm hotel bookings', desc: '3 Groups', tag: 'May 26', tagColor: 'blue', checked: false }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="welcome-title">Good Morning, Ahmed 👋</h1>
          <p className="welcome-subtitle">Here's what's happening with your agency today.</p>
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
              <h3>Revenue Overview</h3>
              <div className="revenue-total">
                <h2>$1,482,430</h2>
                <span className="text-green text-sm font-medium">↑ 18.6% vs last year</span>
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
            <h3>Clients by Country</h3>
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
              <h2>3,580</h2>
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
            <h3>Visa Status Overview</h3>
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
              <h2>1,248</h2>
              <span>Total Visas</span>
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
            <h3>Upcoming Departures</h3>
            <button className="view-all-btn" onClick={() => navigate('/dashboard/flights')}>View All</button>
          </div>
          <div className="list-group">
            {[1, 2, 3, 4].map((_, i) => (
              <div key={i} className="list-item">
                <div className="list-date">
                  <span className="month">MAY</span>
                  <span className="day">{25 + i}</span>
                </div>
                <div className="list-details">
                  <h4>Umrah Group - May 2025</h4>
                  <div className="list-meta">
                    <span>👥 32 People</span>
                    <span>📍 Jeddah, Saudi Arabia</span>
                  </div>
                </div>
                <div className="list-flight">
                  <div className="airline-logo bg-green-light text-green">✈️</div>
                  <div className="flight-info">
                    <span className="flight-no">SV 245</span>
                    <span className="flight-time">10:30 AM</span>
                  </div>
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
                  <h4>New client registered</h4>
                  <span>10 min ago</span>
                </div>
                <p>Ali Raza has been added as a new client.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon bg-purple-light text-purple"><FileText size={14} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>Visa approved</h4>
                  <span>1 hour ago</span>
                </div>
                <p>Visa for Muhammad Ahmed has been approved.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon bg-green-light text-green"><CreditCard size={14} /></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <h4>Payment received</h4>
                  <span>2 hours ago</span>
                </div>
                <p>Payment of $1,250 received from Sarah Khan.</p>
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
