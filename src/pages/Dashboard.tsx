import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight, ArrowDownLeft,
  Plus, X, Gift, Users, Eye, EyeOff
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import balanceCardImg from "@/assets/balance-card.jpg";

import transferShortcutsImg from "@/assets/transfer-shortcuts.jpg";
import quickActionsImg from "@/assets/quick-actions.jpg";

const quickActions = [
  { icon: "📱", label: "Airtime", badge: "Up to 6%" },
  { icon: "📶", label: "Data", badge: "Up to 6%" },
  { icon: "⚽", label: "Betting" },
  { icon: "📺", label: "TV" },
  { icon: "💰", label: "SafeBox" },
  { icon: "🤲", label: "Loan" },
  { icon: "📢", label: "Invitation" },
  { icon: "⋯", label: "More" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { balance, transactions, addMoney } = useWallet();
  const { profile } = useAuth();
  const displayName = profile?.display_name || "User";
  const [showBalance, setShowBalance] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleAddMoney = async () => {
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) return;
    setAddLoading(true);
    await addMoney(amt);
    setAddAmount("");
    setShowAddMoney(false);
    setAddLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "add": return <Plus size={16} className="text-primary" />;
      case "transfer": return <span className="text-base">↗</span>;
      default: return <span className="text-sm">💸</span>;
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20 max-w-md mx-auto relative">
      {/* Header */}
      <DashboardHeader />

      {/* Balance Card */}
      <div className="relative">
        <img src={balanceCardImg} alt="Available Balance" className="w-full" />
        {/* Clickable Add Money overlay */}
        <button
          onClick={() => setShowAddMoney(true)}
          className="absolute bottom-[28%] right-[4%] w-[35%] h-[22%] z-10"
          aria-label="Add Money"
        />
        {/* Clickable Transaction History overlay */}
        <button
          onClick={() => navigate("/transactions")}
          className="absolute top-[28%] right-[4%] w-[45%] h-[18%] z-10"
          aria-label="Transaction History"
        />
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="px-4 mt-3">
          <div className="bg-card rounded-2xl p-4">
            <div className="space-y-4">
              {transactions.slice(0, 3).map((tx) => (
                <button
                  key={tx.id}
                  onClick={() => navigate("/receipt", {
                    state: {
                      amount: Math.abs(tx.amount),
                      recipientName: tx.name,
                      bank: tx.bank || "OPay",
                      account: tx.account || "—",
                      remark: tx.remark || "",
                      reference: tx.reference,
                      date: tx.date,
                      isCredit: tx.amount > 0,
                    },
                  })}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      {getIcon(tx.icon)}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground truncate max-w-[160px]">{tx.name}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                      {tx.amount > 0 ? "+" : "-"}₦{Math.abs(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[10px] text-primary font-medium">{tx.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Transfer Shortcuts */}
      <div className="px-4 mt-3">
        <div className="bg-card rounded-2xl overflow-hidden relative">
          <img src={transferShortcutsImg} alt="Transfer shortcuts" className="w-full" />
          <div className="absolute inset-0 grid grid-cols-3">
            <button onClick={() => navigate("/transfer")} className="w-full h-full" aria-label="To OPay" />
            <button onClick={() => navigate("/transfer")} className="w-full h-full" aria-label="To Bank" />
            <button className="w-full h-full" aria-label="Withdraw" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-3">
        <div className="bg-card rounded-2xl overflow-hidden">
          <img src={quickActionsImg} alt="Quick actions" className="w-full" />
        </div>
      </div>

      {/* Saving Challenge */}
      <div className="px-4 mt-3">
        <div className="bg-gradient-to-br from-secondary to-opay-green-light rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Saving Challenge 2026</h3>
            <Gift size={24} className="text-primary" />
          </div>
          <div className="border-t border-dashed border-primary/30 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary text-sm">🎯</span></div>
              <div>
                <p className="text-sm font-bold text-foreground">Special Target</p>
                <p className="text-xs text-muted-foreground italic">Start small daily, finish big in 2026</p>
              </div>
            </div>
            <button className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full">Go</button>
          </div>
        </div>
      </div>

      {/* Share OPay */}
      <div className="px-4 mt-3 mb-4">
        <div className="bg-card rounded-2xl p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><Users size={20} className="text-primary" /></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-foreground">Share OPay with Others</p>
            <p className="text-xs text-muted-foreground">Help a loved one get their own account in minutes</p>
          </div>
          <button className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full">Go</button>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-end justify-center">
          <div className="bg-card w-full max-w-md rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Add Money</h2>
              <button onClick={() => setShowAddMoney(false)}><X size={22} className="text-muted-foreground" /></button>
            </div>
            <div className="text-center mb-4">
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-bold text-foreground">₦</span>
                <input type="number" value={addAmount} onChange={(e) => setAddAmount(e.target.value)} placeholder="0.00"
                  className="text-4xl font-bold text-foreground bg-transparent outline-none text-center w-44" autoFocus />
              </div>
            </div>
            <div className="flex gap-2 justify-center mb-6">
              {[500, 1000, 5000, 10000].map((amt) => (
                <button key={amt} onClick={() => setAddAmount(amt.toString())}
                  className="px-3 py-2 rounded-full border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors">
                  ₦{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <button onClick={handleAddMoney} disabled={!addAmount || parseFloat(addAmount) <= 0 || addLoading}
              className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold disabled:opacity-40 transition-opacity">
              {addLoading ? "Adding..." : `Add ₦${addAmount ? parseFloat(addAmount).toLocaleString() : "0"}`}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;
