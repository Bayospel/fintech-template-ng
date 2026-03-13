import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ArrowDownLeft, RefreshCw, Clock, Copy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import opayLogo from "@/assets/opay-logo.png";

const Receipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAuth();
  const data = (location.state as any) || {
    amount: 5000,
    recipientName: "OPEYEMI SULIAT ISRAEL",
    bank: "OPay",
    account: "701 980 3840",
    remark: "",
    reference: "23083102135398765432",
    date: new Date().toLocaleString("en-NG"),
    isCredit: false,
  };

  const isCredit = data.isCredit || false;
  const senderName = profile?.display_name?.toUpperCase() || "USER";
  const senderPhone = profile?.phone_number || "—";

  const copyRef = () => {
    navigator.clipboard.writeText(data.reference);
    toast.success("Reference copied!");
  };

  const details = [
    { label: "Recipient Details", value: `${data.recipientName}\n${data.bank} | ${data.account}` },
    { label: "Transaction No.", value: data.reference, copyable: true },
    { label: "Payment Method", value: "OWealth" },
    { label: "Transaction Date", value: data.date },
  ];

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-foreground">
            ←
          </button>
          <h1 className="font-semibold text-foreground text-base">Transaction Details</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-6">
        {/* Logo + Amount Card */}
        <div className="bg-card rounded-2xl border border-border p-6 mb-4">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <img src={opayLogo} alt="OPay" className="w-9 h-9" />
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mb-1">
            {isCredit ? `Received from ${data.recipientName}` : `Transfer to ${data.recipientName}`}
          </p>
          
          <p className="text-center text-3xl font-extrabold text-foreground mb-3">
            {isCredit ? "+" : ""}₦{data.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
          
          <div className="flex items-center justify-center gap-1.5">
            <CheckCircle size={16} className="text-primary" />
            <span className="text-primary font-semibold text-sm">Successful</span>
          </div>
        </div>

        {/* Transaction Details Card */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <h3 className="font-bold text-foreground text-sm mb-4">Transaction Details</h3>
          
          {details.map((d, i) => (
            <div key={i} className={`flex justify-between py-3 ${i < details.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-sm text-muted-foreground">{d.label}</span>
              <div className="flex items-center gap-1.5 text-right max-w-[55%]">
                <span className="text-sm font-medium text-foreground whitespace-pre-line text-right italic">
                  {d.value}
                </span>
                {d.copyable && (
                  <button onClick={copyRef}>
                    <Copy size={14} className="text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* More Actions Card */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-6">
          <h3 className="font-bold text-foreground text-sm mb-3">More Actions</h3>
          <div className="flex gap-6">
            <button onClick={() => navigate("/transfer")} className="flex items-center gap-2 text-primary text-sm font-medium">
              <RefreshCw size={16} /> Transfer Again
            </button>
            <button onClick={() => navigate("/transactions")} className="flex items-center gap-2 text-primary text-sm font-medium">
              <Clock size={16} /> View Records
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="px-4 pb-8 pt-2">
        <div className="flex gap-3">
          <button className="flex-1 py-3.5 rounded-full border border-destructive/30 text-destructive font-semibold text-sm">
            Report Issue
          </button>
          <button className="flex-1 py-3.5 rounded-full opay-gradient text-primary-foreground font-semibold text-sm">
            Share Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
