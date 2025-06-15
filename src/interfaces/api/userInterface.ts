export interface User {
  user_id: number;
  user_name: string;
  user_email: string;
  device_ip: string;
  actions:unknown;
  patients: unknown;
  roles: {
    role_name: string;
  };
  user_groups: {
    group_name: string;
  };
}


export interface updateUser {
  user_id: number;
  user_name: string;
  user_email: string;
  device_ip: string;
  actions:unknown;
  patients: unknown;
  roles: {
    role_name: string;
  }
  fk_group_id?: {
    gruop_id: number;
  };
}
export interface UserGroup  {
  user_id: number;
  user_name: string;
  user_email: string;
  device_ip: string;
  roles: {
    role_name: string;
  };
  user_groups: {
    group_name: string;
  };
  actions: React.ReactNode; // ← Faltan estas
};