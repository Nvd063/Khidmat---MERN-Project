import  { useState } from 'react';
import API from '../src/Api';
import toast from 'react-hot-toast';

export default function BookingModal({ provider, onClose }) {
  const [formData, setFormData] = useState({
    serviceName: '',
    bookingDate: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/services/request', {
        providerId: provider.user._id,
        ...formData
      });
      toast.success('Service Request Sent Successfully!');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-bold text-slate-800 mb-2">Book Service</h3>
        <p className="text-sm text-slate-500 mb-4">Provider: <span className="font-semibold text-slate-700">{provider.user?.name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Service Needed</label>
            <input
              type="text"
              required
              placeholder="e.g. Wiring, AC Repair, Math Tutoring"
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Address</label>
            <textarea
              rows="3"
              placeholder="Provide job details or your location..."
              className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 border border-slate-300 text-slate-700 py-2.5 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}