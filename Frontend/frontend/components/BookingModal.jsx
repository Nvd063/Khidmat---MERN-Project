import { useState } from 'react';
import API from '../src/Api'; // Corrected import path (assuming '../api')
import toast from 'react-hot-toast';
import { 
  X, 
  Calendar, 
  Briefcase, 
  MapPin, 
  Loader2, 
  UserCheck, 
  Send 
} from 'lucide-react';

export default function BookingModal({ provider, onClose }) {
  const [formData, setFormData] = useState({
    serviceName: '',
    bookingDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Prevent selecting past dates
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const providerUserId = provider?.user?._id || provider?._id;

      await API.post('/services/request', {
        providerId: providerUserId,
        ...formData
      });

      toast.success('Service Request Sent Successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all my-auto"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside modal
      >
        
        {/* Modal Header */}
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar size={18} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Book Service
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Send a direct request to provider
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Provider Brief Info Card */}
        <div className="px-6 pt-5">
          <div className="bg-indigo-50/60 rounded-2xl p-3.5 border border-indigo-100/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              {provider?.user?.name?.charAt(0) || 'P'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                Service Provider
              </p>
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {provider?.user?.name || provider?.name || 'Professional'}
              </h4>
              {provider?.category?.name && (
                <span className="inline-block text-[10px] text-slate-500 font-medium">
                  {provider.category.name}
                </span>
              )}
            </div>
            <UserCheck className="text-indigo-500/70" size={18} />
          </div>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Service Needed */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Service Required
            </label>
            <div className="relative flex items-center">
              <Briefcase className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
              <input
                type="text"
                required
                placeholder="e.g. Electrical Wiring, Plumbing, AC Cleaning"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white"
              />
            </div>
          </div>

          {/* Service Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preferred Date
            </label>
            <div className="relative flex items-center">
              <Calendar className="absolute left-3.5 text-slate-400 pointer-events-none" size={16} />
              <input
                type="date"
                required
                min={today}
                value={formData.bookingDate}
                onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white cursor-pointer"
              />
            </div>
          </div>

          {/* Notes / Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Job Details / Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" size={16} />
              <textarea
                rows="3"
                placeholder="Describe the job requirements, address, or special notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white resize-none"
              ></textarea>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 active:scale-[0.98] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-bold active:scale-[0.98] transition shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Confirm Booking
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}