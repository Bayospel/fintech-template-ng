import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Bell, ChevronRight, Send, Building2, ArrowDownLeft,
  Phone, Wifi, Gamepad2, Tv, Shield, Banknote, Megaphone, MoreHorizontal,
  Plus, X, Gift, Users
} from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useWallet } from "@/context/WalletContext";

const quickActions = [
  { icon: Phone, label: "Airtime", badge: "Up to 6%" },
  { icon: Wifi, label: "Data", badge: "Up to 6%" },
  { icon: Gamepad2, label: "Betting" },
  { icon: Tv, label: "TV" },
  { icon: Shield, label: "SafeBox" },
  { icon: Banknote, label: "Loan" },
  { icon: Megaphone, label: "Invitation" },
  { icon: MoreHorizontal, label: "More" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { balance, transactions, addMoney } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  const handleAddMoney = () => {
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) return;
    addMoney(amt);
    setAddAmount("");
    setShowAddMoney(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "interest": return <span className="text-base">%</span>;
      case "betting": return <Gamepad2 size={16} className="text-primary" />;
      case "add": return <Plus size={16} className="text-primary" />;
      case "transfer": return <Send size={16} className="text-primary" />;
      default: return <Send size={14} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-secondary pb-20 max-w-md mx-auto relative">
      {/* Header */}
      <div className="bg-card px-4 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-foreground/80 flex items-center justify-center relative">
              <span className="text-card text-xs font-bold">B</span>
              <span className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground border-2 border-card">3</span>
            </div>
            <span className="text-foreground font-semibold text-base">Hi, Bayonle</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <span className="text-xs font-bold text-destructive absolute -top-2 left-1/2 -translate-x-1/2 bg-destructive/10 rounded-sm px-1">HELP</span>
              <span className="text-lg">🎧</span>
            </div>
            <span className="text-lg">📷</span>
            <button className="relative">
              <Bell size={22} className="text-foreground" />
              <span className="absolute -top-1.5 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">37</span>
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 mt-2">
        <div className="balance-card-gradient rounded-2xl overflow-hidden">
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between mb-0.5">
              <div className="flex items-center gap-2">
                <span className="text-primary-foreground/90 text-sm font-medium flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-primary-foreground/30 flex items-center justify-center text-[8px]">✓</span>
                  Available Balance
                </span>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <Eye size={15} className="text-primary-foreground/70" /> : <EyeOff size={15} className="text-primary-foreground/70" />}
                </button>
              </div>
              <button className="text-primary-foreground/90 text-sm underline">
                Transaction History <ChevronRight size={12} className="inline" />
              </button>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-3xl font-extrabold text-primary-foreground tracking-tight">
                {showBalance ? `₦${balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "₦****"}
                <ChevronRight size={16} className="inline ml-0.5 opacity-60" />
              </p>
              <button onClick={() => setShowAddMoney(true)} className="bg-card text-foreground text-sm font-semibold px-4 py-2 rounded-full">
                + Add Money
              </button>
            </div>
          </div>
          <div className="bg-primary-foreground/10 px-5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary-foreground/90 text-sm">
              <Building2 size={14} />
              <span>Business Service - Today's Sales: <span className="font-semibold">₦0.00</span></span>
            </div>
            <ChevronRight size={14} className="text-primary-foreground/60" />
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mt-3">
        <div className="bg-card rounded-2xl p-4">
          <div className="space-y-4">
            {transactions.slice(0, 3).map((tx, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                    {getIcon(tx.icon)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.name}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                    {tx.amount > 0 ? "+" : "-"}₦{Math.abs(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-primary font-medium">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transfer Shortcuts */}
      <div className="px-4 mt-3">
        <div className="bg-card rounded-2xl p-4">
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => navigate("/transfer")} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"><Send size={20} className="text-primary" /></div>
              <span className="text-xs font-medium text-foreground">To OPay</span>
            </button>
            <button onClick={() => navigate("/transfer")} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"><Building2 size={20} className="text-primary" /></div>
              <span className="text-xs font-medium text-foreground">To Bank</span>
            </button>
            <button className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center"><ArrowDownLeft size={20} className="text-primary" /></div>
              <span className="text-xs font-medium text-foreground">Withdraw</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-3">
        <div className="bg-card rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-y-5 gap-x-2">
            {quickActions.map((action) => (
              <button key={action.label} className="flex flex-col items-center gap-1.5 relative">
                {action.badge && (
                  <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-[7px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap z-10">{action.badge}</span>
                )}
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center"><action.icon size={20} className="text-primary" /></div>
                <span className="text-[11px] text-foreground font-medium">{action.label}</span>
              </button>
            ))}
          </div>
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
            <button onClick={handleAddMoney} disabled={!addAmount || parseFloat(addAmount) <= 0}
              className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold disabled:opacity-40 transition-opacity">
              Add ₦{addAmount ? parseFloat(addAmount).toLocaleString() : "0"}
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Dashboard;
