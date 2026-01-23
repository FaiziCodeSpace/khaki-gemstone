import { useState } from "react";
import { Search, User, MapPin, CreditCard, Clock, ChevronRight, Filter } from "lucide-react";

const applications = [
  { name: "Ali", lastName: "Ahmed", cnic: "35201-4567890-1", Applied_at: new Date().toLocaleDateString(), address: "Gulshan-e-Iqbal", City: "Karachi" },
  { name: "Usman", lastName: "Raza", cnic: "61101-2345678-2", Applied_at: new Date().toLocaleDateString(), address: "Satellite Town", City: "Quetta" },
  { name: "Ayesha", lastName: "Malik", cnic: "37405-9876543-3", Applied_at: new Date().toLocaleDateString(), address: "Johar Town", City: "Lahore" },
  { name: "Hamza", lastName: "Sheikh", cnic: "42201-1122334-4", Applied_at: new Date().toLocaleDateString(), address: "North Nazimabad", City: "Karachi" },
  { name: "Zainab", lastName: "Khan", cnic: "33100-5566778-5", Applied_at: new Date().toLocaleDateString(), address: "University Road", City: "Peshawar" },
  { name: "Bilal", lastName: "Hussain", cnic: "36502-9988776-6", Applied_at: new Date().toLocaleDateString(), address: "Cantt Area", City: "Sialkot" },
  { name: "Sara", lastName: "Iqbal", cnic: "61101-4433221-7", Applied_at: new Date().toLocaleDateString(), address: "Jinnah Town", City: "Quetta" },
  { name: "Imran", lastName: "Farooq", cnic: "42101-6677889-8", Applied_at: new Date().toLocaleDateString(), address: "PECHS", City: "Karachi" },
  { name: "Noman", lastName: "Ali", cnic: "17301-2233445-9", Applied_at: new Date().toLocaleDateString(), address: "Main Bazaar", City: "Swat" },
  { name: "Hira", lastName: "Yousaf", cnic: "38403-7788990-0", Applied_at: new Date().toLocaleDateString(), address: "Civil Lines", City: "Faisalabad" },
];

export default function Investors() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = applications.filter(app => 
    `${app.name} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.cnic.includes(searchTerm)
  );

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-800 flex items-center gap-2">
              <User size={24} className="text-[#CA0A7F]" /> 
              Investor Applications
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Reviewing {filteredApps.length} pending submissions
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Search by Name or CNIC..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition-all text-sm font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredApps.map((app, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#CA0A7F]/30 transition-all flex flex-col justify-between relative overflow-hidden"
            >
              {/* Status Indicator */}
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-pink-50 text-[#CA0A7F] text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-tighter border border-pink-100">
                  New
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-black text-sm">
                    {app.name[0]}{app.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 uppercase tracking-tight leading-tight">
                      {app.name} {app.lastName}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock size={10} />
                      <span className="text-[10px] font-bold">{app.Applied_at}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border-t border-gray-50 pt-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CreditCard size={14} className="text-[#CA0A7F]" />
                    <span className="text-xs font-medium tracking-tight">{app.cnic}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin size={14} className="text-[#CA0A7F] mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-800">{app.City}</p>
                      <p className="text-[11px] text-gray-500 leading-none mt-1">{app.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="mt-6 w-full py-2 bg-gray-50 group-hover:bg-[#CA0A7F] group-hover:text-white text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                View Profile <ChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredApps.length === 0 && (
          <div className="bg-white rounded-3xl p-20 border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Filter size={32} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">No applicants found</h3>
            <p className="text-sm text-gray-400 max-w-xs mx-auto">Try adjusting your search terms to find the investor profile you're looking for.</p>
          </div>
        )}
      </div>
    </section>
  );
}