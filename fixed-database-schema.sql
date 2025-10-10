-- Fixed Database Schema for Valora Capital
-- Includes TRC-20 and ERC-20 support with your actual wallet addresses
-- Run this in your Supabase SQL editor

-- =====================================================
-- 1. USER MANAGEMENT TABLES
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  country VARCHAR(100),
  date_of_birth DATE,
  is_admin BOOLEAN DEFAULT false,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User balances
CREATE TABLE IF NOT EXISTS user_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(15,2) DEFAULT 0.00,
  total_invested DECIMAL(15,2) DEFAULT 0.00,
  total_profit DECIMAL(15,2) DEFAULT 0.00,
  total_withdrawn DECIMAL(15,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. KYC (Know Your Customer) TABLES
-- =====================================================

-- KYC documents
CREATE TABLE IF NOT EXISTS kyc_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL, -- 'id_front', 'id_back', 'passport', 'driving_license'
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- KYC status tracking
CREATE TABLE IF NOT EXISTS kyc_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  rejection_reason TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. INVESTMENT TABLES
-- =====================================================

-- Investment plans
CREATE TABLE IF NOT EXISTS investment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  min_amount DECIMAL(10,2) NOT NULL,
  max_amount DECIMAL(10,2),
  roi_percentage DECIMAL(5,2) NOT NULL,
  duration_days INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User investments
CREATE TABLE IF NOT EXISTS user_investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES investment_plans(id),
  amount DECIMAL(10,2) NOT NULL,
  expected_return DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. PAYMENT SYSTEM TABLES
-- =====================================================

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

-- Payment requests (user deposit requests)
CREATE TABLE IF NOT EXISTS payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  currency VARCHAR(15) NOT NULL, -- 'BTC', 'ETH', 'USDT-ERC20', 'USDT-TRC20'
  amount DECIMAL(10,2) NOT NULL, -- USD amount
  company_address VARCHAR(255) NOT NULL, -- Company wallet address
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'confirmed', 'expired'
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment transactions (blockchain transactions)
CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_request_id UUID REFERENCES payment_requests(id) ON DELETE CASCADE,
  tx_hash VARCHAR(255) UNIQUE NOT NULL,
  from_address VARCHAR(255),
  to_address VARCHAR(255),
  amount DECIMAL(20,8) NOT NULL, -- Crypto amount
  confirmations INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
  block_height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User payment tracking (links user deposits to company wallets)
CREATE TABLE IF NOT EXISTS user_payment_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  payment_request_id UUID REFERENCES payment_requests(id) ON DELETE CASCADE,
  company_wallet_id UUID REFERENCES company_wallets(id),
  currency VARCHAR(15) NOT NULL, -- 'BTC', 'ETH', 'USDT-ERC20', 'USDT-TRC20'
  requested_amount DECIMAL(10,2) NOT NULL, -- USD amount user requested
  crypto_amount DECIMAL(20,8) NOT NULL, -- Crypto amount user should send
  company_address VARCHAR(255) NOT NULL, -- Company wallet address
  user_reference VARCHAR(100) NOT NULL, -- Unique reference for user to include in payment
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'confirmed', 'expired'
  tx_hash VARCHAR(255), -- Transaction hash when payment is detected
  confirmations INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. TRANSACTION HISTORY TABLES
-- =====================================================

-- Transaction types
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'investment', 'profit', 'fee');

-- Transaction status
CREATE TYPE transaction_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

-- User transactions
CREATE TABLE IF NOT EXISTS user_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type transaction_type NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  currency VARCHAR(15) NOT NULL,
  status transaction_status DEFAULT 'pending',
  description TEXT,
  reference VARCHAR(100), -- External reference (tx hash, payment ID, etc.)
  metadata JSONB, -- Additional transaction data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. ADMIN MANAGEMENT TABLES
-- =====================================================

-- Admin users (extends users table)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL, -- 'super_admin', 'admin', 'moderator'
  permissions JSONB, -- Role-based permissions
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 7. INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON users(is_admin);

-- Balance indexes
CREATE INDEX IF NOT EXISTS idx_user_balances_user_id ON user_balances(user_id);

-- KYC indexes
CREATE INDEX IF NOT EXISTS idx_kyc_documents_user_id ON kyc_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_documents_status ON kyc_documents(status);
CREATE INDEX IF NOT EXISTS idx_kyc_status_user_id ON kyc_status(user_id);

-- Investment indexes
CREATE INDEX IF NOT EXISTS idx_investment_plans_active ON investment_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_investments_user_id ON user_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_investments_status ON user_investments(status);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_company_wallets_currency ON company_wallets(currency);
CREATE INDEX IF NOT EXISTS idx_company_wallets_active ON company_wallets(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_status ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_tx_hash ON payment_transactions(tx_hash);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_user_id ON user_payment_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_status ON user_payment_tracking(status);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_currency ON user_payment_tracking(currency);

-- Transaction indexes
CREATE INDEX IF NOT EXISTS idx_user_transactions_user_id ON user_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_transactions_type ON user_transactions(type);
CREATE INDEX IF NOT EXISTS idx_user_transactions_status ON user_transactions(status);
CREATE INDEX IF NOT EXISTS idx_user_transactions_created_at ON user_transactions(created_at);

-- Admin indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);

-- =====================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_payment_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- User balances policies
CREATE POLICY "Users can view own balance" ON user_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all balances" ON user_balances FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- KYC policies
CREATE POLICY "Users can manage own KYC" ON kyc_documents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all KYC" ON kyc_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Users can view own KYC status" ON kyc_status FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all KYC status" ON kyc_status FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Investment policies
CREATE POLICY "Anyone can view active plans" ON investment_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON investment_plans FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Users can view own investments" ON user_investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create investments" ON user_investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all investments" ON user_investments FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Payment policies
CREATE POLICY "Admins can manage company wallets" ON company_wallets FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Users can view own payment requests" ON payment_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create payment requests" ON payment_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all payment requests" ON payment_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can view all payment transactions" ON payment_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Users can view own payment tracking" ON user_payment_tracking FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all payment tracking" ON user_payment_tracking FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Transaction policies
CREATE POLICY "Users can view own transactions" ON user_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all transactions" ON user_transactions FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- Admin policies
CREATE POLICY "Admins can manage admin users" ON admin_users FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admins can manage system settings" ON system_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
);

-- =====================================================
-- 9. TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_balances_updated_at BEFORE UPDATE ON user_balances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kyc_status_updated_at BEFORE UPDATE ON kyc_status FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_investment_plans_updated_at BEFORE UPDATE ON investment_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_wallets_updated_at BEFORE UPDATE ON company_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_payment_tracking_updated_at BEFORE UPDATE ON user_payment_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_transactions_updated_at BEFORE UPDATE ON user_transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. INSERT YOUR ACTUAL WALLET ADDRESSES
-- =====================================================

-- Insert your actual wallet addresses
INSERT INTO company_wallets (currency, address, wallet_name, is_active) VALUES
('BTC', '163JAzy3CEz8YoNGDDtu9KxpXgnm5Kn9Rs', 'Main Bitcoin Wallet', true),
('ETH', '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690', 'Ethereum Hot Wallet', true),
('USDT-ERC20', '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690', 'USDT ERC-20 Wallet', true),
('USDT-TRC20', 'THaAnBqAvQ3YY751nXqNDzCoczYVQtBKnP', 'USDT TRC-20 Wallet', true)
ON CONFLICT (currency) DO UPDATE SET
  address = EXCLUDED.address,
  wallet_name = EXCLUDED.wallet_name,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- =====================================================
-- 11. INSERT SAMPLE INVESTMENT PLANS
-- =====================================================

-- Insert sample investment plans
INSERT INTO investment_plans (name, description, min_amount, max_amount, roi_percentage, duration_days, is_active) VALUES
('Starter Plan', 'Perfect for beginners', 500.00, 4999.00, 15.00, 30, true),
('Professional Plan', 'For serious investors', 5000.00, 49999.00, 25.00, 30, true),
('Premium Plan', 'VIP investment opportunity', 50000.00, 1000000.00, 35.00, 30, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. INSERT SYSTEM SETTINGS
-- =====================================================

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('min_deposit_amount', '100.00', 'Minimum deposit amount in USD'),
('max_deposit_amount', '1000000.00', 'Maximum deposit amount in USD'),
('min_withdrawal_amount', '50.00', 'Minimum withdrawal amount in USD'),
('max_withdrawal_amount', '100000.00', 'Maximum withdrawal amount in USD'),
('deposit_fee_percentage', '0.00', 'Deposit fee percentage'),
('withdrawal_fee_percentage', '2.00', 'Withdrawal fee percentage'),
('kyc_required_for_deposit', 'true', 'KYC required for deposits'),
('kyc_required_for_withdrawal', 'true', 'KYC required for withdrawals'),
('maintenance_mode', 'false', 'System maintenance mode'),
('registration_enabled', 'true', 'New user registration enabled')
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- 13. CREATE HELPFUL VIEWS
-- =====================================================

-- Wallet summary view
CREATE OR REPLACE VIEW wallet_summary AS
SELECT 
  cw.currency,
  cw.wallet_name,
  cw.address,
  cw.is_active,
  COUNT(upt.id) as total_payments,
  COUNT(CASE WHEN upt.status = 'pending' THEN 1 END) as pending_payments,
  COUNT(CASE WHEN upt.status = 'confirmed' THEN 1 END) as confirmed_payments,
  COALESCE(SUM(CASE WHEN upt.status = 'confirmed' THEN upt.requested_amount END), 0) as total_confirmed_amount
FROM company_wallets cw
LEFT JOIN user_payment_tracking upt ON cw.currency = upt.currency
GROUP BY cw.id, cw.currency, cw.wallet_name, cw.address, cw.is_active
ORDER BY cw.currency;

-- User dashboard view
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  u.id,
  u.email,
  u.first_name,
  u.last_name,
  ub.balance,
  ub.total_invested,
  ub.total_profit,
  ub.total_withdrawn,
  ks.status as kyc_status,
  COUNT(ui.id) as active_investments,
  COUNT(ut.id) as total_transactions
FROM users u
LEFT JOIN user_balances ub ON u.id = ub.user_id
LEFT JOIN kyc_status ks ON u.id = ks.user_id
LEFT JOIN user_investments ui ON u.id = ui.user_id AND ui.status = 'active'
LEFT JOIN user_transactions ut ON u.id = ut.user_id
GROUP BY u.id, u.email, u.first_name, u.last_name, ub.balance, ub.total_invested, ub.total_profit, ub.total_withdrawn, ks.status;

-- =====================================================
-- 14. VERIFICATION QUERIES
-- =====================================================

-- Verify wallet addresses
SELECT 'Wallet Addresses' as table_name, currency, wallet_name, address, is_active 
FROM company_wallets 
ORDER BY currency;

-- Verify investment plans
SELECT 'Investment Plans' as table_name, name, min_amount, max_amount, roi_percentage, duration_days, is_active
FROM investment_plans 
ORDER BY min_amount;

-- Verify system settings
SELECT 'System Settings' as table_name, key, value, description
FROM system_settings 
ORDER BY key;

-- =====================================================
-- 15. SUCCESS MESSAGE
-- =====================================================

SELECT 'Database schema created successfully! All tables, indexes, policies, and sample data inserted.' as status;
