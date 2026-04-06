# Authentication & LocalStorage Persistence Fix - Summary

## Problem
After page refresh, the following data was being lost from localStorage:
- `ps_loggedIn`
- `ps_role`
- `ps_userId`
- `ps_merchantId`
- Access token in memory

Only `ps_email` and `ps_name` remained.

## Root Cause
1. **Access token stored only in memory** - Lost on page refresh ❌
2. **No token refresh on mount** - When page reloads, no access token is restored
3. **401 errors clear the session** - The http interceptor wasn't properly handling silent refresh
4. **localStorage data preserved but inaccessible** - Redux couldn't restore data because there was no token to make API calls

## Solution Implemented

### File 1: `src/context/AuthContext.jsx`
**Changes Made:**
- Added `useEffect` hook that runs on component mount
- On mount, checks if user was previously logged in via `localStorage.getItem("ps_loggedIn")`
- If logged in, attempts to refresh the access token using the refresh token cookie
- Catches errors and only logs out on 401 (invalid refresh token)
- Keeps localStorage data intact if refresh fails due to network issues

**Key Logic:**
```javascript
useEffect(() => {
  const isLoggedIn = localStorage.getItem("ps_loggedIn") === "true";
  if (isLoggedIn) {
    // Try to get new access token using refresh token cookie
    const response = await http.post("/api/auth/refresh");
    if (response.data?.accessToken) {
      setAuthToken(response.data.accessToken); // Store in memory
    }
  }
}, [dispatch]);
```

### File 2: `src/services/http.js`
**Changes Made:**
- Updated response interceptor to handle 401 errors with proper token refresh
- Added queue system to handle multiple simultaneous requests during refresh
- Prevents infinite loops by checking if refresh is already in progress
- Added proper error handling that doesn't dispatch logout
- Uses axios directly for refresh (not through http instance) to avoid circular issues

**Key Improvements:**
- ✅ Multiple requests don't all try to refresh token simultaneously
- ✅ Queues requests while refresh is in progress
- ✅ Retries failed requests after token is refreshed
- ✅ Doesn't dispatch logout - lets component handle it
- ✅ Preserves localStorage data if refresh fails

### File 3: `src/stores/authSlice.js` (No changes needed)
- Already correctly saves all data to localStorage in `setCredentials()` reducer
- Already correctly clears all data in `logout()` reducer
- `initialState` correctly reads from localStorage on app start

## Flow Diagram

### Initial Login
```
User logs in with email/password/role
  ↓
Backend returns accessToken + user data
  ↓
login() function called
  ↓
1. setAuthToken(accessToken) → stores in memory
2. dispatch(setCredentials()) → saves to localStorage + Redux
  ↓
User navigated to dashboard ✅
```

### Page Refresh
```
User refreshes page (F5)
  ↓
Redux initialState loads from localStorage ✅
  ↓
AuthContext mounts
  ↓
useEffect checks ps_loggedIn
  ↓
Calls /api/auth/refresh with refresh token cookie
  ↓
✅ Gets new accessToken from backend
  ↓
setAuthToken(accessToken) → stores in memory
  ↓
App ready to make API calls with token ✅
```

### If Refresh Token Expired
```
useEffect tries /api/auth/refresh
  ↓
Backend returns 401 (refresh token invalid)
  ↓
Catch block dispatches logout()
  ↓
localStorage cleared
  ↓
User redirected to login
```

## Testing Steps

1. **Login as Admin/Merchant**
   ```
   Email: your-email@example.com
   Password: Your-Password
   Role: Admin (or Merchant)
   ```

2. **Check localStorage** (F12 → Application → Local Storage)
   - Should see: `ps_loggedIn`, `ps_role`, `ps_userId`, `ps_email`, `ps_name`

3. **Refresh the page** (F5)
   - ✅ Should stay logged in
   - ✅ localStorage data still present
   - ✅ Wallet & cards data load
   - ✅ Access token restored to memory

4. **Logout** 
   - localStorage should be completely cleared

## Key Points

| Aspect | Before | After |
|--------|--------|-------|
| Token storage | Memory only (lost on refresh) | Memory + auto-refresh via refresh token cookie |
| localStorage preservation | Cleared after refresh | Preserved indefinitely |
| Refresh on page load | No | Yes ✅ |
| Multiple 401s handling | Caused issues | Queued properly ✅ |
| Network error handling | Lost session | Keeps localStorage intact ✅ |

## Files Modified

1. **`src/context/AuthContext.jsx`** - Added token refresh on mount
2. **`src/services/http.js`** - Improved 401 handling with request queue
3. **`src/stores/authSlice.js`** - No changes (already working correctly)
4. **`src/pages/entrypages/login.jsx`** - No changes (already working correctly)

## Important Notes

- ✅ Refresh token is stored in httpOnly cookie (secure, not accessible to JS)
- ✅ Access token is in memory only (lost on refresh, but restored automatically)
- ✅ User data (role, userId, etc.) is in localStorage (persists across refreshes)
- ✅ All 3 work together to provide security and persistence
