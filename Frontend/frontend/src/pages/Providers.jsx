import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import BookingModal from '../../components/BookingModal';
import { Star, MapPin, AlertCircle, X, LogIn } from 'lucide-react';

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/services/providers')
      .then((res) => setProviders(res.data))
      .catch((err) => console.log(err));
  }, []);

  // Handle Booking Click with Authentication Check
  const handleBookClick = (provider) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setShowAlert(true); // Show modern alert banner/modal
      return;
    }

    setSelectedProvider(provider);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
      
      {/* 🔴 Professional Custom Alert Banner */}
      {showAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 transform transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                  <AlertCircle size={26} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Authentication Required</h3>
                  <p className="text-xs text-slate-500">Please sign in to continue</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAlert(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-slate-600 my-4 leading-relaxed">
              You need to be logged into your Khidmat account to book a service professional.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={() => setShowAlert(false)}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <LogIn size={16} />
                Please Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Heading */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Available Service Professionals
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Find and book verified experts near you
        </p>
      </div>

      {/* Responsive Grid System */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {providers.map((p) => (
          <div 
            key={p._id} 
            className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800 line-clamp-1">{p.user?.name}</h3>
                  <span className="inline-block mt-1 text-[11px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {p.category}
                  </span>
                </div>
                <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg text-amber-600 font-bold text-xs sm:text-sm shrink-0">
                  <Star size={15} className="fill-amber-500 mr-1" />
                  {p.rating || '5.0'}
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm mb-4 line-clamp-2 leading-relaxed">
                {p.bio || 'No bio added yet.'}
              </p>
            </div>

            <div>
              <div className="flex items-center text-slate-500 text-xs mb-4">
                <MapPin size={14} className="mr-1.5 shrink-0 text-slate-400" />
                <span className="truncate">{p.serviceAreas?.join(', ') || 'All Areas'}</span>
              </div>

              <button
                onClick={() => handleBookClick(p)}
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
              >
                Book Service Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedProvider && (
        <BookingModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
        />
      )}
    </div>
  );
}