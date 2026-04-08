import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import P2PForm from "./forms/P2PForm.jsx";
import P2MForm from "./forms/P2MForm.jsx";
import RefundForm from "./forms/RefundForm.jsx";
import { ChevronRight } from "lucide-react";
import p2pImage from "../../assets/p2p.png";
import p2mImage from "../../assets/p2m.png";
import refundImage from "../../assets/refund.png";

// Payment Option Cards with images
const PaymentCard = ({ imageUrl, title, description, color, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`relative overflow-hidden rounded-3xl p-8 transition-all duration-500 transform cursor-pointer group
      ${isSelected 
        ? 'col-span-full md:col-span-full h-auto ring-2 ring-offset-2 ring-offset-slate-900' 
        : 'hover:shadow-xl hover:scale-105'
      }
    `}
    style={{
      backgroundColor: isSelected ? 'rgba(15, 23, 42, 0.8)' : 'rgba(30, 41, 59, 0.6)',
      borderColor: color,
      borderWidth: '3px',
      ringColor: color,
    }}
  >
    {/* Background gradient effect */}
    <div className={`absolute inset-0 opacity-5`} style={{ backgroundColor: color }}></div>
    
    {/* Content */}
    <div className="relative z-10">
      {/* Image */}
      <div className="mb-6 h-48 flex items-center justify-center bg-gradient-to-b from-slate-700/20 to-transparent rounded-2xl overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-contain"
        />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2 text-center">{title}</h3>
      <p className="text-slate-300 text-sm mb-4 text-center">{description}</p>
      
      {!isSelected && (
        <div className="flex items-center justify-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all opacity-0 group-hover:opacity-100">
          <span style={{ color }}>Get Started</span>
          <ChevronRight size={16} style={{ color }} />
        </div>
      )}
    </div>
  </button>
);

export default function PaymentHub({ onCompleted }) {
  const role = useSelector((s) => s.auth?.role);
  const [selectedType, setSelectedType] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Check if retry form should be auto-selected
  useEffect(() => {
    const activePaymentTab = sessionStorage.getItem("activePaymentTab");
    if (activePaymentTab) {
      setSelectedType(activePaymentTab);
      sessionStorage.removeItem("activePaymentTab");
    }
  }, []);

  const paymentOptions = [
    {
      id: "p2p",
      imageUrl: p2pImage,
      title: "P2P Transfer",
      description: "Send money directly to another wallet",
      color: "#3b82f6",
    },
    {
      id: "p2m",
      imageUrl: p2mImage,
      title: "P2M Transfer",
      description: "Pay merchants securely and instantly",
      color: "#10b981",
    },
    {
      id: "refund",
      imageUrl: refundImage,
      title: "Request Refund",
      description: "Request a refund for merchant transactions",
      color: "#f59e0b",
    },
  ];

  const handleCardClick = (id) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedType(id);
      setIsTransitioning(false);
    }, 200);
  };

  const handleBack = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedType(null);
      setIsTransitioning(false);
    }, 200);
  };

  const handleCompleted = () => {
    onCompleted?.();
    setTimeout(() => {
      handleBack();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Payment Options</h1>
          <p className="text-slate-400 text-lg">Choose how you want to transfer money</p>
        </div>

        {/* Show Selection Cards if nothing is selected */}
        {!selectedType && (
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-500 ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {paymentOptions.map((option) => (
              <PaymentCard
                key={option.id}
                {...option}
                isSelected={false}
                onClick={() => handleCardClick(option.id)}
              />
            ))}
          </div>
        )}

        {/* Show Selected Form */}
        {selectedType && (
          <div
            className={`transition-all duration-500 ${
              isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="mb-8 flex items-center gap-2 text-slate-300 hover:text-white transition-colors duration-300 group"
            >
              <svg
                className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-semibold">Back to Options</span>
            </button>

            {/* Forms */}
            {selectedType === "p2p" && <P2PForm onCompleted={handleCompleted} />}
            {selectedType === "p2m" && <P2MForm onCompleted={handleCompleted} />}
            {selectedType === "refund" && <RefundForm onCompleted={handleCompleted} />}
          </div>
        )}
      </div>
    </div>
  );
}
