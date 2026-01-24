import { useState } from "react";
import { Search, User, MapPin, CreditCard, Clock, ChevronRight, Filter, X, Phone, Mail, Calendar, Users, Check, Ban } from "lucide-react";

const applications = [
    {
        name: "Ali",
        lastName: "Ahmed",
        cnic: "35201-4567890-1",
        email: "ali.ahmed@gmail.com",
        phone: "0301-1234567",
        dob: "1995-04-12",
        gender: "Male",
        Applied_at: new Date().toLocaleDateString(),
        address: "Gulshan-e-Iqbal",
        City: "Karachi"
    },
    {
        name: "Usman",
        lastName: "Raza",
        cnic: "61101-2345678-2",
        email: "usman.raza@gmail.com",
        phone: "0333-7654321",
        dob: "1992-09-18",
        gender: "Male",
        Applied_at: new Date().toLocaleDateString(),
        address: "Satellite Town",
        City: "Quetta"
    },
    {
        name: "Ayesha",
        lastName: "Malik",
        cnic: "37405-9876543-3",
        email: "ayesha.malik@gmail.com",
        phone: "0312-9988776",
        dob: "1997-01-25",
        gender: "Female",
        Applied_at: new Date().toLocaleDateString(),
        address: "Johar Town",
        City: "Lahore"
    },
    {
        name: "Hamza",
        lastName: "Sheikh",
        cnic: "42201-1122334-4",
        email: "hamza.sheikh@gmail.com",
        phone: "0345-2233445",
        dob: "1994-06-30",
        gender: "Male",
        Applied_at: new Date().toLocaleDateString(),
        address: "North Nazimabad",
        City: "Karachi"
    },
    {
        name: "Zainab",
        lastName: "Khan",
        cnic: "33100-5566778-5",
        email: "zainab.khan@gmail.com",
        phone: "0309-4455667",
        dob: "1998-11-09",
        gender: "Female",
        Applied_at: new Date().toLocaleDateString(),
        address: "University Road",
        City: "Peshawar"
    },
    {
        name: "Bilal",
        lastName: "Hussain",
        cnic: "36502-9988776-6",
        email: "bilal.hussain@gmail.com",
        phone: "0321-8899776",
        dob: "1991-03-14",
        gender: "Male",
        Applied_at: new Date().toLocaleDateString(),
        address: "Cantt Area",
        City: "Sialkot"
    },
    {
        name: "Sara",
        lastName: "Iqbal",
        cnic: "61101-4433221-7",
        email: "sara.iqbal@gmail.com",
        phone: "0315-3344556",
        dob: "1996-07-21",
        gender: "Female",
        Applied_at: new Date().toLocaleDateString(),
        address: "Jinnah Town",
        City: "Quetta"
    },
    {
        name: "Imran",
        lastName: "Farooq",
        cnic: "42101-6677889-8",
        email: "imran.farooq@gmail.com",
        phone: "0300-6677889",
        dob: "1989-12-05",
        gender: "Male",
        Applied_at: new Date().toLocaleDateString(),
        address: "PECHS",
        City: "Karachi"
    },
    {
        name: "Noman",
        lastName: "Ali",
        cnic: "17301-2233445-9",
        email: "noman.ali@gmail.com",
        phone: "0340-2233445",
        dob: "1993-05-17",
        gender: "Male",
        Applied_at: new Date().toLocaleDateString(),
        address: "Main Bazaar",
        City: "Swat"
    },
    {
        name: "Hira",
        lastName: "Yousaf",
        cnic: "38403-7788990-0",
        email: "hira.yousaf@gmail.com",
        phone: "0322-7788990",
        dob: "1999-08-28",
        gender: "Female",
        Applied_at: new Date().toLocaleDateString(),
        address: "Civil Lines",
        City: "Faisalabad"
    }
];

export default function Investors() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);

    const filteredApps = applications.filter(app =>
        `${app.name} ${app.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.cnic.includes(searchTerm)
    );

    const handleAction = (id, status) => {
        console.log(`Application ${id} status updated to: ${status}`);
        setSelectedApp(null);
    };

    return (
        <section className="min-h-screen bg-gray-50 relative pb-10">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* TOP BAR */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-gray-800 flex items-center gap-2">
                            <User size={24} className="text-[#CA0A7F]" />
                            Investor Applications
                        </h2>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                            Reviewing {filteredApps.length} pending submissions
                        </p>
                    </div>

                    <div className="relative w-full md:w-80 lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search Name or CNIC..."
                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition-all text-sm font-medium"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* GRID LAYOUT */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredApps.map((app, index) => (
                        <div key={index} className="group bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <div className="bg-pink-50 text-[#CA0A7F] text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter border border-pink-100">New</div>
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0">
                                        {app.name[0]}{app.lastName[0]}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-gray-800 uppercase tracking-tight leading-tight truncate">{app.name} {app.lastName}</h3>
                                        <div className="flex items-center gap-1 text-gray-400 mt-1">
                                            <Clock size={12} /><span className="text-[10px] font-bold">{app.Applied_at}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-gray-50 pt-5">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                                            <CreditCard size={14} className="text-[#CA0A7F]" />
                                        </div>
                                        <span className="text-xs font-bold tracking-tight text-gray-700">{app.cnic}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                            <MapPin size={14} className="text-[#CA0A7F]" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-gray-800">{app.City}</p>
                                            <p className="text-[10px] text-gray-500 truncate leading-tight mt-0.5">{app.address}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedApp(app)}
                                className="mt-6 w-full py-3 bg-gray-50 hover:bg-[#CA0A7F] hover:text-white text-gray-500 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2"
                            >
                                View Profile <ChevronRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- MODAL DIALOG --- */}
            {selectedApp && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg sm:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300 max-h-[95vh] overflow-y-auto">
                        
                        {/* Modal Header */}
                        <div className="relative bg-gray-900 p-6 md:p-8 text-white">
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X size={18} />
                            </button>
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 md:w-20 md:h-20 bg-[#CA0A7F] rounded-[1.5rem] flex items-center justify-center text-xl md:text-3xl font-black shadow-xl shadow-pink-500/20">
                                    {selectedApp.name[0]}{selectedApp.lastName[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-tight">{selectedApp.name} <br className="block md:hidden" /> {selectedApp.lastName}</h2>
                                    <p className="text-[#CA0A7F] text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mt-1">Pending Approval</p>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8">
                                <DetailItem icon={<Mail size={14}/>} label="Email Address" value={selectedApp.email} />
                                <DetailItem icon={<Phone size={14}/>} label="Contact Number" value={selectedApp.phone} />
                                <DetailItem icon={<Calendar size={14}/>} label="Date of Birth" value={selectedApp.dob} />
                                <DetailItem icon={<Users size={14}/>} label="Gender" value={selectedApp.gender} />
                            </div>

                            <div className="p-5 bg-gray-50 rounded-[2rem] border border-gray-100">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                                    <MapPin size={12} className="text-[#CA0A7F]" /> Verified Residency
                                </p>
                                <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedApp.address}, {selectedApp.City}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 md:gap-4 pt-2 pb-6 sm:pb-0">
                                <button
                                    onClick={() => handleAction(selectedApp.cnic, 'rejected')}
                                    className="order-2 sm:order-1 flex items-center justify-center gap-3 py-4 md:py-5 border-2 border-gray-100 text-gray-500 hover:text-red-600 hover:border-red-100 hover:bg-red-50 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all"
                                >
                                    <Ban size={18} /> Decline
                                </button>
                                <button
                                    onClick={() => handleAction(selectedApp.cnic, 'approved')}
                                    className="order-1 sm:order-2 flex items-center justify-center gap-3 py-4 md:py-5 bg-gray-900 text-white hover:bg-[#CA0A7F] rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-gray-200"
                                >
                                    <Check size={18} /> Approve Investor
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

// Sub-component for cleaner modal code
function DetailItem({ icon, label, value }) {
    return (
        <div className="space-y-1.5">
            <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase flex items-center gap-2 tracking-widest">
                <span className="text-[#CA0A7F]">{icon}</span> {label}
            </p>
            <p className="text-sm md:text-base font-bold text-gray-800 break-words">{value}</p>
        </div>
    );
}