export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  role: 'CUSTOMER' | 'RESTAURANT_OWNER' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE'; // forse si puo togliere dipende se devidiamo di salvarlo nel db o no
  emailVerified: boolean;
}

export interface AuthResponse{
  token: string;
  type: 'Bearer';
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface RestaurantRegisterRequest {
  restaurantName: string;
  address: string;
  adminFirstName: string;
  adminLastName: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  redirectUrl?: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

// Enum per i ruoli (opzionale, ma utile)
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  RESTAURANT_OWNER = 'RESTAURANT_OWNER',
  ADMIN = 'ADMIN'
}

// di nuovo dipende se vogliamo saperlo o meno ma si puo anche fare a meno 
export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE'
}