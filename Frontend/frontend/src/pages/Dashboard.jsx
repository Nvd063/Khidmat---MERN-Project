import { useEffect, useState, useCallback } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  User, 
  Loader2, 
  Briefcase, 
  MapPin, 
  Settings 
} from 'lucide-react';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [providerProfile, setProviderProfile] = useState({
    category: '',
    serviceAreas: '',
    bio: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Helper function to safely extract requests array regardless of backend payload wrapper
  const extractRequests = (resData) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    if (Array.isArray(resData.requests)) return resData.requests;
    if (Array.isArray(resData.data)) return resData.data;
    if (Array.isArray(resData.bookings)) return resData.bookings;
    return [];
  };

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Get user booking requests
      const res = await API.get('/services/requests');
      const parsedRequests = extractRequests(res.data);
      setRequests(parsedRequests);
    } catch (err) {
      console.error('Error fetching requests', err);
      toast.error(err.response?.data?.message || 'Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleStatusUpdate = async (requestId, status) => {
    try {
      await API.put(`/services/request/${requestId}`, { status });
      toast.success(`Booking marked as ${status}`);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await API.post('/services/provider-profile', {
        ...providerProfile,
        serviceAreas: providerProfile.serviceAreas.split(',').map((a) => a.trim())
      });
      toast.success('Provider profile updated successfully!');
      setIsUpdatingProfile(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            <CheckCircle size={13} /> Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full font-bold">
            <XCircle size={13} /> Rejected
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full font-bold">
            <CheckCircle size={13} /> Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-bold">
            <Clock size={13} /> Pending
          </span>
        );
    }
  };

  // Helper to get client / provider name safely
  const getPartyName = (req) => {
    if (user.role === 'provider') {
      return (
        req.customer?.name || 
        req.customer?.user?.name || 
        req.user?.name || 
        'Customer'
      );
    } else {
      return (
        req.provider?.name || 
        req.provider?.user?.name || 
        req.providerId?.name || 
        'Service Provider'
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-slate-800 text-indigo-400 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            <User size={14} />
            <span className="capitalize">{user.role || 'User'} Dashboard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name || 'User'}!
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage your service requests and stay updated.
          </p>
        </div>

        {user.role === 'provider' && (
          <button
            onClick={() => setIsUpdatingProfile(!isUpdatingProfile)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Settings size={16} />
            {isUpdatingProfile ? 'Close Form' : 'Update Profile Details'}
          </button>
        )}
      </div>

      {/* Provider Profile Setup Form */}
      {user.role === 'provider' && isUpdatingProfile && (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 mb-8 shadow-sm animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-600" />
            Provider Service Information
          </h3>

          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Electrician, Plumber, Tutor"
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                value={providerProfile.category}
                onChange={(e) => setProviderProfile({ ...providerProfile, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Service Areas (comma separated)</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  placeholder="e.g. Gulberg, Model Town, Johar Town"
                  className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  value={providerProfile.serviceAreas}
                  onChange={(e) => setProviderProfile({ ...providerProfile, serviceAreas: e.target.value })}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio & Experience</label>
              <textarea
                rows="3"
                placeholder="Describe your skills, experience, and working hours..."
                className="w-full border border-slate-200 rounded-xl p-3 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition resize-none"
                value={providerProfile.bio}
                onChange={(e) => setProviderProfile({ ...providerProfile, bio: e.target.value })}
              ></textarea>
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button 
                type="submit" 
                disabled={savingProfile}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition shadow-md shadow-indigo-200 disabled:opacity-70 flex items-center gap-2 cursor-pointer"
              >
                {savingProfile ? <Loader2 size={15} className="animate-spin" /> : null}
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bookings / Service Requests Section */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              {user.role === 'provider' ? 'Incoming Booking Requests' : 'My Service Bookings'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              List of all submitted or received service requests
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Loader2 className="animate-spin text-indigo-600 mb-2" size={32} />
            <p className="text-xs font-bold">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <AlertCircle size={38} className="mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">No booking requests found</p>
            <p className="text-xs text-slate-400 mt-1">New booking requests will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[11px] uppercase font-extrabold tracking-wider bg-slate-50/50">
                  <th className="py-3 px-4 rounded-l-xl">Service</th>
                  <th className="py-3 px-4">{user.role === 'provider' ? 'Customer' : 'Provider'}</th>
                  <th className="py-3 px-4">Booking Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right rounded-r-xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {requests.map((req) => (
                  <tr key={req._id || req.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {req.serviceName || req.service || 'Service Request'}
                    </td>
                    
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {getPartyName(req)}
                    </td>
                    
                    <td className="py-4 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-slate-400" />
                        {req.bookingDate ? new Date(req.bookingDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    
                    <td className="py-4 px-4">
                      {getStatusBadge(req.status)}
                    </td>
                    
                    <td className="py-4 px-4 text-right">
                      {user.role === 'provider' && req.status?.toLowerCase() === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(req._id || req.id, 'accepted')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id || req.id, 'rejected')}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {user.role === 'provider' && req.status?.toLowerCase() === 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(req._id || req.id, 'completed')}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}

                      {user.role !== 'provider' && (
                        <span className="text-xs text-slate-400 italic font-medium">No actions</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}