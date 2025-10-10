import SupabaseService from './supabaseService'

// Free blockchain APIs
const BLOCKCYPHER_API = 'https://api.blockcypher.com/v1'
const ETHERSCAN_API = 'https://api.etherscan.io/api'
const COINGECKO_API = 'https://api.coingecko.com/api/v3'

export interface BlockchainTransaction {
  hash: string
  value: number
  confirmations: number
  timestamp: number
  from: string
  to: string
}

export class BlockchainMonitor {
  // Monitor Bitcoin transactions
  static async checkBitcoinTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      const response = await fetch(
        `${BLOCKCYPHER_API}/btc/main/addrs/${address}/full?limit=50`
      )
      
      if (!response.ok) {
        console.log('BlockCypher API limit reached, using fallback')
        return []
      }

      const data = await response.json()
      const transactions: BlockchainTransaction[] = []

      if (data.txs) {
        for (const tx of data.txs) {
          // Check if this transaction is TO our address
          for (const output of tx.outputs) {
            if (output.addresses && output.addresses.includes(address)) {
              transactions.push({
                hash: tx.hash,
                value: output.value, // in satoshis
                confirmations: tx.confirmations || 0,
                timestamp: new Date(tx.received).getTime(),
                from: tx.inputs[0]?.addresses?.[0] || 'unknown',
                to: address
              })
            }
          }
        }
      }

      return transactions
    } catch (error) {
      console.error('Error checking Bitcoin transactions:', error)
      return []
    }
  }

  // Monitor Ethereum transactions
  static async checkEthereumTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      // You'll need to get a free API key from Etherscan
      const apiKey = 'YourEtherscanAPIKey' // Replace with your free API key
      
      const response = await fetch(
        `${ETHERSCAN_API}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
      )
      
      if (!response.ok) {
        console.log('Etherscan API limit reached')
        return []
      }

      const data = await response.json()
      const transactions: BlockchainTransaction[] = []

      if (data.result && Array.isArray(data.result)) {
        for (const tx of data.result) {
          if (tx.to.toLowerCase() === address.toLowerCase() && tx.isError === '0') {
            transactions.push({
              hash: tx.hash,
              value: parseInt(tx.value), // in wei
              confirmations: parseInt(tx.confirmations) || 0,
              timestamp: parseInt(tx.timeStamp) * 1000,
              from: tx.from,
              to: tx.to
            })
          }
        }
      }

      return transactions
    } catch (error) {
      console.error('Error checking Ethereum transactions:', error)
      return []
    }
  }

  // Monitor USDT transactions (on Ethereum network - ERC-20)
  static async checkUSDTTransactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      // USDT is an ERC-20 token on Ethereum
      const apiKey = 'YourEtherscanAPIKey' // Replace with your free API key
      const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7' // USDT contract
      
      const response = await fetch(
        `${ETHERSCAN_API}?module=account&action=tokentx&contractaddress=${usdtContractAddress}&address=${address}&page=1&offset=100&sort=desc&apikey=${apiKey}`
      )
      
      if (!response.ok) {
        console.log('Etherscan API limit reached for USDT')
        return []
      }

      const data = await response.json()
      const transactions: BlockchainTransaction[] = []

      if (data.result && Array.isArray(data.result)) {
        for (const tx of data.result) {
          if (tx.to.toLowerCase() === address.toLowerCase()) {
            transactions.push({
              hash: tx.hash,
              value: parseInt(tx.value), // in USDT (6 decimals)
              confirmations: parseInt(tx.confirmations) || 0,
              timestamp: parseInt(tx.timeStamp) * 1000,
              from: tx.from,
              to: tx.to
            })
          }
        }
      }

      return transactions
    } catch (error) {
      console.error('Error checking USDT transactions:', error)
      return []
    }
  }

  // Monitor USDT transactions (on TRON network - TRC-20)
  static async checkTRC20Transactions(address: string): Promise<BlockchainTransaction[]> {
    try {
      // USDT TRC-20 contract address on TRON
      const trc20ContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // USDT TRC-20 contract
      
      // Using TronGrid API (free tier available)
      const response = await fetch(
        `https://api.trongrid.io/v1/accounts/${address}/transactions/trc20?contract_address=${trc20ContractAddress}&limit=50`
      )
      
      if (!response.ok) {
        console.log('TronGrid API limit reached for USDT TRC-20')
        return []
      }

      const data = await response.json()
      const transactions: BlockchainTransaction[] = []

      if (data.data && Array.isArray(data.data)) {
        for (const tx of data.data) {
          if (tx.to.toLowerCase() === address.toLowerCase()) {
            transactions.push({
              hash: tx.transaction_id,
              value: parseInt(tx.value), // in USDT (6 decimals)
              confirmations: tx.confirmed ? 1 : 0,
              timestamp: tx.block_timestamp,
              from: tx.from,
              to: tx.to
            })
          }
        }
      }

      return transactions
    } catch (error) {
      console.error('Error checking USDT TRC-20 transactions:', error)
      return []
    }
  }

  // Monitor all company wallet addresses
  static async monitorAllCompanyWallets() {
    try {
      console.log('🔍 Monitoring company wallets for new transactions...')
      
      // Get all company wallets
      const companyWallets = await SupabaseService.getCompanyWallets()
      const pendingPayments = await SupabaseService.getPendingUserPayments()
      
      for (const wallet of companyWallets) {
        console.log(`Checking ${wallet.currency} wallet: ${wallet.address}`)
        
        let transactions: BlockchainTransaction[] = []
        
        // Check transactions based on currency
        switch (wallet.currency) {
          case 'BTC':
            transactions = await this.checkBitcoinTransactions(wallet.address)
            break
          case 'ETH':
            transactions = await this.checkEthereumTransactions(wallet.address)
            break
          case 'USDT-ERC20':
            transactions = await this.checkUSDTTransactions(wallet.address)
            break
          case 'USDT-TRC20':
            transactions = await this.checkTRC20Transactions(wallet.address)
            break
        }
        
        // Process new transactions
        for (const tx of transactions) {
          await this.processNewTransaction(tx, wallet, pendingPayments)
        }
      }
      
      console.log('✅ Wallet monitoring completed')
    } catch (error) {
      console.error('Error monitoring wallets:', error)
    }
  }

  // Process a new transaction
  static async processNewTransaction(
    tx: BlockchainTransaction,
    wallet: any,
    pendingPayments: any[]
  ) {
    try {
      // Check if this transaction matches any pending payment
      const matchingPayment = pendingPayments.find(payment => 
        payment.company_address.toLowerCase() === wallet.address.toLowerCase() &&
        payment.status === 'pending'
      )
      
      if (matchingPayment) {
        // Convert transaction value to match expected amount
        let txValue = tx.value
        if (wallet.currency === 'BTC') {
          txValue = txValue / 100000000 // Convert satoshis to BTC
        } else if (wallet.currency === 'ETH') {
          txValue = txValue / 1000000000000000000 // Convert wei to ETH
        } else if (wallet.currency === 'USDT') {
          txValue = txValue / 1000000 // Convert to USDT (6 decimals)
        }
        
        // Check if amount matches (with some tolerance)
        const expectedAmount = parseFloat(matchingPayment.crypto_amount)
        const tolerance = 0.0001 // 0.01% tolerance
        
        if (Math.abs(txValue - expectedAmount) <= tolerance) {
          console.log(`💰 Payment confirmed: ${tx.hash} for ${wallet.currency}`)
          
          // Update payment status
          await SupabaseService.updateUserPaymentTrackingStatus(
            matchingPayment.id,
            'confirmed',
            tx.hash,
            tx.confirmations
          )
          
          console.log(`✅ User balance updated for payment ${matchingPayment.id}`)
        }
      }
    } catch (error) {
      console.error('Error processing transaction:', error)
    }
  }

  // Start continuous monitoring
  static startMonitoring(intervalMinutes: number = 5) {
    console.log(`🚀 Starting blockchain monitoring (every ${intervalMinutes} minutes)`)
    
    // Run immediately
    this.monitorAllCompanyWallets()
    
    // Then run every X minutes
    setInterval(() => {
      this.monitorAllCompanyWallets()
    }, intervalMinutes * 60 * 1000)
  }

  // Manual payment confirmation (for admin)
  static async manuallyConfirmPayment(
    trackingId: string,
    txHash: string,
    confirmations: number = 6
  ) {
    try {
      await SupabaseService.updateUserPaymentTrackingStatus(
        trackingId,
        'confirmed',
        txHash,
        confirmations
      )
      
      console.log(`✅ Payment ${trackingId} manually confirmed`)
      return true
    } catch (error) {
      console.error('Error manually confirming payment:', error)
      return false
    }
  }
}

export default BlockchainMonitor
