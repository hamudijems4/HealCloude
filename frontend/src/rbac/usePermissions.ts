import { useAuthStore } from '../store/authStore';
import { can, getPermissions, ROLE_META, ROLE_HOME } from './permissions';
import type { Permission, Role } from './permissions';

export function usePermissions() {
  const profile = useAuthStore(s => s.profile);
  const role = (profile?.role ?? 'patient') as Role;

  return {
    role,
    can: (permission: Permission) => can(role, permission),
    permissions: getPermissions(role),
    meta: ROLE_META[role],
    homeRoute: ROLE_HOME[role],
  };
}
