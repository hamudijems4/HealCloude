import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { Smartphone, Globe, Clock, TrendingUp } from 'lucide-react';
import './USSDAnalyticsPage.css';

const HOURLY = [
  { hour:'00', sessions:42  }, { hour:'01', sessions:28  }, { hour:'02', sessions:18  },
  { hour:'03', sessions:12  }, { hour:'04', sessions:15  }, { hour:'05', sessions:38  },
  { hour:'06', sessions:124 }, { hour:'07', sessions:287 }, { hour:'08', sessions:412 },
  { hour:'09', sessions:498 }, { hour:'10', sessions:521 }, { hour:'11', sessions:489 },
  { hour:'12', sessions:376 }, { hour:'13', sessions:445 }, { hour:'14', sessions:510 },
  { hour:'15', sessions:487 }, { hour:'16', sessions:423 }, { hour:'17', sessions:398 },
  { hour:'18', sessions:312 }, { hour:'19', sessions:267 }, { hour:'20', sessions:198 },
  { hour:'21', sessions:142 }, { hour:'22', sessions:98  }, { hour:'23', sessions:63  },
];

const WEEKLY = [
  { day:'Mon', sessions:3421, completed:2890 },
  { day:'Tue', sessions:3876, completed:3210 },
  { day:'Wed', sessions:4102, completed:3540 },
  { day:'Thu', sessions:3987, completed:3380 },
  { day:'Fri', sessions:4320, completed:3720 },
  { day:'Sat', sessions:2890, completed:2410 },
  { day:'Sun', sessions:2340, completed:1980 },
];

const LANGUAGES = [
  { name:'Amharic',  value:52, color:'#2563eb' },
  { name:'English',  value:28, color:'#059669' },
  { name:'Oromiffa', value:13, color:'#d97706' },
  { name:'Tigrinya', value:7,  color:'#7c3aed' },
];

const TOP_MENUS = [
  { menu:'1 — View Appointments',   sessions:12840, pct:34 },
  { menu:'2 — Wellness Score',      sessions:9210,  pct:24 },
  { menu:'3 — Medication Reminder', sessions:6740,  pct:18 },
  { menu:'4 — Emergency Info',      sessions:4980,  pct:13 },
  { menu:'5 — Change Language',     sessions:2340,  pct:6  },
  { menu:'6 — Register / Update',   sessions:1890,  pct:5  },
];

const REGIONS = [
  { region:'Oromia',      sessions:8940, color:'#2563eb' },
  { region:'Amhara',      sessions:7210, color:'#7c3aed' },
  { region:'Addis Ababa', sessions:6540, color:'#059669' },
  { region:'SNNPR',       sessions:4320, color:'#d97706' },
  { region:'Tigray',      sessions:3870, color:'#ec4899' },
  { region:'Somali',      sessions:2890, color:'#ef4444' },
];

const SEED_FEED = [
  { id:1, phone:'+251 9** *** 455', lang:'am', menu:'Appointments',   region:'Tigray',       time:'2s ago',  status:'active'    },
  { id:2, phone:'+251 9** *** 877', lang:'en', menu:'Wellness Score', region:'Oromia',       time:'8s ago',  status:'completed' },
  { id:3, phone:'+251 9** *** 123', lang:'am', menu:'Medication',     region:'Amhara',       time:'15s ago', status:'completed' },
  { id:4, phone:'+251 9** *** 341', lang:'or', menu:'Emergency Info', region:'SNNPR',        time:'22s ago', status:'completed' },
  { id:5, phone:'+251 9** *** 690', lang:'am', menu:'Appointments',   region:'Addis Ababa',  time:'31s ago', status:'active'    },
  { id:6, phone:'+251 9** *** 502', lang:'ti', menu:'Wellness Score', region:'Tigray',       time:'44s ago', status:'completed' },
  { id:7, phone:'+251 9** *** 218', lang:'en', menu:'Register',       region:'Oromia',       time:'58s ago', status:'completed' },
];

const LANG_LABEL: Record<string,string> = { am:'አማ', en:'EN', or:'OM', ti:'TI' };
const LANG_COLOR: Record<string,string> = { am:'#2563eb', en:'#059669', or:'#d97706', ti:'#7c3aed' };
const PHONES  = ['+251 9** *** 314', '+251 9** *** 882', '+251 9** *** 447', '+251 9** *** 991'];
const MENUS   = ['Appointments', 'Wellness Score', 'Medication', 'Emergency Info'];
const REG     = ['Oromia', 'Amhara', 'Tigray', 'SNNPR', 'Addis Ababa'];
const LANGS   = ['am', 'en', 'am', 'or'];

export const USSDAnalyticsPage: React.FC = () => {
  const [feed, setFeed]   = useState(SEED_FEED);
  const [tick, setTick]   = useState(0);
  const [count, setCount] = useState(3421);

  useEffect(() => {
    const t = setInterval(() => {
      setTick(n => n + 1);
      setCount(n => n + Math.floor(Math.random() * 4) + 1);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (tick === 0) return;
    setFeed(prev => [{
      id:     Date.now(),
      phone:  PHONES[tick % PHONES.length],
      lang:   LANGS[tick % LANGS.length],
      menu:   MENUS[tick % MENUS.length],
      region: REG[tick % REG.length],
      time:   'just now',
      status: 'active',
    }, ...prev.slice(0, 6)]);
  }, [tick]);

  return (
    <div className="ua">
      <div className="ua__header">
        <div>
          <h1>USSD Analytics</h1>
          <p>Real-time reach via <strong>*961#</strong> — 2G feature phones · No internet required</p>
        </div>
        <div className="ua__live-badge">
          <span className="ua__live-dot"/>
          LIVE · {count.toLocaleString()} sessions today
        </div>
      </div>

      <div className="ua__kpis">
        {[
          { icon:<Smartphone size={18}/>, label:'Sessions Today',       value:count.toLocaleString(), color:'#2563eb', sub:'across all regions'         },
          { icon:<TrendingUp size={18}/>, label:'Completion Rate',      value:'84.7%',                color:'#059669', sub:'+2.1% vs last week'          },
          { icon:<Globe size={18}/>,      label:'Languages Active',     value:'4',                    color:'#7c3aed', sub:'am · en · or · ti'           },
          { icon:<Clock size={18}/>,      label:'Avg Session Duration', value:'38s',                  color:'#d97706', sub:'down from 45s last month'    },
        ].map((k, i) => (
          <div key={i} className="ua__kpi" style={{ borderLeftColor:k.color }}>
            <div className="ua__kpi-icon" style={{ background:`${k.color}15`, color:k.color }}>{k.icon}</div>
            <div>
              <span className="ua__kpi-val" style={{ color:k.color }}>{k.value}</span>
              <span className="ua__kpi-lbl">{k.label}</span>
              <span className="ua__kpi-sub">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="ua__top">
        <div className="ch-card ua__card ua__card--wide">
          <div className="ua__card-head">
            <div><h3>Sessions by Hour (Today)</h3><p>Peak hours: 9AM–5PM · Feature phone usage pattern</p></div>
          </div>
          <div style={{ height:200, padding:'0 1rem 1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY} margin={{ top:5, right:5, left:0, bottom:0 }}>
                <defs>
                  <linearGradient id="uaG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize:10, fill:'#94a3b8' }} interval={2}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Area type="monotone" dataKey="sessions" stroke="#2563eb" strokeWidth={2.5} fill="url(#uaG)" dot={false}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ch-card ua__card">
          <div className="ua__card-head">
            <div><h3>Language Split</h3><p>Session language selection today</p></div>
          </div>
          <div className="ua__donut-wrap">
            <div className="ua__donut-center"><span>4</span><small>languages</small></div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={LANGUAGES} cx="50%" cy="50%" innerRadius={55} outerRadius={78} paddingAngle={4} dataKey="value">
                  {LANGUAGES.map((e, i) => <Cell key={i} fill={e.color}/>)}
                </Pie>
                <Tooltip formatter={(v: unknown) => [`${v as number}%`, 'Share']} contentStyle={{ borderRadius:8, border:'none' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="ua__lang-legend">
            {LANGUAGES.map((d, i) => (
              <div key={i}><i style={{ background:d.color }}/><span>{d.name}</span><strong style={{ color:d.color }}>{d.value}%</strong></div>
            ))}
          </div>
        </div>
      </div>

      <div className="ua__mid">
        <div className="ch-card ua__card ua__card--wide">
          <div className="ua__card-head">
            <div><h3>Weekly Volume</h3><p>Total vs completed sessions</p></div>
          </div>
          <div style={{ height:200, padding:'0 1rem 1rem' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY} margin={{ top:5, right:5, left:0, bottom:0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize:12, fill:'#94a3b8' }}/>
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize:11, fill:'#94a3b8' }}/>
                <Tooltip contentStyle={{ borderRadius:8, border:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.1)' }}/>
                <Bar dataKey="sessions"  fill="#dbeafe" radius={[4,4,0,0]} barSize={20} name="Total"/>
                <Bar dataKey="completed" fill="#2563eb" radius={[4,4,0,0]} barSize={20} name="Completed"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="ch-card ua__card">
          <div className="ua__card-head">
            <div><h3>Sessions by Region</h3><p>This week</p></div>
          </div>
          <div className="ua__regions">
            {REGIONS.map((r, i) => (
              <div key={i} className="ua__region-row">
                <span>{r.region}</span>
                <div className="ua__region-track">
                  <div className="ua__region-fill" style={{ width:`${(r.sessions/REGIONS[0].sessions)*100}%`, background:r.color }}/>
                </div>
                <span style={{ color:r.color, fontWeight:700 }}>{r.sessions.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ua__bottom">
        <div className="ch-card ua__card">
          <div className="ua__card-head">
            <div><h3>Top Menu Selections</h3><p>Most accessed features via USSD</p></div>
          </div>
          <div className="ua__menus">
            {TOP_MENUS.map((m, i) => (
              <div key={i} className="ua__menu-row">
                <span className="ua__menu-rank">{i + 1}</span>
                <div className="ua__menu-info">
                  <span className="ua__menu-name">{m.menu}</span>
                  <div className="ua__menu-track">
                    <div className="ua__menu-fill" style={{ width:`${m.pct}%` }}/>
                  </div>
                </div>
                <div className="ua__menu-stats">
                  <span>{m.sessions.toLocaleString()}</span>
                  <span className="ua__menu-pct">{m.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ch-card ua__card ua__card--wide">
          <div className="ua__card-head">
            <div><h3>Live Session Feed</h3><p>Real-time USSD activity — anonymized</p></div>
            <span className="ua__live-tag"><span className="ua__live-dot"/>Live</span>
          </div>
          <div className="ua__feed">
            {feed.map((s, i) => (
              <div key={s.id} className={`ua__feed-row ${i === 0 ? 'ua__feed-row--new' : ''}`}>
                <div className="ua__feed-lang" style={{ background:`${LANG_COLOR[s.lang]}20`, color:LANG_COLOR[s.lang] }}>
                  {LANG_LABEL[s.lang]}
                </div>
                <div className="ua__feed-info">
                  <span className="ua__feed-phone">{s.phone}</span>
                  <span className="ua__feed-menu">{s.menu} · {s.region}</span>
                </div>
                <div className="ua__feed-right">
                  <span className={`ua__feed-status ${s.status === 'active' ? 'ua__feed-status--active' : ''}`}>
                    {s.status === 'active' ? '● Active' : '✓ Done'}
                  </span>
                  <span className="ua__feed-time">{s.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
