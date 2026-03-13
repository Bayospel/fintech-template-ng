import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import opayLogo from "@/assets/opay-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (isSignUp && !username.trim()) {
      setError("Please enter a username");
      return;
    }

    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(phoneNumber, pin, username.trim());
      if (error) {
        setError(error.message);
      } else {
        navigate("/dashboard");
      }
    } else {
      const { error } = await signIn(phoneNumber, pin);
      if (error) {
        if (error.message === "Invalid login credentials") {
          setError("Wrong phone number or PIN");
        } else {
          setError(error.message);
        }
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

        {isSignUp && (
          <div className="border-2 border-border rounded-lg p-3 mb-4 focus-within:border-primary relative">
            <label className="absolute -top-3 left-3 bg-background px-1 text-muted-foreground text-xs font-medium">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent outline-none text-foreground text-base"
              placeholder="Enter your username"
            />
          </div>
        )}

        <div className="border-2 border-border rounded-lg p-3 mb-4 focus-within:border-primary relative">
          <label className="absolute -top-3 left-3 bg-background px-1 text-muted-foreground text-xs font-medium">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full bg-transparent outline-none text-foreground text-base"
            placeholder="0701 234 5678"
          />
        </div>

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
          <p className="text-[10px] text-muted-foreground mt-1">4-6 digit PIN</p>
        </div>

        {error && <p className="text-destructive text-sm mb-3">{error}</p>}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!phoneNumber || !pin || loading || (isSignUp && !username)}
          className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          {loading ? "Please wait..." : isSignUp ? "CREATE ACCOUNT" : "LOG IN"}
        </button>
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {isSignUp ? "Already have an account? " : "Don't have an account yet? "}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="text-primary font-medium">
            {isSignUp ? "Log in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
