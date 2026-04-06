# Debug Guide - LocalStorage Data Loss on Refresh

## What to Check

After you refresh the page (F5), **open your browser console** (F12 → Console tab) and look for these logs:

### Console Logs to Look For:

```
🔄 AuthContext mounted - isLoggedIn: true userId: 123 role: admin
🔄 Attempting to refresh access token...
```

Then you should see ONE of these:

#### ✅ SUCCESS (Data will be preserved):
```
✅ Access token refreshed on mount
```

#### ⚠️ FAILURE (Need to check why):
```
❌ Refresh error details: {
  status: 404,  // or 401, 500, etc.
  message: "...",
  endpoint: "/api/auth/refresh"
}
⚠️ Refresh failed but keeping session - will retry on next API call
```

---

## What Each Error Means

| Error Status | Meaning | What to Do |
|---|---|---|
| **401** | Refresh token invalid/expired | User must login again - this is correct |
| **404** | Endpoint doesn't exist | Backend endpoint `/api/auth/refresh` is wrong |
| **500** | Server error | Check backend logs |
| **Network error** | Can't reach backend | Check if backend is running |
| **No error, but no token** | Endpoint exists but returns no token | Check backend response format |

---

## Step-by-Step Debug

1. **Before refresh**, check localStorage (F12 → Application → Local Storage):
   - Look for: `ps_loggedIn`, `ps_role`, `ps_userId`

2. **Refresh page** (F5)

3. **Check console immediately**:
   - Do you see logs starting with 🔄 ?
   - Do you see ✅ or ❌ ?

4. **Check localStorage after refresh**:
   - Are `ps_loggedIn`, `ps_role`, `ps_userId` still there?
   - Or were they deleted?

5. **If deleted**, tell me what the console error says (status code & message)

---

## Most Likely Issues

### Issue #1: Endpoint Name is Wrong
If you see `status: 404`, the backend endpoint might be:
- `/api/Auth/refresh` (capital A)
- `/api/auth/refresh-token`
- `/api/auth/token/refresh`
- Something else entirely

**Fix**: Tell me what the correct endpoint is, and I'll update the code.

### Issue #2: Refresh Token Cookie Not Sent
The refresh token is sent in a cookie. If the backend doesn't receive it, it will return 401.

**Check**: In Network tab → See the `/api/auth/refresh` request → Check if Cookie header is present

### Issue #3: Backend Not Ready
If you see network errors, the backend might not be running.

**Check**: Can you manually access `http://localhost:5245/api/auth/refresh` ?

---

## What I Changed

### `src/context/AuthContext.jsx`:
- Added detailed console logging to see what's happening
- Added safer error handling - only logs out on 401
- Checks for both `isLoggedIn` AND `userId` before attempting refresh

### `src/services/http.js`:
- Added detailed console logging for silent refresh
- Better error handling with proper error messages
- Changed `/auth/refresh` check to `/auth/` (more flexible)

---

## Next Steps

1. **Test the page refresh again**
2. **Open console** (F12)
3. **Take a screenshot** of the console logs
4. **Tell me**:
   - What error status do you see (401, 404, 500, etc.)?
   - Or do you see ✅ success?
   - Is localStorage data still deleted or preserved now?
