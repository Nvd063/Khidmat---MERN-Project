import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', role: 'customer'
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', formData);
      toast.success('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-600 text-sm mb-1 font-medium">Full Name</label>
            <input type="text" required className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-1 font-medium">Email</label>
            <input type="email" required className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-1 font-medium">Phone Number</label>
            <input type="text" required className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-1 font-medium">Password</label>
            <input type="password" required className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-1 font-medium">Account Type</label>
            <select className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500" onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
              <option value="customer">Customer (Looking for services)</option>
              <option value="provider">Service Provider (Offering services)</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Register
          </button>
        </form>
        <p className="text-slate-500 text-center text-sm mt-4">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
}