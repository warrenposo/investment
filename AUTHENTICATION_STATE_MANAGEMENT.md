# Authentication State Management Guide

## Overview
This application now has a complete authentication state management system that keeps users logged in across browser sessions and page refreshes.

## Features ✅

- **Persistent Sessions**: Users stay logged in even after closing the browser
- **Automatic Redirects**: Already logged-in users are redirected to their dashboard
- **Protected Routes**: Unauthorized users can't access protected pages
- **Role-Based Access**: Admin users are automatically redirected to admin dashboard
- **Single Sign-On Experience**: No need to log in multiple times
- **Secure**: Uses Supabase's built-in session management

---

## How It Works

### 1. **AuthContext** (`src/contexts/AuthContext.tsx`)

The central authentication state manager that:
- Checks authentication status on app load
- Stores user information (id, email, name, isAdmin)
- Provides `signIn` and `signOut` functions
- Automatically redirects based on user role

```typescript
const { user, loading, signIn, signOut, isAuthenticated, isAdmin } = useAuth();
```

### 2. **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)

Wrapper component for routes that require authentication:
- Shows loading spinner while checking auth
- Redirects to `/signin` if not authenticated
- Supports admin-only routes
- Prevents regular users from accessing admin routes

```typescript
<Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
```

### 3. **PublicRoute** (`src/components/PublicRoute.tsx`)

Wrapper for sign-in/sign-up pages:
- Checks if user is already authenticated
- Redirects authenticated users to their dashboard
- Prevents logged-in users from seeing login page again

```typescript
<Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
<Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
```

---

## User Flow

### First Time Login:
1. User visits `/signin`
2. Enters credentials
3. `AuthContext.signIn()` is called
4. Supabase authenticates and stores session in localStorage
5. User is redirected to `/dashboard` (or `/admin` if admin)

### Returning User:
1. User opens the website (any page)
2. `AuthContext` automatically checks Supabase session
3. If valid session exists, user data is loaded
4. User is automatically redirected to appropriate dashboard
5. No login required! ✅

### Logout:
1. User clicks logout button
2. `AuthContext.signOut()` is called
3. Supabase session is cleared
4. User is redirected to home page
5. Next visit will require login

---

## Route Configuration

### Public Routes (No Auth Required):
```typescript
- / (home)
- /plan
- /blog
- /faq
- /about
- /contact
```

### Auth Routes (Redirect if Logged In):
```typescript
- /signin → redirects to /dashboard or /admin if already logged in
- /signup → redirects to /dashboard or /admin if already logged in
```

### Protected Routes (Auth Required):
```typescript
- /dashboard → regular users only
- /kyc → regular users only
```

### Admin Routes (Admin Only):
```typescript
- /admin → admin users only (warrenokumu98@gmail.com)
```

---

## Session Storage

### Where is session data stored?

**Supabase automatically stores:**
- Access token
- Refresh token  
- User session data
- Expiry time

**Storage location:**
- `localStorage` (browser)
- Key: `sb-<project-id>-auth-token`

### How long does a session last?

- **Access Token**: 1 hour (default)
- **Refresh Token**: 60 days (default)
- Session is automatically refreshed when access token expires
- User stays logged in until they manually log out or token expires

---

## Code Examples

### Using Auth in a Component

```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in</p>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      {isAdmin && <p>You are an admin!</p>}
      <button onClick={signOut}>Logout</button>
    </div>
  );
};
```

### Creating a Protected Route

```typescript
// In App.tsx
<Route 
  path="/profile" 
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  } 
/>
```

### Creating an Admin-Only Route

```typescript
// In App.tsx
<Route 
  path="/admin/settings" 
  element={
    <ProtectedRoute adminOnly>
      <AdminSettings />
    </ProtectedRoute>
  } 
/>
```

---

## Testing

### Test Persistent Login:

1. **Login as regular user**
   - Go to `/signin`
   - Login with credentials
   - You're redirected to `/dashboard`
   
2. **Close and reopen browser**
   - Open the website
   - You should be automatically logged in
   - You're on `/dashboard` without signing in again ✅

3. **Try to access sign-in page**
   - Go to `/signin`
   - You're automatically redirected to `/dashboard` ✅

4. **Logout and verify**
   - Click logout
   - You're redirected to home page
   - Try accessing `/dashboard` → redirected to `/signin` ✅

### Test Admin Access:

1. **Login as admin** (warrenokumu98@gmail.com)
   - You're redirected to `/admin`
   
2. **Try to access regular dashboard**
   - Go to `/dashboard`
   - You're redirected to `/admin` (admin can't access user dashboard)

3. **Close and reopen browser**
   - Still logged in as admin
   - Still on `/admin` ✅

---

## Troubleshooting

### User keeps getting logged out

**Cause**: Session expired or localStorage cleared

**Solution**: 
- Check if browser is in incognito mode
- Check if localStorage is enabled
- Verify Supabase session timeout settings

### Infinite redirect loop

**Cause**: Auth check failing repeatedly

**Solution**:
- Check browser console for errors
- Verify Supabase configuration
- Check if `getCurrentUser()` is working properly

### Admin can't access admin dashboard

**Cause**: Email check not matching

**Solution**:
- Verify admin email is exactly: `warrenokumu98@gmail.com`
- Check browser console for auth logs
- Verify user is authenticated properly

### Session not persisting

**Cause**: Supabase not storing session in localStorage

**Solution**:
- Check if `persistSession` is enabled in Supabase client
- Verify browser allows localStorage
- Check Supabase dashboard for session settings

---

## Security Considerations

### ✅ Secure Practices:

1. **Tokens stored in localStorage** (Supabase default)
2. **Automatic token refresh** (handled by Supabase)
3. **Row-level security** enforced in database
4. **Protected routes** prevent unauthorized access
5. **Role-based access control** for admin users

### ⚠️ Important Notes:

- Admin email is hardcoded (`warrenokumu98@gmail.com`)
- To change admin email, update in:
  - `src/contexts/AuthContext.tsx` (line 45)
  - All database RLS policies
  - `src/pages/Dashboard.tsx` (KYC check)
  - `src/pages/AdminDashboard.tsx` (access check)

---

## Files Modified

### Created:
- ✅ `src/contexts/AuthContext.tsx` - Authentication state manager
- ✅ `src/components/ProtectedRoute.tsx` - Protected route wrapper
- ✅ `src/components/PublicRoute.tsx` - Public route wrapper

### Modified:
- ✅ `src/App.tsx` - Added AuthProvider and route protection
- ✅ `src/pages/SignIn.tsx` - Uses auth context
- ✅ `src/pages/Dashboard.tsx` - Uses auth context for logout
- ✅ `src/pages/AdminDashboard.tsx` - Uses auth context for logout

---

## Benefits

### For Users:
- ✅ No need to log in repeatedly
- ✅ Seamless experience across sessions
- ✅ Fast navigation (no auth checks on every page)

### For Developers:
- ✅ Centralized auth logic
- ✅ Easy to add new protected routes
- ✅ Simple role-based access control
- ✅ Better code organization

### For Security:
- ✅ Consistent auth checks
- ✅ Automatic token refresh
- ✅ Protected API calls
- ✅ Session management handled by Supabase

---

## Future Enhancements

Possible improvements:
- [ ] Add "Remember me" functionality with extended sessions
- [ ] Implement email verification
- [ ] Add password reset flow
- [ ] Support multiple admin roles
- [ ] Add session timeout warnings
- [ ] Implement refresh token rotation
- [ ] Add activity logging
- [ ] Support multiple concurrent sessions

---

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify Supabase configuration
3. Clear browser cache and try again
4. Check localStorage for session data
5. Verify network requests to Supabase

## Summary

The authentication system now provides a complete, secure, and user-friendly experience. Users stay logged in across sessions, and the app automatically handles routing based on authentication state and user roles. 🔐✨

