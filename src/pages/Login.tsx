import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    if (isSignUp) {
      const { error } = await signUp(email, password, displayName || email.split("@")[0]);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Account created! Check your email to confirm, then log in.");
        setIsSignUp(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
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
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">O</span>
          </div>
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
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-transparent outline-none text-foreground text-base"
              placeholder="Bayonle"
            />
          </div>
        )}

        <div className="border-2 border-border rounded-lg p-3 mb-4 focus-within:border-primary relative">
          <label className="absolute -top-3 left-3 bg-background px-1 text-muted-foreground text-xs font-medium">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent outline-none text-foreground text-base"
            placeholder="you@email.com"
          />
        </div>

        <div className="border-2 border-border rounded-lg p-3 mb-3 focus-within:border-primary relative">
          <label className="absolute -top-3 left-3 bg-background px-1 text-muted-foreground text-xs font-medium">
            Password
          </label>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent outline-none text-foreground text-base"
              placeholder="••••••••"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && <p className="text-destructive text-sm mb-3">{error}</p>}
        {success && <p className="text-primary text-sm mb-3">{success}</p>}

        {!isSignUp && (
          <p className="text-sm text-muted-foreground mb-2">
            Forgot password? <span className="text-primary font-medium cursor-pointer">Reset it</span>
          </p>
        )}
      </div>

      <div className="px-6 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!email || !password || loading}
          className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          {loading ? "Please wait..." : isSignUp ? "CREATE ACCOUNT" : "LOG IN"}
        </button>
        <p className="text-center mt-4 text-sm text-muted-foreground">
          {isSignUp ? "Already have an account? " : "Don't have an account yet? "}
          <button onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }} className="text-primary font-medium">
            {isSignUp ? "Log in" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
