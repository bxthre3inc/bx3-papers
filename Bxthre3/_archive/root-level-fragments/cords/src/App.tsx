import { useState } from 'react';
import { MapPin, Flame } from 'lucide-react';
import { SearchView } from './SearchView';
import { SupplierOnboarding } from './SupplierOnboarding';

type View = 'search' | 'supplier';

export default function App() {
  const [view, setView] = useState<View>('search');

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 p-2">
        <div className="flex justify-around">
          <button onClick={() => setView('search')} className={`px-6 py-3 rounded-xl font-medium ${view === 'search' ? 'bg-[#5D4037] text-white' : 'text-[#5D4037]'}`}>
            <MapPin className="w-5 h-5 mx-auto mb-1" />
            Find Wood
          </button>
          <button onClick={() => setView('supplier')} className={`px-6 py-3 rounded-xl font-medium ${view === 'supplier' ? 'bg-[#5D4037] text-white' : 'text-[#5D4037]'}`}>
            <Flame className="w-5 h-5 mx-auto mb-1" />
            Sell Wood
          </button>
        </div>
      </nav>
      <div className="pb-24">
        {view === 'search' ? <SearchView /> : <SupplierOnboarding />}
      </div>
    </div>
  );
}
