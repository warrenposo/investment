import React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { QrCode } from 'lucide-react'

interface QRCodeGeneratorProps {
  address: string
  currency: string
  amount?: number
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ address, currency, amount }) => {
  // Generate QR code URL using a free QR code service
  const generateQRCodeURL = () => {
    let qrText = address
    
    // For Bitcoin, include amount in the QR code if provided
    if (currency === 'BTC' && amount) {
      qrText = `bitcoin:${address}?amount=${amount}`
    }
    // For Ethereum and ERC-20 tokens
    else if ((currency === 'ETH' || currency === 'USDT-ERC20') && amount) {
      qrText = `ethereum:${address}?value=${amount}`
    }
    // For TRC-20 tokens
    else if (currency === 'USDT-TRC20' && amount) {
      qrText = `tron:${address}?amount=${amount}`
    }
    
    // Use qr-server.com for free QR code generation
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}`
  }

  const getCurrencyName = () => {
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

  const getNetworkName = () => {
    switch (currency) {
      case 'BTC':
        return 'Bitcoin Network'
      case 'ETH':
        return 'Ethereum Network'
      case 'USDT-ERC20':
        return 'Ethereum Network (ERC-20)'
      case 'USDT-TRC20':
        return 'TRON Network (TRC-20)'
      default:
        return 'Blockchain Network'
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{getCurrencyName()} QR Code</DialogTitle>
          <DialogDescription>
            Scan this QR code with your {getCurrencyName()} wallet to send payment
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* QR Code Image */}
          <div className="flex justify-center">
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
              <img
                src={generateQRCodeURL()}
                alt={`${getCurrencyName()} QR Code`}
                className="w-64 h-64"
                onError={(e) => {
                  console.error('Failed to load QR code')
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
          
          {/* Address Display */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Wallet Address:</div>
            <div className="p-3 bg-muted rounded-md">
              <code className="text-xs break-all">{address}</code>
            </div>
          </div>
          
          {/* Network Information */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Network:</div>
            <div className="text-sm">{getNetworkName()}</div>
          </div>
          
          {/* Instructions */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Instructions:</div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>1. Open your {getCurrencyName()} wallet</p>
              <p>2. Scan the QR code above</p>
              <p>3. Confirm the amount and network</p>
              <p>4. Send the payment</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default QRCodeGenerator
