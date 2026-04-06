import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Provider } from 'react-redux'
import { store } from './stores/store'
import { setAuthToken } from './services/http'
import { setCredentials } from './stores/authSlice' // IMPORT THIS ACTION
import http from './services/http'
import './index.css'

console.log("React is attempting to mount to #root...");


async function restoreSession() {
  const isLoggedIn = localStorage.getItem('ps_loggedIn') === 'true';
  if (!isLoggedIn) return;

  try {
    // Note: Added leading slash to ensure correct pathing
    const res = await http.post('/api/auth/refresh');
    console.log("Refresh response:", res.data);
    // Destructure the data returned by your C# Refresh() task
    const { accessToken, role, userId, merchantId, name, email } = res.data;

    if (accessToken) {
      // 1. Update Axios headers for future requests (Memory Storage)
      setAuthToken(accessToken);

      // 2. Update Redux store (State Storage)
      // This prevents the "auth/logout" trigger you saw in Redux DevTools
      store.dispatch(setCredentials({
        role: role,
        userId: userId,
        merchantId: merchantId,
        name: name,
        email: email
      }));

      console.log("Session successfully restored.");
    }
  } catch (error) {
    console.error("Session restoration failed:", error.response?.data?.message || error.message);
    
    // Only clear storage if the backend explicitly says the refresh token is invalid (401)
    if (error.response?.status === 401) {
      localStorage.removeItem('ps_role');
      localStorage.removeItem('ps_userId');
      localStorage.removeItem('ps_merchantId');
      localStorage.removeItem('ps_name');
      localStorage.removeItem('ps_email');
      localStorage.removeItem('ps_loggedIn');
    }
  }
}

const root = document.getElementById('root');

if (root) {
  // Wait for the async restoreSession to finish BEFORE rendering the App
  restoreSession().finally(() => {
    ReactDOM.createRoot(root).render(
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    );
    console.log("React app initialized.");
  });
} else {
  console.error("CRITICAL: Element with id 'root' not found!");
}