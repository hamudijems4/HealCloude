import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from './usePermissions';
import type { Permission } from './permissions';

interface Props {
  require: Permission;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<Props> = ({ require, children }) => {
  const { can, homeRoute } = usePermissions();

  if (!can(require)) {
    return <Navigate to={homeRoute} replace />;
  }

  return <>{children}</>;
};
