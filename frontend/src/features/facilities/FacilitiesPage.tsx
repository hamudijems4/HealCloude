import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { Search, Wifi, WifiOff, Building2, MapPin, Phone, Activity } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './FacilitiesPage.css';

const FACILITIES = [
  { id:1,  name:'Black Lion Specialized Hospital',  type:'hospital',       region:'Addis Ababa', zone:'Gulele',       lat:9.0302,  lng:38.7468, online:true,  phone:'+251111239744', beds:700, staff:1200 },
  { id:2,  name:'St. Paul Hospital',               type:'hospital',       region:'Addis Ababa', zone:'Gulele',       lat:9.0411,  lng:38.7578, online:true,  phone:'+251111274950', beds:500, staff:850  },
  { id:3,  name:'Mekelle General Hospital',        type:'hospital',       region:'Tigray',      zone:'Central',      lat:13.4970, lng:39.4770, online:true,  phone:'+251344406788', beds:350, staff:620  },
  { id:4,  name:'Adwa Health Center',              type:'health_center',  region:'Tigray',      zone:'Central',      lat:14.1690, lng:38.8960, online:false, phone:'+251344751010', beds:40,  staff:45   },
  { id:5,  name:'Hawassa University Hospital',     type:'hospital',       region:'Sidama',      zone:'Hawassa',      lat:7.0550,  lng:38.4770, online:true,  phone:'+251462201220', beds:400, staff:730  },
  { id:6,  name:'Gondar University Hospital',      type:'hospital',       region:'Amhara',      zone:'North Gondar', lat:12.6080, lng:37.4610, online:true,  phone:'+251581114005', beds:500, staff:900  },
  { id:7,  name:'Jimma University Hospital',       type:'hospital',       region:'Oromia',      zone:'Jimma',        lat:7.6750,  lng:36.8340, online:true,  phone:'+251471119722', beds:450, staff:780  },
  { id:8,  name:'Nekemte Referral Hospital',       type:'hospital',       region:'Oromia',      zone:'E. Wollega',   lat:9.0880,  lng:36.5490, online:false, phone:'+251572661590', beds:280, staff:400  },
  { id:9,  name:'Assosa General Hospital',         type:'hospital',       region:'Benishangul', zone:'Assosa',       lat:10.0650, lng:34.5350, online:true,  phone:'+251577751010', beds:200, staff:320  },
  { id:10, name:'Gambella Regional Hospital',      type:'hospital',       region:'Gambella',    zone:'Gambella',     lat:8.2520,  lng:34.5890, online:false, phone:'+251477510012', beds:180, staff:260  },
  { id:11, name:'Dire Dawa Referral Hospital',     type:'hospital',       region:'Dire Dawa',   zone:'Dire Dawa',    lat:9.5930,  lng:41.8620, online:true,  phone:'+251252113000', beds:300, staff:520  },
  { id:12, name:'Harar Regional Hospital',         type:'hospital',       region:'Harari',      zone:'Harar',        lat:9.3120,  lng:42.1180, online:true,  phone:'+251256665151', beds:250, staff:410  },
  { id:13, name:'Jijiga General Hospital',         type:'hospital',       region:'Somali',      zone:'Fafan',        lat:9.3500,  lng:42.7900, online:true,  phone:'+251257751010', beds:220, staff:360  },
  { id:14, name:'Semera Regional Hospital',        type:'hospital',       region:'Afar',        zone:'Zone 1',       lat:11.7930, lng:41.0110, online:false, phone:'+251335510080', beds:160, staff:240  },
  { id:15, name:'Arba Minch General Hospital',     type:'hospital',       region:'SNNPR',       zone:'Gamo',         lat:6.0380,  lng:37.5500, online:true,  phone:'+251468810053', beds:320, staff:550  },
];

const TYPE_CFG: Record<string, { label:string; color:string; short:string }> = {
  hospital:       { label:'Hospital',       color:'#2563eb', short:'H' },
  health_center:  { label:'Health Center',  color:'#059669', short:'HC'},
  clinic:         { label:'Clinic',         color:'#7c3aed', short:'C' },
  health_post:    { label:'Health Post',    color:'#d97706', short:'HP'},
};

const makeIcon = (color: string, online: boolean) => L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:${online?color:'#94a3b8'};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;">
    <div style="transform:rotate(45deg);width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
      ${online ? `<div style="width:6px;height:6px;border-radius:50%;background:white;"></div>` : `<div style="width:6px;height:6px;border-radius:50%;background:#fed7aa;"></div>`}
    </div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -30],
});

export const FacilitiesPage: React.FC = () => {
  const [search, setSearch]   = useState('');
  const [type, setType]       = useState('all');
  const [region, setRegion]   = useState('all');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selected, setSelected] = useState<typeof FACILITIES[0] | null>(null);

  const regions = ['all', ...Array.from(new Set(FACILITIES.map(f => f.region)))];
  const types   = ['all', 'hospital', 'health_center', 'clinic', 'health_post'];

  const filtered = FACILITIES.filter(f => {
    const q = search.toLowerCase();
    return (
      (!q || f.name.toLowerCase().includes(q) || f.region.toLowerCase().includes(q)) &&
      (type === 'all'   || f.type   === type) &&
      (region === 'all' || f.region === region) &&
      (!onlineOnly      || f.online)
    );
  });

  const onlineCount  = FACILITIES.filter(f => f.online).length;
  const offlineCount = FACILITIES.length - onlineCount;

  return (
    <div className="fc">
      <div className="fc__header">
        <div>
          <h1>Health Facilities</h1>
          <p>National facility directory — {FACILITIES.length} facilities across 11 regions</p>
        </div>
      </div>

      <div className="fc__kpis">
        {[
          { label:'Total Facilities', value:FACILITIES.length, color:'#2563eb' },
          { label:'Online',           value:onlineCount,        color:'#059669' },
          { label:'Offline',          value:offlineCount,       color:'#d97706' },
          { label:'Total Beds',       value:FACILITIES.reduce((s,f)=>s+f.beds,0).toLocaleString(), color:'#7c3aed' },
        ].map((k,i) => (
          <div key={i} className="fc__kpi" style={{ borderLeftColor:k.color }}>
            <span style={{ color:k.color, fontSize:'1.6rem', fontWeight:700 }}>{k.value}</span>
            <span style={{ fontSize:'0.72rem', color:'#64748b' }}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className="fc__body">
        {/* Controls + List */}
        <div className="fc__left">
          <div className="fc__controls ch-card">
            <div className="fc__search">
              <Search size={14}/>
              <input placeholder="Search facilities or regions…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <div className="fc__filters">
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="all">All Types</option>
                {types.filter(t=>t!=='all').map(t => <option key={t} value={t}>{TYPE_CFG[t]?.label}</option>)}
              </select>
              <select value={region} onChange={e => setRegion(e.target.value)}>
                {regions.map(r => <option key={r} value={r}>{r==='all'?'All Regions':r}</option>)}
              </select>
              <label className="fc__online-toggle">
                <input type="checkbox" checked={onlineOnly} onChange={e => setOnlineOnly(e.target.checked)}/>
                <span>Online only</span>
              </label>
            </div>
          </div>

          <div className="fc__list ch-card">
            <div className="fc__list-header">
              <span>Showing {filtered.length} facilities</span>
            </div>
            <div className="fc__list-scroll">
              {filtered.map(f => {
                const tc = TYPE_CFG[f.type] ?? { color:'#64748b', label:f.type };
                return (
                  <div
                    key={f.id}
                    className={`fc__item ${selected?.id === f.id ? 'fc__item--active' : ''}`}
                    onClick={() => setSelected(f)}
                  >
                    <div className="fc__item-icon" style={{ background:`${tc.color}15`, color:tc.color }}>
                      <Building2 size={15}/>
                    </div>
                    <div className="fc__item-info">
                      <div className="fc__item-name">{f.name}</div>
                      <div className="fc__item-meta">
                        <span><MapPin size={11}/> {f.region} · {f.zone}</span>
                        <span><Activity size={11}/> {f.beds} beds</span>
                      </div>
                    </div>
                    <div className="fc__item-status">
                      {f.online
                        ? <span className="fc__status fc__status--online"><Wifi size={11}/> Online</span>
                        : <span className="fc__status fc__status--offline"><WifiOff size={11}/> Offline</span>
                      }
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && <div className="fc__empty">No facilities match your filters.</div>}
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="fc__map-wrap ch-card">
          <MapContainer center={[9.0, 39.5]} zoom={6} style={{ width:'100%', height:'100%', borderRadius:16 }} zoomControl={false}>
            <ZoomControl position="bottomright"/>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO'/>
            {filtered.map(f => (
              <Marker key={f.id} position={[f.lat, f.lng]} icon={makeIcon(TYPE_CFG[f.type]?.color ?? '#2563eb', f.online)} eventHandlers={{ click: () => setSelected(f) }}>
                <Popup>
                  <div className="fc__popup">
                    <strong>{f.name}</strong>
                    <span>{f.region} · {f.zone}</span>
                    <span>{f.online ? '🟢 Online' : '🔴 Offline'} · {f.beds} beds</span>
                    {f.phone && <span><Phone size={11}/> {f.phone}</span>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {selected && (
            <div className="fc__detail-panel">
              <div className="fc__detail-header">
                <strong>{selected.name}</strong>
                <button onClick={() => setSelected(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'#94a3b8',fontSize:'1rem' }}>✕</button>
              </div>
              <div className="fc__detail-body">
                <div className="fc__detail-row"><MapPin size={13}/> {selected.region}, {selected.zone}</div>
                <div className="fc__detail-row"><Building2 size={13}/> {TYPE_CFG[selected.type]?.label}</div>
                <div className="fc__detail-row"><Activity size={13}/> {selected.beds} beds · {selected.staff} staff</div>
                {selected.phone && <div className="fc__detail-row"><Phone size={13}/> {selected.phone}</div>}
                <div className="fc__detail-row">
                  {selected.online
                    ? <span style={{ color:'#059669', display:'flex', alignItems:'center', gap:4 }}><Wifi size={13}/> Connected</span>
                    : <span style={{ color:'#d97706', display:'flex', alignItems:'center', gap:4 }}><WifiOff size={13}/> Offline — last sync 6h ago</span>
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
