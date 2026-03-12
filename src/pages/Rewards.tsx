import { Heart, Gift, Star, Trophy, ChevronRight, Ticket } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const rewards = [
  { icon: Gift, title: "Daily Check-in", desc: "Check in daily to earn rewards", points: "+10 pts", color: "bg-primary/10 text-primary" },
  { icon: Star, title: "First Transfer Bonus", desc: "Make your first transfer today", points: "+50 pts", color: "bg-primary/10 text-primary" },
  { icon: Trophy, title: "Savings Challenge", desc: "Save ₦1,000 this week", points: "+100 pts", color: "bg-primary/10 text-primary" },
  { icon: Ticket, title: "Invite Friends", desc: "Earn up to ₦6,300 per referral", points: "+200 pts", color: "bg-primary/10 text-primary" },
];

const Rewards = () => {
  return (
    <div className="min-h-screen bg-secondary pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="opay-gradient px-4 pt-6 pb-8 rounded-b-3xl">
        <h1 className="text-xl font-bold text-primary-foreground mb-1">Rewards</h1>
        <p className="text-primary-foreground/80 text-sm mb-5">Earn points on every transaction</p>

        <div className="bg-primary-foreground/15 backdrop-blur-sm rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-primary-foreground/80 text-sm">Total Points</span>
            <Heart size={18} className="text-primary-foreground/60" />
          </div>
          <p className="text-3xl font-extrabold text-primary-foreground">1,250</p>
          <p className="text-xs text-primary-foreground/70 mt-1">≈ ₦125.00 value</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-xl p-3 text-center shadow-sm border border-border">
            <p className="text-lg font-bold text-foreground">7</p>
            <p className="text-[10px] text-muted-foreground">Day Streak</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center shadow-sm border border-border">
            <p className="text-lg font-bold text-foreground">12</p>
            <p className="text-[10px] text-muted-foreground">Tasks Done</p>
          </div>
          <div className="bg-card rounded-xl p-3 text-center shadow-sm border border-border">
            <p className="text-lg font-bold text-primary">Silver</p>
            <p className="text-[10px] text-muted-foreground">Your Tier</p>
          </div>
        </div>
      </div>

      {/* Available Rewards */}
      <div className="px-4 mt-5">
        <h3 className="font-bold text-foreground mb-3">Earn More Points</h3>
        <div className="bg-card rounded-2xl overflow-hidden border border-border">
          {rewards.map((r, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-4 border-b border-border last:border-b-0">
              <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center shrink-0`}>
                <r.icon size={18} />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
              <span className="text-xs font-bold text-primary shrink-0">{r.points}</span>
              <ChevronRight size={14} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Redeem Section */}
      <div className="px-4 mt-5 mb-4">
        <div className="opay-gradient-light rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-foreground">Redeem Points</p>
            <p className="text-xs text-muted-foreground">Convert points to cash or vouchers</p>
          </div>
          <button className="bg-primary text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full">Redeem</button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Rewards;
