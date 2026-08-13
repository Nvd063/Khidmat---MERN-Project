import  { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login Successful!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Credentials');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md border border-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 text-center mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-600 text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full border rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-slate-600 text-sm mb-1 font-medium">Password</label>
            <input
              type="password"
              required
              className="w-full border rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Login
          </button>
        </form>
        <p className="text-slate-500 text-center text-sm mt-4">
          Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold">Register</Link>
        </p>
      </div>
    </div>
  );
}