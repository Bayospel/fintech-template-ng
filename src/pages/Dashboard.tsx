import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, ChevronRight, ArrowDownLeft,
  Plus, X, Gift, Users
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import DashboardHeader from "@/components/DashboardHeader";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import opayLogo from "@/assets/opay-logo.png";
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
      <DashboardHeader />

      {/* Balance Card */}
      <div className="px-4 mt-2">
        <div className="balance-card-gradient rounded-2xl overflow-hidden">
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <span className="text-primary-foreground text-sm font-medium flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-primary-foreground/30 flex items-center justify-center text-[10px]">🛡️</span>
                  Available Balance
                </span>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <Eye size={16} className="text-primary-foreground" /> : <EyeOff size={16} className="text-primary-foreground" />}
                </button>
              </div>
              <button onClick={() => navigate("/transactions")} className="text-primary-foreground text-sm underline underline-offset-2 flex items-center gap-0.5">
                Transaction History <ChevronRight size={13} className="inline" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[28px] font-extrabold text-primary-foreground tracking-tight">
                {showBalance ? `₦${balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "₦****"}
                <ChevronRight size={16} className="inline ml-0.5 opacity-60" />
              </p>
              <button onClick={() => setShowAddMoney(true)} className="bg-card text-primary text-sm font-semibold px-5 py-2 rounded-full border border-primary/20">
                + Add Money
              </button>
            </div>
          </div>
          <div className="bg-primary-foreground/10 px-5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary-foreground text-sm">
              <span>🏪</span>
              <span>Business Service - Today's Sales: <span className="font-bold text-primary-foreground">₦0.00</span></span>
            </div>
            <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <ChevronRight size={14} className="text-primary-foreground" />
            </div>
          </div>
        </div>
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
