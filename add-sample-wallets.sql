-- Add sample wallet addresses for ERC-20 and TRC-20 USDT
-- Run this in your Supabase SQL editor after setting up the company_wallets table

-- Insert sample wallet addresses
INSERT INTO company_wallets (currency, address, wallet_name, is_active) VALUES
('BTC', '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', 'Main Bitcoin Wallet', true),
('ETH', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'Ethereum Hot Wallet', true),
('USDT-ERC20', '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', 'USDT ERC-20 Wallet', true),
('USDT-TRC20', 'TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE', 'USDT TRC-20 Wallet', true)
ON CONFLICT (currency) DO UPDATE SET
  address = EXCLUDED.address,
  wallet_name = EXCLUDED.wallet_name,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the wallets were added
SELECT currency, wallet_name, address, is_active, created_at 
FROM company_wallets 
ORDER BY currency;
