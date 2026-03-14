import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Bank {
  name: string;
  code: string;
}

const NIGERIAN_BANKS: Bank[] = [
  { name: "Access Bank", code: "044" },
  { name: "Citibank Nigeria", code: "023" },
  { name: "Ecobank Nigeria", code: "050" },
  { name: "Fidelity Bank", code: "070" },
  { name: "First Bank of Nigeria", code: "011" },
  { name: "First City Monument Bank", code: "214" },
  { name: "Globus Bank", code: "00103" },
  { name: "Guaranty Trust Bank", code: "058" },
  { name: "Heritage Bank", code: "030" },
  { name: "Jaiz Bank", code: "301" },
  { name: "Keystone Bank", code: "082" },
  { name: "Kuda Bank", code: "50211" },
  { name: "Moniepoint", code: "50515" },
  { name: "OPay", code: "999992" },
  { name: "PalmPay", code: "999991" },
  { name: "Parallex Bank", code: "104" },
  { name: "Polaris Bank", code: "076" },
  { name: "Providus Bank", code: "101" },
  { name: "Stanbic IBTC Bank", code: "221" },
  { name: "Standard Chartered Bank", code: "068" },
  { name: "Sterling Bank", code: "232" },
  { name: "SunTrust Bank", code: "100" },
  { name: "Titan Trust Bank", code: "102" },
  { name: "Union Bank of Nigeria", code: "032" },
  { name: "United Bank for Africa", code: "033" },
  { name: "Unity Bank", code: "215" },
  { name: "VFD Microfinance Bank", code: "566" },
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
];

const recentRecipients = [
  { name: "MARIAM OLUWAPELUMI ADEOSUN", account: "8076399304", bank: "MONIE POINT", bankCode: "50515" },
  { name: "IDOWU BABATUNDE", account: "5046737368", bank: "MONIE POINT", bankCode: "50515" },
  { name: "KAFILAT IJAOLA", account: "5492875326", bank: "MONIE POINT", bankCode: "50515" },
];

const Transfer = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"opay" | "bank">("bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankSearch, setBankSearch] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const [resolvedName, setResolvedName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");

  const filteredBanks = NIGERIAN_BANKS.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  const resolveAccount = useCallback(async (acctNo: string, bankCode: string) => {
    setResolving(true);
    setResolvedName("");
    setResolveError("");

    try {
      const { data, error } = await supabase.functions.invoke("resolve-account", {
        body: { account_number: acctNo, bank_code: bankCode },
      });

      if (error) {
        setResolveError("Could not verify account. Please check and try again.");
        return;
      }

      if (data?.account_name) {
        setResolvedName(data.account_name);
      } else if (data?.error) {
        setResolveError(data.error);
      }
    } catch {
      setResolveError("Network error. Please try again.");
    } finally {
      setResolving(false);
    }
  }, []);

  // Auto-resolve when account number is 10 digits and bank is selected
  useEffect(() => {
    const bankCode = tab === "opay" ? "999992" : selectedBank?.code;
    if (accountNumber.length === 10 && bankCode) {
      resolveAccount(accountNumber, bankCode);
    } else {
      setResolvedName("");
      setResolveError("");
    }
  }, [accountNumber, selectedBank, tab, resolveAccount]);

  const handleAccountChange = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 10);
    setAccountNumber(digits);
  };

  const handleProceed = () => {
    const bankName = tab === "opay" ? "OPay" : selectedBank?.name;
    if (resolvedName && bankName) {
      navigate("/transfer/amount", {
        state: { recipientName: resolvedName, bank: bankName, account: accountNumber },
      });
    }
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={22} className="text-foreground" />
          </button>
          <h1 className="font-semibold text-foreground text-lg">
            Transfer to {tab === "opay" ? "OPay Account" : "Bank Account"}
          </h1>
        </div>
        <button onClick={() => navigate("/transactions")} className="text-primary font-semibold text-sm italic">History</button>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-3 opay-gradient-light rounded-lg px-4 py-2.5">
        <p className="text-primary text-sm font-medium">
          {tab === "opay" ? "Instant, Zero Issues, Free" : `Free transfers for the day: 3`}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex mx-4 mt-4 bg-secondary rounded-lg p-1">
        <button
          onClick={() => { setTab("opay"); setSelectedBank(null); setResolvedName(""); setResolveError(""); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "opay" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          To OPay
        </button>
        <button
          onClick={() => { setTab("bank"); setResolvedName(""); setResolveError(""); }}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
            tab === "bank" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          To Bank
        </button>
      </div>

      {/* Form */}
      <div className="px-4 mt-5">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
          <h3 className="font-semibold text-foreground mb-4">Recipient Account</h3>

          <input
            type="tel"
            placeholder={tab === "opay" ? "Phone No./OPay Account No." : "Enter 10 digits Account Number"}
            value={accountNumber}
            onChange={(e) => handleAccountChange(e.target.value)}
            className="w-full bg-transparent border-b border-border py-3 text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />

          {tab === "bank" && (
            <div className="relative mt-1">
              <button
                onClick={() => setShowBankList(!showBankList)}
                className="w-full flex items-center justify-between py-3 border-b border-border"
              >
                <span className={`text-sm ${selectedBank ? "text-foreground" : "text-muted-foreground"}`}>
                  {selectedBank?.name || "Select Bank"}
                </span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </button>

              {showBankList && (
                <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-xl shadow-lg z-20 max-h-60 overflow-y-auto mt-1 animate-fade-in">
                  <div className="p-2 sticky top-0 bg-card border-b border-border">
                    <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
                      <Search size={14} className="text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search bank..."
                        value={bankSearch}
                        onChange={(e) => setBankSearch(e.target.value)}
                        className="flex-1 bg-transparent outline-none text-sm text-foreground"
                        autoFocus
                      />
                    </div>
                  </div>
                  {filteredBanks.map((bank) => (
                    <button
                      key={bank.code}
                      onClick={() => { setSelectedBank(bank); setShowBankList(false); setBankSearch(""); }}
                      className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-secondary transition-colors"
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resolving indicator */}
          {resolving && (
            <div className="mt-3 flex items-center gap-2 text-muted-foreground animate-fade-in">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Verifying account...</span>
            </div>
          )}

          {/* Resolved name */}
          {resolvedName && !resolving && (
            <div className="mt-3 p-3 opay-gradient-light rounded-lg animate-fade-in">
              <p className="text-sm font-semibold text-primary">{resolvedName}</p>
            </div>
          )}

          {/* Error */}
          {resolveError && !resolving && (
            <div className="mt-3 p-3 bg-destructive/10 rounded-lg animate-fade-in">
              <p className="text-sm text-destructive">{resolveError}</p>
            </div>
          )}

          <button
            onClick={handleProceed}
            disabled={!resolvedName || resolving || (tab === "bank" && !selectedBank)}
            className="w-full mt-5 py-3.5 rounded-full opay-gradient text-primary-foreground font-semibold disabled:opacity-40 transition-opacity"
          >
            Next
          </button>
        </div>
      </div>

      {/* Recents */}
      <div className="px-4 mt-5 flex-1 pb-6">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex gap-6 mb-4">
            <button className="text-primary text-sm font-semibold border-b-2 border-primary pb-1">Recents</button>
            <button className="text-muted-foreground text-sm font-medium pb-1">Favourites</button>
          </div>
          <div className="space-y-4">
            {recentRecipients.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setAccountNumber(r.account);
                  setResolvedName(r.name);
                  const bank = NIGERIAN_BANKS.find(b => b.code === r.bankCode);
                  if (bank) setSelectedBank(bank);
                }}
                className="w-full flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{r.bank[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.account} {r.bank}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
