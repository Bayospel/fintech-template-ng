import { createContext, useContext, useState, ReactNode } from "react";

export interface Transaction {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  icon: "interest" | "betting" | "transfer" | "airtime" | "add" | "stamp" | "merchant";
  bank?: string;
  account?: string;
  reference: string;
  remark?: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  addMoney: (amount: number) => void;
  deductMoney: (amount: number, recipientName: string, bank?: string, account?: string, remark?: string) => string;
}

const WalletContext = createContext<WalletContextType | null>(null);

const genRef = () => `2303${Date.now().toString().slice(-16)}`;
const genId = () => Math.random().toString(36).slice(2, 10);

const initialTransactions: Transaction[] = [
  { id: genId(), name: "OWealth Interest Earned", type: "Credit", amount: 0.09, date: "Mar 12th, 02:10:53", status: "Successful", icon: "interest", reference: "23031202105312345678" },
  { id: genId(), name: "Betting", type: "Betting", amount: -20000, date: "Mar 11th, 20:03:07", status: "Successful", icon: "betting", reference: "23031120030798765432" },
  { id: genId(), name: "Transfer to OPEYEMI SULIAT ISRA...", type: "Transfer", amount: -5000, date: "Mar 11th, 19:45:21", status: "Successful", icon: "transfer", bank: "OPay", account: "701 980 3840", reference: "23031119452187654321" },
  { id: genId(), name: "Transfer to MARIAM OLUWAPELU...", type: "Transfer", amount: -1000, date: "Mar 11th, 19:36:28", status: "Successful", icon: "transfer", bank: "Moniepoint", account: "8076399304", reference: "23031119362876543210" },
  { id: genId(), name: "Stamp Duty", type: "Debit", amount: -50, date: "Mar 11th, 19:31:33", status: "Successful", icon: "stamp", reference: "23031119313365432109" },
  { id: genId(), name: "Transfer to IDOWU BABATUNDE", type: "Transfer", amount: -15000, date: "Mar 11th, 19:31:26", status: "Successful", icon: "transfer", bank: "Moniepoint", account: "5046737368", reference: "23031119312654321098" },
  { id: genId(), name: "Transfer from AWE MFB", type: "Credit", amount: 41000, date: "Mar 11th, 19:30:58", status: "Successful", icon: "add", bank: "AWE MFB", reference: "23031119305843210987" },
  { id: genId(), name: "Third-Party Merchant Order", type: "Debit", amount: -17600, date: "Mar 11th, 19:21:58", status: "Successful", icon: "merchant", reference: "23031119215832109876" },
];

const formatDate = () => {
  const now = new Date();
  const day = now.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? "st" : day === 2 || day === 22 ? "nd" : day === 3 || day === 23 ? "rd" : "th";
  return `${now.toLocaleDateString("en-US", { month: "short" })} ${day}${suffix}, ${now.toLocaleTimeString("en-GB", { hour12: false })}`;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(20.48);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addMoney = (amount: number) => {
    setBalance((prev) => prev + amount);
    const ref = genRef();
    setTransactions((prev) => [
      { id: genId(), name: "Add Money", type: "Credit", amount, date: formatDate(), status: "Successful", icon: "add", reference: ref },
      ...prev,
    ]);
  };

  const deductMoney = (amount: number, recipientName: string, bank?: string, account?: string, remark?: string) => {
    const ref = genRef();
    setBalance((prev) => prev - amount);
    setTransactions((prev) => [
      { id: genId(), name: recipientName, type: "Transfer", amount: -amount, date: formatDate(), status: "Successful", icon: "transfer", bank, account, reference: ref, remark },
      ...prev,
    ]);
    return ref;
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
