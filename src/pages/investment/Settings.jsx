import React from 'react';

const user = {
    firstname: "Muhammad Faizan",
    lastName: "khan",
    email: "faizanwebdev1@gmail.com",
    phone: "0310706255",
    gender: "male",
    dob: "1 Sep, 2003",
    national_ID: "12101-080285309",
    city: "Dera Ismail khan",
    postalCode: 29111,
    Address: "Model City"
};

export default function Settings() {
    return (
        <section className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-sm font-medium text-[#CA0A7C] uppercase tracking-wider">Profile Information</h2>
                <h1 className="text-3xl font-bold text-slate-900 mt-1">{user.firstname} {user.lastName}</h1>
            </div>

            <hr className="border-slate-100 mb-8" />

            <form className="space-y-8">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal Details</h2>
                    
                    {/* Responsive Grid Container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* First Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">First Name</label>
                            <input 
                                type="text" 
                                defaultValue={user.firstname} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#CA0A7C] focus:border-[#CA0A7C] outline-none transition-all bg-slate-50"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Last Name</label>
                            <input 
                                type="text" 
                                defaultValue={user.lastName} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#CA0A7C] focus:border-[#CA0A7C] outline-none transition-all bg-slate-50"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Email Address</label>
                            <input 
                                type="email" 
                                defaultValue={user.email} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-100 cursor-not-allowed text-slate-500" 
                                disabled 
                            />
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Phone Number</label>
                            <input 
                                type="text" 
                                defaultValue={user.phone} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#CA0A7C] transition-all"
                            />
                        </div>

                        {/* National ID */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">National ID (CNIC)</label>
                            <input 
                                type="text" 
                                defaultValue={user.national_ID} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#CA0A7C] transition-all"
                            />
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Gender</label>
                            <select defaultValue={user.gender} className="px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#CA0A7C] transition-all">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        {/* Address - Full Width */}
                        <div className="flex flex-col gap-2 md:col-span-2">
                            <label className="text-sm font-medium text-slate-700">Home Address</label>
                            <input 
                                type="text" 
                                defaultValue={user.Address} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#CA0A7C] transition-all"
                            />
                        </div>

                        {/* City */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">City</label>
                            <input 
                                type="text" 
                                defaultValue={user.city} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#CA0A7C] transition-all"
                            />
                        </div>

                        {/* Postal Code */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-slate-700">Postal Code</label>
                            <input 
                                type="number" 
                                defaultValue={user.postalCode} 
                                className="px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-[#CA0A7C] transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                    <button type="button" className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" className="px-8 py-2.5 bg-[#CA0A7C] hover:bg-[#a8086a] text-white rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95">
                        Save Changes
                    </button>
                </div>
            </form>
        </section>
    );
}