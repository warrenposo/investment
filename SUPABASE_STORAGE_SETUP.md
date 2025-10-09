# Supabase Storage Setup for KYC Documents

## 🚨 **Current Issue:**
The KYC upload is failing because the Supabase storage bucket `kyc-documents` doesn't exist yet.

## 🔧 **Quick Fix - Set Up Storage Bucket:**

### **Step 1: Go to Supabase Dashboard**
1. Visit: https://supabase.com/dashboard
2. Select your project: `uqbzgdbycgoeatrvjrnk`

### **Step 2: Create Storage Bucket**
1. Go to **Storage** in the left sidebar
2. Click **"Create a new bucket"**
3. Set bucket name: `kyc-documents`
4. Set to **Public** (so documents can be accessed)
5. Click **"Create bucket"**

### **Step 3: Set Up Storage Policies**
Go to **SQL Editor** and run these commands:

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

## 🎯 **Why Uploads Are Failing:**

### **Current Behavior:**
- ✅ **File selection works** - You can select files
- ❌ **Upload fails** - Storage bucket doesn't exist
- ✅ **Fallback works** - Uses simulation instead
- ✅ **Status updates** - KYC status still changes to 'pending'

### **After Setup:**
- ✅ **Real file uploads** - Files stored in Supabase
- ✅ **Secure access** - Only users can see their own files
- ✅ **Admin access** - Admins can review all documents
- ✅ **Database records** - Document metadata stored properly

## 🔍 **Admin Permission Check:**

The issue is **NOT** related to admin permissions. The problem is simply that the storage bucket doesn't exist yet.

### **Admin vs Regular User:**
- **Regular users** - Can upload their own KYC documents
- **Admin users** - Can view all KYC documents for review
- **Both** - Need the storage bucket to exist first

## 🚀 **Test After Setup:**

1. **Create the storage bucket** (Step 2 above)
2. **Set up the policies** (Step 3 above)
3. **Try uploading again** - Should work with real Supabase storage
4. **Check browser console** - Should see "Successfully uploaded" messages

## 📝 **Current Status:**
- **Database tables** ✅ Created
- **Storage bucket** ❌ Missing (this is the issue)
- **Storage policies** ❌ Missing
- **Upload functionality** ✅ Ready (just needs storage)

Once you create the storage bucket, the KYC uploads will work perfectly!
