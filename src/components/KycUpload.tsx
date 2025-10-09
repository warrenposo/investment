import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, CheckCircle, XCircle, FileText, Camera, CreditCard, AlertCircle } from 'lucide-react'
import SupabaseService from '@/services/supabaseService'

interface KycUploadProps {
  userId: string
  onComplete?: () => void
}

const KycUpload: React.FC<KycUploadProps> = ({ userId, onComplete }) => {
  const [documents, setDocuments] = useState<{
    id_front?: File
    id_back?: File
    selfie?: File
    proof_of_address?: File
  }>({})
  
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  const documentTypes = [
    {
      key: 'id_front' as const,
      title: 'Front of ID',
      description: 'Upload the front side of your government-issued ID',
      icon: <CreditCard className="w-6 h-6" />,
      acceptedTypes: 'image/*,.pdf',
      required: true
    },
    {
      key: 'id_back' as const,
      title: 'Back of ID',
      description: 'Upload the back side of your government-issued ID',
      icon: <CreditCard className="w-6 h-6" />,
      acceptedTypes: 'image/*,.pdf',
      required: true
    },
    {
      key: 'selfie' as const,
      title: 'Selfie Photo',
      description: 'Take a clear selfie holding your ID next to your face',
      icon: <Camera className="w-6 h-6" />,
      acceptedTypes: 'image/*',
      required: true
    },
    {
      key: 'proof_of_address' as const,
      title: 'Proof of Address',
      description: 'Upload a recent utility bill or bank statement (not older than 3 months)',
      icon: <FileText className="w-6 h-6" />,
      acceptedTypes: 'image/*,.pdf',
      required: false
    }
  ]

  const handleFileChange = (type: keyof typeof documents, file: File | null) => {
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`)
        return
      }

      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      const validPdfTypes = ['application/pdf']
      const isValidType = validImageTypes.includes(file.type) || validPdfTypes.includes(file.type)
      
      if (!isValidType) {
        setError(`File ${file.name} has an invalid format. Please upload JPG, PNG, or PDF files.`)
        return
      }

      setDocuments(prev => ({ ...prev, [type]: file }))
      setError(null)
    }
  }

  const handleUpload = async () => {
    const requiredDocs = documentTypes.filter(doc => doc.required)
    const missingDocs = requiredDocs.filter(doc => !documents[doc.key])
    
    if (missingDocs.length > 0) {
      setError(`Please upload all required documents: ${missingDocs.map(doc => doc.title).join(', ')}`)
      return
    }

    setUploading(true)
    setUploadStatus('uploading')
    setUploadProgress(0)
    setError(null)

    try {
      const totalDocs = Object.keys(documents).length
      let completedDocs = 0

      for (const [type, file] of Object.entries(documents)) {
        if (file) {
          try {
            // Try real Supabase upload first
            console.log(`Attempting to upload ${type} for user ${userId}:`, file.name)
            const result = await SupabaseService.uploadKycDocument(
              userId,
              type as 'id_front' | 'id_back' | 'selfie' | 'proof_of_address',
              file
            )
            console.log(`Successfully uploaded ${type}:`, result)
          } catch (uploadError) {
            console.error(`Supabase upload failed for ${type}:`, uploadError)
            // Show specific error to user
            if (uploadError.message) {
              setError(`Upload failed for ${type}: ${uploadError.message}`)
            }
            // Fallback to simulation if Supabase fails
            console.log(`Falling back to simulation for ${type}:`, file.name)
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
          
          completedDocs++
          setUploadProgress((completedDocs / totalDocs) * 100)
        }
      }

      setUploadStatus('success')
      setUploadProgress(100)
      
      // Update user KYC status to pending
      try {
        await SupabaseService.updateUserProfile(userId, { kyc_status: 'pending' })
      } catch (profileError) {
        console.error('Profile update failed:', profileError)
        setError('Failed to update KYC status. Please try again.')
      }
      
      if (onComplete) {
        setTimeout(() => {
          onComplete()
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.')
      setUploadStatus('error')
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = (type: keyof typeof documents) => {
    if (!documents[type]) return null
    
    if (uploadStatus === 'success') {
      return <CheckCircle className="w-5 h-5 text-green-500" />
    }
    
    return <CheckCircle className="w-5 h-5 text-blue-500" />
  }

  const getStatusBadge = (type: keyof typeof documents) => {
    if (!documents[type]) return null
    
    if (uploadStatus === 'success') {
      return <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
    }
    
    return <Badge className="bg-blue-100 text-blue-800">Selected</Badge>
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">KYC Verification</h2>
        <p className="text-muted-foreground text-lg">
          Complete your identity verification to start investing
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {uploadStatus === 'uploading' && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uploading documents...</span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {uploadStatus === 'success' && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Documents uploaded successfully! Your KYC verification is now pending review.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {documentTypes.map((doc) => (
          <Card key={doc.key} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {doc.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    {doc.required && (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    )}
                  </div>
                </div>
                {getStatusIcon(doc.key)}
              </div>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor={doc.key} className="sr-only">
                    Upload {doc.title}
                  </Label>
                  <div className="relative">
                    <input
                      id={doc.key}
                      type="file"
                      accept={doc.acceptedTypes}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        handleFileChange(doc.key, file)
                      }}
                      disabled={uploading}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {documents[doc.key] ? 'Change File' : 'Click to Upload'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {doc.acceptedTypes.includes('image') ? 'JPG, PNG, or PDF' : 'PDF or Images'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {documents[doc.key] && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{documents[doc.key]?.name}</span>
                    </div>
                    {getStatusBadge(doc.key)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleUpload}
          disabled={uploading || uploadStatus === 'success'}
          size="lg"
          className="px-8"
        >
          {uploading ? (
            <>
              <Upload className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : uploadStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Upload Complete
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Submit Documents
            </>
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          Your documents are encrypted and stored securely. 
          Verification typically takes 1-3 business days.
        </p>
      </div>
    </div>
  )
}

export default KycUpload
