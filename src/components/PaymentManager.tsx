import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  Copy,
  AlertCircle,
  DollarSign,
  Bitcoin,
  Coins
} from 'lucide-react'
import SupabaseService from '@/services/supabaseService'
import BlockchainMonitor from '@/services/blockchainMonitor'

interface PaymentTracking {
  id: string
  user_id: string
  currency: string
  requested_amount: number
  crypto_amount: number
  company_address: string
  user_reference: string
  status: string
  tx_hash?: string
  confirmations?: number
  created_at: string
  users?: {
    first_name: string
    last_name: string
    email: string
  }
  company_wallets?: {
    wallet_name: string
    currency: string
  }
}

const PaymentManager: React.FC = () => {
  const [payments, setPayments] = useState<PaymentTracking[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [manualConfirm, setManualConfirm] = useState<{
    trackingId: string
    txHash: string
    confirmations: number
  } | null>(null)

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      setLoading(true)
      const data = await SupabaseService.getAllUserPaymentTracking()
      setPayments(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  const handleManualConfirm = async () => {
    if (!manualConfirm) return

    try {
      setConfirming(manualConfirm.trackingId)
      setError(null)

      const success = await BlockchainMonitor.manuallyConfirmPayment(
        manualConfirm.trackingId,
        manualConfirm.txHash,
        manualConfirm.confirmations
      )

      if (success) {
        setSuccess('Payment confirmed successfully!')
        setManualConfirm(null)
        await loadPayments()
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000)
      } else {
        setError('Failed to confirm payment')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to confirm payment')
    } finally {
      setConfirming(null)
    }
  }

  const startBlockchainMonitoring = () => {
    BlockchainMonitor.startMonitoring(5) // Monitor every 5 minutes
    setSuccess('Blockchain monitoring started! Checking wallets every 5 minutes.')
    setTimeout(() => setSuccess(null), 5000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case 'paid':
        return <Badge className="bg-blue-100 text-blue-800">Paid</Badge>
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'expired':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return <Bitcoin className="w-5 h-5 text-orange-500" />
      case 'ETH':
        return <Coins className="w-5 h-5 text-blue-500" />
      case 'USDT':
        return <DollarSign className="w-5 h-5 text-green-500" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCryptoAmount = (amount: number, currency: string) => {
    const decimals = currency === 'BTC' ? 8 : currency === 'ETH' ? 6 : 2
    return parseFloat(amount.toString()).toFixed(decimals)
  }

  const pendingPayments = payments.filter(p => p.status === 'pending')
  const confirmedPayments = payments.filter(p => p.status === 'confirmed')
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.requested_amount, 0)
  const totalConfirmed = confirmedPayments.reduce((sum, p) => sum + p.requested_amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Management</h2>
          <p className="text-muted-foreground">Monitor and confirm cryptocurrency payments</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={startBlockchainMonitoring} variant="outline">
            Start Monitoring
          </Button>
          <Button onClick={loadPayments} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground">${totalPending.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmedPayments.length}</div>
            <p className="text-xs text-muted-foreground">${totalConfirmed.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.length > 0 ? Math.round((confirmedPayments.length / payments.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Payment success</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual Confirmation Form */}
      {manualConfirm && (
        <Card>
          <CardHeader>
            <CardTitle>Manual Payment Confirmation</CardTitle>
            <CardDescription>
              Confirm a payment manually by entering the transaction hash
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="txHash">Transaction Hash</Label>
              <Input
                id="txHash"
                value={manualConfirm.txHash}
                onChange={(e) => setManualConfirm(prev => prev ? {...prev, txHash: e.target.value} : null)}
                placeholder="Enter transaction hash"
              />
            </div>
            <div>
              <Label htmlFor="confirmations">Confirmations</Label>
              <Input
                id="confirmations"
                type="number"
                value={manualConfirm.confirmations}
                onChange={(e) => setManualConfirm(prev => prev ? {...prev, confirmations: parseInt(e.target.value)} : null)}
                placeholder="Number of confirmations"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleManualConfirm}
                disabled={confirming === manualConfirm.trackingId}
              >
                {confirming === manualConfirm.trackingId ? "Confirming..." : "Confirm Payment"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => setManualConfirm(null)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payments List */}
      <div className="space-y-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCurrencyIcon(payment.currency)}
                  <div>
                    <CardTitle className="text-lg">
                      {payment.users?.first_name} {payment.users?.last_name}
                    </CardTitle>
                    <CardDescription>{payment.users?.email}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(payment.status)}
                  {getStatusBadge(payment.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Amount</Label>
                  <p className="font-medium">${payment.requested_amount}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Crypto Amount</Label>
                  <p className="font-medium">
                    {formatCryptoAmount(payment.crypto_amount, payment.currency)} {payment.currency}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Reference</Label>
                  <p className="font-medium font-mono text-xs">{payment.user_reference}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Created</Label>
                  <p className="font-medium">{formatDate(payment.created_at)}</p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Company Address</Label>
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                  <code className="text-xs flex-1 break-all">{payment.company_address}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(payment.company_address)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {payment.tx_hash && (
                <div>
                  <Label className="text-xs text-muted-foreground">Transaction Hash</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <code className="text-xs flex-1 break-all">{payment.tx_hash}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(payment.tx_hash!)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {payment.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setManualConfirm({
                      trackingId: payment.id,
                      txHash: '',
                      confirmations: 6
                    })}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Manual Confirm
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {payments.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Payments Yet</h3>
              <p className="text-muted-foreground">Payments will appear here when users make deposits</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PaymentManager
