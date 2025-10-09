# Admin Access Debug Guide

## 🔍 **Debug Steps:**

### **Step 1: Check Console Logs**
1. **Open browser console** - F12 → Console tab
2. **Sign in with** - `warrenokumu98@gmail.com`
3. **Look for these messages:**
   - `"Dashboard - Current user email: warrenokumu98@gmail.com"`
   - `"Dashboard - Is admin? true"`
   - `"Email: warrenokumu98@gmail.com | Admin: Yes"`

### **Step 2: Check Admin Panel Button**
1. **Look for "Admin Panel" button** - Should appear next to "Complete KYC" button
2. **If not visible** - Check the debug info showing "Admin: No"
3. **Click the button** - Should navigate to `/admin`

### **Step 3: Test Admin Dashboard Access**
1. **Try to access** - `http://localhost:8082/admin` directly
2. **Check console** - Look for admin access messages
3. **Should see** - "Admin access granted" message

## 🚨 **Common Issues:**

### **Issue 1: Email Case Sensitivity**
- **Problem:** Email might be stored with different case
- **Solution:** Check if email is exactly `warrenokumu98@gmail.com`

### **Issue 2: User Not in Database**
- **Problem:** User exists in auth but not in public.users table
- **Solution:** Run the setup script again

### **Issue 3: Supabase Connection**
- **Problem:** Can't connect to Supabase
- **Solution:** Check network and Supabase credentials

## 🔧 **Quick Fixes:**

### **Fix 1: Case-Insensitive Email Check**
If email case is the issue, update the admin detection:

```typescript
// In Dashboard.tsx and AdminDashboard.tsx
const isAdmin = currentUser.email?.toLowerCase() === 'warrenokumu98@gmail.com';
```

### **Fix 2: Manual Admin Check**
Run this SQL to verify admin user exists:

```sql
-- Check if admin user exists
SELECT 
  u.email,
  u.id,
  au.role,
  au.permissions
FROM auth.users u
LEFT JOIN public.admin_users au ON u.id = au.user_id
WHERE u.email = 'warrenokumu98@gmail.com';
```

### **Fix 3: Force Admin Access**
Temporarily bypass admin check for testing:

```typescript
// In AdminDashboard.tsx - temporary fix
if (currentUser.email?.toLowerCase().includes('warren')) {
  // Allow access for testing
}
```

## 🎯 **Expected Behavior:**

### **For Admin User (`warrenokumu98@gmail.com`):**
- ✅ **Dashboard** - Shows "Admin Panel" button
- ✅ **Admin Panel** - Can access `/admin` route
- ✅ **KYC Verification** - Can review and approve/reject documents
- ✅ **User Management** - Can view all users

### **For Regular Users:**
- ❌ **No Admin Panel** - Button doesn't appear
- ❌ **Admin Access Denied** - Can't access `/admin`
- ✅ **KYC Upload** - Can upload documents
- ✅ **Standard Features** - Normal user functionality

## 📱 **Test the System:**

1. **Sign in as admin** - `warrenokumu98@gmail.com`
2. **Check console logs** - Verify admin detection
3. **Look for Admin Panel button** - Should be visible
4. **Click Admin Panel** - Should navigate to admin dashboard
5. **Test KYC verification** - Should see pending documents

Let me know what you see in the console logs and whether the Admin Panel button appears!
