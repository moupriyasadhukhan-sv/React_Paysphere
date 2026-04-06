// import React from 'react';
// import { Toaster } from 'react-hot-toast'; // Import the Toaster
// import PaymentMethodsPage from './pages/Dashboards/PaymentMethodsPage.jsx';

// function App() {
//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* 1. Add the Toaster here. It stays invisible until a toast is triggered */}
//       <Toaster 
//         position="top-center" 
//         reverseOrder={false} 
//         toastOptions={{
//           style: {
//             borderRadius: '12px',
//             background: '#333',
//             color: '#fff',
//           },
//         }}
//       />
      
//       <header className="bg-blue-700 text-white p-4 shadow-lg text-center font-bold tracking-wide">
//         PaySphere Portal
//       </header>
      
//       <main className="py-10">
//         <PaymentMethodsPage />
//       </main>
//     </div>
//   );
// }

// export default App;
// import React from 'react';
// import { Toaster } from 'react-hot-toast';
// import AppRoutes from './routes/AppRoutes'; // Import your logic

// function App() {
//   return (
//     <div className="min-h-screen">
//       <Toaster 
//         position="top-center" 
//         reverseOrder={false} 
//         toastOptions={{
//           style: {
//             borderRadius: '12px',
//             background: '#333',
//             color: '#fff',
//           },
//         }}
//       />
      
//       {/* This component decides whether to show Login, Register, or Dashboard */}
//       <AppRoutes />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <>
      <Toaster position="top-center" />
      <AppRoutes />
    </>
  );
}

export default App;