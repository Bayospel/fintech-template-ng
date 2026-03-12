import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Settings, ChevronRight, Shield, MessageCircle, Megaphone,
  FileText, Gauge, CreditCard, Briefcase, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: FileText, label: "Transaction History", desc: "", path: "" },
  { icon: Gauge, label: "Account Limits", desc: "View your transaction limits" },
  { icon: CreditCard, label: "Bank Card/Account", desc: "1 linked card/account" },
  { icon: Briefcase, label: "My BizPayment", desc: "Receive payment for business", badge: "Fast TFR" },
  { icon: Users, label: "OJunior", desc: "Create an account for your child/ward", badge: "New" },
];

const bottomMenuItems = [
  { icon: Shield, label: "Security Center", desc: "Protect your funds" },
  { icon: MessageCircle, label: "Customer Service Center", desc: "" },
  { icon: Megaphone, label: "Invitation", desc: "Invite friends and earn up to ₦6,300 Bonus" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { balance } = useWallet();
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="min-h-screen bg-secondary pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-foreground/80 flex items-center justify-center relative">
              <span className="text-card font-bold text-lg">B</span>
              <span className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground border-2 border-card">3</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Hi, Bayonle</p>
              <span className="text-xs bg-primary/15 text-primary font-semibold px-2 py-0.5 rounded-full">⭐ Tier 3</span>
            </div>
          </div>
          <button>
            <Settings size={22} className="text-foreground" />
          </button>
        </div>

        {/* Balance */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground">Total Balance</span>
            <button onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={14} className="text-muted-foreground" /> : <EyeOff size={14} className="text-muted-foreground" />}
            </button>
          </div>
          <p className="text-4xl font-extrabold text-foreground tracking-tight">
            {showBalance ? (
              <>₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</>
            ) : (
              "₦****"
            )}
          </p>
          <div className="mt-2 inline-block bg-secondary rounded-full px-3 py-1">
            <span className="text-xs text-muted-foreground">Interest Credited Today </span>
            <span className="text-xs text-primary font-semibold">+₦0.09</span>
          </div>
        </div>
      </div>

      {/* Safety Tips Banner */}
      <div className="px-4 mt-3">
        <div className="opay-gradient rounded-xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <div>
              <p className="text-primary-foreground font-bold text-sm">7 Safety Tips</p>
              <p className="text-primary-foreground/80 text-xs">Make your account more secure.</p>
            </div>
          </div>
          <button className="bg-card text-foreground text-xs font-semibold px-4 py-1.5 rounded-full">View</button>
        </div>
      </div>

      {/* Main Menu */}
      <div className="px-4 mt-3">
        <div className="bg-card rounded-2xl overflow-hidden">
          {menuItems.map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-4 border-b border-border last:border-b-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      item.badge === "New" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Menu */}
      <div className="px-4 mt-3 mb-4">
        <div className="bg-card rounded-2xl overflow-hidden">
          {bottomMenuItems.map((item, i) => (
            <button key={i} className="w-full flex items-center gap-3 px-4 py-4 border-b border-border last:border-b-0">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon size={18} className="text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
