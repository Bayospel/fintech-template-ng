import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronRight, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface Bank {
  name: string;
  code: string;
}

const NIGERIAN_BANKS: Bank[] = [
  // Commercial Banks
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
  { name: "Wema Bank", code: "035" },
  { name: "Zenith Bank", code: "057" },
  // Microfinance / Digital Banks
  { name: "Kuda Bank", code: "50211" },
  { name: "Moniepoint", code: "50515" },
  { name: "VFD Microfinance Bank", code: "566" },
  { name: "Carbon", code: "565" },
  { name: "Rubies Microfinance Bank", code: "125" },
  { name: "Sparkle Microfinance Bank", code: "51310" },
  { name: "Mint Finex MFB", code: "50563" },
  { name: "Eyowo", code: "50126" },
  { name: "ALAT by Wema", code: "035A" },
  { name: "Fairmoney Microfinance Bank", code: "51318" },
  { name: "Branch International", code: "50322" },
  { name: "Renmoney Microfinance Bank", code: "51286" },
  { name: "AB Microfinance Bank", code: "51204" },
  { name: "Accion Microfinance Bank", code: "602" },
  { name: "Addosser Microfinance Bank", code: "51162" },
  { name: "Aella Credit", code: "50596" },
  { name: "Baobab Microfinance Bank", code: "50992" },
  { name: "Bowen Microfinance Bank", code: "50931" },
  { name: "CEMCS Microfinance Bank", code: "50823" },
  { name: "Coronation Merchant Bank", code: "559" },
  { name: "Dot Microfinance Bank", code: "50162" },
  { name: "e-Barcs Microfinance Bank", code: "50940" },
  { name: "Ekondo Microfinance Bank", code: "562" },
  { name: "Firmus MFB", code: "51314" },
  { name: "First Trust Mortgage Bank", code: "413" },
  { name: "FSDH Merchant Bank", code: "501" },
  { name: "Hackman Microfinance Bank", code: "51251" },
  { name: "Hasal Microfinance Bank", code: "50383" },
  { name: "Ibile Microfinance Bank", code: "51244" },
  { name: "Infinity MFB", code: "50457" },
  { name: "Lagos Building Investment Co.", code: "90052" },
  { name: "LAPO Microfinance Bank", code: "50549" },
  { name: "Living Trust Mortgage Bank", code: "031" },
  { name: "Lotus Bank", code: "303" },
  { name: "Mainstreet MFB", code: "51212" },
  { name: "Mkobo MFB", code: "50205" },
  { name: "Mutual Trust Microfinance Bank", code: "50304" },
  { name: "NPF Microfinance Bank", code: "552" },
  { name: "One Finance", code: "565" },
  { name: "Paga", code: "100002" },
  { name: "PalmPay", code: "999991" },
  { name: "Petra Microfinance Bank", code: "50746" },
  { name: "Rand Merchant Bank", code: "502" },
  { name: "SafeHaven Microfinance Bank", code: "51113" },
  { name: "Seed Capital Microfinance Bank", code: "51076" },
  { name: "TAJ Bank", code: "302" },
  { name: "TCF MFB", code: "51211" },
  { name: "Titan Paystack", code: "102" },
  { name: "Trustbanc J6 Microfinance Bank", code: "51284" },
  { name: "Unical Microfinance Bank", code: "50871" },
].sort((a, b) => a.name.localeCompare(b.name));

interface Recipient {
  name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
}

const Transfer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<"opay" | "bank">("bank");
  const [accountNumber, setAccountNumber] = useState("");
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [bankSearch, setBankSearch] = useState("");
  const [showBankList, setShowBankList] = useState(false);
  const [resolvedName, setResolvedName] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState("");
  const [recentRecipients, setRecentRecipients] = useState<Recipient[]>([]);

  // Load recent recipients from DB
  useEffect(() => {
    if (!user) return;
    supabase
      .from("recipients")
      .select("name, account_number, bank_name, bank_code")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setRecentRecipients(data);
      });
  }, [user]);

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
      } else {
        setResolveError(data?.error || "No account found with this number.");
      }
    } catch {
      setResolveError("Network error. Please try again.");
    } finally {
      setResolving(false);
    }
  }, []);

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
    const bankCode = tab === "opay" ? "999992" : selectedBank?.code;
    if (resolvedName && bankName && bankCode) {
      // Save recipient to DB (fire and forget)
      if (user) {
        supabase.from("recipients").upsert(
          {
            user_id: user.id,
            name: resolvedName,
            account_number: accountNumber,
            bank_name: bankName,
            bank_code: bankCode,
          },
          { onConflict: "user_id,account_number,bank_code" }
        ).then(() => {});
      }
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
                      key={bank.code + bank.name}
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

          {resolving && (
            <div className="mt-3 flex items-center gap-2 text-muted-foreground animate-fade-in">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Verifying account...</span>
            </div>
          )}

          {resolvedName && !resolving && (
            <div className="mt-3 p-3 opay-gradient-light rounded-lg animate-fade-in">
              <p className="text-sm font-semibold text-primary">{resolvedName}</p>
            </div>
          )}

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

      {/* Recents from DB */}
      <div className="px-4 mt-5 flex-1 pb-6">
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex gap-6 mb-4">
            <button className="text-primary text-sm font-semibold border-b-2 border-primary pb-1">Recents</button>
            <button className="text-muted-foreground text-sm font-medium pb-1">Favourites</button>
          </div>
          <div className="space-y-4">
            {recentRecipients.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">No recent recipients yet</p>
            )}
            {recentRecipients.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setAccountNumber(r.account_number);
                  setResolvedName(r.name);
                  const bank = NIGERIAN_BANKS.find(b => b.code === r.bank_code);
                  if (bank) setSelectedBank(bank);
                }}
                className="w-full flex items-center gap-3 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">{r.bank_name[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.account_number} • {r.bank_name}</p>
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
