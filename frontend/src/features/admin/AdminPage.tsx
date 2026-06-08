import React, { useState, useEffect } from 'react';
import { Search, Shield, Users, UserCheck, RefreshCw, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './AdminPage.css';

type Role = 'patient' | 'clinician' | 'facility_admin' | 'moh_analyst' | 'ngo_analyst' | 'super_admin';

interface UserRow {
  id: string;
  full_name: string;
  fayda_id: string | null;
  phone: string | null;
  role: Role;
  region: string | null;
  is_active: boolean;
  created_at: string;
}

const ROLES: { value: Role; label: string; color: string }[] = [
  { value: 'patient',        label: 'Patient',        color: '#059669' },
  { value: 'clinician',      label: 'Clinician',      color: '#0891b2' },
  { value: 'facility_admin', label: 'Facility Admin', color: '#7c3aed' },
  { value: 'moh_analyst',    label: 'MoH Analyst',    color: '#2563eb' },
  { value: 'ngo_analyst',    label: 'NGO Analyst',    color: '#d97706' },
  { value: 'super_admin',    label: 'Super Admin',    color: '#dc2626' },
];

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  patient:        ['view_own_health', 'view_own_appointments', 'view_own_wellness', 'use_healthbot', 'view_settings'],
  clinician:      ['view_all_patients', 'view_patient_detail', 'view_fhir_records', 'manage_appointments', 'view_all_wellness', 'use_healthbot', 'view_settings'],
  facility_admin: ['view_all_patients', 'view_patient_detail', 'manage_appointments', 'view_all_wellness', 'view_facilities', 'view_ussd', 'view_reports', 'view_settings'],
  moh_analyst:    ['view_all_patients', 'view_fhir_records', 'view_all_wellness', 'view_disease_map', 'view_disease_alerts', 'manage_alerts', 'view_facilities', 'view_ussd', 'view_reports', 'view_moh_dashboard', 'view_settings'],
  ngo_analyst:    ['view_disease_map', 'view_disease_alerts', 'view_facilities', 'view_reports', 'view_settings'],
  super_admin:    ['ALL PERMISSIONS', 'manage_users', 'view_moh_dashboard', 'view_all_patients', 'view_fhir_records', 'view_disease_map', 'manage_alerts', 'view_facilities', 'view_ussd', 'view_reports', 'use_healthbot'],
};

export const AdminPage: React.FC = () => {
  const [users, setUsers]           = useState<UserRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');
  const [editing, setEditing]       = useState<string | null>(null);
  const [editRole, setEditRole]     = useState<Role>('patient');
  const [editActive, setEditActive] = useState(true);
  const [saving, setSaving]         = useState(false);
  const [toast, setToast]           = useState<string | null>(null);
  const [selected, setSelected]     = useState<UserRow | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, fayda_id, phone, role, region, is_active, created_at')
      .order('created_at', { ascending: false });
    if (!error && data) setUsers(data as UserRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const startEdit = (u: UserRow, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(u.id); setEditRole(u.role); setEditActive(u.is_active);
  };

  const saveEdit = async (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ role: editRole, is_active: editActive }).eq('id', userId);
    setSaving(false);
    if (error) { showToast(`❌ ${error.message}`); return; }
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: editRole, is_active: editActive } : u));
    if (selected?.id === userId) setSelected(prev => prev ? { ...prev, role: editRole, is_active: editActive } : null);
    setEditing(null);
    showToast('✅ Role updated successfully');
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return (
      (!q || u.full_name.toLowerCase().includes(q) || (u.fayda_id ?? '').includes(q) || (u.phone ?? '').includes(q)) &&
      (roleFilter === 'all' || u.role === roleFilter)
    );
  });

  const counts = ROLES.reduce((acc, r) => ({ ...acc, [r.value]: users.filter(u => u.role === r.value).length }), {} as Record<Role, number>);

  return (
    <div className="adm">
      {toast && <div className="adm__toast">{toast}</div>}

      <div className="adm__header">
        <div>
          <h1><Shield size={18}/> Super Admin Panel</h1>
          <p>Manage users, assign roles, and control platform access</p>
        </div>
        <button className="ch-btn ch-btn--ghost" onClick={fetchUsers} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'adm__spin' : ''}/> Refresh
        </button>
      </div>

      {/* Role distribution strip */}
      <div className="adm__role-strip">
        {ROLES.map(r => (
          <div key={r.value} className={`adm__role-card ${roleFilter === r.value ? 'adm__role-card--active' : ''}`}
            style={{ '--rc': r.color } as React.CSSProperties}
            onClick={() => setRoleFilter(roleFilter === r.value ? 'all' : r.value)}>
            <span className="adm__role-count">{counts[r.value] ?? 0}</span>
            <span className="adm__role-label">{r.label}</span>
          </div>
        ))}
      </div>

      <div className="adm__body">
        {/* Table */}
        <div className="adm__table-wrap ch-card">
          <div className="adm__toolbar">
            <div className="adm__search">
              <Search size={14}/>
              <input placeholder="Search by name, Fayda ID, phone…" value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <span className="adm__total">{filtered.length} users</span>
          </div>

          {loading ? (
            <div className="adm__loading"><RefreshCw size={18} className="adm__spin"/> Loading users…</div>
          ) : (
            <table className="adm__table">
              <thead>
                <tr><th>User</th><th>Fayda ID</th><th>Region</th><th>Role</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const ri = ROLES.find(r => r.value === u.role)!;
                  const isEditing = editing === u.id;
                  return (
                    <tr key={u.id} className={`adm__row ${selected?.id === u.id ? 'adm__row--sel' : ''}`}
                      onClick={() => setSelected(selected?.id === u.id ? null : u)}>
                      <td>
                        <div className="adm__user">
                          <div className="adm__av" style={{ background: `${ri.color}18`, color: ri.color }}>{u.full_name[0]}</div>
                          <div>
                            <div className="adm__uname">{u.full_name}</div>
                            <div className="adm__uphone">{u.phone ?? '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="adm__fayda">{u.fayda_id ?? '—'}</span></td>
                      <td><span className="adm__region">{u.region ?? '—'}</span></td>
                      <td onClick={e => e.stopPropagation()}>
                        {isEditing ? (
                          <select className="adm__sel" value={editRole} onChange={e => setEditRole(e.target.value as Role)}>
                            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                          </select>
                        ) : (
                          <span className="adm__rbadge" style={{ background: `${ri.color}15`, color: ri.color, border: `1px solid ${ri.color}30` }}>{ri.label}</span>
                        )}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        {isEditing ? (
                          <select className="adm__sel" value={editActive ? 'active' : 'inactive'} onChange={e => setEditActive(e.target.value === 'active')}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <span className={`ch-badge ${u.is_active ? 'ch-badge--green' : 'ch-badge--red'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                        )}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        {isEditing ? (
                          <div className="adm__acts">
                            <button className="adm__save" onClick={e => saveEdit(u.id, e)} disabled={saving}><Save size={13}/>{saving ? '…' : 'Save'}</button>
                            <button className="adm__cancel" onClick={e => { e.stopPropagation(); setEditing(null); }}><X size={13}/></button>
                          </div>
                        ) : (
                          <button className="adm__edit" onClick={e => startEdit(u, e)}>Edit Role</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && <div className="adm__empty"><Users size={28}/><p>No users found</p></div>}
        </div>

        {/* Permission detail panel */}
        {selected && (
          <div className="adm__perms ch-card">
            <div className="adm__perms-user">
              <div className="adm__av adm__av--lg" style={{ background: `${ROLES.find(r => r.value === selected.role)!.color}18`, color: ROLES.find(r => r.value === selected.role)!.color }}>
                {selected.full_name[0]}
              </div>
              <div>
                <div className="adm__perms-name">{selected.full_name}</div>
                <div className="adm__perms-role" style={{ color: ROLES.find(r => r.value === selected.role)!.color }}>
                  {ROLES.find(r => r.value === selected.role)!.label}
                </div>
              </div>
            </div>
            <div className="adm__perms-title">Granted Permissions</div>
            <div className="adm__perms-list">
              {ROLE_PERMISSIONS[selected.role].map((p, i) => (
                <div key={i} className="adm__perm-row">
                  <UserCheck size={13} color="#059669"/>
                  <span>{p}</span>
                </div>
              ))}
            </div>
            <div className="adm__perms-info">
              <span>Fayda ID</span><span>{selected.fayda_id ?? 'Not linked'}</span>
              <span>Region</span><span>{selected.region ?? '—'}</span>
              <span>Joined</span><span>{new Date(selected.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
