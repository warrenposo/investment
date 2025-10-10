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

  // Payment methods
  static async createPaymentRequest(
    userId: string,
    currency: string,
    amount: number,
    address: string
  ) {
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

    const { data, error } = await supabase
      .from('payment_requests')
      .insert({
        user_id: userId,
        currency,
        requested_amount: amount,
        crypto_address: address,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserPaymentRequests(userId: string) {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async createPaymentTransaction(
    userId: string,
    currency: string,
    cryptoAmount: number,
    usdAmount: number,
    txHash: string,
    exchangeRate: number
  ) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .insert({
        user_id: userId,
        currency,
        crypto_amount: cryptoAmount,
        usd_amount: usdAmount,
        tx_hash: txHash,
        exchange_rate: exchangeRate,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updatePaymentTransactionStatus(
    transactionId: string,
    status: 'pending' | 'confirmed' | 'failed' | 'expired',
    confirmations?: number
  ) {
    const updateData: any = { status }
    if (confirmations !== undefined) {
      updateData.confirmations = confirmations
    }

    const { data, error } = await supabase
      .from('payment_transactions')
      .update(updateData)
      .eq('id', transactionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserPaymentTransactions(userId: string) {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getAllPaymentTransactions() {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async saveUserCryptoAddress(
    userId: string,
    currency: string,
    address: string
  ) {
    const { data, error } = await supabase
      .from('user_crypto_addresses')
      .insert({
        user_id: userId,
        currency,
        address
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserCryptoAddresses(userId: string) {
    const { data, error } = await supabase
      .from('user_crypto_addresses')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)

    if (error) throw error
    return data
  }

  static async getPendingPaymentTransactions() {
    const { data, error } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  }

  // Company wallet methods
  static async getCompanyWallets() {
    const { data, error } = await supabase
      .from('company_wallets')
      .select('*')
      .eq('is_active', true)
      .order('currency')

    if (error) throw error
    return data
  }

  static async updateCompanyWallet(currency: string, address: string, walletName: string) {
    const { data, error } = await supabase
      .from('company_wallets')
      .upsert({
        currency,
        address,
        wallet_name: walletName,
        is_active: true
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async createUserPaymentTracking(
    userId: string,
    paymentRequestId: string,
    companyWalletId: string,
    currency: string,
    requestedAmount: number,
    cryptoAmount: number,
    companyAddress: string,
    userReference: string
  ) {
    const { data, error } = await supabase
      .from('user_payment_tracking')
      .insert({
        user_id: userId,
        payment_request_id: paymentRequestId,
        company_wallet_id: companyWalletId,
        currency,
        requested_amount: requestedAmount,
        crypto_amount: cryptoAmount,
        company_address: companyAddress,
        user_reference: userReference,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateUserPaymentTrackingStatus(
    trackingId: string,
    status: 'pending' | 'paid' | 'confirmed' | 'expired',
    txHash?: string,
    confirmations?: number
  ) {
    const updateData: any = { status }
    if (txHash) updateData.tx_hash = txHash
    if (confirmations !== undefined) updateData.confirmations = confirmations

    const { data, error } = await supabase
      .from('user_payment_tracking')
      .update(updateData)
      .eq('id', trackingId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getUserPaymentTracking(userId: string) {
    const { data, error } = await supabase
      .from('user_payment_tracking')
      .select(`
        *,
        company_wallets:company_wallet_id (
          wallet_name,
          currency
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getAllUserPaymentTracking() {
    const { data, error } = await supabase
      .from('user_payment_tracking')
      .select(`
        *,
        users:user_id (
          first_name,
          last_name,
          email
        ),
        company_wallets:company_wallet_id (
          wallet_name,
          currency
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getPendingUserPayments() {
    const { data, error } = await supabase
      .from('user_payment_tracking')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  }
}

export default SupabaseService
