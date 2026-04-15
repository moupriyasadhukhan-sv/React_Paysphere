// import React, { useState, useEffect } from 'react';
// import { Wallet, TrendingUp, ArrowUpRight, Zap } from 'lucide-react';
// import toast from 'react-hot-toast';
// import TopUpModal from "../../components/TopUpModal";
// import { paymentService } from '../../services/paymentService';
// import { walletService } from '../../services/walletService';

// export default function WalletDashboard() {
//   const [walletBalance, setWalletBalance] = useState(0);
//   const [instruments, setInstruments] = useState([]);
//   const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
//   const [isLoadingBalance, setIsLoadingBalance] = useState(false);
//   const [isLoadingInstruments, setIsLoadingInstruments] = useState(false);

//   // Diagnostic check on mount
//   useEffect(() => {
//     walletService.checkSetup();
//   }, []);

//   // Fetch wallet balance and payment instruments on component mount
//   useEffect(() => {
//     fetchWalletData();
//   }, []);

//   const fetchWalletData = async () => {
//     setIsLoadingBalance(true);
//     setIsLoadingInstruments(true);
//     try {
//       // Fetch wallet balance
//       console.log('Starting wallet data fetch...');
//       const balanceResponse = await walletService.getWalletBalance();
//       console.log('Balance fetched:', balanceResponse);
//       const balance = balanceResponse.balance || balanceResponse.walletBalance || balanceResponse.amount || 0;
//       setWalletBalance(balance);
//     } catch (error) {
//       console.error('Error fetching wallet balance:', error);
//       toast.error('Failed to load wallet balance: ' + (error.response?.data?.message || error.message));
//       setWalletBalance(0);
//     } finally {
//       setIsLoadingBalance(false);
//     }

//     try {
//       // Fetch saved payment instruments
//       console.log('Fetching payment instruments...');
//       const instrumentsResponse = await paymentService.getInstruments();
//       console.log('Instruments fetched:', instrumentsResponse);
//       setInstruments(instrumentsResponse || []);
//     } catch (error) {
//       console.error('Error fetching instruments:', error);
//       toast.error('Failed to load payment methods');
//       setInstruments([]);
//     } finally {
//       setIsLoadingInstruments(false);
//     }
//   };

//   const handleWalletUpdate = (newBalance) => {
//     setWalletBalance(newBalance);
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2,
//     }).format(amount);
//   };

//   return (
//     <div className="min-h-screen" style={{ background: 'linear-gradient(145deg,#080d1a 0%,#0d1424 60%,#080d1a 100%)' }}>
//       {/* Header */}
//       <header
//         className="w-full px-6 py-4 flex items-center justify-between"
//         style={{
//           background: 'rgba(10,17,40,0.95)',
//           borderBottom: '1px solid rgba(255,255,255,0.06)',
//           backdropFilter: 'blur(12px)',
//         }}
//       >
//         <div>
//           <h1 className="text-lg font-black text-white flex items-center gap-2">
//             <Wallet className="text-indigo-400" size={24} />
//             My Wallet
//           </h1>
//           <p className="text-xs text-white/30">Add funds to your wallet instantly</p>
//         </div>
//       </header>

//       <main className="p-6 space-y-8">
//         {/* Main Balance Card */}
//         <div
//           className="rounded-3xl p-12 text-white overflow-hidden relative group transition-all hover:scale-[1.01]"
//           style={{
//             background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)',
//             boxShadow: '0 25px 50px -12px rgba(99,102,241,0.4)',
//           }}
//         >
//           {/* Decorative elements */}
//           <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 65%)' }} />
//           <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 65%)' }} />

//           <div className="relative z-10 flex items-end justify-between">
//             <div>
//               <p className="text-white/70 text-sm font-semibold mb-3 uppercase tracking-widest">Wallet Balance</p>
//               {isLoadingBalance ? (
//                 <div className="animate-pulse">
//                   <div className="h-12 bg-white/20 rounded w-48 mb-4" />
//                 </div>
//               ) : (
//                 <>
//                   <h2 className="text-5xl font-black mb-2 tracking-tight">{formatCurrency(walletBalance)}</h2>
//                   <p className="text-white/60 text-sm">Ready to use</p>
//                 </>
//               )}
//             </div>
//             <Zap size={48} className="text-white opacity-30" />
//           </div>
//         </div>

//         {/* Action Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Top Up Card */}
//           <div
//             className="rounded-2xl p-8 border backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer"
//             style={{
//               background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05))',
//               borderColor: 'rgba(99,102,241,0.3)',
//             }}
//             onClick={() => setIsTopUpModalOpen(true)}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
//                 <ArrowUpRight className="text-indigo-400" size={24} />
//               </div>
//             </div>
//             <h3 className="text-white font-bold text-lg mb-2">Add Funds</h3>
//             <p className="text-white/60 text-sm mb-4">Top up your wallet using your saved payment methods</p>
//             <button
//               onClick={() => setIsTopUpModalOpen(true)}
//               className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors font-semibold text-sm"
//             >
//               Top Up Now
//               <ArrowUpRight size={16} />
//             </button>
//           </div>

//           {/* Quick Stats Card */}
//           <div
//             className="rounded-2xl p-8 border backdrop-blur-sm"
//             style={{
//               background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(236,72,153,0.05))',
//               borderColor: 'rgba(139,92,246,0.3)',
//             }}
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
//                 <TrendingUp className="text-purple-400" size={24} />
//               </div>
//             </div>
//             <h3 className="text-white font-bold text-lg mb-2">Quick Stats</h3>
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-white/60 text-sm">Available Balance</span>
//                 <span className="text-white font-semibold">{formatCurrency(walletBalance)}</span>
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-white/60 text-sm">Payment Methods</span>
//                 <span className="text-white font-semibold">{isLoadingInstruments ? '...' : instruments.length}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Info Banner */}
//         <div
//           className="rounded-2xl p-6 border"
//           style={{
//             background: 'rgba(16,185,129,0.08)',
//             borderColor: 'rgba(16,185,129,0.2)',
//           }}
//         >
//           <p className="text-emerald-100 text-sm">
//             💡 <span className="font-semibold">Tip:</span> You can manage your payment methods in the Cards section. Use this wallet for quick transactions!
//           </p>
//         </div>
//       </main>

//       {/* Top Up Modal */}
//       <TopUpModal
//         isOpen={isTopUpModalOpen}
//         onClose={() => setIsTopUpModalOpen(false)}
//         instruments={instruments}
//         onWalletUpdate={handleWalletUpdate}
//       />
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, ArrowUpRight, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import TopUpModal from "../../components/TopUpModal";
import { paymentService } from '../../services/paymentService';
import { walletService } from '../../services/walletService';

export default function WalletDashboard() {
  const [walletBalance, setWalletBalance] = useState(0);
  const [instruments, setInstruments] = useState([]);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingInstruments, setIsLoadingInstruments] = useState(false);

  // Diagnostic check on mount
  useEffect(() => {
    walletService.checkSetup();
  }, []);

  // Fetch wallet balance and payment instruments on component mount
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    setIsLoadingBalance(true);
    setIsLoadingInstruments(true);
    try {
      // Fetch wallet balance
      console.log('Starting wallet data fetch...');
      const balanceResponse = await walletService.getWalletBalance();
      console.log('Balance fetched:', balanceResponse);
      const balance = balanceResponse.balance || balanceResponse.walletBalance || balanceResponse.amount || 0;
      setWalletBalance(balance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      toast.error('Failed to load wallet balance: ' + (error.response?.data?.message || error.message));
      setWalletBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }

    try {
      // Fetch saved payment instruments
      console.log('Fetching payment instruments...');
      const instrumentsResponse = await paymentService.getInstruments();
      console.log('Instruments fetched:', instrumentsResponse);
      setInstruments(instrumentsResponse || []);
    } catch (error) {
      console.error('Error fetching instruments:', error);
      toast.error('Failed to load payment methods');
      setInstruments([]);
    } finally {
      setIsLoadingInstruments(false);
    }
  };

  const handleWalletUpdate = (newBalance) => {
    setWalletBalance(newBalance);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(145deg,#080d1a 0%,#0d1424 60%,#080d1a 100%)' }}>
      {/* Header */}
      <header
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{
          background: 'rgba(10,17,40,0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <Wallet className="text-indigo-400" size={24} />
            My Wallet
          </h1>
          <p className="text-xs text-white/30">Add funds to your wallet instantly</p>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {/* Main Balance Card */}
        <div
          className="rounded-3xl p-12 text-white overflow-hidden relative group transition-all hover:scale-[1.01]"
          style={{
            background: 'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)',
            boxShadow: '0 25px 50px -12px rgba(99,102,241,0.4)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 65%)' }} />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(255,255,255,0.08) 0%,transparent 65%)' }} />

          <div className="relative z-10 flex items-end justify-between">
            <div>
              <p className="text-white/70 text-sm font-semibold mb-3 uppercase tracking-widest">Wallet Balance</p>
              {isLoadingBalance ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-white/20 rounded w-48 mb-4" />
                </div>
              ) : (
                <>
                  <h2 className="text-5xl font-black mb-2 tracking-tight">{formatCurrency(walletBalance)}</h2>
                  <p className="text-white/60 text-sm">Ready to use</p>
                </>
              )}
            </div>
            <Zap size={48} className="text-white opacity-30" />
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Up Card */}
          <div
            className="rounded-2xl p-8 border backdrop-blur-sm transition-all hover:scale-[1.02] cursor-pointer"
            style={{
              background: 'linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.05))',
              borderColor: 'rgba(99,102,241,0.3)',
            }}
            onClick={() => setIsTopUpModalOpen(true)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99,102,241,0.2)' }}>
                <ArrowUpRight className="text-indigo-400" size={24} />
              </div>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Add Funds</h3>
            <p className="text-white/60 text-sm mb-4">Top up your wallet using your saved payment methods</p>
            <button
              onClick={() => setIsTopUpModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-indigo-400 hover:text-indigo-300 transition-colors font-semibold text-sm"
            >
              Top Up Now
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Quick Stats Card */}
          <div
            className="rounded-2xl p-8 border backdrop-blur-sm"
            style={{
              background: 'linear-gradient(135deg,rgba(139,92,246,0.1),rgba(236,72,153,0.05))',
              borderColor: 'rgba(139,92,246,0.3)',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139,92,246,0.2)' }}>
                <TrendingUp className="text-purple-400" size={24} />
              </div>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Available Balance</span>
                <span className="text-white font-semibold">{formatCurrency(walletBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Payment Methods</span>
                <span className="text-white font-semibold">{isLoadingInstruments ? '...' : instruments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: 'rgba(16,185,129,0.08)',
            borderColor: 'rgba(16,185,129,0.2)',
          }}
        >
          <p className="text-emerald-100 text-sm">
            💡 <span className="font-semibold">Tip:</span> You can manage your payment methods in the Cards section. Use this wallet for quick transactions!
          </p>
        </div>
      </main>

      {/* Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        instruments={instruments}
        onWalletUpdate={handleWalletUpdate}
      />
    </div>
  );
}
