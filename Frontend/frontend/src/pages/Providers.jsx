import  { useEffect, useState } from 'react';
import API from '../api';
import BookingModal from '../../components/BookingModal';
import { Star, MapPin } from 'lucide-react';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);

  useEffect(() => {
    API.get('/services/providers')
      .then((res) => setProviders(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-slate-800 mb-6">Available Service Professionals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div key={p._id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">{p.user?.name}</h3>
                <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-full uppercase">
                  {p.category}
                </span>
              </div>
              <div className="flex items-center text-amber-500 font-bold text-sm">
                <Star size={16} className="fill-amber-500 mr-1" />
                {p.rating || '5.0'}
              </div>
            </div>

            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{p.bio || 'No bio added yet.'}</p>

            <div className="flex items-center text-slate-500 text-xs mb-4">
              <MapPin size={14} className="mr-1" />
              <span>{p.serviceAreas?.join(', ') || 'All Areas'}</span>
            </div>

            <button
              onClick={() => setSelectedProvider(p)}
              className="w-full bg-slate-900 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition"
            >
              Book Service Now
            </button>
          </div>
        ))}
      </div>

      {selectedProvider && (
        <BookingModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}