import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye, EyeOff, Bell, ChevronRight, Send, Download,
  Phone, Wifi, Gamepad2, Zap, Globe, MoreHorizontal,
  Plus, ArrowUpRight
} from "lucide-react";
import BottomNav from "@/components/BottomNav";

const quickActions = [
  { icon: Send, label: "Transfer", color: "bg-primary/10 text-primary", path: "/transfer" },
  { icon: Download, label: "Withdraw", color: "bg-primary/10 text-primary" },
  { icon: Phone, label: "Airtime", color: "bg-primary/10 text-primary", badge: "Up to 6%" },
  { icon: Wifi, label: "Data", color: "bg-primary/10 text-primary", badge: "Up to 6%" },
  { icon: Gamepad2, label: "Betting", color: "bg-primary/10 text-primary" },
  { icon: Zap, label: "Electricity", color: "bg-primary/10 text-primary" },
  { icon: Globe, label: "Internet", color: "bg-primary/10 text-primary" },
  { icon: MoreHorizontal, label: "More", color: "bg-primary/10 text-primary" },
];

const transactions = [
  { name: "Adebayo Ogundimu", type: "Transfer", amount: -5000, date: "Mar 12, 10:30", status: "Successful" },
  { name: "OWealth Interest", type: "Credit", amount: 0.09, date: "Mar 12, 02:10", status: "Successful" },
  { name: "MTN Airtime", type: "Airtime", amount: -500, date: "Mar 11, 18:45", status: "Successful" },
  { name: "Betting Deposit", type: "Betting", amount: -20000, date: "Mar 11, 20:03", status: "Successful" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const balance = 245830.5;

  return (
    <div className="min-h-screen bg-secondary pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card px-4 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">B</span>
            </div>
            <span className="text-foreground font-semibold">Hi, Bayonle</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell size={22} className="text-foreground" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                37
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 mt-3">
        <div className="balance-card-gradient rounded-2xl p-5 text-primary-foreground">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-90">Available Balance</span>
              <button onClick={() => setShowBalance(!showBalance)}>
                {showBalance ? <Eye size={16} className="opacity-70" /> : <EyeOff size={16} className="opacity-70" />}
              </button>
            </div>
            <button className="text-sm underline opacity-90">Transaction History</button>
          </div>
          <p className="text-3xl font-bold mb-4">
            {showBalance ? `₦${balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}` : "₦****"}
            <ChevronRight size={18} className="inline ml-1 opacity-60" />
          </p>
          <div className="flex gap-3">
            <button className="flex-1 bg-primary-foreground/20 backdrop-blur-sm rounded-full py-2.5 text-sm font-medium flex items-center justify-center gap-1.5">
              <Plus size={16} /> Add Money
            </button>
            <button
              onClick={() => navigate("/transfer")}
              className="flex-1 bg-primary-foreground/20 backdrop-blur-sm rounded-full py-2.5 text-sm font-medium flex items-center justify-center gap-1.5"
            >
              <ArrowUpRight size={16} /> Transfer
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-5">
        <div className="bg-card rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => action.path && navigate(action.path)}
                className="flex flex-col items-center gap-1.5 relative"
              >
                {action.badge && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 bg-destructive text-destructive-foreground text-[8px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap z-10">
                    {action.badge}
                  </span>
                )}
                <div className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}>
                  <action.icon size={20} />
                </div>
                <span className="text-xs text-foreground font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="px-4 mt-5">
        <div className="bg-card rounded-2xl p-4">
          <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
          <div className="space-y-4">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
                    <Send size={14} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.name}</p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                    {tx.amount > 0 ? "+" : ""}₦{Math.abs(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                  </p>
                  <span className="text-[10px] text-primary font-medium">{tx.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
