
import { Link, useNavigate } from 'react-router-dom';
import logo from '../src/assets/Logo.jpeg';

export default function Navbar() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            {/* Logo Image */}
            <img src={logo} alt="Khidmat Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-gray-900"></span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link to="/providers" className="text-gray-700 hover:text-indigo-600">Services</Link>
            {token ? (
              <>
                <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Login</Link>
                <Link 
                  to="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}