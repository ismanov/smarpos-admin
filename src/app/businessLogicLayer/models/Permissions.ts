export interface CreateAppRouteModel {
  id?: number;
  annotationName?: string;
  menuName?: string;
  section?: boolean;
  parentId?: number;
  position?: number;
}

export interface AddPermissionsModel {
  id: number;
  permissions: string[];
}

export interface AppRouteDetails {
  id?: number;
  annotationName?: string;
  menuName?: string;
  section?: boolean;
  parentId?: number;
  position?: number;
}

export interface AppRouteModel {
  id?: number;
  name?: string;
}