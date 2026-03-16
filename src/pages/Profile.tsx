import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Settings, ChevronRight, Shield, MessageCircle, Megaphone,
  FileText, Gauge, CreditCard, Briefcase, Users, LogOut, Lock, X, Delete } from "lucide-react";
import { useState, useEffect } from "react";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const menuItems = [
  { icon: FileText, label: "Transaction History", desc: "", path: "/transactions" },
  { icon: Gauge, label: "Account Limits", desc: "View your transaction limits" },
  { icon: CreditCard, label: "Bank Card/Account", desc: "1 linked card/account" },
  { icon: Briefcase, label: "My BizPayment", desc: "Receive payment for business", badge: "Fast TFR" },
  { icon: Users, label: "OJunior", desc: "Create an account for your child/ward", badge: "New" },
];

const bottomMenuItems = [
  { icon: Lock, label: "Payment PIN", desc: "Set or change your payment PIN", action: "pin" },
  { icon: Shield, label: "Security Center", desc: "Protect your funds" },
  { icon: MessageCircle, label: "Customer Service Center", desc: "" },
  { icon: Megaphone, label: "Invitation", desc: "Invite friends and earn up to ₦6,300 Bonus" },
];

const Profile = () => {
  const navigate = useNavigate();
  const { balance } = useWallet();
  const { profile, signOut } = useAuth();
  const displayName = profile?.display_name || "User";
  const tier = profile?.tier || 1;
  const [showBalance, setShowBalance] = useState(true);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinStep, setPinStep] = useState<"enter" | "confirm">("enter");
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    const checkPin = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("payment_pin")
        .eq("user_id", user.id)
        .single();
      if (data && (data as any).payment_pin) setHasPin(true);
    };
    checkPin();
  }, [user]);

  const handlePinDigit = (digit: string) => {
    if (pinStep === "enter") {
      if (newPin.length < 4) setNewPin(newPin + digit);
    } else {
      if (confirmPin.length < 4) {
        const next = confirmPin + digit;
        setConfirmPin(next);
        if (next.length === 4) {
          if (next === newPin) {
            savePin(next);
          } else {
            toast.error("PINs don't match. Try again.");
            setNewPin("");
            setConfirmPin("");
            setPinStep("enter");
          }
        }
      }
    }
  };

  const handlePinDelete = () => {
    if (pinStep === "enter") setNewPin(newPin.slice(0, -1));
    else setConfirmPin(confirmPin.slice(0, -1));
  };

  const savePin = async (pinValue: string) => {
    if (!user) return;
    await supabase.from("profiles").update({ payment_pin: pinValue } as any).eq("user_id", user.id);
    setHasPin(true);
    setShowPinSetup(false);
    setNewPin("");
    setConfirmPin("");
    setPinStep("enter");
    toast.success("Payment PIN set successfully!");
  };

  const handleNextPin = () => {
    if (newPin.length === 4) setPinStep("confirm");
  };

  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-secondary pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="bg-card px-4 pt-4 pb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-foreground/80 flex items-center justify-center relative">
              <span className="text-card font-bold text-lg">{displayName[0]?.toUpperCase()}</span>
              <span className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground border-2 border-card">{tier}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">Hi, {displayName}</p>
              <span className="text-xs bg-primary/15 text-primary font-semibold px-2 py-0.5 rounded-full">⭐ Tier {tier}</span>
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
            <button key={i} onClick={() => item.path && navigate(item.path)} className="w-full flex items-center gap-3 px-4 py-4 border-b border-border last:border-b-0">
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

      {/* Sign Out */}
      <div className="px-4 mt-3 mb-4">
        <button
          onClick={async () => { await signOut(); navigate("/login"); }}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-destructive text-destructive font-semibold text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
