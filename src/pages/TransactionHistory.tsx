import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, ChevronDown, ArrowUpRight, ArrowDownLeft, Gamepad2, FileText, Percent } from "lucide-react";
import opayLogo from "@/assets/opay-logo.png";
import { useWallet, Transaction } from "@/context/WalletContext";

const getIconForTx = (tx: Transaction) => {
  if (tx.icon === "interest") return <Percent size={16} className="text-primary" />;
  if (tx.icon === "betting") return <Gamepad2 size={16} className="text-primary" />;
  if (tx.icon === "merchant" || tx.icon === "stamp") return <FileText size={16} className="text-primary" />;
  if (tx.amount > 0) return <ArrowDownLeft size={16} className="text-primary" />;
  return <ArrowUpRight size={16} className="text-primary" />;
};

const TransactionHistory = () => {
  const navigate = useNavigate();
  const { transactions } = useWallet();

  const totalIn = transactions.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = transactions.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  const handleTxClick = (tx: Transaction) => {
    navigate("/receipt", {
      state: {
        amount: Math.abs(tx.amount),
        recipientName: tx.name,
        bank: tx.bank || "OPay",
        account: tx.account || "—",
        remark: tx.remark || "",
        reference: tx.reference,
        date: tx.date,
        isCredit: tx.amount > 0,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="font-semibold text-foreground text-lg">Transactions</h1>
        </div>
        <button className="text-primary font-semibold text-sm">Download</button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 px-4 mt-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-sm font-medium text-foreground">
          All Categories <ChevronDown size={14} />
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full border border-border text-sm font-medium text-foreground">
          All Status <ChevronDown size={14} />
        </button>
      </div>

      {/* SMS Alert Banner */}
      <div className="px-4 mt-3">
        <div className="opay-gradient rounded-2xl p-4">
          <p className="text-primary-foreground font-bold text-sm">No transaction alerts?</p>
          <p className="text-primary-foreground/80 text-xs mt-1">
            <span className="font-semibold text-primary-foreground">Activate SMS alerts</span> to get instant notifications for every transaction – incoming or outgoing
          </p>
          <button className="mt-3 bg-foreground text-card text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-1">
            Activate Now →
          </button>
        </div>
      </div>

      {/* Month Summary */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-bold text-foreground">Mar 2026</h2>
            <ChevronDown size={16} className="text-foreground" />
          </div>
          <button className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full">
            Analysis
          </button>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            In: <span className="text-primary font-semibold">₦{totalIn.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
          </span>
          <span className="text-muted-foreground italic">
            Out: <span className="text-foreground font-semibold">₦{totalOut.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
          </span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-4 mt-4 flex-1 pb-8">
        <div className="space-y-0">
          {transactions.map((tx) => (
            <button
              key={tx.id}
              onClick={() => handleTxClick(tx)}
              className="w-full flex items-center justify-between py-4 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-opay-green-light flex items-center justify-center shrink-0">
                  {getIconForTx(tx)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground truncate max-w-[180px]">{tx.name}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                  {tx.amount > 0 ? "+" : "-"}₦{Math.abs(tx.amount).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                </p>
                <span className="text-[10px] text-primary font-medium">{tx.status}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
