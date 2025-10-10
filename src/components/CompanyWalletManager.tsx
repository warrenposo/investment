import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Wallet, 
  Copy, 
  Check, 
  AlertCircle,
  Bitcoin,
  Coins,
  DollarSign
} from 'lucide-react'
import SupabaseService from '@/services/supabaseService'
import QRCodeGenerator from './QRCodeGenerator'

interface CompanyWallet {
  id: string
  currency: string
  address: string
  wallet_name: string
  is_active: boolean
  created_at: string
}

const CompanyWalletManager: React.FC = () => {
  const [wallets, setWallets] = useState<CompanyWallet[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editingWallet, setEditingWallet] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    address: '',
    wallet_name: ''
  })

  useEffect(() => {
    loadWallets()
  }, [])

  const loadWallets = async () => {
    try {
      setLoading(true)
      const data = await SupabaseService.getCompanyWallets()
      setWallets(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load wallets')
    } finally {
      setLoading(false)
    }
  }

  const handleEditWallet = (wallet: CompanyWallet) => {
    setEditingWallet(wallet.id)
    setEditForm({
      address: wallet.address,
      wallet_name: wallet.wallet_name
    })
  }

  const handleSaveWallet = async (currency: string) => {
    try {
      setSaving(true)
      setError(null)
      
      await SupabaseService.updateCompanyWallet(
        currency,
        editForm.address,
        editForm.wallet_name
      )
      
      setSuccess(`Wallet address updated for ${currency}`)
      setEditingWallet(null)
      await loadWallets()
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to update wallet')
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const getCurrencyIcon = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return <Bitcoin className="w-5 h-5 text-orange-500" />
      case 'ETH':
        return <Coins className="w-5 h-5 text-blue-500" />
      case 'USDT-ERC20':
        return <DollarSign className="w-5 h-5 text-green-500" />
      case 'USDT-TRC20':
        return <DollarSign className="w-5 h-5 text-red-500" />
      default:
        return <Wallet className="w-5 h-5" />
    }
  }

  const getCurrencyName = (currency: string) => {
    switch (currency) {
      case 'BTC':
        return 'Bitcoin'
      case 'ETH':
        return 'Ethereum'
      case 'USDT-ERC20':
        return 'USDT (ERC-20)'
      case 'USDT-TRC20':
        return 'USDT (TRC-20)'
      default:
        return currency
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading wallet addresses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Company Wallet Management</h2>
        <p className="text-muted-foreground">
          Manage your company's cryptocurrency wallet addresses. Users will send payments to these addresses.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <Card key={wallet.id} className="relative">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCurrencyIcon(wallet.currency)}
                  <div>
                    <CardTitle className="text-lg">{getCurrencyName(wallet.currency)}</CardTitle>
                    <CardDescription>{wallet.wallet_name}</CardDescription>
                  </div>
                </div>
                <Badge variant={wallet.is_active ? "default" : "secondary"}>
                  {wallet.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingWallet === wallet.id ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="wallet_name">Wallet Name</Label>
                    <Input
                      id="wallet_name"
                      value={editForm.wallet_name}
                      onChange={(e) => setEditForm(prev => ({ ...prev, wallet_name: e.target.value }))}
                      placeholder="e.g., Main Bitcoin Wallet"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Wallet Address</Label>
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter wallet address"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveWallet(wallet.currency)}
                      disabled={saving}
                      className="flex-1"
                    >
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setEditingWallet(null)}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Wallet Address</Label>
                    <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                      <code className="text-xs flex-1 break-all">{wallet.address}</code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.address)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <QRCodeGenerator
                        address={wallet.address}
                        currency={wallet.currency}
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleEditWallet(wallet)}
                    className="w-full"
                  >
                    Edit Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> These are your company's receiving addresses. 
          All user deposits will be sent to these addresses. Make sure to use secure, 
          company-controlled wallets only.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default CompanyWalletManager
