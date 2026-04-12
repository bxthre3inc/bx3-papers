"use client";
import { useState, useEffect } from "react";

const TOTAL_SHARES = 1000000;
const FOUNDER_SHARES = 500100;
const AVAILABLE_SHARES = TOTAL_SHARES - FOUNDER_SHARES;
const PRICE_PER_SHARE = 10;

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  state: string;
  numShares: string;
  paymentMethod: "stripe" | "ach" | "cashapp";
  agreeTerms: boolean;
}

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function SharePurchaseFlow() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    fullName: "", email: "", phone: "", state: "", numShares: "", paymentMethod: "stripe", agreeTerms: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [purchased, setPurchased] = useState(false);
  const [ownedShares, setOwnedShares] = useState(0);

  const numSharesNum = parseInt(form.numShares || "0");
  const subtotal = numSharesNum * PRICE_PER_SHARE;
  const stripeFee = form.paymentMethod === "stripe" ? parseFloat((subtotal * 0.029 + 0.30).toFixed(2)) : 0;
  const achFee = form.paymentMethod === "ach" ? 25 : 0;
  const cashappFee = form.paymentMethod === "cashapp" ? 0 : 0;
  const total = subtotal + stripeFee + achFee + cashappFee;
  const owns1pct = numSharesNum >= 10000;

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.phone.match(/^\+?[\d\s-]{10,}/)) e.phone = "Valid phone required";
    if (!form.state) e.state = "Required";
    const n = parseInt(form.numShares || "0");
    if (n < 10) e.numShares = "Minimum 10 shares ($100)";
    if (n > 10000) e.numShares = "Max 10,000 shares without approval";
    if (!form.agreeTerms) e.agreeTerms = true as any;
    return e;
  }

  function handleNext() {
    if (step === 1) {
      const e = validate();
      if (Object.keys(e).length) { setErrors(e); return; }
      setErrors({});
    }
    if (step < 4) setStep(step + 1);
    else {
      setPurchased(true);
      setOwnedShares(numSharesNum);
    }
  }

  if (purchased) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-900 to-black text-white flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-sm w-full text-center border border-green-500">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">Purchase Complete!</h2>
          <p className="text-green-300 mb-4">{ownedShares.toLocaleString()} shares issued to you.</p>
          <p className="text-sm text-white/60 mb-6">Your share certificate and contract have been sent to your email.</p>
          <a href="/vpc-deck" className="inline-block bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl w-full">
            View Investment Deck
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-purple-900 text-white">
      {/* Ticker */}
      <div className="bg-black/80 border-b border-purple-500 px-4 py-2">
        <div className="flex items-center gap-2 text-xs font-mono overflow-hidden">
          <span className="text-purple-400 shrink-0">VPC SHARES</span>
          <div className="animate-marquee whitespace-nowrap flex gap-6 text-white/80">
            <span>AVAILABLE: <span className="text-green-400">{AVAILABLE_SHARES.toLocaleString()}</span></span>
            <span>FOUNDER RESERVE: <span className="text-yellow-400">{FOUNDER_SHARES.toLocaleString()}</span></span>
            <span>PRICE: <span className="text-cyan-400">${PRICE_PER_SHARE}/share</span></span>
            <span>CASH PARTNERSHIP: <span className="text-pink-400">1%+ ownership required</span></span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-3 bg-black/40">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-purple-500" : "bg-white/10"}`} />
        ))}
      </div>

      <div className="max-w-md mx-auto p-4">
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-purple-300">Step 1: Choose Shares</h2>
            <div className="bg-white/5 rounded-xl p-4 border border-purple-500">
              <div className="text-3xl font-black text-cyan-400 mb-1">{AVAILABLE_SHARES.toLocaleString()}</div>
              <div className="text-sm text-white/60">shares available of 1,000,000 total</div>
              <div className="mt-2 text-xs text-yellow-400">Founder holds 500,100 (50.01%)</div>
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Number of Shares</label>
              <input type="number" min="10" max="10000" value={form.numShares} onChange={e => setForm({...form, numShares: e.target.value})}
                className="w-full bg-white/10 border border-purple-500 rounded-xl px-4 py-3 text-white text-lg" placeholder="min 10" />
              {errors.numShares && <p className="text-red-400 text-xs mt-1">{errors.numShares}</p>}
              <div className="mt-2 text-sm text-white/60">= <span className="text-cyan-400 font-bold">${(parseInt(form.numShares||"0") * PRICE_PER_SHARE).toLocaleString()}</span></div>
              {owns1pct && <div className="mt-2 bg-green-500/20 border border-green-500 rounded-lg p-3 text-sm"><span className="text-green-400 font-bold">⭐ 1%+ ownership!</span> You qualify for Cash Partnership (10% flat take rate)</div>}
            </div>
            <div className="bg-white/5 rounded-xl p-4 space-y-1 text-sm">
              <div className="text-white/60">Share Price</div>
              <div className="text-2xl font-black text-white">${PRICE_PER_SHARE}<span className="text-sm font-normal text-white/60">/share</span></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-purple-300">Step 2: Your Information</h2>
            <div>
              <label className="block text-sm text-white/60 mb-1">Full Legal Name</label>
              <input type="text" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})}
                className="w-full bg-white/10 border border-purple-500 rounded-xl px-4 py-3 text-white" placeholder="As it appears on ID" />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/10 border border-purple-500 rounded-xl px-4 py-3 text-white" placeholder="email@example.com" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">Phone</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full bg-white/10 border border-purple-500 rounded-xl px-4 py-3 text-white" placeholder="+1 (555) 000-0000" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm text-white/60 mb-1">State of Residence</label>
              <select value={form.state} onChange={e => setForm({...form, state: e.target.value})}
                className="w-full bg-white/10 border border-purple-500 rounded-xl px-4 py-3 text-white">
                <option value="">Select state</option>
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {errors.state && <p className="text-red-400 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-purple-300">Step 3: Payment Method</h2>
            <p className="text-sm text-white/60">Purchaser covers all processing fees</p>
            {[
              { id: "stripe", label: "Credit/Debit Card (Stripe)", sub: `+${(subtotal * 0.029 + 0.30).toFixed(2)} fee (2.9% + $0.30)`, emoji: "💳" },
              { id: "ach", label: "ACH Bank Transfer", sub: "+$25 flat fee", emoji: "🏦" },
              { id: "cashapp", label: "CashApp", sub: "No fee — fastest", emoji: "💵" },
            ].map(opt => (
              <button key={opt.id} onClick={() => setForm({...form, paymentMethod: opt.id as any})}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${form.paymentMethod === opt.id ? "border-purple-500 bg-purple-500/20" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{opt.emoji}</span>
                  <div>
                    <div className="font-bold">{opt.label}</div>
                    <div className="text-sm text-white/60">{opt.sub}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-purple-300">Step 4: Review & Sign</h2>
            <div className="bg-white/5 rounded-xl p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-white/60">Shares</span><span>{numSharesNum.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-white/60">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-white/60">Processing Fee ({form.paymentMethod})</span><span className="text-yellow-400">+${(stripeFee + achFee).toFixed(2)}</span></div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-lg">
                <span>Total</span><span className="text-cyan-400">${total.toFixed(2)}</span>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-3 mt-2">
                <div className="text-xs text-purple-300 mb-1">Ownership after purchase</div>
                <div className="text-xl font-black text-purple-300">{((numSharesNum / TOTAL_SHARES) * 100).toFixed(4)}%</div>
                {owns1pct && <div className="text-xs text-green-400 mt-1">⭐ Qualifies for Cash Partnership — 10% flat take rate</div>}
              </div>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300">
              By purchasing, you acknowledge the risks of early-stage investing and agree to the VPC Share Purchase Agreement.
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={form.agreeTerms} onChange={e => setForm({...form, agreeTerms: e.target.checked})}
                className="mt-1 w-5 h-5 accent-purple-500" />
              <span className="text-sm text-white/80">I have read and agree to the <a href="/SHARE_PURCHASE_CONTRACT.pdf" className="underline text-purple-400">Share Purchase Agreement</a> and acknowledge all risks.</span>
            </label>
            {errors.agreeTerms && <p className="text-red-400 text-xs">You must agree to continue.</p>}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-6">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl transition-all text-lg">
              Back
            </button>
          )}
          <button onClick={handleNext}
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all text-lg">
            {step === 4 ? `Pay $${total.toFixed(2)}` : step === 3 ? "Review Order" : "Continue"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
      `}</style>
    </div>
  );
}
