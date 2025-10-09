import { supabase, User, KycDocument, Investment, Transaction } from '../lib/supabase'

export class SupabaseService {
  // Authentication methods
  static async signUp(email: string, password: string, userData: {
    firstName: string
    lastName: string
    phone?: string
    country?: string
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          country: userData.country
        }
      }
    })

    if (error) throw error
    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // User profile methods
  static async getUserProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }

  static async updateUserProfile(userId: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // KYC Document methods
  static async uploadKycDocument(
    userId: string,
    documentType: 'id_front' | 'id_back' | 'selfie' | 'proof_of_address',
    file: File
  ) {
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('kyc-documents')
      .getPublicUrl(fileName)

    // Save document record to database
    const { data, error } = await supabase
      .from('kyc_documents')
      .insert({
        user_id: userId,
        document_type: documentType,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserKycDocuments(userId: string) {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', userId)
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updateKycDocumentStatus(
    documentId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string,
    reviewedBy?: string
  ) {
    const { data, error } = await supabase
      .from('kyc_documents')
      .update({
        status,
        rejection_reason: rejectionReason,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy
      })
      .eq('id', documentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Investment methods
  static async getInvestmentPlans() {
    const { data, error } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('is_active', true)
      .order('min_amount', { ascending: true })

    if (error) throw error
    return data
  }

  static async createInvestment(
    userId: string,
    planId: string,
    amount: number,
    planData: {
      name: string
      roi_percentage: number
      frequency: string
    }
  ) {
    const { data, error } = await supabase
      .from('investments')
      .insert({
        user_id: userId,
        plan_id: planId,
        plan_name: planData.name,
        amount,
        roi_percentage: planData.roi_percentage,
        frequency: planData.frequency
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserInvestments(userId: string) {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Transaction methods
  static async createTransaction(
    userId: string,
    type: 'deposit' | 'withdrawal' | 'investment' | 'profit',
    amount: number,
    method: string,
    description?: string
  ) {
    const reference = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        type,
        amount,
        method,
        reference,
        description
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserTransactions(userId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updateTransactionStatus(
    transactionId: string,
    status: 'pending' | 'completed' | 'failed'
  ) {
    const { data, error } = await supabase
      .from('transactions')
      .update({ status })
      .eq('id', transactionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Balance methods
  static async getUserBalance(userId: string) {
    const { data, error } = await supabase
      .from('user_balances')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  }

  static async updateUserBalance(
    userId: string,
    updates: {
      total_balance?: number
      total_invested?: number
      total_profit?: number
      total_withdrawals?: number
      active_investments?: number
    }
  ) {
    const { data, error } = await supabase
      .from('user_balances')
      .upsert({
        user_id: userId,
        ...updates
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Admin methods
  static async getAllKycDocuments() {
    const { data, error } = await supabase
      .from('kyc_documents')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          email
        )
      `)
      .order('uploaded_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getAllUsers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async updateUserKycStatus(
    userId: string,
    status: 'pending' | 'approved' | 'rejected'
  ) {
    const { data, error } = await supabase
      .from('users')
      .update({ kyc_status: status })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export default SupabaseService
