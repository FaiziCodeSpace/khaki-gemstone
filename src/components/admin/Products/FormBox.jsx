import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { X, Upload, CheckCircle2, Loader2, Plus, Image as ImageIcon, ChevronDown } from "lucide-react";

export default function FormBox() {
  const { productId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    productNumber: "",
    name: "",
    price: "",
    description: "",
    gem_size: "",
    portal: "public",
    marginPercentage: "",
    details: {
      gemstone: "",
      cut_type: "",
      color: "",
      clarity: "",
    },
    more_information: {
      weight: "",
      origin: "",
      treatment: "",
      refractive_index: "",
    },
    isLimitedProduct: true,
  });

  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [previews, setPreviews] = useState({
    imgs_src: [],
    lab_test_img_src: null,
    certificate_img_src: null,
  });

  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
    }
  }, [productId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (e, section) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [name]: value },
    }));
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => setTags(tags.filter((_, i) => i !== index));

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({
          ...prev,
          imgs_src: [...prev.imgs_src, reader.result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    setPreviews((prev) => ({
      ...prev,
      imgs_src: prev.imgs_src.filter((_, i) => i !== index),
    }));
  };

  const handleSingleFile = (e, key) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [key]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Inventory Synchronized!");
    }, 2000);
  };

  const inputStyle = "w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition-all bg-white text-sm lg:text-base";
  const labelStyle = "block text-[10px] lg:text-xs font-black text-gray-400 uppercase mb-2 tracking-[0.15em]";

  return (
    <section className="min-h-screen bg-gray-50 py-6 md:py-12 px-4 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl md:rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
        
        {/* RESPONSIVE HEADER */}
        <div className="bg-[#CA0A7F] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
              {isEditMode ? "Update Asset" : "Vault Entry"}
            </h2>
            <p className="text-pink-100 text-xs md:text-sm mt-2 font-bold uppercase tracking-widest opacity-80">Inventory Management System</p>
          </div>
          <div className="absolute top-[-40%] right-[-10%] w-64 h-64 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 lg:p-14 space-y-10 md:space-y-16">
          
          {/* DISTRIBUTION CHANNEL - Fluid Flex */}
          <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 flex flex-col md:flex-row items-stretch md:items-end gap-6">
            <div className="flex-1">
              <label className={labelStyle}>Target Portal</label>
              <div className="relative">
                <select 
                  name="portal" 
                  value={formData.portal} 
                  onChange={handleChange} 
                  className="w-full bg-white border border-gray-300 rounded-xl p-4 text-sm font-bold appearance-none cursor-pointer pr-10 focus:ring-2 focus:ring-[#CA0A7F]"
                >
                  <option value="public">🌐 Public Website</option>
                  <option value="investor">💼 Investor Portal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={18} />
              </div>
            </div>

            {formData.portal === "investor" && (
              <div className="w-full md:w-56 animate-in zoom-in-95 duration-300">
                <label className={labelStyle}>Margin (%)</label>
                <div className="relative">
                  <input type="number" name="marginPercentage" value={formData.marginPercentage} onChange={handleChange} placeholder="0" className={`${inputStyle} font-black !p-4 border-none bg-gray-900 text-white placeholder:text-gray-600`} required />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-500">%</span>
                </div>
              </div>
            )}
          </div>

          {/* MAIN INFO - Responsive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                 <h3 className="text-[#CA0A7F] font-black uppercase text-xs tracking-widest">General Info</h3>
                 <div className="h-px flex-1 bg-gray-100"></div>
              </div>
              <div>
                <label className={labelStyle}>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} placeholder="Emerald Cut Diamond" required />
              </div>
              <div>
                <label className={labelStyle}>SKU / Product ID</label>
                <input type="text" name="productNumber" value={formData.productNumber} onChange={handleChange} className={inputStyle} placeholder="SKU-9921" required />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="hidden lg:flex items-center gap-3 mb-2">
                 <h3 className="text-[#CA0A7F] font-black uppercase text-xs tracking-widest">Storytelling</h3>
                 <div className="h-px flex-1 bg-gray-100"></div>
              </div>
              <label className={`${labelStyle} lg:hidden`}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputStyle} flex-1 min-h-[120px] lg:min-h-0`} placeholder="Describe the rarity and heritage..."></textarea>
            </div>
          </div>

          {/* NESTED DETAILS - Mobile 2-col, Desktop 4-col */}
          <div className="bg-gray-50/50 p-6 md:p-8 rounded-[2rem] border border-gray-100">
            <h3 className="text-[#CA0A7F] font-black uppercase text-[10px] tracking-[0.2em] mb-8 text-center md:text-left underline underline-offset-8 decoration-pink-200">Gemological Specifications</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {['gemstone', 'cut_type', 'color', 'clarity'].map((field) => (
                <div key={field}>
                  <label className={labelStyle}>{field.replace('_', ' ')}</label>
                  <input type="text" name={field} value={formData.details[field]} onChange={(e) => handleNestedChange(e, 'details')} className={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* TECH & PRICING - Mobile 1-col, Tablet 2-col, Desktop 3-col */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div>
              <label className={labelStyle}>Base Price (Rs)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className={`${inputStyle} font-bold text-[#CA0A7F]`} />
            </div>
            {['weight', 'origin', 'treatment', 'refractive_index'].map((info) => (
              <div key={info}>
                <label className={labelStyle}>{info.replace('_', ' ')}</label>
                <input type="text" name={info} value={formData.more_information[info]} onChange={(e) => handleNestedChange(e, 'more_information')} className={inputStyle} />
              </div>
            ))}
             <div>
              <label className={labelStyle}>Size (mm)</label>
              <input type="text" name="gem_size" value={formData.gem_size} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          {/* TAGS & TOGGLES */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <label className={labelStyle}>Search Keywords</label>
              <div className={`${inputStyle} flex flex-wrap gap-2 items-center min-h-[60px]`}>
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-gray-900 text-white text-[9px] font-black px-3 py-1.5 rounded-lg flex items-center gap-2 uppercase tracking-wider">
                    {tag} <X size={12} className="cursor-pointer hover:text-pink-400" onClick={() => removeTag(idx)} />
                  </span>
                ))}
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} className="flex-1 outline-none text-sm bg-transparent min-w-[100px]" placeholder="Type & Enter..." />
              </div>
            </div>

            <div className="bg-pink-50 p-6 rounded-2xl flex items-center justify-between border border-pink-100">
               <div>
                 <p className="font-black text-[#CA0A7F] text-xs uppercase tracking-tight">Limited Edition</p>
                 <p className="text-[10px] text-pink-400 font-bold uppercase leading-tight">Badge Visibility</p>
               </div>
               <label className="relative inline-flex items-center cursor-pointer scale-110">
                <input type="checkbox" name="isLimitedProduct" checked={formData.isLimitedProduct} onChange={handleChange} className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#CA0A7F] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-6"></div>
              </label>
            </div>
          </div>

          {/* GALLERY - Grid of 2 to 6 columns */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
               <h3 className="text-[#CA0A7F] font-black uppercase text-xs tracking-widest">Media Assets</h3>
               <div className="h-px flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <label className="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-[#CA0A7F] hover:bg-pink-50/30 transition-all cursor-pointer group">
                <Plus size={20} className="group-hover:scale-125 transition-transform" />
                <span className="text-[8px] font-black mt-2 uppercase tracking-tighter">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleMultipleFiles} />
              </label>

              {previews.imgs_src.map((src, index) => (
                <div key={index} className="aspect-square relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm text-red-500 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MediaInput label="Laboratory Report" preview={previews.lab_test_img_src} onChange={(e) => handleSingleFile(e, 'lab_test_img_src')} />
              <MediaInput label="Authenticity Certificate" preview={previews.certificate_img_src} onChange={(e) => handleSingleFile(e, 'certificate_img_src')} />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-5 lg:py-7 rounded-2xl font-black tracking-[0.3em] text-white transition-all shadow-xl flex items-center justify-center gap-4 uppercase text-xs lg:text-sm ${isLoading ? 'bg-gray-300' : 'bg-[#CA0A7F] hover:brightness-110 active:scale-[0.99]'}`}>
            {isLoading ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} />{isEditMode ? "Save Changes" : "Commit to Inventory"}</>}
          </button>
        </form>
      </div>
    </section>
  );
}

function MediaInput({ label, preview, onChange }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">{label}</label>
      <div className="h-44 relative border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex flex-col items-center justify-center group hover:border-[#CA0A7F] transition-all">
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center opacity-30 group-hover:opacity-100 group-hover:text-[#CA0A7F] transition-all">
            <ImageIcon size={32} className="mx-auto" strokeWidth={1.5} />
            <p className="text-[8px] font-black mt-2 uppercase tracking-widest">Select File</p>
          </div>
        )}
        <input type="file" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
      </div>
    </div>
  );
}