import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"phone" | "pin">("phone");
  const [showPin, setShowPin] = useState(false);

  const handleNext = () => {
    if (step === "phone" && phone.length >= 10) {
      setStep("pin");
    } else if (step === "pin" && pin.length === 6) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4">
        {step === "pin" && (
          <button onClick={() => setStep("phone")} className="text-foreground text-xl">←</button>
        )}
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

      {/* Content */}
      <div className="px-6 flex-1">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          {step === "phone" ? "Log in to your account" : "Enter your PIN"}
        </h1>

        {step === "phone" ? (
          <>
            <div className="border-2 border-primary rounded-lg p-3 relative">
              <label className="absolute -top-3 left-3 bg-background px-1 text-primary text-xs font-medium">
                Enter your Mobile No./Email
              </label>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-medium text-sm">+234</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="flex-1 bg-transparent outline-none text-foreground text-base"
                  placeholder="8012345678"
                  autoFocus
                />
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Lost Your Mobile Number, <span className="text-primary font-medium cursor-pointer">Change Now</span>
            </p>
          </>
        ) : (
          <>
            <div className="flex gap-3 justify-center mb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-lg border-2 flex items-center justify-center text-xl font-bold ${
                    i < pin.length ? "border-primary bg-opay-green-light" : "border-border"
                  }`}
                >
                  {pin[i] ? (showPin ? pin[i] : "●") : ""}
                </div>
              ))}
            </div>
            <input
              type="number"
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, 6))}
              className="opacity-0 absolute"
              autoFocus
            />
            <div className="flex justify-between items-center">
              <button onClick={() => setShowPin(!showPin)} className="text-muted-foreground">
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              <button className="text-primary text-sm font-medium">Forgot PIN?</button>
            </div>
          </>
        )}
      </div>

      {/* Bottom */}
      <div className="px-6 pb-8">
        <button
          onClick={handleNext}
          disabled={(step === "phone" && phone.length < 10) || (step === "pin" && pin.length < 6)}
          className="w-full py-4 rounded-full opay-gradient text-primary-foreground font-semibold text-base disabled:opacity-40 transition-opacity"
        >
          {step === "phone" ? "NEXT" : "LOG IN"}
        </button>
        {step === "phone" && (
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Don't have an OPay Account yet?{" "}
            <span className="text-primary font-medium cursor-pointer">Click here to get one</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
