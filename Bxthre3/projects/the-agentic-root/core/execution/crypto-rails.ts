// Crypto Payment Rails
// Accepts, holds, converts, and disburses crypto for Agentic
// Enables autonomous financial operations

export interface PaymentWallet {
  id: string;
  name: string;
  address: string;
  network: 'ethereum' | 'solana' | 'bitcoin' | 'polygon';
  balance: number;
  usdValue: number;
  lastActivity: string;
}

export interface PaymentTransaction {
  id: string;
  type: 'received' | 'sent' | 'converted';
  amount: number;
  currency: string;
  usdValue: number;
  status: 'pending' | 'confirmed' | 'failed';
  from: string;
  to: string;
  timestamp: string;
  autoProcessed: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceUSD: number;
  priceCrypto: { eth?: number; sol?: number; btc?: number };
  features: string[];
  active: boolean;
}

class CryptoPaymentRails {
  private wallets: Map<string, PaymentWallet> = new Map();
  private transactions: PaymentTransaction[] = [];
  private subscriptions: SubscriptionPlan[] = [];

  constructor() {
    this.initializeWallets();
    this.initializeSubscriptions();
  }

  private initializeWallets(): void {
    // ETH/MATIC wallet ( Polygon for low fees )
    this.wallets.set('polygon', {
      id: 'polygon',
      name: 'Polygon Wallet',
      address: '0x...', // Would be real address
      network: 'polygon',
      balance: 0,
      usdValue: 0,
      lastActivity: new Date().toISOString()
    });

    // Solana wallet ( fast, cheap )
    this.wallets.set('solana', {
      id: 'solana',
      name: 'Solana Wallet',
      address: '...', // Would be real address
      network: 'solana',
      balance: 0,
      usdValue: 0,
      lastActivity: new Date().toISOString()
    });

    // Bitcoin wallet ( store of value )
    this.wallets.set('bitcoin', {
      id: 'bitcoin',
      name: 'Bitcoin Wallet',
      address: 'bc1...', // Would be real address
      network: 'bitcoin',
      balance: 0,
      usdValue: 0,
      lastActivity: new Date().toISOString()
    });
  }

  private initializeSubscriptions(): void {
    // Agentic Subscription tiers
    this.subscriptions = [
      {
        id: 'starter',
        name: 'Starter',
        priceUSD: 29,
        priceCrypto: { eth: 0.01, sol: 0.1, btc: 0.0003 },
        features: [
          '5 digital employees',
          'Gmail + Calendar sync',
          'Basic task management',
          'Community support'
        ],
        active: true
      },
      {
        id: 'professional',
        name: 'Professional',
        priceUSD: 99,
        priceCrypto: { eth: 0.035, sol: 0.35, btc: 0.001 },
        features: [
          '20 digital employees',
          'All integrations (Gmail, Calendar, Tasks, SMS)',
          'GitHub + Drive sync',
          'Priority support',
          'Custom workflows'
        ],
        active: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        priceUSD: 299,
        priceCrypto: { eth: 0.1, sol: 1.0, btc: 0.003 },
        features: [
          'Unlimited digital employees',
          'Multi-workspace support',
          'Full autonomy mode',
          'Dedicated support',
          'Custom integrations',
          'API access'
        ],
        active: true
      }
    ];
  }

  // Get payment addresses for each network
  getPaymentAddresses(): PaymentWallet[] {
    return Array.from(this.wallets.values());
  }

  // Get subscription plans
  getPlans(): SubscriptionPlan[] {
    return this.subscriptions.filter(s => s.active);
  }

  // Calculate payment amount in crypto
  async calculateCryptoAmount(planId: string, network: string): Promise<number | null> {
    const plan = this.subscriptions.find(s => s.id === planId);
    if (!plan) return null;

    switch (network) {
      case 'ethereum':
      case 'polygon':
        return plan.priceCrypto.eth || 0;
      case 'solana':
        return plan.priceCrypto.sol || 0;
      case 'bitcoin':
        return plan.priceCrypto.btc || 0;
      default:
        return null;
    }
  }

  // Process incoming payment (called by webhook/monitor)
  async processPayment(
    txHash: string,
    network: string,
    amount: number,
    fromAddress: string
  ): Promise<{ success: boolean; subscriptionId?: string }> {
    // Verify payment on-chain
    // In production: use proper RPC/web3 API
    
    const tx: PaymentTransaction = {
      id: txHash,
      type: 'received',
      amount,
      currency: network.toUpperCase(),
      usdValue: amount * 2000, // Rough conversion
      status: 'confirmed',
      from: fromAddress,
      to: this.wallets.get(network)?.address || '',
      timestamp: new Date().toISOString(),
      autoProcessed: true
    };

    this.transactions.push(tx);

    // Update wallet balance
    const wallet = this.wallets.get(network);
    if (wallet) {
      wallet.balance += amount;
      wallet.lastActivity = new Date().toISOString();
    }

    return { success: true };
  }

  // Auto-disburse based on rules
  async autoDisburse(): Promise<void> {
    const wallet = this.wallets.get('polygon');
    if (!wallet || wallet.balance < 0.1) return; // Min 0.1 ETH

    // Rules for auto-disbursement:
    // - 30% to operations wallet
    // - 20% to R&D
    // - 50% to reserve
    
    const opsAmount = wallet.balance * 0.3;
    const rdAmount = wallet.balance * 0.2;

    // In production: actual transfer logic
    wallet.balance -= (opsAmount + rdAmount);
    
    this.transactions.push({
      id: `disp-${Date.now()}`,
      type: 'sent',
      amount: opsAmount,
      currency: 'POL',
      usdValue: opsAmount * 2000,
      status: 'pending',
      from: wallet.address,
      to: 'ops-wallet',
      timestamp: new Date().toISOString(),
      autoProcessed: true
    });
  }

  // Get transaction history
  getTransactions(limit = 50): PaymentTransaction[] {
    return this.transactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Get financial summary
  getSummary(): {
    totalReceived: number;
    totalSent: number;
    netPosition: number;
    byNetwork: { network: string; balance: number; usdValue: number }[];
    recentTransactions: number;
  } {
    const totalReceived = this.transactions
      .filter(t => t.type === 'received' && t.status === 'confirmed')
      .reduce((sum, t) => sum + t.usdValue, 0);

    const totalSent = this.transactions
      .filter(t => t.type === 'sent')
      .reduce((sum, t) => sum + t.usdValue, 0);

    const byNetwork = Array.from(this.wallets.values()).map(w => ({
      network: w.network,
      balance: w.balance,
      usdValue: w.usdValue
    }));

    return {
      totalReceived,
      totalSent,
      netPosition: totalReceived - totalSent,
      byNetwork,
      recentTransactions: this.transactions.length
    };
  }
}

export const cryptoRails = new CryptoPaymentRails();
