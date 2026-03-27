import React, { createContext, useContext, useState, useEffect } from 'react';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'payment_sent' | 'payment_received';
  amount: number;
  status: 'completed' | 'pending';
  date: string;
  label: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  deposit: (amount: number) => void;
  withdraw: (amount: number) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [balance, setBalance] = useState(1250.50); // Mock initial balance
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', type: 'payment_received', amount: 450, status: 'completed', date: '2024-03-20', label: 'Website Redesign Task' },
    { id: '2', type: 'payment_sent', amount: 50, status: 'completed', date: '2024-03-18', label: 'Logo Cleanup' },
  ]);

  const deposit = (amount: number) => setBalance(prev => prev + amount);
  const withdraw = (amount: number) => setBalance(prev => prev - amount);

  return (
    <WalletContext.Provider value={{ balance, transactions, deposit, withdraw }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within a WalletProvider');
  return context;
};