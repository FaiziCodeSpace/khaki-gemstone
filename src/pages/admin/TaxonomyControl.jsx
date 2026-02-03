import { useState } from "react";
import { Plus, Tag, Layers, X, Hash, CheckCircle2, Megaphone, Trash2, Zap } from "lucide-react";

const initialList = {
  filters: ["Ruby", "Sapphire", "Emerald", "Diamond", "Amethyst", "Topaz", "Aquamarine"],
  categories: ["Rough Stones", "Cut Stones", "Jewelry", "Pearls", "Rings", "Necklaces", "Bracelets"],
};

export default function CategoriesManagement() {
  const [list, setList] = useState(initialList);
  const [filterInput, setFilterInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");

  // Single Active Event State
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ subject: "", description: "" });

  const addItem = (type, value, setInput) => {
    if (!value.trim()) return;
    if (list[type].some(item => item.toLowerCase() === value.trim().toLowerCase())) {
      alert(`${value} already exists!`);
      return;
    }
    setList(prev => ({ ...prev, [type]: [...prev[type], value.trim()] }));
    setInput("");
  };

  const removeItem = (type, index) => {
    setList(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));
  };

  const handleSetEvent = (e) => {
    e.preventDefault();
    if (!eventForm.subject || !eventForm.description) return;
    setActiveEvent({ ...eventForm });
    setEventForm({ subject: "", description: "" });
  };

  const sectionStyle = "bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full";
  const inputStyle = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition-all text-sm font-medium";
  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2";
  const scrollBox = "mt-6 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar";

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Management Hub</h2>
            <p className="text-sm text-gray-500">Configure store metadata and active announcements.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
            <CheckCircle2 size={16} className="text-[#CA0A7F]" />
            <span className="text-[10px] font-black text-[#CA0A7F] uppercase tracking-tighter">System Active</span>
          </div>
        </div>

        {/* TOP ROW: FILTERS & CATEGORIES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className={sectionStyle}>
            <label className={labelStyle}><Hash size={14} className="text-[#CA0A7F]" /> Search Filters</label>
            <div className="flex gap-2">
              <input
                type="text" value={filterInput}
                onChange={(e) => setFilterInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('filters', filterInput, setFilterInput)}
                placeholder="Add filter..." className={inputStyle}
              />
              <button onClick={() => addItem('filters', filterInput, setFilterInput)} className="bg-[#CA0A7F] text-white px-4 rounded-xl hover:bg-black transition-all">
                <Plus size={20} />
              </button>
            </div>
            <div className={scrollBox}>
              <div className="flex flex-wrap gap-2">
                {list.filters.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold uppercase hover:border-[#CA0A7F] transition-all group">
                    {item} <X size={12} className="cursor-pointer text-gray-300 group-hover:text-red-500" onClick={() => removeItem('filters', idx)} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={sectionStyle}>
            <label className={labelStyle}><Layers size={14} className="text-[#CA0A7F]" /> Store Categories</label>
            <div className="flex gap-2">
              <input
                type="text" value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addItem('categories', categoryInput, setCategoryInput)}
                placeholder="Add category..." className={inputStyle}
              />
              <button onClick={() => addItem('categories', categoryInput, setCategoryInput)} className="bg-black text-white px-4 rounded-xl hover:bg-[#CA0A7F] transition-all">
                <Plus size={20} />
              </button>
            </div>
            <div className={scrollBox}>
              <div className="flex flex-wrap gap-2">
                {list.categories.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase hover:bg-[#CA0A7F] transition-all group">
                    <Tag size={10} className="text-pink-400" /> {item}
                    <X size={12} className="cursor-pointer text-white/30 group-hover:text-white" onClick={() => removeItem('categories', idx)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: SINGLE ACTIVE EVENT */}
        <div className={`${sectionStyle} !h-auto`}>
          <label className={labelStyle}><Megaphone size={14} className="text-[#CA0A7F]" /> Global Announcement</label>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Set Event Form */}
            <form onSubmit={handleSetEvent} className="lg:col-span-1 space-y-4">
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase ml-1">Update Subject</p>
                <input
                  type="text" placeholder="e.g. Winter Clearance"
                  className={inputStyle} value={eventForm.subject}
                  onChange={(e) => setEventForm({ ...eventForm, subject: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <p className="text-[9px] font-bold text-gray-400 uppercase ml-1">Announcement Details</p>
                <textarea
                  placeholder="Describe the promotion..." rows={3}
                  className={`${inputStyle} resize-none`} value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                />
              </div>
              <button type="submit" className="w-full bg-[#CA0A7F] text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-md">
                Deploy Announcement
              </button>
            </form>

            {/* Current Active Event Status */}
            <div className="lg:col-span-2 border-l border-gray-100 lg:pl-8 flex flex-col justify-center">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4">Live Status</p>

              {activeEvent ? (
                <div className="p-6 rounded-2xl border-2 border-pink-100 bg-pink-50/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-2">
                    <Zap size={16} className="text-pink-400 animate-pulse" />
                  </div>
                  <div className="relative z-10">
                    <h5 className="font-black text-[#CA0A7F] uppercase text-lg tracking-tight">{activeEvent.subject}</h5>
                    <p className="text-sm text-pink-900/70 mt-2 leading-relaxed font-medium">{activeEvent.description}</p>
                    <button
                      onClick={() => setActiveEvent(null)}
                      className="mt-6 flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={14} /> Clear Announcement
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center py-12 text-gray-300">
                  <Megaphone size={32} strokeWidth={1} className="opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest mt-3">No Active Announcement</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CA0A7F; }
      `}} />
    </section>
  );
}