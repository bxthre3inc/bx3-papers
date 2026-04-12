import { useState, useEffect } from 'react';
import { QrCode, DollarSign, History, Banknote, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

interface PartnerStatus {
  id: string;
  name: string;
  tier: number;
  securedBalance: number;
  maxCapacity: number;
  availableCapacity: number;
  pendingCash: number;
  status: 'active' | 'frozen' | 'suspended';
  commissionRate: number;
  totalDepositsProcessed: number;
  totalVolumeLifetime: number;
}

interface DepositRecord {
  token: string;
  userId: string;
  amount: number;
  timestamp: string;
  commission: number;
}

export default function PartnerDashboard() {
  const { balance } = useSocket();
  const [activeTab, setActiveTab] = useState<'deposit' | 'history' | 'drops'>('deposit');
  const [partner, setPartner] = useState<PartnerStatus | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [depositHistory, setDepositHistory] = useState<DepositRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [dropAmount, setDropAmount] = useState('');
  const [dropReceipt, setDropReceipt] = useState('');

  // Simulate fetching partner data on load
  useEffect(() => {
    // In production, fetch from /api/cash/secured/partner/:id
    setPartner({
      id: 'partner-demo',
      name: 'Valley Corner Store',
      tier: 3,
      securedBalance: 2500,
      maxCapacity: 2500,
      availableCapacity: 1847,
      pendingCash: 653,
      status: 'active',
      commissionRate: 0.07,
      totalDepositsProcessed: 47,
      totalVolumeLifetime: 12500
    });

    // Simulated history
    setDepositHistory([
      { token: 'VPC-CASH-A1B2C3', userId: 'user-123', amount: 100, timestamp: '2026-03-18T14:30:00Z', commission: 7 },
      { token: 'VPC-CASH-D4E5F6', userId: 'user-456', amount: 250, timestamp: '2026-03-18T12:15:00Z', commission: 17.50 },
      { token: 'VPC-CASH-G7H8I9', userId: 'user-789', amount: 50, timestamp: '2026-03-18T10:00:00Z', commission: 3.50 },
    ]);
  }, []);

  const handleDepositConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // In production: POST /api/cash/deposit/confirm
      // const response = await fetch('/api/cash/deposit/confirm', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ partnerId: partner?.id, token: tokenInput })
      // });

      // Simulate API call
      await new Promise(r => setTimeout(r, 1000));
      
      const amount = parseInt(cashAmount) || 100;
      const commission = amount * (partner?.commissionRate || 0.07);

      setMessage({
        type: 'success',
        text: `✓ Deposited ${amount} VLY. Commission: $${commission.toFixed(2)}`
      });

      // Update local state
      if (partner) {
        setPartner({
          ...partner,
          availableCapacity: partner.availableCapacity - amount,
          pendingCash: partner.pendingCash + amount,
          totalDepositsProcessed: partner.totalDepositsProcessed + 1,
          totalVolumeLifetime: partner.totalVolumeLifetime + amount
        });
      }

      setDepositHistory(prev => [{
        token: tokenInput,
        userId: 'user-new',
        amount,
        timestamp: new Date().toISOString(),
        commission
      }, ...prev]);

      setTokenInput('');
      setCashAmount('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to process deposit. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In production: POST /api/cash/secured/drop
      await new Promise(r => setTimeout(r, 800));
      
      const amount = parseInt(dropAmount) || 0;
      
      if (partner) {
        setPartner({
          ...partner,
          availableCapacity: partner.availableCapacity + amount,
          pendingCash: Math.max(0, partner.pendingCash - amount)
        });
      }

      setMessage({
        type: 'success',
        text: `✓ Cash drop logged: $${amount}. Awaiting verification.`
      });

      setDropAmount('');
      setDropReceipt('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to log drop.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!partner) return <div className="p-8 text-white">Loading partner data...</div>;

  const capacityPercent = (partner.pendingCash / partner.maxCapacity) * 100;
  const isAtRisk = capacityPercent > 80;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-4">
      {/* Header */}
      <div className="max-w-md mx-auto mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{partner.name}</h1>
            <p className="text-sm text-zinc-400">Tier {partner.tier} Partner • {partner.commissionRate * 100}% Commission</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${partner.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>

        {/* Capacity Alert */}
        {isAtRisk && (
          <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-200">At 80% capacity. Cash drop required or deposits will freeze.</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Available Capacity</p>
            <p className="text-2xl font-bold text-green-400">${partner.availableCapacity}</p>
            <p className="text-xs text-zinc-500">of ${partner.maxCapacity}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
            <p className="text-xs text-zinc-400 mb-1">Pending Cash</p>
            <p className="text-2xl font-bold text-yellow-400">${partner.pendingCash}</p>
            <p className="text-xs text-zinc-500">Needs drop</p>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-zinc-400 mb-1">
            <span>Capacity Used</span>
            <span>{capacityPercent.toFixed(1)}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all ${capacityPercent > 80 ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`rounded-lg p-3 mb-4 flex items-center gap-2 ${
            message.type === 'success' ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-red-400" />}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['deposit', 'history', 'drops'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab 
                  ? 'bg-violet-600 text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {tab === 'deposit' && <><QrCode className="w-4 h-4 inline mr-1" /> Deposit</>}
              {tab === 'history' && <><History className="w-4 h-4 inline mr-1" /> History</>}
              {tab === 'drops' && <><Banknote className="w-4 h-4 inline mr-1" /> Drop</>}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
          {activeTab === 'deposit' && (
            <form onSubmit={handleDepositConfirm}>
              <div className="mb-4">
                <label className="block text-sm text-zinc-400 mb-2">Player QR Token</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                    placeholder="VPC-CASH-XXXXXX"
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-600"
                  />
                  <button type="button" className="bg-zinc-700 p-2 rounded-lg">
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-zinc-400 mb-2">Cash Received ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                  <input
                    type="number"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="100"
                    min="10"
                    max={partner.availableCapacity}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-3 py-2 text-white placeholder-zinc-600"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Max: ${partner.availableCapacity}</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !tokenInput || !cashAmount}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Processing...' : 'Confirm Deposit'}
              </button>
            </form>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {depositHistory.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No deposits yet</p>
              ) : (
                depositHistory.map((deposit, i) => (
                  <div key={i} className="bg-zinc-900/50 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium">${deposit.amount} VLY</p>
                      <p className="text-xs text-zinc-500">{new Date(deposit.timestamp).toLocaleTimeString()}</p>
                      <p className="text-xs text-zinc-600 font-mono">{deposit.token}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm">+${deposit.commission.toFixed(2)}</p>
                      <p className="text-xs text-zinc-500">commission</p>
                    </div>
                  </div>
                ))
              )}

              <div className="border-t border-zinc-700 pt-3 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Total Deposits</span>
                  <span className="font-medium">{partner.totalDepositsProcessed}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-zinc-400">Lifetime Volume</span>
                  <span className="font-medium">${partner.totalVolumeLifetime.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drops' && (
            <form onSubmit={handleLogDrop}>
              <div className="mb-4">
                <label className="block text-sm text-zinc-400 mb-2">Drop Amount ($)</label>
                <div className="relative">
                  <Banknote className="absolute left-3 top-2.5 w-5 h-5 text-zinc-500" />
                  <input
                    type="number"
                    value={dropAmount}
                    onChange={(e) => setDropAmount(e.target.value)}
                    placeholder="500"
                    min="1"
                    max={partner.pendingCash}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-3 py-2 text-white placeholder-zinc-600"
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-1">Max: ${partner.pendingCash} (pending cash)</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-zinc-400 mb-2">Receipt Photo / Reference</label>
                <input
                  type="text"
                  value={dropReceipt}
                  onChange={(e) => setDropReceipt(e.target.value)}
                  placeholder="Receipt # or photo URL"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white placeholder-zinc-600"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !dropAmount}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Logging...' : 'Log Cash Drop'}
              </button>

              <p className="text-xs text-zinc-500 mt-3 text-center">
                Cash drops require verification before capacity is restored.
              </p>
            </form>
          )}
        </div>

        {/* Lifetime Stats */}
        <div className="mt-6 bg-zinc-800/30 rounded-lg p-4 border border-zinc-700/50">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-violet-400" />
            <span className="font-medium">Lifetime Performance</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-violet-400">{partner.totalDepositsProcessed}</p>
              <p className="text-xs text-zinc-500">Deposits</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">${(partner.totalVolumeLifetime * partner.commissionRate).toFixed(0)}</p>
              <p className="text-xs text-zinc-500">Est. Earnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* PWA Install Prompt (shown on Android) */}
      <div className="fixed bottom-4 left-4 right-4 bg-violet-600 text-white p-4 rounded-lg shadow-lg md:hidden">
        <p className="text-sm font-medium">📱 Add to Home Screen</p>
        <p className="text-xs text-violet-200">Install this app for quick access</p>
      </div>
    </div>
  );
}
