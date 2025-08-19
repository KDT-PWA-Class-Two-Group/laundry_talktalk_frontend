export interface User {
  user_id: number;
  email: string;
  password: string;
  phone: string;
  access_token: string;
  refresh_token: string;
  login_id: string;
  user_admin: boolean;
}