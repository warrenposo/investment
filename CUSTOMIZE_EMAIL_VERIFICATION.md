# Customize Supabase Email Verification

## 🎯 **Goal:**
Change the email verification message from default Supabase to "Welcome to Valora Capital"

## 📋 **Step-by-Step Instructions:**

### **Step 1: Go to Supabase Dashboard**
1. **Visit:** https://supabase.com/dashboard
2. **Select your project:** `uqbzgdbycgoeatrvjrnk`
3. **Go to Authentication** → **Email Templates**

### **Step 2: Update Email Templates**

#### **Confirm Signup Template:**
1. **Click on "Confirm signup"** template
2. **Update the subject line:**
   ```
   Welcome to Valora Capital - Confirm Your Account
   ```

3. **Update the email body:**
   ```html
   <h2>Welcome to Valora Capital!</h2>
   
   <p>Thank you for joining Valora Capital, your trusted investment partner.</p>
   
   <p>To complete your registration and start your investment journey, please confirm your email address by clicking the button below:</p>
   
   <div style="text-align: center; margin: 30px 0;">
     <a href="{{ .ConfirmationURL }}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
       Confirm Your Account
     </a>
   </div>
   
   <p>If you didn't create an account with Valora Capital, you can safely ignore this email.</p>
   
   <p>Best regards,<br>
   The Valora Capital Team</p>
   
   <hr>
   <p style="font-size: 12px; color: #666;">
     Valora Capital - Premium Investment Platform<br>
     Email: info@valora-capital.com<br>
     Phone: +44 7848 179386
   </p>
   ```

#### **Magic Link Template:**
1. **Click on "Magic Link"** template
2. **Update the subject line:**
   ```
   Your Valora Capital Login Link
   ```

3. **Update the email body:**
   ```html
   <h2>Welcome back to Valora Capital!</h2>
   
   <p>Click the link below to sign in to your Valora Capital account:</p>
   
   <div style="text-align: center; margin: 30px 0;">
     <a href="{{ .ConfirmationURL }}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
       Sign In to Valora Capital
     </a>
   </div>
   
   <p>This link will expire in 1 hour for security reasons.</p>
   
   <p>If you didn't request this login link, you can safely ignore this email.</p>
   
   <p>Best regards,<br>
   The Valora Capital Team</p>
   
   <hr>
   <p style="font-size: 12px; color: #666;">
     Valora Capital - Premium Investment Platform<br>
     Email: info@valora-capital.com<br>
     Phone: +44 7848 179386
   </p>
   ```

#### **Reset Password Template:**
1. **Click on "Reset password"** template
2. **Update the subject line:**
   ```
   Reset Your Valora Capital Password
   ```

3. **Update the email body:**
   ```html
   <h2>Reset Your Valora Capital Password</h2>
   
   <p>We received a request to reset your password for your Valora Capital account.</p>
   
   <p>Click the button below to reset your password:</p>
   
   <div style="text-align: center; margin: 30px 0;">
     <a href="{{ .ConfirmationURL }}" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
       Reset Password
     </a>
   </div>
   
   <p>This link will expire in 1 hour for security reasons.</p>
   
   <p>If you didn't request a password reset, you can safely ignore this email.</p>
   
   <p>Best regards,<br>
   The Valora Capital Team</p>
   
   <hr>
   <p style="font-size: 12px; color: #666;">
     Valora Capital - Premium Investment Platform<br>
     Email: info@valora-capital.com<br>
     Phone: +44 7848 179386
   </p>
   ```

### **Step 3: Update Site URL**
1. **Go to Authentication** → **URL Configuration**
2. **Set Site URL:** `http://localhost:8082` (for development)
3. **Set Redirect URLs:** 
   ```
   http://localhost:8082/**
   https://your-domain.com/**
   ```

### **Step 4: Update Email Settings**
1. **Go to Authentication** → **Settings**
2. **Update "Site Name":** `Valora Capital`
3. **Update "Site Logo":** Upload your Valora Capital logo (optional)

## 🎨 **Email Template Features:**

### **Branding:**
- ✅ **Valora Capital branding** - Company name and colors
- ✅ **Professional design** - Clean, modern email layout
- ✅ **Brand colors** - Orange (#f97316) buttons matching your theme
- ✅ **Contact information** - Company email and phone

### **User Experience:**
- ✅ **Clear call-to-action** - Prominent buttons
- ✅ **Welcome message** - Friendly, professional tone
- ✅ **Security information** - Link expiration times
- ✅ **Contact support** - Easy to reach if needed

## 🚀 **Test the Changes:**

### **Step 1: Test Sign Up**
1. **Go to sign up page** - `/signup`
2. **Enter email** - Use a real email address
3. **Complete registration** - Should receive Valora Capital branded email
4. **Check email** - Should see "Welcome to Valora Capital" message

### **Step 2: Test Email Verification**
1. **Click confirmation link** - In the email
2. **Should redirect** - To your app with success message
3. **Account activated** - User can now sign in

## 📱 **Expected Results:**

### **Email Verification:**
- ✅ **Subject:** "Welcome to Valora Capital - Confirm Your Account"
- ✅ **Branding:** Valora Capital colors and styling
- ✅ **Message:** Professional welcome message
- ✅ **Button:** "Confirm Your Account" in brand colors

### **User Experience:**
- ✅ **Professional appearance** - Matches your brand
- ✅ **Clear instructions** - Easy to understand
- ✅ **Brand consistency** - Matches website design
- ✅ **Trust building** - Professional email builds confidence

Your email verification will now show "Welcome to Valora Capital" with professional branding! 🎉✨
