import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, User } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const quickAmounts = [500, 1000, 2000, 5000, 9999, 10000];

const TransferAmount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, deductMoney } = useWallet();
  const { recipientName, bank, account } = (location.state as any) || {
    recipientName: "ADEBAYO OGUNDIMU",
    bank: "Moniepoint",
    account: "8076399304",
  };
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [remarkType, setRemarkType] = useState<"purchase" | "personal" | "">("");
  const [sending, setSending] = useState(false);

  const isOPay = bank === "OPay";
  const headerTitle = isOPay ? "Transfer to OPay Account" : `Transfer to Bank Account`;

  const handleSend = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setSending(true);
    const ref = await deductMoney(amt, recipientName, bank, account, remark || remarkType);
    setSending(false);
    navigate("/receipt", {
      state: {
        amount: amt,
        recipientName,
        bank,
        account,
        remark: remark || remarkType,
        reference: ref,
        date: new Date().toLocaleString("en-NG"),
      },
    });
  };

  const formatAccount = (acc: string) => {
    if (acc.length === 10) return `${acc.slice(0, 3)} ${acc.slice(3, 6)} ${acc.slice(6)}`;
    return acc;
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="font-semibold text-foreground text-base">{headerTitle}</h1>
        </div>
        <button onClick={() => navigate("/transactions")} className="text-primary font-semibold text-sm italic">
          Records
        </button>
      </div>

      <div className="flex-1 px-4 pt-5 pb-4 flex flex-col">
        {/* Recipient Info */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <User size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="font-bold text-foreground text-sm">{recipientName}</p>
            <p className="text-muted-foreground text-sm">{formatAccount(account)}</p>
          </div>
        </div>

        {/* Amount Section */}
        <div className="bg-card rounded-2xl border border-border p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-foreground text-sm">Amount</p>
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              No Transaction Fees
            </span>
          </div>

          <div className="flex items-center border-b border-border pb-4 mb-4">
            <span className="text-2xl font-bold text-foreground mr-1">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10.00 – 5,000,000.00"
              className="flex-1 text-xl text-foreground bg-transparent outline-none placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {quickAmounts.map((qa) => (
              <button
                key={qa}
                onClick={() => setAmount(qa.toString())}
                className="py-3 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                ₦{qa.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Remark Section */}
        <div className="bg-card rounded-2xl border border-border p-5">
          <p className="font-semibold text-foreground text-sm mb-3">Remark</p>
          <input
            type="text"
            placeholder="What's this for?(Optional)"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full bg-transparent border-b border-border pb-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none mb-4"
          />
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setRemarkType("purchase"); setRemark("Purchase"); }}
              className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                remarkType === "purchase" ? "border-primary text-primary bg-primary/5" : "border-border text-foreground hover:bg-secondary"
              }`}
            >
              Purchase
            </button>
            <button
              onClick={() => { setRemarkType("personal"); setRemark("Personal"); }}
              className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                remarkType === "personal" ? "border-primary text-primary bg-primary/5" : "border-border text-foreground hover:bg-secondary"
              }`}
            >
              Personal
            </button>
          </div>
        </div>

        <div className="flex-1" />

        {/* Confirm Button */}
        <div className="pt-4 pb-4">
          <button
            onClick={handleSend}
            disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance || sending}
            className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base disabled:opacity-40 transition-opacity"
          >
            {sending ? "Sending..." : "Confirm"}
          </button>
          {amount && parseFloat(amount) > balance && (
            <p className="text-center text-xs text-destructive mt-2">Insufficient balance</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransferAmount;
