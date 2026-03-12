import { TrendingUp, PiggyBank, BarChart3, ChevronRight, Shield, Wallet } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { useWallet } from "@/context/WalletContext";

const Finance = () => {
  const { balance } = useWallet();

  const products = [
    { icon: PiggyBank, title: "OWealth", desc: "Earn up to 15% annual interest", rate: "15% p.a.", value: "₦0.00" },
    { icon: Shield, title: "SafeBox", desc: "Lock funds for higher returns", rate: "Up to 20%", value: "₦0.00" },
    { icon: Wallet, title: "Flex Naira", desc: "Flexible savings with daily interest", rate: "10% p.a.", value: "₦0.00" },
  ];

  return (
    <div className="min-h-screen bg-secondary pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card px-4 pt-6 pb-5">
        <h1 className="text-xl font-bold text-foreground mb-4">Finance</h1>

        {/* Portfolio Card */}
        <div className="balance-card-gradient rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-primary-foreground/80 text-sm">Total Portfolio</span>
            <TrendingUp size={18} className="text-primary-foreground/60" />
          </div>
          <p className="text-3xl font-extrabold text-primary-foreground mb-1">
            ₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-xs text-primary-foreground/70">Total Interest Earned:</span>
            <span className="text-xs text-primary-foreground font-semibold">₦0.09</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-sm font-bold text-foreground">Interest: ₦0.09</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">All Time</span>
            </div>
            <p className="text-sm font-bold text-foreground">Interest: ₦0.09</p>
          </div>
        </div>
      </div>

      {/* Financial Products */}
      <div className="px-4 mt-5">
        <h3 className="font-bold text-foreground mb-3">Financial Products</h3>
        <div className="bg-card rounded-2xl overflow-hidden border border-border">
          {products.map((p, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-4 border-b border-border last:border-b-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <span className="text-[9px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{p.rate}</span>
                </div>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-foreground">{p.value}</p>
                <ChevronRight size={14} className="text-muted-foreground ml-auto" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 mt-5 mb-4">
        <div className="opay-gradient rounded-2xl p-4">
          <p className="text-primary-foreground font-bold text-sm mb-1">Start earning today!</p>
          <p className="text-primary-foreground/80 text-xs mb-3">Put your money to work with up to 20% annual returns.</p>
          <button className="bg-card text-foreground text-sm font-semibold px-5 py-2 rounded-full">Explore Products</button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Finance;
