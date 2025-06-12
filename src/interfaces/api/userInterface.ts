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
