import React, { useState } from 'react';
import { X, MapPin, Navigation, Plus, Check, Building, Home, Briefcase } from 'lucide-react';
import { useLocation } from '../context/LocationContext';

export function LocationModal() {
  const { 
    isLocationModalOpen, 
    setIsLocationModalOpen, 
    savedAddresses, 
    currentAddress, 
    selectAddress, 
    addNewAddress, 
    detectCurrentLocation,
    selectedCity,
    setSelectedCity
  } = useLocation();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState('Home');
  const [newFlat, setNewFlat] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState(selectedCity);
  const [newPincode, setNewPincode] = useState('560038');

  if (!isLocationModalOpen) return null;

  const handleAddNewSubmit = (e) => {
    e.preventDefault();
    if (!newFlat || !newStreet) return;

    // Approximate coords based on city
    let lat = 12.9716;
    let lng = 77.6412;
    if (newCity === 'Mumbai') { lat = 19.0553; lng = 72.8301; }
    if (newCity === 'Delhi-NCR') { lat = 28.6315; lng = 77.2167; }

    addNewAddress({
      label: newLabel,
      tag: newLabel,
      name: 'Yuvan Sharma',
      phone: '+91 98450 12345',
      flat: newFlat,
      street: newStreet,
      city: newCity,
      pincode: newPincode,
      lat,
      lng,
    });
    setIsAddingNew(false);
  };

  const cities = ['Bengaluru', 'Mumbai', 'Delhi-NCR'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="location-selector-modal"
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">Select Delivery Location</h3>
              <p className="text-xs text-slate-500">Only verified stores delivering to this area will be shown</p>
            </div>
          </div>
          <button
            onClick={() => { setIsLocationModalOpen(false); setIsAddingNew(false); }}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* City Selector Pills */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select City / Metro Hub
            </label>
            <div className="grid grid-cols-3 gap-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    // Switch to first address in that city if available
                    const match = savedAddresses.find(a => a.city === city);
                    if (match) selectAddress(match);
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-extrabold border transition-all ${
                    selectedCity === city
                      ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-600/20'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* GPS Auto-Detect Button */}
          <button
            onClick={detectCurrentLocation}
            id="detect-gps-btn"
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-brand-50 border border-brand-200 text-brand-700 hover:bg-brand-100 transition-all font-bold text-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div className="text-left flex-1">
              <p className="font-extrabold text-sm text-brand-900">Detect Current GPS Location</p>
              <p className="text-xs text-brand-600/80">Using simulated high-precision browser positioning</p>
            </div>
          </button>

          {!isAddingNew ? (
            <>
              {/* Saved Addresses list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Saved Addresses ({selectedCity})
                  </label>
                  <button
                    onClick={() => setIsAddingNew(true)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {savedAddresses
                    .filter(a => a.city === selectedCity)
                    .map((addr) => {
                      const isSelected = currentAddress?.id === addr.id;
                      return (
                        <div
                          key={addr.id}
                          onClick={() => selectAddress(addr)}
                          className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 p-2 rounded-xl bg-slate-100 text-slate-600">
                              {addr.label === 'Work' || addr.label === 'Office' ? (
                                <Briefcase className="w-4 h-4" />
                              ) : (
                                <Home className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-extrabold text-slate-800">{addr.label}</span>
                                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {addr.pincode}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                                {addr.flat}, {addr.street}
                              </p>
                              <p className="text-[11px] text-slate-400 mt-1">{addr.name} • {addr.phone}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          ) : (
            /* Add New Address Form */
            <form onSubmit={handleAddNewSubmit} className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <h4 className="text-sm font-extrabold text-slate-800">Add New Address in {newCity}</h4>
              
              <div className="grid grid-cols-3 gap-2">
                {['Home', 'Work', 'Other'].map(type => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setNewLabel(type)}
                    className={`py-1.5 text-xs font-bold rounded-lg border ${
                      newLabel === type
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">House / Flat / Building</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Sunshine Heights"
                  value={newFlat}
                  onChange={(e) => setNewFlat(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Street / Locality</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 100 Feet Road, Indiranagar"
                  value={newStreet}
                  onChange={(e) => setNewStreet(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Pincode</label>
                  <input
                    type="text"
                    required
                    placeholder="560038"
                    value={newPincode}
                    onChange={(e) => setNewPincode(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="w-1/2 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm"
                >
                  Save & Deliver Here
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
