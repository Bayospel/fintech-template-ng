import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, User, X, Shield, Delete } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const quickAmounts = [500, 1000, 2000, 5000, 9999, 10000];

import transferSuccessImg from "@/assets/transfer-success.jpg";

type Step = "amount" | "reminder" | "summary" | "pin" | "processing" | "success";

const TransferAmount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { balance, deductMoney } = useWallet();
  const { user } = useAuth();
  const { recipientName, bank, account } = (location.state as any) || {
    recipientName: "ADEBAYO OGUNDIMU",
    bank: "Moniepoint",
    account: "8076399304",
  };
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [remarkType, setRemarkType] = useState<"purchase" | "personal" | "">("");
  const [step, setStep] = useState<Step>("amount");
  const [pin, setPin] = useState("");
  const [hasPin, setHasPin] = useState(false);
  const [pinError, setPinError] = useState("");

  const isOPay = bank === "OPay";
  const headerTitle = isOPay ? "Transfer to OPay Account" : "Transfer to Bank Account";
  const amt = parseFloat(amount) || 0;

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

  const handleConfirm = () => {
    if (!amt || amt <= 0 || amt > balance) return;
    setStep("reminder");
  };

  const handleContinueFromReminder = () => setStep("summary");

  const handlePay = () => {
    if (!hasPin) {
      setPinError("Please set a payment PIN in your profile first");
      return;
    }
    setStep("pin");
  };

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) {
        verifyAndSend(newPin);
      }
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
    setPinError("");
  };

  const verifyAndSend = async (enteredPin: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("payment_pin")
      .eq("user_id", user.id)
      .single();

    if (!data || (data as any).payment_pin !== enteredPin) {
      setPinError("Incorrect PIN. Try again.");
      setPin("");
      return;
    }

    setStep("processing");
    const ref = await deductMoney(amt, recipientName, bank, account, remark || remarkType);

    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  const formatAccount = (acc: string) => {
    if (acc.length === 10) return `${acc.slice(0, 3)} ${acc.slice(3, 6)} ${acc.slice(6)}`;
    return acc;
  };

  // Step: Success
  if (step === "success") {
    return (
      <div className="min-h-screen bg-secondary max-w-md mx-auto flex flex-col">
        <div className="relative">
          <img src={transferSuccessImg} alt="Transfer successful" className="w-full" />
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-4 right-4 text-primary font-bold text-base z-10"
          >
            Done
          </button>
        </div>
        <div className="px-4 py-4">
          <button
            onClick={() => navigate("/receipt", { state: { amount: amt, recipientName, bank, account, remark: remark || remarkType, reference: `${Date.now()}`, date: new Date().toLocaleString("en-NG"), isCredit: false } })}
            className="w-full py-4 rounded-full border-2 border-primary text-primary font-semibold text-base"
          >
            View Details
          </button>
        </div>
      </div>
    );
  }

  // Step: Processing
  if (step === "processing") {
    return (
      <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col items-center justify-center px-8">
        <div className="w-20 h-20 rounded-full border-4 border-border border-t-primary animate-spin mb-8" />
        <p className="text-xl font-bold text-foreground text-center italic mb-3">
          Transaction is currently being processed
        </p>
        <p className="text-primary text-center italic text-sm">
          Please do not close this page until the process is complete
        </p>
      </div>
    );
  }

  // Step: PIN entry
  if (step === "pin") {
    return (
      <div className="min-h-screen bg-foreground/90 max-w-md mx-auto flex flex-col">
        <div className="flex-1" />
        <div className="bg-card rounded-t-3xl pt-6 pb-4">
          <div className="flex items-center justify-between px-5 mb-6">
            <span className="text-lg font-bold text-foreground italic">Enter Payment Pin</span>
            <button onClick={() => { setStep("summary"); setPin(""); setPinError(""); }}>
              <X size={22} className="text-muted-foreground" />
            </button>
          </div>

          {/* PIN dots */}
          <div className="flex justify-center gap-4 mb-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold ${
                  pin.length > i
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-muted text-transparent"
                }`}
              >
                {pin.length > i ? "●" : ""}
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm italic mb-2">Enter Payment Pin</p>
          {pinError && <p className="text-center text-destructive text-xs mb-2">{pinError}</p>}

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield size={16} className="text-primary" />
            <span className="text-sm text-primary italic">OPay Secure Numeric Keypad</span>
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 border-t border-border">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handlePinInput(n.toString())}
                className="py-5 text-center text-2xl font-bold text-foreground border-b border-r border-border active:bg-muted transition-colors italic"
              >
                {n}
              </button>
            ))}
            <div className="py-5" />
            <button
              onClick={() => handlePinInput("0")}
              className="py-5 text-center text-2xl font-bold text-foreground border-b border-r border-border active:bg-muted transition-colors italic"
            >
              0
            </button>
            <button
              onClick={handlePinDelete}
              className="py-5 flex items-center justify-center border-b border-border active:bg-muted transition-colors"
            >
              <Delete size={24} className="text-foreground" />
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full italic">
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
                className={`py-3 rounded-xl border text-sm font-medium transition-colors ${
                  amount === qa.toString()
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-foreground hover:bg-secondary"
                }`}
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
            placeholder="What's this for? (Optional)"
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
            onClick={handleConfirm}
            disabled={!amount || amt <= 0 || amt > balance}
            className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base disabled:opacity-40 transition-opacity"
          >
            Confirm
          </button>
          {amount && amt > balance && (
            <p className="text-center text-xs text-destructive mt-2">Insufficient balance</p>
          )}
        </div>
      </div>

      {/* STEP 1: Reminder Dialog */}
      {step === "reminder" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50">
          <div className="bg-card w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom">
            <div className="flex justify-end mb-2">
              <button onClick={() => setStep("amount")}>
                <X size={22} className="text-muted-foreground" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-foreground text-center mb-3">Reminder</h2>
            <p className="text-muted-foreground text-center text-sm mb-6">
              Double check the transfer details before you proceed. Please note that successful transfers cannot be reversed.
            </p>

            <div className="bg-secondary rounded-2xl p-5 mb-6">
              <h3 className="font-bold text-foreground text-sm mb-4">Transaction Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="text-sm font-bold text-foreground">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Account No.</span>
                  <span className="text-sm font-bold text-foreground">{account}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Bank</span>
                  <span className="text-sm font-bold text-foreground">{bank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-sm font-bold text-foreground">₦{amt.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("amount")}
                className="flex-1 py-4 rounded-full border border-primary text-primary font-semibold text-base bg-primary/5"
              >
                Recheck
              </button>
              <button
                onClick={handleContinueFromReminder}
                className="flex-1 py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Payment Summary */}
      {step === "summary" && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/50">
          <div className="bg-card w-full max-w-md rounded-t-3xl p-6 animate-in slide-in-from-bottom">
            <div className="flex justify-start mb-4">
              <button onClick={() => setStep("reminder")}>
                <X size={22} className="text-muted-foreground" />
              </button>
            </div>

            <p className="text-3xl font-extrabold text-foreground text-center mb-6">
              ₦{amt.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Account Number</span>
                <span className="text-sm font-medium text-foreground">{formatAccount(account)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Name</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                    <User size={12} className="text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{recipientName}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Amount</span>
                <span className="text-sm font-bold text-foreground">₦{amt.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-foreground">Payment Method</span>
                <span className="text-xs text-muted-foreground">All &gt;</span>
              </div>
              <div className="flex items-center gap-3 p-3 border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-xs">O</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">OPay Account</p>
                  <p className="text-xs text-muted-foreground">Balance: ₦{balance.toLocaleString("en-NG", { minimumFractionDigits: 2 })}</p>
                </div>
                <span className="text-primary text-lg">✓</span>
              </div>
            </div>

            {pinError && <p className="text-center text-destructive text-xs mb-3">{pinError}</p>}

            <button
              onClick={handlePay}
              className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base"
            >
              Pay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferAmount;
