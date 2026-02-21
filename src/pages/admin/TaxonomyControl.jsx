import { useState, useEffect } from "react";
import { Plus, Tag, Layers, X, Hash, CheckCircle2, Megaphone, Trash2, Zap, Loader2 } from "lucide-react";
import taxonomyService from "../../services/taxanonmyService"; 

const initialList = {
  filters: [],
  categories: [],
};

export default function CategoriesManagement() {
  const [list, setList] = useState(initialList);
  const [filterInput, setFilterInput] = useState("");
  const [categoryInput, setCategoryInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [docIds, setDocIds] = useState({ event: null, filter: null, category: null });

  const [activeEvent, setActiveEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ subject: "", description: "" });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Parallel fetching for performance
        const [metaData, eventData] = await Promise.all([
          taxonomyService.getMetadata(),
          taxonomyService.getEvent()
        ]);

        // Find specific documents in the metadata array
        const filterDoc = metaData.find(d => d.taxonomy === "Filter");
        const categoryDoc = metaData.find(d => d.taxonomy === "Categories");

        // Set list values
        setList({
          filters: filterDoc?.Filters || [],
          categories: categoryDoc?.Categories || []
        });

        // Set active event (now a direct object, not an array)
        if (eventData) {
          setActiveEvent(eventData);
        }
        
        // Store IDs for future updates
        setDocIds({ 
          event: eventData?._id,
          filter: filterDoc?._id, 
          category: categoryDoc?._id 
        });

      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const addItem = async (type, value, setInput) => {
    if (!value.trim()) return;
    const dbType = type === 'filters' ? 'Filters' : 'Categories';
    const taxonomyKey = type === 'filters' ? 'Filter' : 'Categories';
    const docId = type === 'filters' ? docIds.filter : docIds.category;

    if (list[type].some(item => item.toLowerCase() === value.trim().toLowerCase())) {
      alert(`${value} already exists!`);
      return;
    }

    const updatedList = [...list[type], value.trim()];
    
    try {
      await taxonomyService.update(docId, { 
        taxonomy: taxonomyKey, 
        [dbType]: updatedList 
      });
      setList(prev => ({ ...prev, [type]: updatedList }));
      setInput("");
    } catch (err) {
      alert("Failed to sync with database");
    }
  };

  const removeItem = async (type, index) => {
    const dbType = type === 'filters' ? 'Filters' : 'Categories';
    const taxonomyKey = type === 'filters' ? 'Filter' : 'Categories';
    const docId = type === 'filters' ? docIds.filter : docIds.category;

    const updatedList = list[type].filter((_, i) => i !== index);

    try {
      await taxonomyService.update(docId, { 
        taxonomy: taxonomyKey, 
        [dbType]: updatedList 
      });
      setList(prev => ({ ...prev, [type]: updatedList }));
    } catch (err) {
      alert("Failed to sync removal");
    }
  };

  const handleSetEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.subject || !eventForm.description) return;

    try {
      const res = await taxonomyService.update(docIds.event, {
        taxonomy: "Event",
        ...eventForm
      });
      // Backend returns { data: updatedDoc } based on your controller
      setActiveEvent(res.data);
      setEventForm({ subject: "", description: "" });
    } catch (err) {
      alert("Announcement update failed");
    }
  };

  const sectionStyle = "bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full";
  const inputStyle = "w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition-all text-sm font-medium";
  const labelStyle = "text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2";
  const scrollBox = "mt-6 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar";

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-[#CA0A7F]" size={40} />
    </div>
  );

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="mx-auto space-y-8 p-4 md:p-8">

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
                      onClick={async () => {
                        try {
                           const res = await taxonomyService.update(docIds.event, { 
                             taxonomy: "Event", 
                             subject: "None", 
                             description: "No active event" 
                           });
                           setActiveEvent(res.data);
                        } catch (err) {
                           alert("Failed to clear announcement");
                        }
                      }}
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