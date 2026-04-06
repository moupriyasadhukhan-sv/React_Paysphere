import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './index.css';

console.log("1. Main.jsx has started execution");

const rootElement = document.getElementById('root');

if (!rootElement) {
  alert("CRITICAL ERROR: No #root element found in index.html!");
} else {
  console.log("2. Found #root element, attempting to render...");
  
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </React.StrictMode>
    );
    console.log("3. Render command successfully sent to React.");
  } catch (error) {
    console.error("4. RENDER FAILED:", error);
    rootElement.innerHTML = `<h1 style="color:red">React Crash: ${error.message}</h1>`;
  }
}