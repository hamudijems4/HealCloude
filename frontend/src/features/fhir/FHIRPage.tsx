import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Copy, Check, FileCode2, Activity, User, Stethoscope } from 'lucide-react';
import './FHIRPage.css';

interface FHIRResource {
  resourceType: string;
  id: string;
  status?: string;
  [key: string]: unknown;
}

interface BundleEntry {
  resource: FHIRResource;
}

const BUNDLES: Record<string, { patient: string; entries: BundleEntry[] }> = {
  'ET8823710293': {
    patient: 'Almaz Tesfaye',
    entries: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'almaz-001',
          identifier: [{ system: 'https://fayda.et/id', value: 'ET8823710293' }],
          name: [{ use: 'official', text: 'Almaz Tesfaye' }],
          gender: 'female',
          birthDate: '1996-03-15',
          telecom: [{ system: 'phone', value: '+251922334455' }],
          address: [{ text: 'Adwa, Tigray', country: 'ET' }],
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          id: 'obs-bp-001',
          status: 'final',
          code: { coding: [{ system: 'http://loinc.org', code: '8480-6', display: 'Systolic blood pressure' }], text: 'Systolic blood pressure' },
          subject: { reference: 'Patient/almaz-001' },
          effectiveDateTime: '2025-06-02T09:15:00Z',
          valueQuantity: { value: 118, unit: 'mm[Hg]', system: 'http://unitsofmeasure.org' },
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          id: 'obs-hgb-001',
          status: 'final',
          code: { coding: [{ system: 'http://loinc.org', code: '718-7', display: 'Hemoglobin [Mass/volume] in Blood' }], text: 'Hemoglobin' },
          subject: { reference: 'Patient/almaz-001' },
          effectiveDateTime: '2025-06-02T09:15:00Z',
          valueQuantity: { value: 9.8, unit: 'g/dL', system: 'http://unitsofmeasure.org' },
          interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'L', display: 'Low' }] }],
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          id: 'obs-weight-001',
          status: 'final',
          code: { coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body weight' }], text: 'Body weight' },
          subject: { reference: 'Patient/almaz-001' },
          effectiveDateTime: '2025-06-02T09:10:00Z',
          valueQuantity: { value: 62, unit: 'kg', system: 'http://unitsofmeasure.org' },
        },
      },
      {
        resource: {
          resourceType: 'Condition',
          id: 'cond-001',
          clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
          code: { coding: [{ system: 'http://snomed.info/sct', code: '87832008', display: 'Iron deficiency anemia' }], text: 'Iron Deficiency Anemia' },
          subject: { reference: 'Patient/almaz-001' },
          onsetDateTime: '2025-03-15',
        },
      },
      {
        resource: {
          resourceType: 'Encounter',
          id: 'enc-001',
          status: 'finished',
          class: { code: 'AMB', display: 'Ambulatory' },
          type: [{ coding: [{ system: 'http://snomed.info/sct', code: '424441002', display: 'Prenatal initial visit' }] }],
          subject: { reference: 'Patient/almaz-001' },
          period: { start: '2025-06-02T09:00:00Z', end: '2025-06-02T09:45:00Z' },
          serviceProvider: { display: 'Adwa Health Center' },
        },
      },
    ],
  },
  'ET5590183421': {
    patient: 'Biruk Tadesse',
    entries: [
      {
        resource: {
          resourceType: 'Patient',
          id: 'biruk-001',
          identifier: [{ system: 'https://fayda.et/id', value: 'ET5590183421' }],
          name: [{ use: 'official', text: 'Biruk Tadesse' }],
          gender: 'male',
          birthDate: '2017-09-03',
          telecom: [{ system: 'phone', value: '+251944556677' }],
          address: [{ text: 'Jimma, Oromia', country: 'ET' }],
        },
      },
      {
        resource: {
          resourceType: 'Observation',
          id: 'obs-weight-002',
          status: 'final',
          code: { coding: [{ system: 'http://loinc.org', code: '29463-7', display: 'Body weight' }], text: 'Body weight' },
          subject: { reference: 'Patient/biruk-001' },
          effectiveDateTime: '2025-06-08T08:00:00Z',
          valueQuantity: { value: 14, unit: 'kg', system: 'http://unitsofmeasure.org' },
          interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: 'LL', display: 'Critical Low' }] }],
        },
      },
      {
        resource: {
          resourceType: 'Condition',
          id: 'cond-002',
          clinicalStatus: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }] },
          code: { coding: [{ system: 'http://snomed.info/sct', code: '44054006', display: 'Severe acute malnutrition' }], text: 'Severe Acute Malnutrition' },
          subject: { reference: 'Patient/biruk-001' },
          onsetDateTime: '2025-06-01',
          severity: { coding: [{ system: 'http://snomed.info/sct', code: '24484000', display: 'Severe' }] },
        },
      },
    ],
  },
};

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  Patient:     <User size={14}/>,
  Observation: <Activity size={14}/>,
  Condition:   <Stethoscope size={14}/>,
  Encounter:   <FileCode2 size={14}/>,
};

const RESOURCE_COLOR: Record<string, string> = {
  Patient:     '#2563eb',
  Observation: '#0891b2',
  Condition:   '#d97706',
  Encounter:   '#7c3aed',
};

const ResourceNode: React.FC<{ entry: BundleEntry }> = ({ entry }) => {
  const [open, setOpen]     = useState(false);
  const [copied, setCopied] = useState(false);
  const r = entry.resource;
  const color = RESOURCE_COLOR[r.resourceType] ?? '#64748b';

  const copyJson = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(r, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fhir__resource">
      <div className="fhir__resource-header" onClick={() => setOpen(!open)} style={{ borderLeftColor: color }}>
        <div className="fhir__resource-left">
          <span className="fhir__resource-chevron" style={{ color }}>
            {open ? <ChevronDown size={15}/> : <ChevronRight size={15}/>}
          </span>
          <span className="fhir__resource-icon" style={{ background: `${color}18`, color }}>
            {RESOURCE_ICONS[r.resourceType] ?? <FileCode2 size={14}/>}
          </span>
          <div>
            <span className="fhir__resource-type" style={{ color }}>{r.resourceType}</span>
            <span className="fhir__resource-id">/{r.id}</span>
          </div>
        </div>
        <div className="fhir__resource-actions">
          {r.status && <span className="fhir__status-badge">{r.status}</span>}
          <button className="fhir__copy-btn" onClick={copyJson} title="Copy JSON">
            {copied ? <Check size={13}/> : <Copy size={13}/>}
          </button>
        </div>
      </div>

      {open && (
        <div className="fhir__resource-body">
          <pre className="fhir__json">{JSON.stringify(r, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export const FHIRPage: React.FC = () => {
  const [selectedId, setSelectedId] = useState('ET8823710293');
  const [search, setSearch]         = useState('');
  const [copiedAll, setCopiedAll]   = useState(false);

  const bundle = BUNDLES[selectedId];

  const filtered = bundle.entries.filter(e => {
    const q = search.toLowerCase();
    return !q || e.resource.resourceType.toLowerCase().includes(q) || JSON.stringify(e.resource).toLowerCase().includes(q);
  });

  const copyBundle = () => {
    const full = { resourceType: 'Bundle', type: 'collection', total: bundle.entries.length, entry: bundle.entries.map(e => ({ resource: e.resource })) };
    navigator.clipboard.writeText(JSON.stringify(full, null, 2));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const resourceCounts = bundle.entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.resource.resourceType] = (acc[e.resource.resourceType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="fhir">
      <div className="fhir__header">
        <div>
          <h1>FHIR Records</h1>
          <p>HL7 FHIR R4 patient bundles — interoperable health data</p>
        </div>
      </div>

      <div className="fhir__kpis">
        {[
          { label: 'FHIR Standard',    value: 'R4',                               color: '#2563eb' },
          { label: 'Resources Loaded', value: bundle.entries.length,              color: '#0891b2' },
          { label: 'Fayda ID',         value: selectedId,                         color: '#7c3aed' },
          { label: 'Namespace',        value: 'fayda.et/id',                      color: '#059669' },
        ].map((k, i) => (
          <div key={i} className="fhir__kpi" style={{ borderLeftColor: k.color }}>
            <span style={{ color: k.color, fontSize: '1rem', fontWeight: 700, fontFamily: i === 2 ? 'monospace' : undefined }}>{k.value}</span>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{k.label}</span>
          </div>
        ))}
      </div>

      <div className="fhir__toolbar ch-card">
        <div className="fhir__patient-select">
          <label>Patient</label>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)}>
            {Object.entries(BUNDLES).map(([id, b]) => (
              <option key={id} value={id}>{b.patient} — {id}</option>
            ))}
          </select>
        </div>

        <div className="fhir__search">
          <Search size={14}/>
          <input placeholder="Filter by resource type or content…" value={search} onChange={e => setSearch(e.target.value)}/>
        </div>

        <div className="fhir__type-pills">
          {Object.entries(resourceCounts).map(([type, count]) => (
            <span key={type} className="fhir__type-pill" style={{ background: `${RESOURCE_COLOR[type] ?? '#64748b'}12`, color: RESOURCE_COLOR[type] ?? '#64748b', borderColor: `${RESOURCE_COLOR[type] ?? '#64748b'}30` }}>
              {type} <strong>{count}</strong>
            </span>
          ))}
        </div>

        <button className="ch-btn ch-btn--ghost fhir__copy-all" onClick={copyBundle}>
          {copiedAll ? <Check size={14}/> : <Copy size={14}/>}
          {copiedAll ? 'Copied!' : 'Copy Bundle JSON'}
        </button>
      </div>

      <div className="fhir__bundle ch-card">
        <div className="fhir__bundle-header">
          <div className="fhir__bundle-title">
            <FileCode2 size={16} color="#2563eb"/>
            <span>Bundle</span>
            <span className="fhir__bundle-meta">type: collection · total: {bundle.entries.length}</span>
          </div>
          <span className="ch-badge ch-badge--blue">FHIR R4</span>
        </div>

        <div className="fhir__entries">
          {filtered.length === 0
            ? <div className="fhir__empty">No resources match your filter.</div>
            : filtered.map((entry, i) => <ResourceNode key={i} entry={entry}/>)
          }
        </div>
      </div>
    </div>
  );
};
