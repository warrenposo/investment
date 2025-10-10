-- Payment and cryptocurrency tables for Supabase

-- User cryptocurrency addresses
CREATE TABLE IF NOT EXISTS user_crypto_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL, -- 'BTC', 'ETH', 'USDT'
  address VARCHAR(255) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL,
  crypto_amount DECIMAL(20,8) NOT NULL, -- Original crypto amount
  usd_amount DECIMAL(10,2) NOT NULL, -- USD equivalent at time of transaction
  tx_hash VARCHAR(255) UNIQUE,
  confirmations INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, failed, expired
  exchange_rate DECIMAL(10,2), -- USD rate at time of transaction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment requests (when user initiates a deposit)
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(10) NOT NULL,
  requested_amount DECIMAL(10,2) NOT NULL, -- USD amount requested
  crypto_address VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, expired, cancelled
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_crypto_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_crypto_addresses
CREATE POLICY "Users can view own addresses" ON user_crypto_addresses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON user_crypto_addresses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for payment_transactions
CREATE POLICY "Users can view own transactions" ON payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert transactions" ON payment_transactions
  FOR INSERT WITH CHECK (true);

-- RLS Policies for payment_requests
CREATE POLICY "Users can view own requests" ON payment_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own requests" ON payment_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin policies (for admin dashboard)
CREATE POLICY "Admins can view all addresses" ON user_crypto_addresses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

CREATE POLICY "Admins can view all transactions" ON payment_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

CREATE POLICY "Admins can view all requests" ON payment_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email = 'warrenokumu98@gmail.com'
    )
  );

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_crypto_addresses_user_id ON user_crypto_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_user_crypto_addresses_currency ON user_crypto_addresses(currency);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_tx_hash ON payment_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);

-- Function to update user balance when payment is confirmed
CREATE OR REPLACE FUNCTION update_user_balance_on_payment()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update balance when status changes to 'confirmed'
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    -- Update user_balances table
    INSERT INTO user_balances (user_id, total_balance, total_deposits)
    VALUES (NEW.user_id, NEW.usd_amount, NEW.usd_amount)
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      total_balance = user_balances.total_balance + NEW.usd_amount,
      total_deposits = user_balances.total_deposits + NEW.usd_amount,
      updated_at = NOW();
    
    -- Also update the main transactions table
    INSERT INTO transactions (user_id, type, amount, method, reference, status, description)
    VALUES (NEW.user_id, 'deposit', NEW.usd_amount, NEW.currency, NEW.tx_hash, 'completed', 
            'Cryptocurrency deposit via ' || NEW.currency);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update user balance
CREATE TRIGGER trigger_update_user_balance_on_payment
  AFTER UPDATE ON payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_balance_on_payment();
