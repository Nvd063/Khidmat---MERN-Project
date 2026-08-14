import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../src/assets/Logo.jpeg';
import { Menu, X, LogOut, User, LayoutDashboard, Home, Briefcase } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
    setIsOpen(false);
    navigate('/login');
  };

  // Determine correct dashboard path based on role
  const getDashboardPath = () => {
    const role = user?.role?.toLowerCase();
    if (role === 'admin') return '/admin/dashboard';
    if (role === 'provider') return '/provider/dashboard';
    return '/dashboard';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & App Name */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 transition active:scale-95"
            onClick={() => setIsOpen(false)}
          >
            <img src={logo} alt="Khidmat Logo" className="h-9 w-auto rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              Khidmat
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link 
              to="/" 
              className={`flex items-center gap-1.5 transition ${
                isActive('/') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Home size={16} />
              Home
            </Link>

            <Link 
              to="/providers" 
              className={`flex items-center gap-1.5 transition ${
                isActive('/providers') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Briefcase size={16} />
              Services
            </Link>

            {token ? (
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <Link 
                  to={getDashboardPath()} 
                  className={`flex items-center gap-1.5 transition ${
                    isActive(getDashboardPath()) ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>

                {/* User Greeting Tag */}
                {user?.name && (
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <User size={13} className="text-slate-500" />
                    {user.name.split(' ')[0]}
                  </span>
                )}

                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition text-xs font-bold cursor-pointer"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <Link 
                  to="/login" 
                  className="text-slate-700 hover:text-indigo-600 px-3 py-2 transition"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2 rounded-xl transition shadow-md shadow-indigo-100 text-xs font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 focus:outline-none transition"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-5 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          <Link 
            to="/" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Home size={18} />
            Home
          </Link>

          <Link 
            to="/providers" 
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
              isActive('/providers') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Briefcase size={18} />
            Services
          </Link>

          {token ? (
            <>
              <Link 
                to={getDashboardPath()} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                  isActive(getDashboardPath()) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>

              {user?.name && (
                <div className="px-3 py-1.5 text-xs text-slate-500 font-medium flex items-center gap-2">
                  <User size={14} /> Signed in as <span className="font-bold text-slate-800">{user.name}</span>
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-bold px-4 py-2.5 rounded-xl text-sm transition mt-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link 
                to="/login" 
                onClick={() => setIsOpen(false)}
                className="block text-center w-full py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setIsOpen(false)}
                className="block text-center w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-md shadow-indigo-100 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}