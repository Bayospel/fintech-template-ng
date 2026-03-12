import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

export interface Transaction {
  id: string;
  name: string;
  type: string;
  amount: number;
  date: string;
  status: string;
  icon: string;
  bank?: string;
  account?: string;
  reference: string;
  remark?: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  addMoney: (amount: number) => Promise<void>;
  deductMoney: (amount: number, recipientName: string, bank?: string, account?: string, remark?: string) => Promise<string>;
  refreshData: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

const genRef = () => `2303${Date.now().toString().slice(-16)}`;

const formatCreatedAt = (iso: string) => {
  const d = new Date(iso);
  const day = d.getDate();
  const suffix = [1, 21, 31].includes(day) ? "st" : [2, 22].includes(day) ? "nd" : [3, 23].includes(day) ? "rd" : "th";
  return `${d.toLocaleDateString("en-US", { month: "short" })} ${day}${suffix}, ${d.toLocaleTimeString("en-GB", { hour12: false })}`;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const [walletRes, txRes] = await Promise.all([
      supabase.from("wallets").select("balance").eq("user_id", user.id).single(),
      supabase.from("transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);

    if (walletRes.data) setBalance(Number(walletRes.data.balance));
    if (txRes.data) {
      setTransactions(
        txRes.data.map((t: any) => ({
          id: t.id,
          name: t.name,
          type: t.type,
          amount: Number(t.amount),
          date: formatCreatedAt(t.created_at),
          status: t.status,
          icon: t.icon,
          bank: t.bank,
          account: t.account,
          reference: t.reference,
          remark: t.remark,
        }))
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addMoney = async (amount: number) => {
    if (!user) return;
    const ref = genRef();

    await supabase.from("wallets").update({ balance: balance + amount }).eq("user_id", user.id);
    await supabase.from("transactions").insert({
      user_id: user.id,
      name: "Add Money",
      type: "Credit",
      amount,
      icon: "add",
      reference: ref,
    });

    await refreshData();
  };

  const deductMoney = async (amount: number, recipientName: string, bank?: string, account?: string, remark?: string) => {
    if (!user) return "";
    const ref = genRef();

    await supabase.from("wallets").update({ balance: balance - amount }).eq("user_id", user.id);
    await supabase.from("transactions").insert({
      user_id: user.id,
      name: recipientName,
      type: "Transfer",
      amount: -amount,
      icon: "transfer",
      bank,
      account,
      reference: ref,
      remark,
    });

    await refreshData();
    return ref;
  };

  return (
    <WalletContext.Provider value={{ balance, transactions, loading, addMoney, deductMoney, refreshData }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
};
