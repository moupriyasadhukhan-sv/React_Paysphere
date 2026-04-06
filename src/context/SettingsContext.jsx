import React, { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const translations = {
  en: {
    home: 'Home', transactions: 'Transactions', payment: 'Payment',
    wallet: 'Wallet', cards: 'Cards', settings: 'Settings', logout: 'Logout',
    dashboard: 'Dashboard', welcomeBack: 'Welcome back',
    managePayments: 'Manage your payments and wallet effortlessly.',
  },
  hi: {
    home: 'होम', transactions: 'लेनदेन', payment: 'भुगतान',
    wallet: 'वॉलेट', cards: 'कार्ड', settings: 'सेटिंग्स', logout: 'लॉग आउट',
    dashboard: 'डैशबोर्ड', welcomeBack: 'वापस स्वागत है',
    managePayments: 'अपने भुगतान और वॉलेट को आसानी से प्रबंधित करें।',
  },
  te: {
    home: 'హోమ్', transactions: 'లావాదేవీలు', payment: 'చెల్లింపు',
    wallet: 'వాలెట్', cards: 'కార్డులు', settings: 'సెట్టింగులు', logout: 'లాగ్ అవుట్',
    dashboard: 'డాష్‌బోర్డ్', welcomeBack: 'తిరిగి స్వాగతం',
    managePayments: 'మీ చెల్లింపులు మరియు వాలెట్‌ను సులభంగా నిర్వహించండి.',
  },
};

export function SettingsProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('ps_darkMode') !== 'false');
  const [language, setLanguage] = useState(() => localStorage.getItem('ps_language') || 'en');

  const toggleDark = () => {
    setDarkMode(prev => {
      const next = !prev;
      localStorage.setItem('ps_darkMode', next);
      return next;
    });
  };

  const setLang = (code) => {
    setLanguage(code);
    localStorage.setItem('ps_language', code);
  };

  const t = translations[language];

  return (
    <SettingsContext.Provider value={{ darkMode, toggleDark, language, setLang, t }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
