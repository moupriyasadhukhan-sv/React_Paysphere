import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ChevronDown, Plus, Loader, CreditCard, Wallet, ArrowRight } from 'lucide-react';
import Modal from './shared/Modal';
import { walletService } from '../services/walletService';

export default function TopUpModal({ isOpen, onClose, instruments, onWalletUpdate }) {
  const navigate = useNavigate();
  const [selectedInstrument, setSelectedInstrument] = useState(null);
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddNewMethod = () => {
    onClose();
    navigate('/dashboard/payment-methods/add');
  };

  const handleTopUp = async () => {
    if (!selectedInstrument) {
      toast.error('Please select a payment method');
      return;
    }

    if (selectedInstrument.status === 'Lost') {
      toast.error('❌ This card is reported Lost. Use a different payment method.');
      return;
    }

    if (selectedInstrument.status === 'Blocked') {
      toast.error('❌ This card is Blocked. Use a different payment method.');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      const response = await walletService.topup(selectedInstrument.instrumentID, parseFloat(amount));
      
      // Success response (200 status)
      toast.success('✓ Wallet topped up successfully!');
      
      // Update wallet balance in parent
      if (onWalletUpdate) {
        onWalletUpdate(response.newBalance || response.walletBalance);
      }
      
      // Reset and close modal
      setSelectedInstrument(null);
      setAmount('');
      setIsDropdownOpen(false);
      onClose();
    } catch (error) {
      // Handle different error scenarios
      if (error.response?.status === 400) {
        // Declined transaction (insufficient funds or other decline reason)
        const errorMessage = error.response?.data?.message || 'Transaction Declined: Insufficient Funds';
        toast.error(`❌ ${errorMessage}`);
      } else if (error.response?.status === 404) {
        toast.error('Payment method or wallet not found');
      } else if (error.response?.status === 401) {
        toast.error('Please log in again');
      } else {
        toast.error(error.response?.data?.message || 'An error occurred during top-up');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectInstrument = (instrument) => {
    setSelectedInstrument(instrument);
    setIsDropdownOpen(false);
  };

  const getInstrumentLabel = (instrument) => {
    if (!instrument) return 'Select a payment method';
    return `${instrument.maskedIdentifier || 'Card'} (${instrument.type || 'Unknown'})`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Top Up Wallet">
      <div className="space-y-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 rounded-xl max-h-[calc(100vh-250px)] overflow-y-auto">
        {/* Header with Icon */}
        <div className="flex items-center justify-center mb-2">
          <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Saved Payment Methods Section */}
        <div className="relative z-30 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-indigo-600"></div>
            <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Select Your Payment Method
            </label>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-5 py-4 text-left bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-200 rounded-xl flex items-center justify-between hover:border-indigo-400 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent group"
            >
              <span className={`font-semibold text-base ${selectedInstrument ? 'text-slate-900' : 'text-slate-500'}`}>
                {getInstrumentLabel(selectedInstrument)}
              </span>
              <ChevronDown 
                size={20} 
                className={`text-indigo-600 transition-all duration-300 group-hover:text-indigo-700 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu - Fixed positioning to prevent overflow */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-indigo-200 rounded-xl shadow-2xl z-50 max-h-48 overflow-y-auto backdrop-blur-sm">
                <div>
                  {instruments && instruments.length > 0 ? (
                    instruments.map((instrument, index) => {
                      const isLocked = instrument.status === 'Lost' || instrument.status === 'Blocked';
                      return (
                      <button
                        key={instrument.instrumentID}
                        type="button"
                        onClick={() => !isLocked && handleSelectInstrument(instrument)}
                        disabled={isLocked}
                        className={`w-full px-5 py-4 text-left transition-all duration-200 flex items-center justify-between ${
                          index !== instruments.length - 1 ? 'border-b border-slate-100' : ''
                        } ${
                          isLocked ? 'opacity-50 cursor-not-allowed bg-red-50' :
                          selectedInstrument?.instrumentID === instrument.instrumentID
                            ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-l-4 border-l-indigo-600'
                            : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white flex-shrink-0 shadow-lg" style={{ background: isLocked ? '#ef444466' : 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
                            {instrument.type?.[0] || '💳'}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate text-base">
                              {instrument.maskedIdentifier || 'Card'}
                            </p>
                            <p className="text-xs truncate mt-1" style={{ color: isLocked ? '#ef4444' : '' }}>
                              {isLocked ? `🔴 ${instrument.status} — Cannot be used` : `${instrument.type}${instrument.providerName ? ` • ${instrument.providerName}` : ''}`}
                            </p>
                          </div>
                        </div>
                        {selectedInstrument?.instrumentID === instrument.instrumentID && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </button>
                      );
                    })
                  ) : (
                    <div className="px-5 py-8 text-center">
                      <Wallet className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                      <p className="text-slate-500 font-medium">No saved cards found</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add New Card Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-emerald-600"></div>
            <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Or Add a New Card
            </label>
          </div>
          <button
            type="button"
            onClick={handleAddNewMethod}
            className="w-full px-5 py-4 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-emerald-300 rounded-xl text-left hover:border-emerald-400 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent flex items-center justify-between group"
          >
            <div>
              <p className="text-slate-900 font-bold text-base group-hover:text-emerald-700 transition-colors">
                Add a New Payment Card
              </p>
              <p className="text-xs text-slate-600 mt-1">Securely add and save a new card</p>
            </div>
            <ArrowRight size={20} className="text-emerald-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </button>
        </div>

        {/* Amount Input - Visible Version */}
        {selectedInstrument && (
          <div className="animate-in fade-in duration-300 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-indigo-100">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-blue-600"></div>
              <label className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Enter Amount
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-5 top-4 text-slate-900 font-bold text-2xl">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                step="0.01"
                className="w-full pl-10 pr-5 py-4 text-slate-900 placeholder-slate-400 border-2 border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-bold text-2xl hover:border-indigo-400 transition-all duration-300 shadow-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-600 font-medium">Minimum Amount</p>
                <p className="text-sm font-bold text-slate-900 mt-1">₹1</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-600 font-medium">Available Limit</p>
                <p className="text-sm font-bold text-slate-900 mt-1">₹99,999</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleTopUp}
            disabled={!selectedInstrument || !amount || isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105"
          >
            {isLoading && <Loader size={18} className="animate-spin" />}
            {isLoading ? 'Processing...' : 'Add to Wallet'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
