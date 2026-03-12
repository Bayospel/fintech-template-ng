import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Share2, Download, Home, ArrowDownLeft } from "lucide-react";

const Receipt = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = (location.state as any) || {
    amount: 5000,
    recipientName: "ADEBAYO OGUNDIMU KOLAWOLE",
    bank: "Moniepoint",
    account: "8076399304",
    remark: "",
    reference: "23083102135398765432",
    date: new Date().toLocaleString("en-NG"),
    isCredit: false,
  };

  const isCredit = data.isCredit || false;

  const details = [
    { label: "Status", value: "SUCCESSFUL", highlight: true },
    { label: "Date/Time", value: data.date },
    { label: isCredit ? "From" : "Recipient", value: data.recipientName },
    ...(data.bank ? [{ label: isCredit ? "Source Bank" : "Recipient Bank", value: data.bank }] : []),
    ...(data.account && data.account !== "—" ? [{ label: "Account Number", value: data.account }] : []),
    { label: "Sender", value: "BAYONLE ADEYEMI" },
    { label: "OPay Number", value: "701 980 3840" },
    { label: "Transaction Ref", value: data.reference },
    ...(data.remark ? [{ label: "Remark", value: data.remark }] : []),
  ];

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto flex flex-col">
      {/* Header */}
      <div className="opay-gradient pt-12 pb-8 px-4 text-center rounded-b-3xl">
        {isCredit ? (
          <ArrowDownLeft size={56} className="text-primary-foreground mx-auto mb-3" strokeWidth={1.5} />
        ) : (
          <CheckCircle size={56} className="text-primary-foreground mx-auto mb-3" strokeWidth={1.5} />
        )}
        <p className="text-primary-foreground/80 text-sm mb-1">
          {isCredit ? "Money Received" : "Transfer Successful"}
        </p>
        <p className="text-4xl font-bold text-primary-foreground">
          {isCredit ? "+" : ""}₦{data.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
        </p>
      </div>

      {/* Details */}
      <div className="px-4 -mt-4 flex-1">
        <div className="bg-card rounded-2xl shadow-lg border border-border p-5">
          {details.map((d, i) => (
            <div key={i} className={`flex justify-between py-3 ${i < details.length - 1 ? "border-b border-border" : ""}`}>
              <span className="text-sm text-muted-foreground">{d.label}</span>
              <span className={`text-sm font-medium text-right max-w-[55%] break-all ${
                (d as any).highlight ? "text-primary font-bold" : "text-foreground"
              }`}>
                {d.value}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-4 px-2 leading-relaxed">
          OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.
        </p>
      </div>

      {/* Actions */}
      <div className="px-4 pb-8 pt-4">
        <div className="flex gap-3 mb-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-primary text-primary font-semibold text-sm">
            <Share2 size={16} /> Share Receipt
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full border border-primary text-primary font-semibold text-sm">
            <Download size={16} /> Download
          </button>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-3.5 rounded-full opay-gradient text-primary-foreground font-semibold flex items-center justify-center gap-2"
        >
          <Home size={16} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default Receipt;
