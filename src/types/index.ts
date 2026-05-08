export interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'pending';
  approved: boolean;
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Client {
  id: string;
  file_number: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  signup_date: string;
  total_amount: number;
  balance: number;
  status: 'active' | 'inactive' | 'suspended';
  profile_image_url: string | null;
  created_by: string;
  created_at: string;
}

export interface Plot {
  id: string;
  client_id: string;
  locality_id: string;
  plot_number: string;
  acreage: number;
  status: 'available' | 'sold' | 'reserved';
  plot_picked: boolean;
  site_plan_done: boolean;
  created_at: string;
}

export interface Indenture {
  id: string;
  client_id: string;
  plot_id: string;
  court_oath_date: string;
  copies_released: boolean;
  verification_photo_url: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  title: string;
  type: 'pdf' | 'image' | 'agreement' | 'receipt' | 'site_plan';
  file_url: string;
  public_id: string;
  uploaded_by: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  created_at: string;
}

export interface Payment {
  id: string;
  client_id: string;
  amount: number;
  payment_method: 'cash' | 'bank_transfer' | 'mobile_money' | 'cheque';
  reference: string;
  created_at: string;
}