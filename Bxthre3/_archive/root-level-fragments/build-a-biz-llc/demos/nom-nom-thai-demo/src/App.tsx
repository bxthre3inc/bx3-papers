import { useState } from 'react';
import { MenuScreen } from './screens/MenuScreen';
import { CartScreen } from './screens/CartScreen';
import { LoyaltyScreen } from './screens/LoyaltyScreen';
import { GiftCardsScreen } from './screens/GiftCardsScreen';
import { TabBar } from '../../_shared/components/TabBar';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState<'menu' | 'cart' | 'loyalty' | 'gifts'>('menu');

  return (
    <div className="min-h-screen bg-white">
      {activeTab === 'menu' && <MenuScreen />}
      {activeTab === 'cart' && <CartScreen />}
      {activeTab === 'loyalty' && <LoyaltyScreen />}
      {activeTab === 'gifts' && <GiftCardsScreen />}
      <TabBar active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

export default App;
