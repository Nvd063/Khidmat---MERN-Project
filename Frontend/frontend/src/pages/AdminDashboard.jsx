import { useState, useEffect, useCallback } from 'react';
import API from '../api';
import toast from 'react-hot-toast';
import { 
  BarChart3, 
  Users, 
  Wrench, 
  FolderPlus, 
  PlusCircle, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Menu, 
  X, 
  Clock, 
  FileText, 
  ShieldCheck, 
  ShieldAlert,
  Search
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalProviders: 0, totalRequests: 0, pendingRequests: 0 });
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', icon: '' });
  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // Tracks ID of row being toggled
  const [submittingCategory, setSubmittingCategory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Safe data extractor helper to avoid undefined errors
  const extractData = (resData, fallbackKeys = []) => {
    if (!resData) return [];
    if (Array.isArray(resData)) return resData;
    for (const key of fallbackKeys) {
      if (Array.isArray(resData[key])) return resData[key];
    }
    return resData.data && Array.isArray(resData.data) ? resData.data : [];
  };

  // 1. Fetch Platform Statistics
  const fetchStats = useCallback(async () => {
    try {
      const res = await API.get('/admin/stats');
      if (res.data?.success || res.data) {
        setStats(res.data.stats || res.data.data || res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch stats');
    }
  }, []);

  // 2. Fetch Registered Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/users');
      const userList = extractData(res.data, ['users', 'data', 'customers']);
      setUsers(userList);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Fetch Service Providers
  const fetchProviders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/providers');
      const providerList = extractData(res.data, ['providers', 'data']);
      setProviders(providerList);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch providers');
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Fetch Categories
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get('/admin/categories');
      const categoryList = extractData(res.data, ['categories', 'data']);
      setCategories(categoryList);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  // Automatically fetch data whenever tab changes
  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'providers') fetchProviders();
    if (activeTab === 'categories') fetchCategories();
  }, [activeTab, fetchStats, fetchUsers, fetchProviders, fetchCategories]);

  // 5. Toggle User / Provider Status
  const handleToggleStatus = async (id) => {
    setActionLoading(id);
    try {
      const res = await API.put(`/admin/users/${id}/status`);
      if (res.data?.success || res.status === 200) {
        toast.success(res.data?.message || 'Status updated');
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'providers') fetchProviders();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change status');
    } finally {
      setActionLoading(null);
    }
  };

  // 6. Create Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setSubmittingCategory(true);
    try {
      const res = await API.post('/admin/categories', newCategory);
      if (res.data?.success || res.status === 200) {
        toast.success('Category added successfully!');
        setNewCategory({ name: '', description: '', icon: '' });
        fetchCategories();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add category');
    } finally {
      setSubmittingCategory(false);
    }
  };

  // Helper for filtering table records
  const currentList = activeTab === 'users' ? users : providers;
  const filteredList = currentList.filter(item => {
    const name = item.name || item.username || '';
    const email = item.email || '';
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || 
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const navItems = [
    { id: 'stats', label: 'Dashboard Stats', icon: BarChart3 },
    { id: 'users', label: 'Manage Customers', icon: Users },
    { id: 'providers', label: 'Service Providers', icon: Wrench },
    { id: 'categories', label: 'Categories', icon: FolderPlus },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Wrench size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">Khidmat Admin</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Navigation Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Brand Logo */}
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-slate-800">
          <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30">
            <Wrench size={22} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white tracking-tight">Khidmat</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Control Panel</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 p-4 space-y-1.5 mt-4 md:mt-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  setSearchTerm('');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-150 cursor-pointer ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 font-medium">Khidmat Management System</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        
        {/* TAB 1: STATISTICS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Platform Performance
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Real-time overview of users, requests, and providers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Card 1 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customers</span>
                  <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900">{stats.totalUsers || 0}</h3>
                  <p className="text-xs text-slate-500 mt-1">Registered clients</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Providers</span>
                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Wrench size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900">{stats.totalProviders || 0}</h3>
                  <p className="text-xs text-slate-500 mt-1">Verified professionals</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Requests</span>
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                    <FileText size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900">{stats.totalRequests || 0}</h3>
                  <p className="text-xs text-slate-500 mt-1">Service bookings made</p>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Pending</span>
                  <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                    <Clock size={20} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-black text-slate-900">{stats.pendingRequests || 0}</h3>
                  <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2 & 3: USERS AND PROVIDERS */}
        {(activeTab === 'users' || activeTab === 'providers') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeTab === 'users' ? 'Customer Accounts' : 'Service Providers'}
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Manage active status and details for {activeTab}.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
                <Loader2 className="animate-spin text-indigo-600" size={28} />
                <span className="ml-3 text-sm font-semibold text-slate-600">Loading {activeTab}...</span>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <th className="py-3.5 px-5">User</th>
                        <th className="py-3.5 px-5">Contact Email</th>
                        <th className="py-3.5 px-5">Phone</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredList.map((item) => {
                        const id = item._id || item.id;
                        const isBlocked = item.isActive === false || item.status === 'blocked';
                        
                        return (
                          <tr key={id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-5">
                              <div className="font-bold text-slate-900">{item.name || item.username || 'N/A'}</div>
                              <span className="text-[11px] text-slate-400 font-mono">ID: {id?.slice(-6)}</span>
                            </td>
                            <td className="py-4 px-5 text-slate-600 font-medium">{item.email || 'N/A'}</td>
                            <td className="py-4 px-5 text-slate-600 font-medium">{item.phone || item.mobile || 'N/A'}</td>
                            <td className="py-4 px-5">
                              {isBlocked ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                                  <ShieldAlert size={13} />
                                  Blocked
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                  <ShieldCheck size={13} />
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-5 text-right">
                              <button
                                onClick={() => handleToggleStatus(id)}
                                disabled={actionLoading === id}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer disabled:opacity-50 ${
                                  isBlocked
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                    : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80'
                                }`}
                              >
                                {actionLoading === id ? (
                                  <Loader2 className="animate-spin" size={13} />
                                ) : isBlocked ? (
                                  <>
                                    <CheckCircle2 size={13} /> Activate
                                  </>
                                ) : (
                                  <>
                                    <XCircle size={13} /> Deactivate
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredList.length === 0 && (
                        <tr>
                          <td colSpan="5" className="py-12 text-center text-slate-400">
                            No matching {activeTab} found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Service Categories
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Add and manage service categories offered across the app.
              </p>
            </div>

            {/* New Category Form Card */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <PlusCircle size={18} className="text-indigo-600" />
                Add New Service Category
              </h3>

              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Electrician"
                      required
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Brief details..."
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Icon Identifier (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. zap, tool, home"
                      value={newCategory.icon}
                      onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submittingCategory}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md shadow-indigo-200 disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {submittingCategory ? (
                      <>
                        <Loader2 className="animate-spin" size={15} /> Adding...
                      </>
                    ) : (
                      'Save Category'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* List of Categories */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">Existing Categories</h3>
              
              {loading ? (
                <div className="flex items-center justify-center p-10 bg-white rounded-2xl border border-slate-200">
                  <Loader2 className="animate-spin text-indigo-600" size={24} />
                  <span className="ml-3 text-sm font-semibold text-slate-600">Loading categories...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((cat) => (
                    <div 
                      key={cat._id || cat.id} 
                      className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 hover:border-indigo-200 transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-extrabold text-slate-900 text-base">{cat.name}</h4>
                          <span className="p-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-mono font-bold">
                            {cat.icon || 'Category'}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          {cat.description || 'No description provided.'}
                        </p>
                      </div>
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm">
                      No categories created yet. Use the form above to add one.
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}