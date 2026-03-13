import { Headset, Scan, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const DashboardHeader = () => {
  const { profile } = useAuth();
  const displayName = profile?.display_name || "User";
  const tier = profile?.tier || 1;

  return (
    <div className="bg-card px-4 pt-3 pb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-foreground/80 flex items-center justify-center relative">
            <span className="text-card text-xs font-bold">{displayName[0]?.toUpperCase()}</span>
            <span className="absolute -bottom-0.5 -left-0.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground border-2 border-card">
              {tier}
            </span>
          </div>
          <span className="text-foreground font-semibold text-base">Hi, {displayName}</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Help icon */}
          <button className="relative">
            <Headset size={24} className="text-foreground" />
            <span className="absolute -top-2.5 -right-3 bg-destructive/20 text-destructive text-[8px] font-bold px-1.5 py-0.5 rounded-full">
              HELP
            </span>
          </button>
          {/* Scan icon */}
          <button>
            <Scan size={24} className="text-foreground" />
          </button>
          {/* Notification bell */}
          <button className="relative">
            <Bell size={24} className="text-foreground" />
            <span className="absolute -top-1.5 -right-2.5 min-w-[20px] h-5 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center px-1">
              38
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
