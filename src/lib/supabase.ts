import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uqbzgdbycgoeatrvjrnk.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxYnpnZGJ5Y2dvZWF0cnZqcm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDE5MjcsImV4cCI6MjA3NTQ3NzkyN30.6cKS8GApzCP37IIoYtraCobRnjAXS-l4e_1srbE6DUc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  country: string
  created_at: string
  updated_at: string
  kyc_status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
}

export interface KycDocument {
  id: string
  user_id: string
  document_type: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address'
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  uploaded_at: string
  reviewed_at?: string
  reviewed_by?: string
}

export interface Investment {
  id: string
  user_id: string
  plan_name: string
  amount: number
  roi_percentage: number
  frequency: string
  status: 'active' | 'completed' | 'cancelled'
  start_date: string
  end_date?: string
  total_return?: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdrawal' | 'investment' | 'profit'
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  method: string
  reference: string
  description?: string
  created_at: string
  updated_at: string
}
