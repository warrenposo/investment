import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  FileText, 
  Camera, 
  CreditCard,
  AlertCircle,
  Eye,
  Download
} from 'lucide-react'
import SupabaseService from '@/services/supabaseService'

interface KycDocument {
  id: string
  user_id: string
  document_type: string
  file_url: string
  file_name: string
  file_size: number
  mime_type: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  uploaded_at: string
  reviewed_at?: string
  reviewed_by?: string
  users?: {
    first_name: string
    last_name: string
    email: string
  }
}

const KycVerification: React.FC = () => {
  const [documents, setDocuments] = useState<KycDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDocument, setSelectedDocument] = useState<KycDocument | null>(null)
  const [reviewing, setReviewing] = useState(false)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const data = await SupabaseService.getAllKycDocuments()
      setDocuments(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (documentId: string, userId: string) => {
    try {
      setReviewing(true)
      await SupabaseService.updateKycDocumentStatus(documentId, 'approved')
      
      // Check if all user documents are approved
      const userDocs = documents.filter(doc => doc.user_id === userId)
      const allApproved = userDocs.every(doc => 
        doc.id === documentId ? true : doc.status === 'approved'
      )
      
      if (allApproved) {
        await SupabaseService.updateUserKycStatus(userId, 'approved')
      }
      
      await loadDocuments()
    } catch (err: any) {
      setError(err.message || 'Failed to approve document')
    } finally {
      setReviewing(false)
    }
  }

  const handleReject = async (documentId: string, userId: string, reason: string) => {
    try {
      setReviewing(true)
      await SupabaseService.updateKycDocumentStatus(documentId, 'rejected', reason)
      await SupabaseService.updateUserKycStatus(userId, 'rejected')
      await loadDocuments()
    } catch (err: any) {
      setError(err.message || 'Failed to reject document')
    } finally {
      setReviewing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'id_front':
      case 'id_back':
        return <CreditCard className="w-6 h-6" />
      case 'selfie':
        return <Camera className="w-6 h-6" />
      case 'proof_of_address':
        return <FileText className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const pendingDocs = documents.filter(doc => doc.status === 'pending')
  const approvedDocs = documents.filter(doc => doc.status === 'approved')
  const rejectedDocs = documents.filter(doc => doc.status === 'rejected')

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">KYC Verification</h2>
          <p className="text-muted-foreground">Review and verify user identity documents</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-yellow-600">
            {pendingDocs.length} Pending
          </Badge>
          <Badge variant="outline" className="text-green-600">
            {approvedDocs.length} Approved
          </Badge>
          <Badge variant="outline" className="text-red-600">
            {rejectedDocs.length} Rejected
          </Badge>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingDocs.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedDocs.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedDocs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingDocs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Pending Documents</h3>
                  <p className="text-muted-foreground">All documents have been reviewed</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingDocs.map((doc) => (
                <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {getDocumentIcon(doc.document_type)}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{getDocumentTitle(doc.document_type)}</CardTitle>
                          <CardDescription className="text-xs">
                            {doc.users?.first_name} {doc.users?.last_name}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(doc.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{doc.file_name}</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Uploaded: {formatDate(doc.uploaded_at)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.file_url, '_blank')}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = doc.file_url
                            link.download = doc.file_name
                            link.click()
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(doc.id, doc.user_id)}
                          disabled={reviewing}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            const reason = prompt('Rejection reason:')
                            if (reason) {
                              handleReject(doc.id, doc.user_id, reason)
                            }
                          }}
                          disabled={reviewing}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedDocs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-semibold mb-2">No Approved Documents</h3>
                  <p className="text-muted-foreground">No documents have been approved yet</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {approvedDocs.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                          {getDocumentIcon(doc.document_type)}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{getDocumentTitle(doc.document_type)}</CardTitle>
                          <CardDescription className="text-xs">
                            {doc.users?.first_name} {doc.users?.last_name}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(doc.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{doc.file_name}</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Approved: {doc.reviewed_at ? formatDate(doc.reviewed_at) : 'N/A'}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.file_url, '_blank')}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = doc.file_url
                            link.download = doc.file_name
                            link.click()
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedDocs.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-semibold mb-2">No Rejected Documents</h3>
                  <p className="text-muted-foreground">No documents have been rejected</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rejectedDocs.map((doc) => (
                <Card key={doc.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600">
                          {getDocumentIcon(doc.document_type)}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{getDocumentTitle(doc.document_type)}</CardTitle>
                          <CardDescription className="text-xs">
                            {doc.users?.first_name} {doc.users?.last_name}
                          </CardDescription>
                        </div>
                      </div>
                      {getStatusIcon(doc.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{doc.file_name}</span>
                        <span>{formatFileSize(doc.file_size)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Rejected: {doc.reviewed_at ? formatDate(doc.reviewed_at) : 'N/A'}
                      </div>
                      {doc.rejection_reason && (
                        <div className="p-2 bg-red-50 rounded text-xs text-red-700">
                          <strong>Reason:</strong> {doc.rejection_reason}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(doc.file_url, '_blank')}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = doc.file_url
                            link.download = doc.file_name
                            link.click()
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default KycVerification
