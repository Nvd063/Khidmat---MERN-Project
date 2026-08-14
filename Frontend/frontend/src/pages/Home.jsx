import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Wrench, 
  Zap, 
  GraduationCap, 
  Camera, 
  Scissors, 
  Car, 
  ShieldCheck, 
  Clock, 
  ThumbsUp, 
  ArrowRight 
} from 'lucide-react';

const categories = [
  { name: 'Electrician', icon: Zap, color: 'bg-amber-500 hover:bg-amber-600', ring: 'ring-amber-200' },
  { name: 'Plumber', icon: Wrench, color: 'bg-blue-500 hover:bg-blue-600', ring: 'ring-blue-200' },
  { name: 'Tutor', icon: GraduationCap, color: 'bg-emerald-500 hover:bg-emerald-600', ring: 'ring-emerald-200' },
  { name: 'Photographer', icon: Camera, color: 'bg-purple-500 hover:bg-purple-600', ring: 'ring-purple-200' },
  { name: 'Beautician', icon: Scissors, color: 'bg-pink-500 hover:bg-pink-600', ring: 'ring-pink-200' },
  { name: 'Mechanic', icon: Car, color: 'bg-red-500 hover:bg-red-600', ring: 'ring-red-200' },
];

const features = [
  {
    title: 'Verified Professionals',
    desc: 'Every service provider is identity verified and background checked for your peace of mind.',
    icon: ShieldCheck,
  },
  {
    title: 'Instant Booking',
    desc: 'Book expert services in just a few clicks with real-time schedule availability.',
    icon: Clock,
  },
  {
    title: 'Quality Guaranteed',
    desc: 'Top rated local professionals dedicated to providing high quality craftsmanship.',
    icon: ThumbsUp,
  },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/providers?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/providers');
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/providers?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* 🚀 HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
        
        {/* Subtle Glow Overlay Effects */}
        <div className="absolute -top-24 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-indigo-300 mb-6 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Your Trusted Local Service Hub
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none mb-6">
            Find Trusted Local Experts <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-blue-500">
              For Any Job
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Connect with background-checked electricians, plumbers, tutors, and top professionals near you in seconds.
          </p>

          {/* Search Form Bar */}
          <form 
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-slate-100"
          >
            <div className="flex items-center w-full px-3 py-2 sm:py-0">
              <Search className="text-slate-400 shrink-0 mr-3" size={20} />
              <input
                type="text"
                placeholder="Search electrician, plumber, tutor..."
                className="w-full text-slate-800 placeholder-slate-400 focus:outline-none text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl sm:rounded-full font-semibold text-sm transition-all shadow-md hover:shadow-indigo-500/25 shrink-0 flex items-center justify-center gap-2"
            >
              Search
              <ArrowRight size={16} />
            </button>
          </form>

        </div>
      </section>

      {/* 🏷️ CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore specialized professionals by service category
            </p>
          </div>

          <button 
            onClick={() => navigate('/providers')}
            className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 self-start sm:self-auto hover:underline"
          >
            View All Services <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => handleCategoryClick(cat.name)}
                className="group bg-white p-5 sm:p-6 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/70 flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className={`${cat.color} p-3.5 sm:p-4 rounded-2xl text-white mb-3 shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <IconComponent size={24} className="sm:w-7 sm:h-7" />
                </div>
                <span className="font-bold text-xs sm:text-sm text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ⭐ WHY CHOOSE US */}
      <section className="bg-white border-y border-slate-200/80 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Book With Khidmat?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              We connect you with verified professionals with full transparency and speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const IconComponent = feat.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50/80 border border-slate-100">
                  <div className="p-3.5 bg-indigo-100 text-indigo-700 rounded-2xl mb-4">
                    <IconComponent size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🤝 CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="text-center lg:text-left max-w-xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold mb-3">
              Are You a Service Professional?
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm sm:leading-relaxed">
              Join Khidmat today as a service provider to grow your business, receive client bookings, and increase your earnings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto shrink-0">
            <button 
              onClick={() => navigate('/register')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3.5 px-8 rounded-xl text-sm transition-all shadow-lg text-center"
            >
              Register as Provider
            </button>
            <button 
              onClick={() => navigate('/providers')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3.5 px-8 rounded-xl text-sm transition-all backdrop-blur-md text-center"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}