-- Company wallet addresses for receiving payments
-- This allows admin to set their own wallet addresses while tracking individual user balances

-- Company wallet addresses (admin managed)
CREATE TABLE IF NOT EXISTS company_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  currency VARCHAR(15) NOT NULL UNIQUE, -- 'BTC', 'ETH', 'USDT-ERC20', 'USDT-TRC20'
  address VARCHAR(255) NOT NULL,
  wallet_name VARCHAR(100) NOT NULL, -- e.g., 'Main Bitcoin Wallet', 'Ethereum Hot Wallet'
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User payment tracking (links user deposits to company wallets)
CREATE TABLE IF NOT EXISTS user_payment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_request_id UUID REFERENCES payment_requests(id) ON DELETE CASCADE,
  company_wallet_id UUID REFERENCES company_wallets(id),
  currency VARCHAR(15) NOT NULL,
  requested_amount DECIMAL(10,2) NOT NULL, -- USD amount user requested
  crypto_amount DECIMAL(20,8) NOT NULL, -- Crypto amount user should send
  company_address VARCHAR(255) NOT NULL, -- Company wallet address
  user_reference VARCHAR(100) NOT NULL, -- Unique reference for user to include in payment
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, confirmed, expired
  tx_hash VARCHAR(255), -- Transaction hash when payment is detected
  confirmations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE company_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_tracking ENABLE ROW LEVEL SECURITY;

-- RLS Policies for company_wallets (admin only)
CREATE POLICY "Only admin can manage company wallets" ON company_wallets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

-- RLS Policies for user_payment_tracking
CREATE POLICY "Users can view own payment tracking" ON user_payment_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert payment tracking" ON user_payment_tracking
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update payment tracking" ON user_payment_tracking
  FOR UPDATE USING (true);

-- Admin can view all payment tracking
CREATE POLICY "Admin can view all payment tracking" ON user_payment_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_company_wallets_currency ON company_wallets(currency);
CREATE INDEX IF NOT EXISTS idx_company_wallets_active ON company_wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_user_id ON user_payment_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_status ON user_payment_tracking(status);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_reference ON user_payment_tracking(user_reference);

-- Function to update user balance when payment is confirmed
CREATE OR REPLACE FUNCTION update_user_balance_on_company_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update balance when status changes to 'confirmed'
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    -- Update user_balances table
    INSERT INTO user_balances (user_id, total_balance, total_deposits)
    VALUES (NEW.user_id, NEW.requested_amount, NEW.requested_amount)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_balance = user_balances.total_balance + NEW.requested_amount,
      total_deposits = user_balances.total_deposits + NEW.requested_amount,
      updated_at = NOW();
    
    -- Also update the main transactions table
    INSERT INTO transactions (user_id, type, amount, method, reference, status, description)
    VALUES (NEW.user_id, 'deposit', NEW.requested_amount, NEW.currency, NEW.tx_hash, 'completed', 
            'Cryptocurrency deposit via ' || NEW.currency || ' - Ref: ' || NEW.user_reference);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user balance
CREATE TRIGGER trigger_update_user_balance_on_company_payment
  AFTER UPDATE ON user_payment_tracking
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance_on_company_payment();

-- Insert default company wallet addresses (admin will update these)
INSERT INTO company_wallets (currency, address, wallet_name, created_by) VALUES
('BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Main Bitcoin Wallet', (SELECT id FROM users WHERE email = 'warrenokumu98@gmail.com' LIMIT 1)),
('ETH', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d4d4', 'Main Ethereum Wallet', (SELECT id FROM users WHERE email = 'warrenokumu98@gmail.com' LIMIT 1)),
('USDT', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d4d4', 'Main USDT Wallet', (SELECT id FROM users WHERE email = 'warrenokumu98@gmail.com' LIMIT 1))
ON CONFLICT (currency) DO NOTHING;
