import { useState } from 'react';
import { Flame, MapPin, Truck } from 'lucide-react';

const WOOD_TYPES = [
  { type: 'oak', label: 'Oak', price: 280 },
  { type: 'pine', label: 'Pine', price: 160 },
  { type: 'fir', label: 'Fir', price: 175 },
  { type: 'mixed', label: 'Mixed', price: 240 },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function SupplierOnboarding() {
  const [form, setForm] = useState({
    businessName: '',
    address: '',
    zip: '',
    radius: 25,
    selectedWood: [] as string[],
    deliveryDays: [] as string[],
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleWood = (type: string) => {
    setForm(f => ({
      ...f,
      selectedWood: f.selectedWood.includes(type)
        ? f.selectedWood.filter(w => w !== type)
        : [...f.selectedWood, type]
    }));
  };

  const toggleDay = (day: string) => {
    setForm(f => ({
      ...f,
      deliveryDays: f.deliveryDays.includes(day)
        ? f.deliveryDays.filter(d => d !== day)
        : [...f.deliveryDays, day]
    }));
  };

  if (submitted) {
    return (
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Flame className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-[#5D4037] font-bold text-xl mb-2">Application Received!</h2>
          <p className="text-[#8D6E63] text-sm">We'll review your details and get in touch within 24 hours.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-[#5D4037] font-bold text-xl mb-2">Become a Supplier</h2>
        <p className="text-[#8D6E63] text-sm mb-6">Start selling firewood in your area</p>
        
        <div className="space-y-4">
          <input 
            placeholder="Business Name" 
            value={form.businessName}
            onChange={(e) => setForm(f => ({ ...f, businessName: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none" 
          />
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-800" />
            <input 
              placeholder="Address" 
              value={form.address}
              onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none" 
            />
          </div>
          
          <div className="flex gap-4">
            <input 
              placeholder="ZIP" 
              value={form.zip}
              onChange={(e) => setForm(f => ({ ...f, zip: e.target.value }))}
              className="flex-1 px-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none" 
            />
            <select 
              value={form.radius}
              onChange={(e) => setForm(f => ({ ...f, radius: Number(e.target.value) }))}
              className="flex-1 px-4 py-3 rounded-xl border border-amber-200 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value={10}>10 mi radius</option>
              <option value={25}>25 mi radius</option>
              <option value={50}>50 mi radius</option>
            </select>
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium text-[#5D4037] mb-3">Wood Types You Sell</p>
            <div className="flex flex-wrap gap-2">
              {WOOD_TYPES.map(w => (
                <button 
                  key={w.type}
                  onClick={() => toggleWood(w.type)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    form.selectedWood.includes(w.type)
                      ? 'bg-[#5D4037] text-white'
                      : 'bg-amber-100 text-[#5D4037] hover:bg-amber-200'
                  }`}
                >
                  {w.label} (${w.price})
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm font-medium text-[#5D4037] mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Delivery Days
            </p>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map(d => (
                <button 
                  key={d}
                  onClick={() => toggleDay(d)}
                  className={`p-3 rounded-xl text-sm transition-colors ${
                    form.deliveryDays.includes(d)
                      ? 'bg-[#FF5722] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setSubmitted(true)}
            disabled={!form.businessName || !form.address || !form.zip || form.selectedWood.length === 0 || form.deliveryDays.length === 0}
            className="w-full py-4 mt-4 bg-[#FF5722] hover:bg-[#E64A19] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
