# Supabase Setup Guide for Valora Capital

## 🚀 Quick Setup Instructions

### 1. **Run the SQL Schema**
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `uqbzgdbycgoeatrvjrnk`
3. Navigate to **SQL Editor**
4. Copy and paste the entire content from `supabase-schema.sql`
5. Click **Run** to execute all the SQL commands

### 2. **Set Up Storage Bucket**
1. In Supabase Dashboard, go to **Storage**
2. Create a new bucket called `kyc-documents`
3. Set the bucket to **Public** (for document access)
4. Configure RLS policies for the bucket:

```sql
-- Allow users to upload their own documents
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'kyc-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view their own documents
CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'kyc-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'kyc-documents' AND
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE user_id = auth.uid()
    )
  );
```

### 3. **Create Admin User**
1. Go to **Authentication** → **Users**
2. Create a new user with admin privileges
3. Run this SQL to make them an admin:

```sql
INSERT INTO public.admin_users (user_id, role, permissions)
VALUES (
  'your-admin-user-id-here',
  'super_admin',
  '{"kyc_review": true, "user_management": true, "investment_management": true}'
);
```

### 4. **Environment Variables**
Create a `.env.local` file in your project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://uqbzgdbycgoeatrvjrnk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxYnpnZGJ5Y2dvZWF0cnZqcm5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDE5MjcsImV4cCI6MjA3NTQ3NzkyN30.6cKS8GApzCP37IIoYtraCobRnjAXS-l4e_1srbE6DUc

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_vosj7ec
VITE_EMAILJS_PUBLIC_KEY=mxYuvAK0YpSZG6gVA

# Company Information
VITE_COMPANY_NAME=Valora Capital
VITE_COMPANY_EMAIL=info@valora-capital.com
VITE_COMPANY_PHONE=+12137274788
VITE_COMPANY_ADDRESS=Guildford, Surrey, United Kingdom
```

## 📋 Database Schema Overview

### **Tables Created:**

#### 1. **users** - User profiles
- Extends Supabase auth.users
- Stores KYC status, personal info
- RLS enabled for security

#### 2. **kyc_documents** - Identity verification documents
- Front/back ID, selfie, proof of address
- File URLs, status tracking
- Admin review workflow

#### 3. **investment_plans** - Available investment options
- Pre-configured with 11 plans
- ROI percentages, frequency, limits

#### 4. **investments** - User investment records
- Links users to plans
- Tracks amounts, returns, status

#### 5. **transactions** - All financial transactions
- Deposits, withdrawals, investments, profits
- Status tracking, reference numbers

#### 6. **user_balances** - Real-time balance tracking
- Total balance, invested, profit, withdrawals
- Auto-updated via triggers

#### 7. **admin_users** - Admin access control
- Role-based permissions
- KYC review capabilities

## 🔐 Security Features

### **Row Level Security (RLS)**
- Users can only access their own data
- Admins have elevated permissions
- Secure document access

### **File Upload Security**
- File type validation (images, PDFs)
- Size limits (10MB max)
- Encrypted storage

### **Authentication**
- Supabase Auth integration
- Email verification
- Password security

## 🎯 KYC Workflow

### **User Side:**
1. User signs up → Profile created automatically
2. User uploads KYC documents → Stored securely
3. Documents marked as "pending" review
4. User receives status updates

### **Admin Side:**
1. Admin views pending documents
2. Reviews each document (view/download)
3. Approves or rejects with reason
4. User KYC status updated automatically

## 🚀 Next Steps

### **To Complete Integration:**

1. **Update Sign Up/Sign In pages** to use Supabase Auth
2. **Replace localStorage** with Supabase database calls
3. **Add KYC upload** to user dashboard
4. **Create admin dashboard** for KYC verification
5. **Test the complete workflow**

### **Files Created:**
- `src/lib/supabase.ts` - Supabase client & types
- `src/services/supabaseService.ts` - Database operations
- `src/components/KycUpload.tsx` - User KYC upload
- `src/components/KycVerification.tsx` - Admin verification
- `supabase-schema.sql` - Complete database schema

## 🔧 Troubleshooting

### **Common Issues:**

1. **RLS Policy Errors**
   - Check user authentication status
   - Verify admin user permissions

2. **File Upload Failures**
   - Ensure storage bucket exists
   - Check file size/type limits

3. **Permission Denied**
   - Verify RLS policies are correct
   - Check user roles and permissions

### **Testing Checklist:**
- [ ] SQL schema executed successfully
- [ ] Storage bucket created
- [ ] Admin user created
- [ ] Environment variables set
- [ ] User signup works
- [ ] KYC upload works
- [ ] Admin verification works

## 📞 Support

If you encounter any issues:
1. Check Supabase logs in Dashboard
2. Verify RLS policies
3. Test with different user roles
4. Check browser console for errors

---

**Your Supabase project is now ready for KYC verification! 🎉**
