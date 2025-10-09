# Admin User Setup Guide for Valora Capital

## 🎯 **Goal:**
Ensure `warrenokumu98@gmail.com` can login as admin while other emails login as normal users.

## 📋 **Step-by-Step Setup:**

### **Step 1: Run the Database Schema**
1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy and paste** the entire content from `supabase-schema-fixed.sql`
3. **Click "Run"** - This creates all tables and policies

### **Step 2: Sign Up as Admin User**
1. **Go to your app** → Sign Up page (`/signup`)
2. **Use admin email** - `warrenokumu98@gmail.com`
3. **Fill in details** - Name, password, etc.
4. **Complete registration** - This creates the user in Supabase auth

### **Step 3: Set Up Admin Privileges**
1. **Go to Supabase Dashboard** → SQL Editor
2. **Copy and paste** the content from `setup-admin-user.sql`
3. **Click "Run"** - This adds admin privileges to your email

### **Step 4: Test the System**

#### **Test Admin Login:**
1. **Sign in with** - `warrenokumu98@gmail.com`
2. **Expected result** - Should see "Admin Panel" button in dashboard
3. **Click "Admin Panel"** - Should access admin dashboard
4. **Admin features** - Can review KYC documents, manage users

#### **Test Regular User Login:**
1. **Sign up with different email** - e.g., `user@example.com`
2. **Sign in with that email**
3. **Expected result** - No "Admin Panel" button, standard user interface
4. **User features** - Can upload KYC documents, make investments

## 🔧 **How Admin Detection Works:**

### **Frontend Logic:**
```typescript
// In SignIn, SignUp, Dashboard, AdminDashboard
const isAdmin = email === 'warrenokumu98@gmail.com';
```

### **Database Setup:**
```sql
-- Admin user gets added to admin_users table
INSERT INTO public.admin_users (user_id, role, permissions)
SELECT id, 'super_admin', '{"kyc_review": true, "user_management": true}'
FROM auth.users 
WHERE email = 'warrenokumu98@gmail.com';
```

### **RLS Policies:**
- **Regular users** - Can only see their own data
- **Admin users** - Can see all users' data (via admin_users table)
- **KYC documents** - Admins can review all documents

## 🎯 **Expected Behavior:**

### **For `warrenokumu98@gmail.com` (Admin):**
- ✅ **Sign in** - Works normally
- ✅ **Dashboard** - Shows "Admin Panel" button
- ✅ **Admin Panel** - Full KYC verification interface
- ✅ **User Management** - Can view all users
- ✅ **KYC Review** - Can approve/reject documents
- ✅ **Database Access** - Can see all data via RLS policies

### **For Other Emails (Regular Users):**
- ✅ **Sign in** - Works normally
- ✅ **Dashboard** - No "Admin Panel" button
- ✅ **KYC Upload** - Can upload documents
- ✅ **Investments** - Can make investments
- ✅ **Database Access** - Can only see their own data

## 🚀 **Verification Steps:**

### **1. Check Admin User in Database:**
```sql
-- Run this to verify admin user exists
SELECT 
  au.user_id,
  au.role,
  u.email,
  u.first_name,
  u.last_name
FROM public.admin_users au
JOIN auth.users u ON au.user_id = u.id
WHERE u.email = 'warrenokumu98@gmail.com';
```

### **2. Test Admin Access:**
- **Login as admin** → Should see admin features
- **Try to access `/admin`** → Should work
- **Login as regular user** → Should be denied access to `/admin`

### **3. Test KYC System:**
- **Regular user** → Upload KYC documents
- **Admin user** → Review and approve/reject documents

## ✅ **Success Indicators:**

- ✅ **Admin login** - `warrenokumu98@gmail.com` sees "Admin Panel" button
- ✅ **Regular login** - Other emails see standard interface
- ✅ **Admin dashboard** - Full KYC verification capabilities
- ✅ **Database security** - Users only see their own data
- ✅ **KYC workflow** - Upload → Review → Approve/Reject

Your admin system is now properly configured! 🎉✨
