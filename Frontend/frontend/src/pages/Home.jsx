import  { useState } from 'react';
import { Search, Wrench, Zap, GraduationCap, Camera, Scissors, Car } from 'lucide-react';

const categories = [
  { name: 'Electrician', icon: Zap, color: 'bg-amber-500' },
  { name: 'Plumber', icon: Wrench, color: 'bg-blue-500' },
  { name: 'Tutor', icon: GraduationCap, color: 'bg-emerald-500' },
  { name: 'Photographer', icon: Camera, color: 'bg-purple-500' },
  { name: 'Beautician', icon: Scissors, color: 'bg-pink-500' },
  { name: 'Mechanic', icon: Car, color: 'bg-red-500' },
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Find Trusted Local Experts for Any Job
        </h1>
        <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
          Connect with vetted electricians, plumbers, tutors, and professionals near you in seconds.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto bg-white rounded-full p-2 flex items-center shadow-lg">
          <Search className="text-slate-400 ml-3 mr-2" />
          <input
            type="text"
            placeholder="Search for electrician, plumber, etc..."
            className="w-full text-slate-800 focus:outline-none px-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-medium transition">
            Search
          </button>
        </div>
      </section>

      {/* Service Categories Grid */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-8 text-center">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-slate-100 flex flex-col items-center cursor-pointer transition transform hover:-translate-y-1"
              >
                <div className={`${cat.color} p-4 rounded-full text-white mb-3`}>
                  <IconComponent size={24} />
                </div>
                <span className="font-semibold text-slate-700">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}