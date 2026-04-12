import { useState, useEffect, useCallback } from "react";

const script = [
  "Valley Players Club. The Cash Partnership Investment Opportunity. The sweepstakes gaming platform with a local cash network.",
  "The problem: 40 percent of Americans are unbanked or underbanked. They cannot use credit or debit cards online. They are blocked from platforms like Chumba and LuckyLand. Cash deposits represent an impossible gap.",
  "Our solution: the Cash Partner Network. The player gives cash to the Cash Partner. The Cash Partner issues Gold Coins to the player. When the player wins, they redeem for cash. Result: zero percent chargeback risk for VPC.",
  "Unit Economics. Per twenty dollar player deposit. Player deposits twenty dollars. Stripe takes eighty eight cents. VPC revenue is nineteen dollars and twelve cents. House edge plus consumables adds five dollars and seventy two cents. VPC net profit is twenty dollars and twenty five cents. One hundred and one percent net margin.",
  "The Deal: One Founding Cash Partner. Your investment: two thousand five hundred dollars. Your equity: two and a half percent. Cash partnership rate: ten percent flat. Guaranteed return: double in six months. You are the only cash partner with this rate.",
  "Why this deal is unique. You are the first and only cash partner, setting the standard for all future partners. Your ten percent flat rate is locked forever, while future partners pay fifteen to twenty percent. You get double your return in six months, founder backed. You receive two and a half percent equity for long term alignment with VPC's success.",
  "Your role: Cash Partner Node. You enable players to deposit and withdraw cash in your area. Earn ten percent flat take on all cash through your node. No chargeback risk because cash is physical. Scale as platform grows.",
  "Traction. Platform fully built and operational. Dual currency model legally vetted. Secured cash partner architecture. Ready to launch.",
  "Let's talk. Join as Founding Cash Partner. getfarmsense email. Phone: plus one, seven one nine, four nine zero, nine two two eight. Scan the QR code for the full one-pager.",
];

const slides = [
  { bg: "from-violet-950 via-slate-900 to-indigo-950", badge: "WELCOME", title: "Valley Players Club", sub: "Cash Partnership", tag: "Sweepstakes Gaming Platform" },

  { bg: "from-rose-950 via-slate-900 to-orange-950", badge: "THE PROBLEM", title: "40%", sub: "of Americans are unbanked or underbanked", list: ["Cannot use credit or debit cards online", "Blocked from Chumba & LuckyLand", "No cash deposit option exists"] },

  { bg: "from-emerald-950 via-slate-900 to-teal-950", badge: "OUR SOLUTION", title: "Cash Partner Network", flow: true },

  { bg: "from-amber-950 via-slate-900 to-yellow-950", badge: "UNIT ECONOMICS", title: "$20.25", sub: "profit per $20 deposit", big: "101% NET MARGIN", table: [
    {r:"Player deposits",     v:"$20.00",   us:"You",     col:"text-rose-300"},
    {r:"Stripe fee",          v:"−$0.88",   us:"Stripe",  col:"text-white/40"},
    {r:"VPC gross revenue",   v:"$19.12",   us:"VPC",     col:"text-cyan-300"},
    {r:"House edge",          v:"+$5.72",   us:"VPC",     col:"text-cyan-300"},
    {r:"YOUR 10% take",       v:"$2.50",    us:"You",     col:"text-green-400", h:true},
    {r:"VPC net profit",      v:"$17.75",   us:"VPC",     col:"text-cyan-300",  h:true},
  ]},

  { bg: "from-cyan-950 via-slate-900 to-blue-950", badge: "YOUR DEAL", title: "2.5% + 10% + 2×", sub: "In addition to your ownership stake, you earn 10% of every dollar that flows through your node — guaranteed.", caps: [
    {l:"Investment",  v:"$2,500"},
    {l:"Equity",     v:"2.5%"},
    {l:"Your Take",  v:"10%"},
    {l:"Guarantee",  v:"2× / 6mo"},
  ]},

  { bg: "from-fuchsia-950 via-slate-900 to-purple-950", badge: "YOUR EDGE", title: "First Partner Gets The Most", list: [
    "You are the ONLY cash partner at 10% flat rate — locked forever",
    "Future partners pay 15–20% take rate",
    "2× your investment back in just 6 months",
    "2.5% equity keeps you aligned with VPC's long-term success",
  ]},

  { bg: "from-sky-950 via-slate-900 to-indigo-950", badge: "YOUR ROLE", title: "Cash Partner Node", list: [
    "Deposit & redeem cash for players in your area",
    "Earn 10% flat take on ALL cash that passes through your node",
    "VPC handles the platform — you handle the local cash flow",
    "No chargeback risk because cash is physical money",
  ]},

  { bg: "from-green-950 via-slate-900 to-emerald-950", badge: "TRACTION", title: "Ready to Launch", list: [
    "Platform fully built & operational",
    "Dual currency model legally vetted",
    "Secured cash partner architecture",
    "Wyoming LLC formation in progress",
  ]},

  { bg: "from-pink-950 via-slate-900 to-rose-950", badge: "CONTACT", title: "Let's Talk", contact: true },
];

export default function VPCDeck() {
  const [cur, setCur] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(() => {
    stopSpeech();
    const utt = new SpeechSynthesisUtterance(script[cur]);
    utt.rate = 0.85;
    utt.onend = () => { setSpeaking(false); setCur(c => (c + 1) % slides.length); };
    utt.onstart = () => setSpeaking(true);
    window.speechSynthesis.speak(utt);
  }, [cur, stopSpeech]);

  useEffect(() => { stopSpeech(); return () => stopSpeech(); }, [cur]);

  const go = useCallback((dir) => { stopSpeech(); setCur(c => (c + dir + slides.length) % slides.length); }, [stopSpeech]);

  const s = slides[cur];
  const NAV_H = 60;
  const DOTS_H = 32;
  const PROG_H = 4;
  const SLIDE_H = `calc(100dvh - ${NAV_H}px - ${DOTS_H}px - ${PROG_H}px)`;

  return (
    <div className="flex flex-col bg-black text-white" style={{height:"100dvh",overflow:"hidden"}}>
      {/* Progress */}
      <div className="flex-none" style={{height:PROG_H}}>
        <div className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-300" style={{width:`${((cur+1)/slides.length)*100}%`}}/>
      </div>

      {/* Slide */}
      <div
        className={`flex-1 flex flex-col justify-center items-center overflow-hidden p-4 bg-gradient-to-br ${s.bg}`}
        style={{height:SLIDE_H,maxHeight:SLIDE_H}}
      >
        {s.badge && <span className="text-xs font-bold tracking-widest text-white/40 mb-2 uppercase">{s.badge}</span>}

        {/* Big stat + table */}
        {s.big && (
          <div className="text-center w-full max-w-xs mx-auto flex flex-col items-center">
            <p className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 leading-none">{s.title}</p>
            <p className="text-white/50 text-xs sm:text-sm mt-1">{s.sub}</p>
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 mt-2 mb-2">
              <span className="text-lg sm:text-2xl font-black text-yellow-300">{s.big}</span>
            </div>
            <table className="w-full max-w-xs text-left"><tbody>
              {s.table.map(r=>(
                <tr key={r.r} className={`border-b border-white/5 ${r.h?"bg-green-900/10":""}`}>
                  <td className={`py-1.5 pr-3 text-xs sm:text-sm ${r.col}`}>{r.r}</td>
                  <td className={`py-1.5 text-right text-xs sm:text-sm font-medium ${r.col}`}>{r.v}</td>
                  <td className={`py-1.5 text-right text-xs font-bold ${r.col}`}>{r.us}</td>
                </tr>
              ))}
            </tbody></table>
          </div>
        )}

        {/* Title only */}
        {s.title && !s.big && !s.caps && !s.flow && !s.list && !s.contact && (
          <div className="text-center">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">{s.title}</h1>
            {s.sub && <p className="text-white/50 text-xs sm:text-base mt-2">{s.sub}</p>}
            {s.tag && <span className="inline-block mt-4 text-xs font-bold tracking-widest text-white/30 uppercase">{s.tag}</span>}
          </div>
        )}

        {/* Flow */}
        {s.flow && (
          <div className="w-full max-w-xs mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-center mb-3 leading-tight">Cash Partner Network</h2>
            <p className="text-white/40 text-xs text-center mb-3">How cash flows through the system</p>
            <div className="flex flex-col gap-1.5">
              {[["Player","Gives Cash","👤"],["You","Issue Gold Coins","🏪"],["Player Wins","Redeem Cash","🎰"],["You Earn","10% Take","💰"]].map(([a,b,c])=>(
                <div key={a} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-lg px-3 py-2">
                  <span className="text-xl flex-none">{c}</span>
                  <div><p className="text-white/30 text-xs font-bold uppercase">{a}</p><p className="text-white font-semibold text-xs sm:text-sm">{b}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Caps grid */}
        {s.caps && (
          <div className="w-full max-w-xs mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-black leading-tight mb-1">{s.title}</h2>
            {s.sub && <p className="text-white/50 text-xs mb-3 leading-relaxed">{s.sub}</p>}
            <div className="grid grid-cols-2 gap-1.5">
              {s.caps.map(c=><div key={c.l} className="bg-white/5 border border-white/10 rounded-xl p-2.5"><p className="text-white/30 text-xs font-bold uppercase mb-0.5">{c.l}</p><p className="text-xl sm:text-2xl font-black text-green-400">{c.v}</p></div>)}
            </div>
          </div>
        )}

        {/* List */}
        {s.list && !s.caps && (
          <div className="w-full max-w-xs mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-3">{s.title}</h2>
            <div className="flex flex-col gap-1.5">
              {s.list.map((l,i)=><div key={i} className="flex items-start gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"><span className="text-green-400 text-sm flex-none mt-0.5">✓</span><p className="text-white/80 text-xs sm:text-sm leading-snug">{l}</p></div>)}
            </div>
          </div>
        )}

        {/* Contact */}
        {s.contact && (
          <div className="w-full max-w-xs mx-auto text-center">
            <h2 className="text-3xl sm:text-5xl font-black leading-none mb-3">{s.title}</h2>
            <div className="flex flex-col gap-1.5 mb-3">
              <a href="mailto:getfarmsense@gmail.com" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white/80 hover:bg-white/10 text-xs sm:text-sm"><span>📧</span><span className="font-medium break-all">getfarmsense@gmail.com</span></a>
              <a href="tel:+17194909228" className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-white/80 hover:bg-white/10 text-xs sm:text-sm"><span>📞</span><span className="font-medium">+1 (719) 490-9228</span></a>
              <div className="flex justify-center"><img src="/VPC-Cash-Partner-Investment.pdf" alt="QR" className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-xl p-1.5"/></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <a href="/VPC-Cash-Partner-Investment.pdf" download className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2.5 sm:py-3 rounded-xl text-sm shadow-lg shadow-green-500/20">📄 Download One-Pager PDF</a>
              <a href="/vpc-deck" className="w-full bg-white/10 border border-white/20 text-white font-bold py-2.5 sm:py-3 rounded-xl text-sm text-center">🖥 Open Slide Deck</a>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex-none flex items-center justify-between p-3 bg-black/90 backdrop-blur-xl border-t border-white/5" style={{height:NAV_H}}>
        <button onClick={()=>go(-1)} className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white text-lg font-bold active:scale-90 transition touch-manipulation">‹</button>
        <button onClick={speaking?stopSpeech:speak} className={`flex-1 mx-2 h-11 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition touch-manipulation ${speaking?"bg-rose-500/20 border border-rose-500/40 text-rose-300":"bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25"}`}>
          {speaking?"⏹ Stop":"🔊 Play Audio"}
        </button>
        <button onClick={()=>go(1)} className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white text-lg font-bold active:scale-90 transition touch-manipulation">›</button>
      </div>

      {/* Dots */}
      <div className="flex-none flex justify-center gap-1.5 p-2 bg-black/50" style={{height:DOTS_H}}>
        {slides.map((_,i)=><button key={i} onClick={()=>{stopSpeech();setCur(i)}} className={`rounded-full transition-all touch-manipulation ${i===cur?"w-5 h-2 bg-cyan-400":"w-2 h-2 bg-white/20"}`}/>)}
      </div>
    </div>
  );
}
