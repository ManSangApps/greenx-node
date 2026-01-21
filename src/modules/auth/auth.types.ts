export interface AuthResponse {
  token?: string;
  user?: {
    id: number;
    email: string;
    name: string;
    phone: string | null;
    isActive: boolean;
  };
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
