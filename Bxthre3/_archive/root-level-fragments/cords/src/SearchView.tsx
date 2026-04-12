import { useState } from 'react';
import { MapPin, Flame, Star, Truck } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: string;
  woodTypes: { type: string; pricePerCord: number; available: boolean }[];
  deliveryDays: string[];
}

const MOCK_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Mountain Firewood Co.', rating: 4.9, reviews: 127, distance: '2.3 mi',
    woodTypes: [
      { type: 'oak', pricePerCord: 280, available: true },
      { type: 'mixed', pricePerCord: 240, available: true },
      { type: 'pine', pricePerCord: 180, available: false },
    ], deliveryDays: ['Mon', 'Wed', 'Fri'] },
  { id: '2', name: 'Valley Pines', rating: 4.7, reviews: 89, distance: '5.1 mi',
    woodTypes: [
      { type: 'pine', pricePerCord: 160, available: true },
      { type: 'fir', pricePerCord: 175, available: true },
    ], deliveryDays: ['Tue', 'Thu', 'Sat'] },
];

export function SearchView() {
  const [zipCode, setZipCode] = useState('81144');
  const [radius, setRadius] = useState(10);

  return (
    <div>
      <header className="sticky top-0 z-10 p-4 bg-gradient-to-br from-[#5D4037] to-[#3E2723]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF5722] flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">Cords</h1>
            <p className="text-amber-200/70 text-xs">Local firewood delivered</p>
          </div>
        </div>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-800" />
          <input type="text" placeholder="Enter ZIP..." value={zipCode} onChange={(e) => setZipCode(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/95 border-0 focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="flex gap-2 mt-3">
          <select value={radius} onChange={(e) => setRadius(Number(e.target.value))}
            className="px-3 py-2 rounded-lg bg-white/20 text-white text-sm border-0">
            <option value={5} className="text-gray-800">5 mi</option>
            <option value={10} className="text-gray-800">10 mi</option>
            <option value={25} className="text-gray-800">25 mi</option>
            <option value={50} className="text-gray-800">50 mi</option>
          </select>
        </div>
      </header>
      <div className="p-4">
        <p className="text-amber-900/60 text-sm mb-3">{MOCK_SUPPLIERS.length} suppliers near {zipCode}</p>
        {MOCK_SUPPLIERS.map(s => <SupplierCard key={s.id} supplier={s} />)}
      </div>
    </div>
  );
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const [selected, setSelected] = useState(supplier.woodTypes.find(w => w.available)?.type);
  const wood = supplier.woodTypes.find(w => w.type === selected);

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
      <div className="p-4 bg-gradient-to-r from-[#8D6E63] to-[#5D4037]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{supplier.name}</h3>
            <div className="flex items-center gap-1 text-amber-400 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span>{supplier.rating}</span>
              <span className="text-white/70">({supplier.reviews})</span>
              <span className="text-white/70 ml-2">• {supplier.distance}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-3">
          {supplier.woodTypes.map((w) => (
            <button key={w.type} onClick={() => w.available && setSelected(w.type)} disabled={!w.available}
              className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                selected === w.type ? 'bg-[#5D4037] text-white' : w.available ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-400'
              }`}>
              {w.type} {!w.available && '(out)'}
            </button>
          ))}
        </div>
        {wood && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#5D4037] font-bold text-2xl">${wood.pricePerCord}</p>
              <p className="text-[#8D6E63] text-sm">per cord delivered</p>
            </div>
            <button className="px-6 py-3 bg-[#FF5722] hover:bg-[#E64A19] text-white rounded-xl font-semibold">
              Order Now
            </button>
          </div>
        )}
        <div className="mt-3 pt-3 border-t border-amber-100">
          <p className="text-sm text-[#5D4037]/70">
            <Truck className="w-4 h-4 inline mr-1" />
            Delivers: {supplier.deliveryDays.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
