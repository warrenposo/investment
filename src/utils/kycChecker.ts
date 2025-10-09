import SupabaseService from '../services/supabaseService'

export interface KycStatus {
  status: 'pending' | 'approved' | 'rejected' | 'not_started'
  canDeposit: boolean
  message: string
  documents: {
    id_front: boolean
    id_back: boolean
    selfie: boolean
    proof_of_address: boolean
  }
}

export class KycChecker {
  /**
   * Check if user can make deposits based on KYC status
   */
  static async canUserDeposit(userId: string): Promise<KycStatus> {
    try {
      // Get user profile from Supabase
      const userProfile = await SupabaseService.getUserProfile(userId);
      const documents = await SupabaseService.getUserKycDocuments(userId);

      const kycStatus = userProfile.kyc_status || 'not_started';

      // Check which documents are uploaded
      const documentStatus = {
        id_front: documents.some(doc => doc.document_type === 'id_front'),
        id_back: documents.some(doc => doc.document_type === 'id_back'),
        selfie: documents.some(doc => doc.document_type === 'selfie'),
        proof_of_address: documents.some(doc => doc.document_type === 'proof_of_address')
      };

      // Determine if user can deposit
      const canDeposit = kycStatus === 'approved';

      // Generate appropriate message
      let message = '';
      switch (kycStatus) {
        case 'approved':
          message = 'Your identity is verified. You can make deposits.';
          break;
        case 'rejected':
          message = 'Your KYC verification was rejected. Please upload new documents.';
          break;
        case 'pending':
          message = 'Your KYC verification is under review. Please wait for approval.';
          break;
        default:
          message = 'KYC verification is required before making deposits.';
      }

      return {
        status: kycStatus,
        canDeposit,
        message,
        documents: documentStatus
      };
    } catch (error) {
      console.error('Error checking KYC status:', error);
      return {
        status: 'not_started',
        canDeposit: false,
        message: 'Unable to verify KYC status. Please try again.',
        documents: {
          id_front: false,
          id_back: false,
          selfie: false,
          proof_of_address: false
        }
      };
    }
  }

  /**
   * Check if user has completed all required KYC documents
   */
  static async hasRequiredDocuments(userId: string): Promise<boolean> {
    try {
      const documents = await SupabaseService.getUserKycDocuments(userId)
      const requiredTypes = ['id_front', 'id_back', 'selfie']
      
      return requiredTypes.every(type => 
        documents.some(doc => doc.document_type === type)
      )
    } catch (error) {
      console.error('Error checking required documents:', error)
      return false
    }
  }

  /**
   * Get KYC completion percentage
   */
  static async getKycProgress(userId: string): Promise<number> {
    try {
      const documents = await SupabaseService.getUserKycDocuments(userId)
      const requiredTypes = ['id_front', 'id_back', 'selfie']
      const uploadedCount = requiredTypes.filter(type => 
        documents.some(doc => doc.document_type === type)
      ).length
      
      return Math.round((uploadedCount / requiredTypes.length) * 100)
    } catch (error) {
      console.error('Error calculating KYC progress:', error)
      return 0
    }
  }

  /**
   * Validate KYC status for deposit
   */
  static async validateDeposit(userId: string): Promise<{
    valid: boolean
    message: string
    redirectTo?: string
  }> {
    const kycStatus = await this.canUserDeposit(userId)
    
    if (kycStatus.canDeposit) {
      return {
        valid: true,
        message: 'KYC verification complete. Proceeding with deposit.'
      }
    }

    // Determine redirect based on status
    let redirectTo = '/kyc'
    if (kycStatus.status === 'rejected') {
      redirectTo = '/kyc'
    } else if (kycStatus.status === 'pending') {
      redirectTo = '/kyc'
    } else {
      redirectTo = '/kyc'
    }

    return {
      valid: false,
      message: kycStatus.message,
      redirectTo
    }
  }
}

export default KycChecker
