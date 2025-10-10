import SupabaseService from './supabaseService'

// Free API endpoints for cryptocurrency data
const COINGECKO_API = 'https://api.coingecko.com/api/v3'
const BLOCKCYPHER_API = 'https://api.blockcypher.com/v1'

export interface CryptoPrice {
  bitcoin: { usd: number }
  ethereum: { usd: number }
  tether: { usd: number }
}

export interface BitcoinTransaction {
  hash: string
  value: number // in satoshis
  confirmations: number
  received: string
  addresses: string[]
}

export class PaymentService {
  // Get current cryptocurrency prices (free API)
  static async getCryptoPrices(): Promise<CryptoPrice> {
    try {
      const response = await fetch(
        `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=usd`
      )
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching crypto prices:', error)
      // Fallback prices
      return {
        bitcoin: { usd: 45000 },
        ethereum: { usd: 3000 },
        tether: { usd: 1 }
      }
    }
  }

  // Get company wallet address for currency
  static async getCompanyWalletAddress(currency: 'BTC' | 'ETH' | 'USDT-ERC20' | 'USDT-TRC20'): Promise<{id: string, address: string, walletName: string}> {
    const wallets = await SupabaseService.getCompanyWallets()
    const wallet = wallets.find(w => w.currency === currency)
    
    if (!wallet) {
      throw new Error(`No company wallet found for ${currency}`)
    }
    
    return {
      id: wallet.id,
      address: wallet.address,
      walletName: wallet.wallet_name
    }
  }

  // Create payment request using company wallet
  static async createPaymentRequest(
    userId: string,
    currency: 'BTC' | 'ETH' | 'USDT-ERC20' | 'USDT-TRC20',
    amount: number
  ) {
    const prices = await this.getCryptoPrices()
    
    // Get company wallet address
    const companyWallet = await this.getCompanyWalletAddress(currency)
    
    // Calculate crypto amount needed
    let cryptoAmount: number
    if (currency === 'BTC') {
      cryptoAmount = amount / prices.bitcoin.usd
    } else if (currency === 'ETH') {
      cryptoAmount = amount / prices.ethereum.usd
    } else if (currency === 'USDT-ERC20' || currency === 'USDT-TRC20') {
      cryptoAmount = amount / prices.tether.usd
    } else {
      throw new Error(`Unsupported currency: ${currency}`)
    }
    
    // Generate unique user reference for tracking
    const userReference = `VC${Date.now()}${userId.slice(-6).toUpperCase()}`
    
    // Create payment request in database
    const paymentRequest = await SupabaseService.createPaymentRequest(
      userId,
      currency,
      amount,
      companyWallet.address
    )

    // Create payment tracking record
    const paymentTracking = await SupabaseService.createUserPaymentTracking(
      userId,
      paymentRequest.id,
      companyWallet.id,
      currency,
      amount,
      cryptoAmount,
      companyWallet.address,
      userReference
    )

    return {
      ...paymentRequest,
      cryptoAmount: cryptoAmount.toFixed(8),
      address: companyWallet.address,
      walletName: companyWallet.walletName,
      userReference,
      exchangeRate: prices[currency.toLowerCase() as keyof CryptoPrice].usd,
      trackingId: paymentTracking.id
    }
  }

  // Simulate payment confirmation (for development)
  static async simulatePaymentConfirmation(
    trackingId: string,
    currency: string,
    amount: number
  ) {
    // Generate simulated transaction hash
    const txHash = `0x${Math.random().toString(16).substr(2, 64)}`

    // Simulate confirmation after 5 seconds
    setTimeout(async () => {
      await SupabaseService.updateUserPaymentTrackingStatus(
        trackingId,
        'confirmed',
        txHash,
        6 // 6 confirmations
      )
    }, 5000)

    return { txHash, status: 'pending' }
  }

  // Check for real Bitcoin transactions (using free BlockCypher API)
  static async checkBitcoinTransactions(address: string): Promise<BitcoinTransaction[]> {
    try {
      // Use testnet for development (free)
      const response = await fetch(
        `${BLOCKCYPHER_API}/btc/test3/addrs/${address}/full?limit=10`
      )
      
      if (!response.ok) {
        console.log('BlockCypher API limit reached, using simulation')
        return []
      }

      const data = await response.json()
      return data.txs || []
    } catch (error) {
      console.error('Error checking Bitcoin transactions:', error)
      return []
    }
  }

  // Monitor payments for a user
  static async monitorUserPayments(userId: string) {
    try {
      const addresses = await SupabaseService.getUserCryptoAddresses(userId)
      const pendingTransactions = await SupabaseService.getPendingPaymentTransactions()
      
      for (const address of addresses) {
        if (address.currency === 'BTC') {
          const transactions = await this.checkBitcoinTransactions(address.address)
          
          for (const tx of transactions) {
            // Check if this transaction is already recorded
            const existingTx = pendingTransactions.find(pt => pt.tx_hash === tx.hash)
            
            if (!existingTx && tx.confirmations >= 1) {
              // New confirmed transaction
              const prices = await this.getCryptoPrices()
              const btcAmount = tx.value / 100000000 // Convert satoshis to BTC
              const usdAmount = btcAmount * prices.bitcoin.usd

              await SupabaseService.createPaymentTransaction(
                userId,
                'BTC',
                btcAmount,
                usdAmount,
                tx.hash,
                prices.bitcoin.usd
              )

              // Mark as confirmed
              setTimeout(async () => {
                const newTransaction = await SupabaseService.getPendingPaymentTransactions()
                const thisTx = newTransaction.find(pt => pt.tx_hash === tx.hash)
                if (thisTx) {
                  await SupabaseService.updatePaymentTransactionStatus(
                    thisTx.id,
                    'confirmed',
                    tx.confirmations
                  )
                }
              }, 1000)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error monitoring payments:', error)
    }
  }

  // Get user's payment history
  static async getUserPaymentHistory(userId: string) {
    return await SupabaseService.getUserPaymentTransactions(userId)
  }

  // Get all payment transactions (for admin)
  static async getAllPaymentTransactions() {
    return await SupabaseService.getAllPaymentTransactions()
  }
}

export default PaymentService
