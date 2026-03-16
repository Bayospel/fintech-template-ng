import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Loader2, CheckCircle, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import opayLogo from "@/assets/opay-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { isInstallable, install } = usePWAInstall();
  const [isSignUp, setIsSignUp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Paystack verification state (signup only)
  const [verifiedName, setVerifiedName] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");

  // Auto-verify OPay account when phone number reaches 10+ digits during signup
  const resolveOPayAccount = useCallback(async (acctNo: string) => {
    setVerifying(true);
    setVerifiedName("");
    setVerifyError("");
    try {
      const { data, error } = await supabase.functions.invoke("resolve-account", {
        body: { account_number: acctNo, bank_code: "999992" }, // OPay bank code
      });
      if (error) {
        setVerifyError("Could not verify OPay account. Check the number.");
        return;
      }
      if (data?.account_name) {
        setVerifiedName(data.account_name);
      } else {
        setVerifyError(data?.error || "No OPay account found with this number.");
      }
    } catch {
      setVerifyError("Network error. Please try again.");
    } finally {
      setVerifying(false);
    }
  }, []);

  useEffect(() => {
    if (!isSignUp) {
      setVerifiedName("");
      setVerifyError("");
      return;
    }
    const digits = phoneNumber.replace(/\D/g, "");
    if (digits.length >= 10) {
      const timer = setTimeout(() => resolveOPayAccount(digits.slice(0, 10)), 500);
      return () => clearTimeout(timer);
    } else {
      setVerifiedName("");
      setVerifyError("");
    }
  }, [phoneNumber, isSignUp, resolveOPayAccount]);

  const handleSubmit = async () => {
    setError("");
    if (!phoneNumber || !pin) {
      setError("Please fill in all fields");
      return;
    }
    if (pin.length < 4 || pin.length > 6) {
      setError("PIN must be 4-6 digits");
      return;
    }
    if (isSignUp && !verifiedName) {
      setError("Your OPay account must be verified first");
      return;
    }

    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(phoneNumber, pin, verifiedName);
      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    } else {
      const { error } = await signIn(phoneNumber, pin);
      if (error) {
        setError(error.message === "Invalid login credentials" ? "Wrong phone number or PIN" : error.message);
      } else {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex-1" />
        <button className="text-primary font-semibold text-sm">Help</button>
      </div>

      {/* Logo */}
      <div className="flex justify-center mt-8 mb-10">
        <div className="flex items-center gap-1.5">
          <img src={opayLogo} alt="OPay" className="w-10 h-10" />
          <span className="text-2xl font-bold text-foreground">Pay</span>
        </div>
      </div>

      <div className="px-6 flex-1">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          {isSignUp ? "Create your account" : "Log in to your account"}
        </h1>

        {/* Phone / OPay Account Number */}
        <div className="border-2 border-border rounded-lg p-3 mb-1 focus-within:border-primary relative">
          <label className="absolute -top-3 left-3 bg-background px-1 text-muted-foreground text-xs font-medium">
            {isSignUp ? "OPay Account Number" : "Phone Number"}
          </label>
          <div className="flex items-center">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
              className="flex-1 bg-transparent outline-none text-foreground text-base"
              placeholder={isSignUp ? "Enter your OPay number" : "0701 234 5678"}
            />
            {isSignUp && verifying && <Loader2 size={18} className="text-muted-foreground animate-spin" />}
            {isSignUp && verifiedName && !verifying && <CheckCircle size={18} className="text-primary" />}
          </div>
        </div>

        {/* Verification result (signup only) */}
        {isSignUp && (
          <div className="mb-4 min-h-[28px]">
            {verifiedName && (
              <div className="mt-1.5 px-3 py-2 opay-gradient-light rounded-lg animate-fade-in">
                <p className="text-sm font-semibold text-primary">{verifiedName}</p>
                <p className="text-[10px] text-primary/70 mt-0.5">This name will be your display name</p>
              </div>
            )}
            {verifyError && (
              <p className="text-destructive text-xs mt-1.5 px-1">{verifyError}</p>
            )}
          </div>
        )}

        {!isSignUp && <div className="mb-4" />}

        {/* PIN */}
        <div className="border-2 border-border rounded-lg p-3 mb-3 focus-within:border-primary relative">
          <label className="absolute -top-3 left-3 bg-background px-1 text-muted-foreground text-xs font-medium">
            PIN
          </label>
          <div className="flex items-center">
            <input
              type={showPin ? "text" : "password"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
              className="flex-1 bg-transparent outline-none text-foreground text-base tracking-[0.5em]"
              placeholder="••••"
              inputMode="numeric"
            />
            <button onClick={() => setShowPin(!showPin)} className="text-muted-foreground">
              {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            {isSignUp ? "Create a 4-6 digit PIN" : "4-6 digit PIN"}
          </p>
        </div>

        {error && <p className="text-destructive text-sm mb-3">{error}</p>}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!phoneNumber || !pin || loading || (isSignUp && !verifiedName)}
          className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          {loading ? "Please wait..." : isSignUp ? "CREATE ACCOUNT" : "LOG IN"}
        </button>
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {isSignUp ? "Already have an account? " : "Don't have an account yet? "}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setVerifiedName(""); setVerifyError(""); }} className="text-primary font-medium">
            {isSignUp ? "Log in" : "Create one"}
          </button>
        </p>

        {isInstallable && (
          <button
            onClick={install}
            className="w-full mt-4 py-3 rounded-full border-2 border-primary text-primary font-semibold text-sm flex items-center justify-center gap-2 transition-colors hover:bg-primary/5"
          >
            <Download size={16} /> Install App
          </button>
        )}
      </div>
    </div>
  );
};

export default Login;
