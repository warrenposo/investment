import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle, Upload } from 'lucide-react'
import KycUpload from '@/components/KycUpload'
import SupabaseService from '@/services/supabaseService'

const KycPage: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [kycStatus, setKycStatus] = useState<'pending' | 'approved' | 'rejected' | 'not_started'>('not_started')
  const [kycDocuments, setKycDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkKycStatus()
  }, [])

  const checkKycStatus = async () => {
    try {
      setLoading(true)
      
      // Get current Supabase user
      const currentUser = await SupabaseService.getCurrentUser()
      
      if (!currentUser) {
        navigate('/signin')
        return
      }

      setUser(currentUser)

      try {
        // Get user profile and KYC status from Supabase
        const userProfile = await SupabaseService.getUserProfile(currentUser.id)
        const documents = await SupabaseService.getUserKycDocuments(currentUser.id)

        setKycDocuments(documents)
        setKycStatus(userProfile.kyc_status || 'not_started')
      } catch (supabaseError) {
        console.log('Supabase error:', supabaseError)
        setError('Failed to load KYC status from database')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load KYC status')
    } finally {
      setLoading(false)
    }
  }

  const handleKycComplete = () => {
    // Refresh KYC status after upload
    checkKycStatus()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-500" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Started</Badge>
    }
  }

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          title: 'KYC Verification Complete!',
          message: 'Your identity has been verified. You can now make deposits and start investing.',
          color: 'text-green-600',
          bgColor: 'bg-green-50 border-green-200'
        }
      case 'rejected':
        return {
          title: 'KYC Verification Rejected',
          message: 'Your documents were rejected. Please upload new documents to complete verification.',
          color: 'text-red-600',
          bgColor: 'bg-red-50 border-red-200'
        }
      case 'pending':
        return {
          title: 'KYC Verification Under Review',
          message: 'Your documents are being reviewed. This usually takes 1-3 business days.',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50 border-yellow-200'
        }
      default:
        return {
          title: 'KYC Verification Required',
          message: 'Complete your identity verification to start investing and making deposits.',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 border-blue-200'
        }
    }
  }

  const getDocumentStatus = (type: string) => {
    const doc = kycDocuments.find(d => d.document_type === type)
    if (!doc) return 'not_uploaded'
    return doc.status
  }

  const getDocumentIcon = (type: string) => {
    const status = getDocumentStatus(type)
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      default:
        return <Upload className="w-5 h-5 text-gray-400" />
    }
  }

  const getDocumentBadge = (type: string) => {
    const status = getDocumentStatus(type)
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 text-xs">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 text-xs">Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs">Pending</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Not Uploaded</Badge>
    }
  }

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case 'id_front':
        return 'Front of ID'
      case 'id_back':
        return 'Back of ID'
      case 'selfie':
        return 'Selfie Photo'
      case 'proof_of_address':
        return 'Proof of Address'
      default:
        return 'Document'
    }
  }

  const getRejectionReason = (type: string) => {
    const doc = kycDocuments.find(d => d.document_type === type)
    return doc?.rejection_reason || ''
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading KYC status...</p>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusMessage(kycStatus)
  const requiredDocs = ['id_front', 'id_back', 'selfie']
  const uploadedDocs = requiredDocs.filter(doc => getDocumentStatus(doc) !== 'not_uploaded')
  const progressPercentage = (uploadedDocs.length / requiredDocs.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">KYC Verification</h1>
            <p className="text-muted-foreground">Complete your identity verification</p>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Status Overview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(kycStatus)}
                <div>
                  <CardTitle className={statusInfo.color}>
                    {statusInfo.title}
                  </CardTitle>
                  <CardDescription>
                    {statusInfo.message}
                  </CardDescription>
                </div>
              </div>
              {getStatusBadge(kycStatus)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Progress Bar */}
              {kycStatus !== 'approved' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Document Upload Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {uploadedDocs.length}/{requiredDocs.length} documents
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}

              {/* Document Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredDocs.map((docType) => (
                  <div key={docType} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getDocumentIcon(docType)}
                      <div>
                        <p className="font-medium">{getDocumentTitle(docType)}</p>
                        {getDocumentStatus(docType) === 'rejected' && getRejectionReason(docType) && (
                          <p className="text-xs text-red-600 mt-1">
                            Reason: {getRejectionReason(docType)}
                          </p>
                        )}
                      </div>
                    </div>
                    {getDocumentBadge(docType)}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Upload Component */}
        {kycStatus !== 'approved' && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Documents</CardTitle>
              <CardDescription>
                {kycStatus === 'rejected' 
                  ? 'Please upload new documents to complete verification.'
                  : 'Upload the required documents to verify your identity.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <KycUpload 
                  userId={user.id} 
                  onComplete={handleKycComplete}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {kycStatus === 'approved' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">
                  Verification Complete!
                </h3>
                <p className="text-green-700 mb-4">
                  Your identity has been verified. You can now make deposits and start investing.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/plan')}
                    className="border-green-600 text-green-600 hover:bg-green-50"
                  >
                    View Investment Plans
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default KycPage
