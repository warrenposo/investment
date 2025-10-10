-- Database Schema Update for TRC-20 and ERC-20 Support
-- Run this in your Supabase SQL editor

-- Step 1: Update existing tables to support new currency types
-- Update company_wallets table
ALTER TABLE company_wallets 
ALTER COLUMN currency TYPE VARCHAR(15);

-- Update user_payment_tracking table  
ALTER TABLE user_payment_tracking 
ALTER COLUMN currency TYPE VARCHAR(15);

-- Update payment_requests table (if it exists)
ALTER TABLE payment_requests 
ALTER COLUMN currency TYPE VARCHAR(15);

-- Step 2: Insert your actual wallet addresses for all supported currencies
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

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_wallets_currency ON company_wallets(currency);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_currency ON user_payment_tracking(currency);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_status ON user_payment_tracking(status);
CREATE INDEX IF NOT EXISTS idx_user_payment_tracking_user_id ON user_payment_tracking(user_id);

-- Step 4: Update any existing USDT records to USDT-ERC20 (if you have old data)
UPDATE user_payment_tracking 
SET currency = 'USDT-ERC20' 
WHERE currency = 'USDT';

UPDATE payment_requests 
SET currency = 'USDT-ERC20' 
WHERE currency = 'USDT';

-- Step 5: Verify the updates
SELECT 'Company Wallets' as table_name, currency, wallet_name, address, is_active 
FROM company_wallets 
ORDER BY currency;

SELECT 'Payment Tracking' as table_name, currency, status, COUNT(*) as count
FROM user_payment_tracking 
GROUP BY currency, status
ORDER BY currency, status;

-- Step 6: Add helpful comments
COMMENT ON COLUMN company_wallets.currency IS 'Supported currencies: BTC, ETH, USDT-ERC20, USDT-TRC20';
COMMENT ON COLUMN user_payment_tracking.currency IS 'Supported currencies: BTC, ETH, USDT-ERC20, USDT-TRC20';

-- Step 7: Create a view for easy wallet management
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

-- Step 8: Grant permissions (if needed)
-- GRANT SELECT ON wallet_summary TO authenticated;

-- Success message
SELECT 'Database schema updated successfully! All currency types now supported.' as status;
