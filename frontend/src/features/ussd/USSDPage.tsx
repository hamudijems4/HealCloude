import React, { useState, useRef, useEffect } from 'react';
import { Phone, Send, RotateCcw, Clock, User, Globe } from 'lucide-react';
import './USSDPage.css';

interface SessionEntry { type: 'system' | 'user'; text: string; }
type NodeKey = string;
interface USSDNode { text: string; options?: Record<string, NodeKey>; }

// ── English tree ─────────────────────────────────────────────────────────────
const EN_TREE: Record<NodeKey, USSDNode> = {
  root: {
    text: `CloudHeal ★ *961#\nSalamta / Selam / Hello!\n\n1. My Health Record\n2. Appointments\n3. Wellness Score\n4. Emergency Info\n5. Change Language`,
    options: { '1':'health','2':'appointments','3':'wellness','4':'emergency','5':'language' },
  },
  health: {
    text: `My Health Record\n━━━━━━━━━━━━━━━\nFayda ID: ET8823710293\nName: Almaz Tesfaye\nBlood Type: B+\nAllergies: Penicillin\n\n1. View Conditions\n2. Recent Visits\n0. Back`,
    options: { '1':'conditions','2':'visits','0':'root' },
  },
  conditions: {
    text: `Active Conditions\n━━━━━━━━━━━━━━━\n• Iron Deficiency Anemia\n• Prenatal Care (32 wks)\n\nNext follow-up:\n15 Jun 2025 · 9:00 AM\nAdwa Health Center\n\n0. Back to menu`,
    options: { '0':'root' },
  },
  visits: {
    text: `Recent Visits\n━━━━━━━━━━━━━━━\n02 Jun — Adwa H.C.\n   Prenatal · Dr. Mekdes\n10 May — Mekelle Gen.\n   Prenatal · Dr. Kebede\n15 Mar — Adwa H.C.\n   First Antenatal\n\n0. Back`,
    options: { '0':'root' },
  },
  appointments: {
    text: `Appointments\n━━━━━━━━━━━━━━━\n⏰ UPCOMING:\n15 Jun 2025 · 9:00 AM\nPrenatal Check\nAdwa Health Center\n📍 3.2km from you\n\n1. Confirm\n2. Reschedule\n3. View all\n0. Back`,
    options: { '1':'confirmed','2':'reschedule','3':'all_appts','0':'root' },
  },
  confirmed: {
    text: `✅ Appointment Confirmed!\n━━━━━━━━━━━━━━━\n15 Jun 2025 · 9:00 AM\nAdwa Health Center\n\nSMS reminder in 24h.\nStay healthy!\n\n0. Main Menu`,
    options: { '0':'root' },
  },
  reschedule: {
    text: `Reschedule Appointment\n━━━━━━━━━━━━━━━\nA nurse will call you\nwithin 2 hours.\n\nOr call directly:\n+251914910001\n\n0. Main Menu`,
    options: { '0':'root' },
  },
  all_appts: {
    text: `All Appointments\n━━━━━━━━━━━━━━━\n1. 15 Jun · Prenatal\n2. 10 May · Attended ✓\n3. 15 Mar · Attended ✓\n\n0. Back`,
    options: { '0':'appointments' },
  },
  wellness: {
    text: `Wellness Score\n━━━━━━━━━━━━━━━\nYour score: 62 / 100\nRisk Level: ⚠️ HIGH\n\nFactors:\n• 2 missed follow-ups\n• Low iron (Hgb 9.8)\n• Week 32 — critical\n\nAction: Schedule now!\n\n1. Book appointment\n0. Main Menu`,
    options: { '1':'appointments','0':'root' },
  },
  emergency: {
    text: `🚨 Emergency Info\n━━━━━━━━━━━━━━━\nEthiopia Emergency: 907\nAmbulance: 907\nNearest Hospital:\nAdwa Health Center\n+251344751010\n📍 3.2km away\n\n0. Main Menu`,
    options: { '0':'root' },
  },
  language: {
    text: `Choose Language\n━━━━━━━━━━━━━━━\n1. English\n2. አማርኛ (Amharic)\n3. Afaan Oromoo\n4. Tigrinya\n\n0. Back`,
    options: { '1':'root','2':'am_root','3':'root','4':'root','0':'root' },
  },
};

// ── Amharic tree ─────────────────────────────────────────────────────────────
const AM_TREE: Record<NodeKey, USSDNode> = {
  am_root: {
    text: `ክላውድሄል ★ *961#\nእንኳን ደህና መጡ!\n\n1. የጤና መዝገቤ\n2. ቀጠሮዎች\n3. የጤና ነጥብ\n4. የድንገተኛ መረጃ\n5. ቋንቋ ቀይር`,
    options: { '1':'am_health','2':'am_appointments','3':'am_wellness','4':'am_emergency','5':'am_language' },
  },
  am_health: {
    text: `የጤና መዝገብ\n━━━━━━━━━━━━━━━\nፋይዳ ቁጥር: ET8823710293\nስም: አልማዝ ተስፋዬ\nደም ዓይነት: B+\nአለርጂ: ፔኒሲሊን\n\n1. ሁኔታዎችን ይመልከቱ\n2. የቅርብ ጊዜ ጉብኝቶች\n0. ተመለስ`,
    options: { '1':'am_conditions','2':'am_visits','0':'am_root' },
  },
  am_conditions: {
    text: `ያሉ ሕመሞች\n━━━━━━━━━━━━━━━\n• የብረት ሕጦ ማነስ\n• የቅድመ ወሊድ ክብካቤ\n  (32 ሳምንታት)\n\nቀጣይ ቀጠሮ:\n15 ሰኔ 2025 · 9:00 ጠ.ቀ.\nአድዋ ጤና ጣቢያ\n\n0. ወደ ዋና ምናሌ`,
    options: { '0':'am_root' },
  },
  am_visits: {
    text: `የቅርብ ጊዜ ጉብኝቶች\n━━━━━━━━━━━━━━━\n02 ሰኔ — አድዋ ጤ.ጣ.\n   ቅድ.ወሊድ · ዶ/ር መቅደስ\n10 ሜ — መቀሌ ሆስ.\n   ቅድ.ወሊድ · ዶ/ር ክቡር\n15 ማ — አድዋ ጤ.ጣ.\n   የመጀመሪያ ቅ.ወሊድ\n\n0. ተመለስ`,
    options: { '0':'am_root' },
  },
  am_appointments: {
    text: `ቀጠሮዎች\n━━━━━━━━━━━━━━━\n⏰ ቀጣይ ቀጠሮ:\n15 ሰኔ 2025 · 9:00 ጠ.ቀ.\nቅ.ወሊድ ምርመራ\nአድዋ ጤና ጣቢያ\n📍 3.2 ኪ.ሜ ርቀት\n\n1. አረጋግጥ\n2. ቀጠሮ ቀይር\n3. ሁሉ ቀጠሮ\n0. ተመለስ`,
    options: { '1':'am_confirmed','2':'am_reschedule','3':'am_all_appts','0':'am_root' },
  },
  am_confirmed: {
    text: `✅ ቀጠሮ ተረጋግጧል!\n━━━━━━━━━━━━━━━\n15 ሰኔ 2025 · 9:00 ጠ.ቀ.\nአድዋ ጤና ጣቢያ\n\nበ24 ሰዓት ውስጥ\nSMS ማሳሰቢያ ይላካል።\n\nጤና ይስጥልን!\n\n0. ዋና ምናሌ`,
    options: { '0':'am_root' },
  },
  am_reschedule: {
    text: `ቀጠሮ መቀየሪያ\n━━━━━━━━━━━━━━━\nነርስ በ2 ሰዓት ውስጥ\nይደውሉልዎታል።\n\nወይም ቀጥታ ይደውሉ:\n+251914910001\n\n0. ዋና ምናሌ`,
    options: { '0':'am_root' },
  },
  am_all_appts: {
    text: `ሁሉም ቀጠሮዎች\n━━━━━━━━━━━━━━━\n1. 15 ሰኔ · ቅ.ወሊድ\n2. 10 ሜ · ተካፍሏል ✓\n3. 15 ማ · ተካፍሏል ✓\n\n0. ተመለስ`,
    options: { '0':'am_appointments' },
  },
  am_wellness: {
    text: `የጤና ነጥብ\n━━━━━━━━━━━━━━━\nነጥብዎ: 62 / 100\nአደጋ ደረጃ: ⚠️ ከፍተኛ\n\nምክንያቶች:\n• 2 ያልተካፈሉ ቀጠሮዎች\n• ዝቅተኛ ብረት (9.8)\n• 32 ሳምን — አሳሳቢ\n\nወዲያው ቀጠሮ ይያዙ!\n\n1. ቀጠሮ ያዙ\n0. ዋና ምናሌ`,
    options: { '1':'am_appointments','0':'am_root' },
  },
  am_emergency: {
    text: `🚨 ድንገተኛ መረጃ\n━━━━━━━━━━━━━━━\nድንገተኛ: 907\nአምቡላንስ: 907\nቅርብ ሆስፒታል:\nአድዋ ጤና ጣቢያ\n+251344751010\n📍 3.2 ኪ.ሜ ርቀት\n\n0. ዋና ምናሌ`,
    options: { '0':'am_root' },
  },
  am_language: {
    text: `ቋንቋ ምረጥ\n━━━━━━━━━━━━━━━\n1. English\n2. አማርኛ\n3. Afaan Oromoo\n4. ትግርኛ\n\n0. ተመለስ`,
    options: { '1':'root','2':'am_root','3':'am_root','4':'am_root','0':'am_root' },
  },
};

const TREE: Record<NodeKey, USSDNode> = { ...EN_TREE, ...AM_TREE };

const SESSIONS = [
  { id:'S001', phone:'+251922334455', patient:'Almaz Tesfaye',   time:'09:42 AM', response:'Confirmed appointment', duration:'1m 12s' },
  { id:'S002', phone:'+251944556677', patient:'Biruk Tadesse',   time:'09:11 AM', response:'Wellness score viewed',  duration:'0m 28s' },
  { id:'S003', phone:'+251911223344', patient:'Kebede Mulugeta', time:'08:55 AM', response:'All appointments listed', duration:'0m 45s' },
  { id:'S004', phone:'+251933445566', patient:'Fatima Abdi',     time:'08:30 AM', response:'Emergency info accessed', duration:'0m 18s' },
  { id:'S005', phone:'+251977001122', patient:'Yonas Bekele',    time:'07:58 AM', response:'Language → Amharic',     duration:'0m 12s' },
];

export const USSDPage: React.FC = () => {
  const [currentNode, setCurrentNode] = useState<NodeKey>('root');
  const [session, setSession]         = useState<SessionEntry[]>([]);
  const [input, setInput]             = useState('');
  const [phone, setPhone]             = useState('+251922334455');
  const [started, setStarted]         = useState(false);
  const [lang, setLang]               = useState<'en' | 'am'>('en');
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (screenRef.current) screenRef.current.scrollTop = screenRef.current.scrollHeight;
  }, [session]);

  // detect language switch from node key
  useEffect(() => {
    setLang(currentNode.startsWith('am_') ? 'am' : 'en');
  }, [currentNode]);

  const start = () => {
    const startNode = lang === 'am' ? 'am_root' : 'root';
    setStarted(true);
    setCurrentNode(startNode);
    setSession([{ type:'system', text: TREE[startNode].text }]);
  };

  const reset = () => { setStarted(false); setSession([]); setCurrentNode('root'); setInput(''); setLang('en'); };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const val = input.trim();
    if (!val) return;
    const node = TREE[currentNode];
    const next = node.options?.[val];
    setSession(prev => [...prev, { type:'user', text:val }]);
    setInput('');
    if (next) {
      setTimeout(() => {
        setSession(prev => [...prev, { type:'system', text: TREE[next].text }]);
        setCurrentNode(next);
      }, 250);
    } else {
      setTimeout(() => {
        setSession(prev => [...prev, { type:'system', text:`❌ "${val}" ?\n\n${node.text}` }]);
      }, 250);
    }
  };

  return (
    <div className="ussd2">

      {/* ── Header ── */}
      <div className="ussd2__header">
        <div>
          <h1>USSD / SMS Simulator</h1>
          <p>Simulate patient interactions via *961# — Africa's Talking integration</p>
        </div>
        <div className="ussd2__lang-toggle">
          <button className={`ussd2__lang-btn ${lang==='en'?'active':''}`} onClick={() => { setLang('en'); if(started) reset(); }}>
            <Globe size={13}/> English
          </button>
          <button className={`ussd2__lang-btn ${lang==='am'?'active':''}`} onClick={() => { setLang('am'); if(started) reset(); }}>
            <Globe size={13}/> አማርኛ
          </button>
        </div>
      </div>

      {/* ── KPIs ── */}
      <div className="ussd2__kpis">
        {[
          { label:'Sessions Today',  value:'3,421', color:'#2563eb' },
          { label:'Unique Users',    value:'2,887', color:'#059669' },
          { label:'Confirmations',   value:'1,204', color:'#7c3aed' },
          { label:'Avg Duration',    value:'1m 8s', color:'#d97706' },
        ].map((k,i) => (
          <div key={i} className="ussd2__kpi" style={{ borderLeftColor:k.color }}>
            <span style={{ color:k.color, fontSize:'1.5rem', fontWeight:700 }}>{k.value}</span>
            <span style={{ fontSize:'0.75rem', color:'#64748b' }}>{k.label}</span>
          </div>
        ))}
      </div>

      {/* ── Main body ── */}
      <div className="ussd2__body">

        {/* ── BIG phone simulator ── */}
        <div className="ussd2__sim-wrap">
          <div className="ussd2__phone">
            <div className="ussd2__notch"/>

            <div className="ussd2__screen">
              <div className="ussd2__carrier">
                <Phone size={13}/> Ethio Telecom &nbsp;·&nbsp; *961#
                {lang === 'am' && <span className="ussd2__lang-badge">አማርኛ</span>}
              </div>

              <div className="ussd2__msgs" ref={screenRef}>
                {!started && (
                  <div className="ussd2__start-prompt">
                    <div className="ussd2__dial-icon">*961#</div>
                    <p>{lang === 'am' ? 'ለማስጀመር *961# ይደውሉ' : 'Dial *961# to connect'}</p>
                    <input
                      className="ussd2__phone-inp"
                      placeholder="+251..."
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                    <button className="ussd2__dial-btn" onClick={start}>
                      {lang === 'am' ? '*961# ይደውሉ' : 'Dial *961#'}
                    </button>
                  </div>
                )}
                {session.map((entry, i) => (
                  <div key={i} className={`ussd2__msg ussd2__msg--${entry.type}`}>
                    <pre>{entry.text}</pre>
                  </div>
                ))}
              </div>

              {started && (
                <form className="ussd2__input-row" onSubmit={send}>
                  <input
                    className="ussd2__text-inp"
                    placeholder={lang === 'am' ? 'አማራጭ ያስገቡ…' : 'Enter option…'}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoFocus
                  />
                  <button type="submit" className="ussd2__send-btn"><Send size={16}/></button>
                </form>
              )}
            </div>

            {started && (
              <button className="ussd2__reset-btn" onClick={reset}>
                <RotateCcw size={14}/> {lang === 'am' ? 'ክፍለ ጊዜ ዝጋ' : 'End Session'}
              </button>
            )}
            <div className="ussd2__home-btn"/>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="ussd2__right">

          <div className="ch-card ussd2__how-card">
            <h3>How It Works</h3>
            <div className="ussd2__steps">
              {[
                'Patient dials *961# on any feature phone — no smartphone needed',
                'CloudHeal serves a multilingual menu via Africa\'s Talking USSD gateway',
                'Patient navigates by pressing number keys — works on 2G networks',
                'Appointments, scores, and records accessed with zero data cost',
              ].map((s,i) => (
                <div key={i} className="ussd2__step">
                  <div className="ussd2__step-num">{i+1}</div>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ch-card ussd2__sessions-card">
            <div className="ussd2__sess-head">
              <h3>Recent Sessions</h3>
              <span className="ch-badge ch-badge--blue">Today</span>
            </div>
            {SESSIONS.map(s => (
              <div key={s.id} className="ussd2__sess-row">
                <div className="ussd2__sess-icon"><User size={15}/></div>
                <div className="ussd2__sess-info">
                  <div className="ussd2__sess-name">{s.patient}</div>
                  <div className="ussd2__sess-meta">{s.phone} · {s.response}</div>
                </div>
                <div className="ussd2__sess-time">
                  <Clock size={11}/> {s.time}
                  <span>{s.duration}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
