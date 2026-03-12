import { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  name: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  icon: "interest" | "betting" | "transfer" | "airtime" | "add";
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => void;
  deductMoney: (amount: number, recipientName: string) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

const initialTransactions: Transaction[] = [
  { name: "OWealth Interest Earned", type: "Credit", amount: 0.09, date: "Mar 12th, 02:10:53", status: "Successful", icon: "interest" },
  { name: "Betting", type: "Betting", amount: -20000, date: "Mar 11th, 20:03:07", status: "Successful", icon: "betting" },
];

const formatDate = () => {
  const now = new Date();
  return `${now.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}, ${now.toLocaleTimeString("en-GB", { hour12: false })}`;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(20.48);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addMoney = (amount: number) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      { name: "Add Money", type: "Credit", amount, date: formatDate(), status: "Successful", icon: "add" },
      ...prev,
    ]);
  };

  const deductMoney = (amount: number, recipientName: string) => {
    setBalance((prev) => prev - amount);
    setTransactions((prev) => [
      { name: recipientName, type: "Transfer", amount: -amount, date: formatDate(), status: "Successful", icon: "transfer" },
      ...prev,
    ]);
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, addMoney, deductMoney }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
