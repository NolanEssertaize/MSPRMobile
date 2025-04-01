export interface User {
  id: number;
  email: string;
  username: string;
  phone: string;
  is_active: boolean;
  is_botanist: boolean;
}

export interface LoginCredentials {
  username: string; // Email est utilisé comme username
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  phone: string;
  password: string;
  is_botanist?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}
