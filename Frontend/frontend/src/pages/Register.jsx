import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserCheck, Loader2, UserPlus, ChevronDown } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'customer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post('/auth/register', formData);
      toast.success('Registration Successful! Please Login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-slate-50/70 px-4">
      <div className="max-w-md w-full bg-white p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 my-auto">
        
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl mb-1.5 shadow-inner">
            <UserPlus size={20} />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Account
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Join Khidmat today to find or provide local services
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-2.5">
          
          {/* Full Name */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
              <input
                type="text"
                required
                placeholder="John Doe"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
              <input
                type="text"
                required
                placeholder="+92 300 1234567"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Account Type Selection */}
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-slate-700 mb-0.5">
              Account Type
            </label>
            <div className="relative flex items-center">
              <UserCheck className="absolute left-3 text-slate-400 pointer-events-none" size={16} />
              <select
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white appearance-none cursor-pointer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="customer">Customer (Looking for services)</option>
                <option value="provider">Service Provider (Offering services)</option>
                <option value="admin">Admin (System Administrator)</option>
              </select>
              <ChevronDown className="absolute right-3 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-md shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-4 text-center pt-3 border-t border-slate-100">
          <p className="text-[11px] sm:text-xs text-slate-500">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}