import { useState, useEffect, useCallback } from "react";

const script = [
  "Welcome to Valley Players Club. The Cash Partnership Investment Opportunity.",
  "Over 40 percent of Americans are unbanked or underbanked. Traditional gaming platforms exclude them entirely. Valley Players Club opens the door.",
  "Valley Players Club is a sweepstakes gaming platform with a proprietary cash in person network. While competitors like Chumba and LuckyLand can only serve banked players, VPC enables cash deposits and payouts through a network of cash partners.",
  "Here is how unit economics work. When a player deposits twenty dollars, the platform nets nineteen twelve after Stripe fees. After average gameplay, payouts, and promos, the platform generates nineteen dollars and eighty two cents in net profit per twenty dollar deposit. That's a ninety nine percent profit margin.",
  "The cash partnership model is the revenue engine. When a player deposits or redeems cash through a cash partner, that partner earns a ten percent flat take on every dollar that flows through their node. The platform keeps the rest. Cash partners do not share in equity. Equity and cash partnership are separate tracks.",
  "The math speaks for itself. At just one hundred players depositing twenty dollars monthly, the cash partner node generates three thousand six hundred dollars in annual take. At one thousand players, that scales to thirty six thousand dollars per year.",
  "The opportunity right now is equity. Shares are available at ten dollars each with a minimum purchase of five shares. Fifty point zero one percent of the company is already sold. That leaves forty nine point nine nine percent available to investors like you.",
  "To learn more, schedule a call or purchase shares directly through the portal below.",
];

const scenes = [
  { title: "Valley Players Club", sub: "The Cash Partnership Investment", bg: "from-violet-900 via-purple-900 to-black", accent: "text-violet-400" },
  { title: "40%", sub: "of Americans are unbanked or underbanked — locked out of traditional gaming platforms", bg: "from-rose-900 via-pink-900 to-black", accent: "text-rose-400" },
  { title: "The Platform", sub: "Sweepstakes gaming + cash-in-person network — the moat competitors can't replicate", bg: "from-emerald-900 via-teal-900 to-black", accent: "text-emerald-400" },
  { title: "$19.82", sub: "net profit per $20 deposited (99.1% margin)", bg: "from-amber-900 via-orange-900 to-black", accent: "text-amber-400" },
  { title: "Cash Partnership Model", sub: "Earn 10% flat take on all cash flows through your node", bg: "from-cyan-900 via-blue-900 to-black", accent: "text-cyan-400" },
  { title: "Cash Partner Earnings", sub: "100 players = $3,600/yr | 1,000 players = $36,000/yr", bg: "from-fuchsia-900 via-purple-900 to-black", accent: "text-fuchsia-400" },
  { title: "49.99%", sub: "shares available at $10/share — min 5 shares", bg: "from-sky-900 via-blue-900 to-black", accent: "text-sky-400" },
  { title: "Your Partnership", sub: "Schedule a call or purchase shares below", bg: "from-indigo-900 via-purple-900 to-black", accent: "text-indigo-400" },
];

export default function Deck() {
  const [scene, setScene] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [done, setDone] = useState(false);

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1;
    setSpeaking(true);
    u.onend = () => { setSpeaking(false); };
    u.onerror = () => { setSpeaking(false); };
    window.speechSynthesis.speak(u);
  }, []);

  useEffect(() => {
    const s = scenes[scene];
    speak(script[scene]);
  }, [scene, speak]);

  const advance = () => {
    if (scene < scenes.length - 1) setScene(scene + 1);
    else setDone(true);
  };

  const back = () => { if (scene > 0) setScene(scene - 1); };

  const toggleSpeech = () => {
    if (!window.speechSynthesis) return;
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); }
    else speak(script[scene]);
  };

  if (done) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-violet-900 via-black to-black text-white flex flex-col" style={{ height: "100dvh" }}>
        <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 overflow-hidden">
          <div className="text-center">
            <div className="text-4xl mb-2">CC</div>
            <h1 className="text-3xl font-black mb-2">Valley Players Club</h1>
            <p className="text-white/60">Your partnership starts here</p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <a href="/shares" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black py-4 px-6 rounded-2xl text-center text-lg shadow-2xl shadow-purple-500/40">Purchase Shares</a>
            <a href="https://calendly.com" target="_blank" className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-6 rounded-2xl text-center text-lg border border-white/20">Schedule a Call</a>
            <a href="/projects/valleyplayersclub" className="bg-white/5 hover:bg-white/10 text-white/60 font-bold py-3 px-6 rounded-xl text-center text-sm">Back to Overview</a>
          </div>
        </div>
      </div>
    );
  }

  const s = scenes[scene];
  const pct = Math.round(((scene + 1) / scenes.length) * 100);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-violet-900 via-black to-black text-white flex flex-col overflow-hidden" style={{ height: "100dvh" }}>
      <div className="bg-black/80 border-b border-white/10 px-4 py-2 shrink-0">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-violet-400 shrink-0 font-bold">VPC</span>
          <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-violet-500 transition-all" style={{ width: `${pct}%` }} /></div>
          <span className="text-white/40 shrink-0">{scene + 1}/{scenes.length}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="text-center max-w-lg w-full">
          <div className={`text-6xl sm:text-7xl md:text-8xl font-black ${s.accent} mb-4`}>{s.title}</div>
          <div className="text-base sm:text-lg md:text-xl text-white/70 leading-relaxed">{s.sub}</div>
        </div>
      </div>
      <div className="flex gap-3 p-4 shrink-0 bg-black/40">
        <button onClick={back} disabled={scene === 0} className="bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold py-3 px-4 rounded-xl text-lg basis-[15%]">B</button>
        <button onClick={toggleSpeech} className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl text-lg basis-[20%]">{speaking ? "Stop" : "Read"}</button>
        <button onClick={advance} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-black py-3 px-6 rounded-xl text-lg basis-[65%]">{scene === scenes.length - 1 ? "Get Shares" : "Next"}</button>
      </div>
    </div>
  );
}
