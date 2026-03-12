import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

const quickAmounts = [1000, 5000, 10000, 50000];

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

  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;
    setSending(true);
    const ref = await deductMoney(amt, recipientName, bank, account, remark);
    setSending(false);
    navigate("/receipt", {
      state: {
        amount: amt,
        recipientName,
        bank,
        account,
        remark,
        reference: ref,
        date: new Date().toLocaleString("en-NG"),
      },
    });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-foreground" />
        </button>
        <h1 className="font-semibold text-foreground text-lg">Enter Amount</h1>
      </div>

      <div className="px-4 mt-4">
        <div className="opay-gradient-light rounded-xl p-4">
          <p className="text-sm font-semibold text-primary">{recipientName}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{account} • {bank}</p>
        </div>
      </div>

      <div className="px-4 mt-6 flex-1">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-1">
            <span className="text-3xl font-bold text-foreground">₦</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="text-4xl font-bold text-foreground bg-transparent outline-none text-center w-48"
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Available: ₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="flex gap-2 justify-center mb-8">
          {quickAmounts.map((qa) => (
            <button
              key={qa}
              onClick={() => setAmount(qa.toString())}
              className="px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              ₦{qa.toLocaleString()}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Add a remark (optional)"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
      </div>

      <div className="px-4 pb-8">
        <button
          onClick={handleSend}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance || sending}
          className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          {sending ? "Sending..." : `Send ₦${amount ? parseFloat(amount).toLocaleString() : "0"}`}
        </button>
        {amount && parseFloat(amount) > balance && (
          <p className="text-center text-xs text-destructive mt-2">Insufficient balance</p>
        )}
      </div>
    </div>
  );
};

export default TransferAmount;
