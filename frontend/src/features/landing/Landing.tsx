import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ChevronDown, Brain, Shield, Phone,
  Globe2, Users, Activity, TrendingUp, MapPin,
  CheckCircle, Zap, Baby
} from 'lucide-react';
import './Landing.css';

/* ─── Ethiopian Flag Logo SVG ─── */
const EthiopianLogo = () => (
  <svg width="42" height="42" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#1d4ed8"/>
    <polyline
      points="10,34 18,34 22,22 28,46 33,34 38,34 41,28 44,40 48,34 54,34"
      fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);

/* ─── Animated Counter ─── */
const Counter: React.FC<{ target: string; duration?: number }> = ({ target, duration = 2000 }) => {
  const [display, setDisplay] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseFloat(target.replace(/[^0-9.]/g, ''));
        const suffix = target.replace(/[0-9.]/g, '');
        const steps = 60;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const progress = step / steps;
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(num * eased);
          setDisplay(`${current}${suffix}`);
          if (step >= steps) clearInterval(timer);
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{display}</span>;
};

/* ─── Tilt Card ─── */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
  }, []);

  const handleLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0px)';
  }, []);

  return (
    <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════ */
export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [loaded, setLoaded] = useState(false);
  const mouseMoveTimer = useRef<number>(0);
  const particlePositions = useState(() =>
    Array.from({ length: 12 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${6 + Math.random() * 6}s`,
      size: `${3 + Math.random() * 4}px`,
    }))
  )[0];

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);

    const onMove = (e: MouseEvent) => {
      if (mouseMoveTimer.current) return;
      mouseMoveTimer.current = window.setTimeout(() => {
        mouseMoveTimer.current = 0;
        setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
      }, 50);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const features = [
    { icon: Brain,    title: 'AI Wellness Engine',  desc: 'Risk scores computed from patient history, missed visits, and vitals — predicting danger before it strikes.' },
    { icon: Shield,   title: 'FHIR Interoperability',desc: 'Connects Excel sheets, paper records, and EMRs under one universal HL7 FHIR standard.' },
    { icon: Phone,    title: 'USSD for All',         desc: 'Dial *961# from any phone. No internet. No smartphone. Prenatal reminders reach every village.' },
    { icon: Globe2,   title: 'MoH God-View',         desc: 'Live outbreak heatmaps. Disease alerts. Resource allocation powered by real-time national data.' },
    { icon: Baby,     title: 'Maternal Care AI',      desc: 'Dedicated AI track for pregnant mothers — scheduling, risk monitoring, and newborn care plans.' },
    { icon: Activity, title: 'Offline-First Sync',   desc: 'Rural clinics record data offline. Everything syncs the moment connectivity is restored.' },
  ];

  const stats = [
    { value: '126M', label: 'Ethiopians', icon: Users },
    { value: '3500+', label: 'Health Facilities', icon: Activity },
    { value: '94%', label: 'AI Accuracy', icon: TrendingUp },
    { value: '11', label: 'Regions', icon: MapPin },
  ];

  const timeline = [
    { time: '07:00', event: 'Almaz receives USSD reminder', detail: 'Prenatal check due · Adwa Health Center · 3.2km' },
    { time: '09:15', event: 'Nurse scans Fayda ID', detail: 'Full history loaded instantly from 3 prior clinics' },
    { time: '09:20', event: 'AI flags risk factor', detail: 'Low iron detected · Prescription auto-suggested' },
    { time: '09:45', event: 'MoH dashboard updates', detail: 'Tigray prenatal coverage: 91% ↑ this week' },
  ];

  const orb1X = (mousePos.x - 0.5) * 60;
  const orb1Y = (mousePos.y - 0.5) * 60;
  const orb2X = (0.5 - mousePos.x) * 40;
  const orb2Y = (0.5 - mousePos.y) * 40;

  return (
    <div className={`lp ${loaded ? 'lp--loaded' : ''}`}>

      {/* ── CANVAS BG ── */}
      <div className="lp-bg" aria-hidden>
        <div className="lp-orb lp-orb--1" style={{ transform: `translate(${orb1X}px, ${orb1Y}px)` }}/>
        <div className="lp-orb lp-orb--2" style={{ transform: `translate(${orb2X}px, ${orb2Y}px)` }}/>
        <div className="lp-orb lp-orb--3"/>
        <div className="lp-grid"/>
        <div className="lp-scanline"/>
        {particlePositions.map((p, i) => (
          <div key={i} className="lp-particle"
            style={{ left: p.left, animationDelay: p.delay, animationDuration: p.duration, width: p.size, height: p.size }}/>
        ))}
        {/* DNA helix decorative lines */}
        <svg className="lp-dna lp-dna--left" viewBox="0 0 60 600" preserveAspectRatio="none">
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <circle cx={30 + Math.sin(i * 0.55) * 25} cy={i * 50 + 25} r="5" fill="#3b82f6" opacity="0.3"/>
              <circle cx={30 - Math.sin(i * 0.55) * 25} cy={i * 50 + 25} r="5" fill="#60a5fa" opacity="0.2"/>
              <line x1={30 + Math.sin(i * 0.55) * 25} y1={i * 50 + 25}
                    x2={30 - Math.sin(i * 0.55) * 25} y2={i * 50 + 25}
                    stroke="#3b82f6" strokeWidth="1.5" opacity="0.2"/>
            </g>
          ))}
        </svg>
        <svg className="lp-dna lp-dna--right" viewBox="0 0 60 600" preserveAspectRatio="none">
          {Array.from({ length: 12 }, (_, i) => (
            <g key={i}>
              <circle cx={30 + Math.sin(i * 0.55 + 1) * 25} cy={i * 50 + 25} r="5" fill="#2563eb" opacity="0.3"/>
              <circle cx={30 - Math.sin(i * 0.55 + 1) * 25} cy={i * 50 + 25} r="5" fill="#3b82f6" opacity="0.2"/>
              <line x1={30 + Math.sin(i * 0.55 + 1) * 25} y1={i * 50 + 25}
                    x2={30 - Math.sin(i * 0.55 + 1) * 25} y2={i * 50 + 25}
                    stroke="#2563eb" strokeWidth="1.5" opacity="0.2"/>
            </g>
          ))}
        </svg>
      </div>

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <div className="lp-nav__inner">
          <div className="lp-nav__brand">
            <EthiopianLogo />
            <span className="lp-nav__name">CloudHeal</span>
          </div>
          <div className="lp-nav__links">
            <a href="#features">Features</a>
            <a href="#story">Almaz's Story</a>
            <a href="#impact">Impact</a>
          </div>
          <button className="lp-btn lp-btn--nav" onClick={() => navigate('/login')}>
            Access Platform <ArrowRight size={16}/>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero__inner">

          <div className="lp-hero__left">
            <div className="lp-hero__badge">
              <span className="lp-badge__dot"/>
              ALX Wellness Hackathon 2024
            </div>

            <h1 className="lp-hero__title">
              <span className="lp-title__line lp-title__line--1">One Cloud.</span>
              <span className="lp-title__line lp-title__line--2">
                Every <em>Life.</em>
              </span>
              <span className="lp-title__line lp-title__line--3">Connected.</span>
            </h1>

            <p className="lp-hero__sub">
              Ethiopia's AI-powered health interoperability layer — unifying 126 million 
              patient records, reaching rural mothers via USSD, and giving the Ministry 
              of Health real-time vision over the nation's wellness.
            </p>

            <div className="lp-hero__actions">
              <button className="lp-btn lp-btn--primary" onClick={() => navigate('/login')}>
                Enter the Platform
                <ArrowRight size={20}/>
              </button>
              <button className="lp-btn lp-btn--ghost">
                Watch Demo
                <ChevronDown size={18}/>
              </button>
            </div>

            {/* Live pulse indicator */}
            <div className="lp-hero__live">
              <span className="lp-live__ring"/>
              <span className="lp-live__dot"/>
              <span>Live · 3,241 patients checked in today</span>
            </div>
          </div>

          {/* Orbiting visual */}
          <div className="lp-hero__right">
            <div className="lp-orbit">
              <div className="lp-orbit__core">
                <EthiopianLogo/>
                <span>CloudHeal</span>
              </div>
              {/* Orbit rings */}
              <div className="lp-orbit__ring lp-orbit__ring--1"/>
              <div className="lp-orbit__ring lp-orbit__ring--2"/>
              {/* Orbiting nodes */}
              <div className="lp-orbit__node lp-orbit__node--1">
                <Brain size={18}/><span>AI Engine</span>
              </div>
              <div className="lp-orbit__node lp-orbit__node--2">
                <Phone size={18}/><span>USSD</span>
              </div>
              <div className="lp-orbit__node lp-orbit__node--3">
                <Shield size={18}/><span>FHIR</span>
              </div>
              <div className="lp-orbit__node lp-orbit__node--4">
                <Globe2 size={18}/><span>MoH</span>
              </div>
              {/* Pulse waves */}
              <div className="lp-pulse lp-pulse--1"/>
              <div className="lp-pulse lp-pulse--2"/>
              <div className="lp-pulse lp-pulse--3"/>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <a href="#stats" className="lp-hero__scroll">
          <ChevronDown size={22}/>
        </a>
      </section>

      {/* ── STATS TICKER ── */}
      <section id="stats" className="lp-stats">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="lp-stats__item" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="lp-stats__icon"><Icon size={20}/></div>
              <div>
                <div className="lp-stats__val"><Counter target={s.value}/></div>
                <div className="lp-stats__lbl">{s.label}</div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="lp-section lp-features">
        <div className="lp-section__inner">
          <div className="lp-section__hd">
            <span className="lp-tag">Technology</span>
            <h2>Built to Save Lives at Scale</h2>
            <p>Six pillars of Ethiopia's healthcare transformation</p>
          </div>
          <div className="lp-features__grid">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <TiltCard key={i} className="lp-feat">
                  <div className="lp-feat__glow"/>
                  <div className="lp-feat__icon"><Icon size={26}/></div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                  <div className="lp-feat__bar"/>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ALMAZ'S STORY / TIMELINE ── */}
      <section id="story" className="lp-section lp-story">
        <div className="lp-section__inner lp-story__inner">

          {/* Phone + USSD */}
          <div className="lp-story__phone-wrap">
            <div className="lp-phone">
              <div className="lp-phone__notch"/>
              <div className="lp-phone__screen">
                <div className="lp-ussd">
                  <div className="lp-ussd__carrier">Ethio Telecom · *961#</div>
                  <div className="lp-ussd__box">
                    <p className="lp-ussd__title">CloudHeal</p>
                    <p>ሰላም Almaz! 👋</p>
                    <p>Your 32-week prenatal check is due.</p>
                    <div className="lp-ussd__detail">
                      <span>📍 Adwa Health Center</span>
                      <span>⏰ Tue, 10 June · 9:00 AM</span>
                      <span>🚶 3.2 km from you</span>
                    </div>
                    <div className="lp-ussd__opts">
                      <div className="lp-ussd__opt">1. Confirm</div>
                      <div className="lp-ussd__opt">2. Reschedule</div>
                      <div className="lp-ussd__opt">3. Health Tips</div>
                    </div>
                    <div className="lp-ussd__cursor">_</div>
                  </div>
                </div>
              </div>
              <div className="lp-phone__btn"/>
            </div>
          </div>

          {/* Timeline */}
          <div className="lp-story__content">
            <span className="lp-tag">Almaz's Journey</span>
            <h2>A Morning That Changes Everything</h2>
            <p className="lp-story__intro">
              Follow Almaz — a 28-year-old mother in rural Tigray — through one 
              Tuesday morning powered by CloudHeal.
            </p>

            <div className="lp-timeline">
              {timeline.map((t, i) => (
                <div key={i} className="lp-tl__item" style={{ animationDelay: `${i * 0.2}s` }}>
                  <div className="lp-tl__dot">
                    <CheckCircle size={14}/>
                  </div>
                  <div className="lp-tl__content">
                    <div className="lp-tl__time">{t.time}</div>
                    <div className="lp-tl__event">{t.event}</div>
                    <div className="lp-tl__detail">{t.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT ── */}
      <section id="impact" className="lp-impact">
        <div className="lp-section__inner">
          <div className="lp-section__hd lp-section__hd--light">
            <span className="lp-tag lp-tag--light">Why CloudHeal Exists</span>
            <h2>The Crisis Behind the Platform</h2>
            <p>Real numbers. Real Ethiopians. Real urgency.</p>
          </div>
          <div className="lp-impact__grid">
            <div className="lp-impact__card lp-impact__card--big">
              <span className="lp-impact__num"><Counter target="37"/></span>
              <span className="lp-impact__unit">per 1,000 births</span>
              <span className="lp-impact__lbl">Infant mortality rate in Ethiopia<small>Preventable with timely prenatal care & follow-ups</small></span>
              <div className="lp-impact__bar"><div className="lp-impact__bar-fill" style={{width:'74%'}}/></div>
            </div>
            <div className="lp-impact__card">
              <span className="lp-impact__num"><Counter target="68"/>%</span>
              <span className="lp-impact__lbl">Rural patients with zero digital health records</span>
            </div>
            <div className="lp-impact__card">
              <span className="lp-impact__num"><Counter target="40"/>K+</span>
              <span className="lp-impact__lbl">Health Extension Workers currently working offline</span>
            </div>
            <div className="lp-impact__card lp-impact__card--highlight">
              <span className="lp-impact__num"><Counter target="4800"/>+</span>
              <span className="lp-impact__lbl">Infant lives CloudHeal can save annually<small>Just a 10% improvement in prenatal adherence</small></span>
            </div>
          </div>

          {/* Conditions CloudHeal serves */}
          <div className="lp-conditions">
            <p className="lp-conditions__title">CloudHeal serves every patient — not just mothers</p>
            <div className="lp-conditions__grid">
              {['Maternal & Prenatal','Infant & Newborn','Cancer Screening','Malaria & TB','Diabetes & NCDs',
                'Mental Health','HIV/AIDS','Emergency Care','Chronic Disease'].map(c => (
                <span key={c} className="lp-condition__chip">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVENUE ── */}
      <section className="lp-section lp-revenue">
        <div className="lp-section__inner">
          <div className="lp-section__hd">
            <span className="lp-tag">Sustainability</span>
            <h2>Who Pays. Who Benefits.</h2>
          </div>
          <div className="lp-rev__grid">
            {[
              { who: '🏛️ Government', how: 'B2G SaaS · Disease surveillance · Research licensing', free: false },
              { who: '🌍 NGOs & WHO', how: 'Anonymized regional health data · Intervention targeting', free: false },
              { who: '🏥 Hospitals', how: 'API integration · FHIR translation · Patient history access', free: false },
              { who: '👩🍼 Patients', how: 'Everything. Forever.', free: true },
            ].map((r, i) => (
              <div key={i} className={`lp-rev__card ${r.free ? 'lp-rev__card--free' : ''}`}>
                <span className="lp-rev__who">{r.who}</span>
                <span className="lp-rev__how">{r.how}</span>
                {r.free && <span className="lp-rev__badge">FREE</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <div className="lp-cta__inner">
          <div className="lp-cta__glow"/>
          <span className="lp-tag lp-tag--light">Get Started</span>
          <h2>
            One Fayda ID.<br/>
            <em>One history. One cloud.</em>
          </h2>
          <p>The nervous system Ethiopia's healthcare has been waiting for.</p>
          <button className="lp-btn lp-btn--cta" onClick={() => navigate('/login')}>
            Launch CloudHeal <Zap size={18}/>
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer__top">
          <div className="lp-footer__brand">
            <EthiopianLogo/>
            <div>
              <span className="lp-footer__name">CloudHeal</span>
              <span className="lp-footer__tagline">One Cloud. Every Life. Connected.</span>
            </div>
          </div>
          <div className="lp-footer__cols">
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">Platform</span>
              <a href="#features">Features</a>
              <a href="/login">Patient Portal</a>
              <a href="/dashboard">MoH Dashboard</a>
            </div>
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">Standards</span>
              <a href="#">HL7 FHIR R4</a>
              <a href="#">Fayda ID</a>
              <a href="#">Africa's Talking USSD</a>
            </div>
            <div className="lp-footer__col">
              <span className="lp-footer__col-title">Built for</span>
              <a href="#">Ministry of Health</a>
              <a href="#">NGOs & WHO</a>
              <a href="#">Hospitals & Clinics</a>
            </div>
          </div>
        </div>
        <div className="lp-footer__bottom">
          <p>© 2024 CloudHeal · ALX Wellness Hackathon · Built with ❤️ for Ethiopia's 126 million people</p>
          <div className="lp-footer__badges">
            {['FHIR R4','HIPAA Ready','GDPR Compliant','ALX 2024'].map(b => (
              <span key={b} className="lp-footer__badge">{b}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
};
