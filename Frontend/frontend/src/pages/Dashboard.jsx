import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { Clock, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [requests, setRequests] = useState([]);
  const [providerProfile, setProviderProfile] = useState({
    category: '',
    serviceAreas: '',
    bio: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get user booking requests
      const res = await API.get('/services/requests');
      setRequests(res.data);
    } catch (err) {
      console.log('Error fetching requests', err);
    }
  };

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
    try {
      await API.post('/services/provider-profile', {
        ...providerProfile,
        serviceAreas: providerProfile.serviceAreas.split(',').map((a) => a.trim())
      });
      toast.success('Provider profile updated!');
      setIsUpdatingProfile(false);
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'accepted':
        return <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-semibold"><CheckCircle size={14}/> Accepted</span>;
      case 'rejected':
        return <span className="flex items-center gap-1 text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold"><XCircle size={14}/> Rejected</span>;
      case 'completed':
        return <span className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold"><CheckCircle size={14}/> Completed</span>;
      default:
        return <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold"><Clock size={14}/> Pending</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
          <p className="text-slate-400 text-sm mt-1">Role: <span className="capitalize text-indigo-400 font-semibold">{user.role}</span></p>
        </div>

        {user.role === 'provider' && (
          <button
            onClick={() => setIsUpdatingProfile(!isUpdatingProfile)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-xl transition"
          >
            {isUpdatingProfile ? 'Close Form' : 'Update Provider Profile'}
          </button>
        )}
      </div>

      {/* Provider Profile Setup Form */}
      {user.role === 'provider' && isUpdatingProfile && (
        <div className="bg-white border rounded-2xl p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Set Provider Details</h3>
          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <input
                type="text"
                required
                placeholder="e.g. Electrician, Plumber"
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setProviderProfile({ ...providerProfile, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Service Areas (comma separated)</label>
              <input
                type="text"
                required
                placeholder="e.g. Gulberg, Model Town, Johar Town"
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setProviderProfile({ ...providerProfile, serviceAreas: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Bio / Skills</label>
              <textarea
                rows="2"
                placeholder="Briefly describe your experience and skills..."
                className="w-full border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) => setProviderProfile({ ...providerProfile, bio: e.target.value })}
              ></textarea>
            </div>

            <button type="submit" className="md:col-span-2 bg-indigo-600 text-white py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition">
              Save Profile
            </button>
          </form>
        </div>
      )}

      {/* Bookings / Service Requests Table */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          {user.role === 'provider' ? 'Incoming Booking Requests' : 'My Service Bookings'}
        </h3>

        {requests.length === 0 ? (
          <div className="text-center py-12 text-slate-400 flex flex-col items-center">
            <AlertCircle size={40} className="mb-2" />
            <p>No booking requests found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-500 text-xs uppercase font-semibold">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">{user.role === 'provider' ? 'Customer' : 'Provider'}</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm text-slate-700">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-semibold">{req.serviceName}</td>
                    <td className="py-4 px-4">
                      {user.role === 'provider' ? req.customer?.name : req.provider?.name}
                    </td>
                    <td className="py-4 px-4 flex items-center gap-1 text-slate-500">
                      <Calendar size={14}/> {new Date(req.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(req.status)}</td>
                    <td className="py-4 px-4 text-right">
                      {user.role === 'provider' && req.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'accepted')}
                            className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(req._id, 'rejected')}
                            className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}

                      {user.role === 'provider' && req.status === 'accepted' && (
                        <button
                          onClick={() => handleStatusUpdate(req._id, 'completed')}
                          className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-700 transition"
                        >
                          Mark Completed
                        </button>
                      )}

                      {user.role !== 'provider' && (
                        <span className="text-xs text-slate-400 italic">No actions available</span>
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