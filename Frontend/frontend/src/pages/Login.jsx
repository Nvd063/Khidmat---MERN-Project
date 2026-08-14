import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/auth/login', formData);
      
      // Token aur User Details Save Karein
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      toast.success('Login Successful!');

      // Navbar State Update karne ke liye Custom Event trigger
      window.dispatchEvent(new Event('storage'));

      // Role Check (Handling Lowercase / Uppercase Case-Insensitively)
      const userRole = res.data.user?.role?.toLowerCase();

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'provider') {
        navigate('/provider/dashboard');
      } else {
        navigate('/dashboard'); // Customer / Regular User Path
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/70 px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl mb-3 shadow-inner">
            <LogIn size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Please enter your details to sign in
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
              <input
                type="email"
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400 pointer-events-none" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition bg-slate-50/30 focus:bg-white"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white py-3.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 text-center pt-6 border-t border-slate-100">
          <p className="text-xs sm:text-sm text-slate-500">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline transition"
            >
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}