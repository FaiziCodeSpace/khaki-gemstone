import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { X, Upload, CheckCircle2, Loader2, Plus, Image as ImageIcon, ChevronDown } from "lucide-react";

export default function FormBox() {
  const { productId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. STATE: Updated with Portal and Margin logic
  const [formData, setFormData] = useState({
    productNumber: "",
    name: "",
    price: "",
    description: "",
    gem_size: "",
    portal: "public", // "public" or "investor"
    marginPercentage: "", // Only for investors
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

  // 2. UX STATES: Tags and Image Previews
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
      // Fetch logic would go here
    }
  }, [productId]);

  // --- LOGIC HANDLERS ---

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
      [section]: {
        ...prev[section],
        [name]: value,
      },
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

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

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

    const finalPayload = {
      ...formData,
      tags: tags,
      imgs_src: previews.imgs_src,
      lab_test_img_src: previews.lab_test_img_src,
      certificate_img_src: previews.certificate_img_src,
    };

    console.log("Submitting Payload:", finalPayload);

    setTimeout(() => {
      setIsLoading(false);
      alert("Operation Successful!");
    }, 2000);
  };

  // --- STYLES ---
  const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CA0A7F] focus:border-transparent outline-none transition-all bg-white hover:border-[#CA0A7F]/30 appearance-none";
  const labelStyle = "block text-xs font-black text-gray-500 uppercase mb-1 tracking-widest";

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* HEADER */}
        <div className="bg-[#CA0A7F] p-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              {isEditMode ? "Edit Masterpiece" : "Add New Product"}
            </h2>
            <p className="text-pink-100 font-medium tracking-wide italic">Secure Management System</p>
          </div>
          <div className="absolute top-[-20%] right-[-5%] w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12 space-y-12">
          
          {/* NEW SECTION: DISTRIBUTION CHANNEL */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-wrap items-end gap-6">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-[10px] font-black text-pink-400 uppercase mb-2 tracking-[0.2em]">Distribution Channel</label>
              <div className="relative">
                <select 
                  name="portal" 
                  value={formData.portal} 
                  onChange={handleChange} 
                  className="w-full bg-white border border-gray-300 focus:ring-pink-400 rounded-md p-4 text-sm font-bold appearance-none cursor-pointer"
                >
                  <option value="public">🌐 Add to Public Website</option>
                  <option value="investor">💼 Add to Investor Portal</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={18} />
              </div>
            </div>

            {/* CONDITIONAL MARGIN INPUT */}
            {formData.portal === "investor" && (
              <div className="w-full md:w-64 animate-in fade-in slide-in-from-left-4 duration-500">
                <label className="block text-[10px] font-black text-pink-400 uppercase mb-2 tracking-[0.2em]">Margin Percentage (%)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="marginPercentage"
                    value={formData.marginPercentage}
                    onChange={handleChange}
                    placeholder="e.g. 15"
                    className="w-full bg-pink-600 border-none rounded-xl p-4 text-sm font-black text-white placeholder:text-pink-300 focus:ring-2 focus:ring-white outline-none"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-pink-200">%</span>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 1: CORE DATA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2 flex items-center gap-4">
               <h3 className="text-[#CA0A7F] font-black uppercase text-sm">Main Information</h3>
               <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelStyle}>Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputStyle} placeholder="Blue Sapphire" required />
              </div>
              <div>
                <label className={labelStyle}>Product Number (Unique ID)</label>
                <input type="text" name="productNumber" value={formData.productNumber} onChange={handleChange} className={inputStyle} placeholder="SKU-1002" required />
              </div>
            </div>

            <div>
              <label className={labelStyle}>Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={5} className={inputStyle} placeholder="Write the product story..."></textarea>
            </div>
          </div>

          {/* SECTION 2: NESTED DETAILS */}
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-4 flex items-center gap-4 mb-2">
               <h3 className="text-[#CA0A7F] font-black uppercase text-sm">Gemstone Details</h3>
            </div>
            <div>
              <label className={labelStyle}>Gemstone</label>
              <input type="text" name="gemstone" value={formData.details.gemstone} onChange={(e) => handleNestedChange(e, 'details')} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Cut Type</label>
              <input type="text" name="cut_type" value={formData.details.cut_type} onChange={(e) => handleNestedChange(e, 'details')} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Color</label>
              <input type="text" name="color" value={formData.details.color} onChange={(e) => handleNestedChange(e, 'details')} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Clarity</label>
              <input type="text" name="clarity" value={formData.details.clarity} onChange={(e) => handleNestedChange(e, 'details')} className={inputStyle} />
            </div>
          </div>

          {/* SECTION 3: TECHNICAL & PRICING */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-3 flex items-center gap-4">
               <h3 className="text-[#CA0A7F] font-black uppercase text-sm">Technical & Pricing</h3>
               <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>
            <div>
              <label className={labelStyle}>Base Price (Rs)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Gem Size (mm)</label>
              <input type="text" name="gem_size" value={formData.gem_size} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Weight (Carats)</label>
              <input type="number" name="weight" value={formData.more_information.weight} onChange={(e) => handleNestedChange(e, 'more_information')} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Origin</label>
              <input type="text" name="origin" value={formData.more_information.origin} onChange={(e) => handleNestedChange(e, 'more_information')} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Treatment</label>
              <input type="text" name="treatment" value={formData.more_information.treatment} onChange={(e) => handleNestedChange(e, 'more_information')} className={inputStyle} />
            </div>
            <div>
              <label className={labelStyle}>Refractive Index</label>
              <input type="text" name="refractive_index" value={formData.more_information.refractive_index} onChange={(e) => handleNestedChange(e, 'more_information')} className={inputStyle} />
            </div>
          </div>

          {/* SECTION 4: TAGS & VISIBILITY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className={labelStyle}>Smart Tags (Press Enter)</label>
              <div className={`${inputStyle} flex flex-wrap gap-2 items-center min-h-[56px] focus-within:ring-2 focus-within:ring-[#CA0A7F]`}>
                {tags.map((tag, idx) => (
                  <span key={idx} className="bg-[#CA0A7F] text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-2 uppercase tracking-tighter animate-in zoom-in">
                    {tag} <X size={12} className="cursor-pointer hover:text-black" onClick={() => removeTag(idx)} />
                  </span>
                ))}
                <input 
                  type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                  className="flex-1 outline-none text-sm bg-transparent" placeholder="Add keywords..." 
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-pink-50 rounded-2xl border border-pink-100 mt-5">
              <div>
                <p className="font-black text-[#CA0A7F] text-sm uppercase">Limited Edition</p>
                <p className="text-[10px] text-pink-700 font-bold uppercase tracking-tight">Show exclusivity badge</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="isLimitedProduct" checked={formData.isLimitedProduct} onChange={handleChange} className="sr-only peer" />
                <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-[#CA0A7F] after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7"></div>
              </label>
            </div>
          </div>

          {/* SECTION 5: MULTI-IMAGE GALLERY */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <h3 className="text-[#CA0A7F] font-black uppercase text-sm">Product Gallery</h3>
               <div className="h-[1px] flex-1 bg-gray-100"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <label className="h-32 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-[#CA0A7F] hover:text-[#CA0A7F] transition-all cursor-pointer bg-gray-50 hover:bg-white group">
                <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-[10px] font-black mt-2 uppercase tracking-widest">Add Image</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleMultipleFiles} />
              </label>

              {previews.imgs_src.map((src, index) => (
                <div key={index} className="h-32 relative group rounded-2xl overflow-hidden shadow-lg border border-white animate-in fade-in slide-in-from-bottom-2">
                  <img src={src} alt="Gallery" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-2 right-2 bg-white text-[#CA0A7F] p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={14} />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-0 inset-x-0 bg-[#CA0A7F] text-white text-[8px] font-black py-1 text-center uppercase tracking-widest">Cover</div>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
              <MediaInput 
                label="Lab Test Report" 
                preview={previews.lab_test_img_src} 
                onChange={(e) => handleSingleFile(e, 'lab_test_img_src')} 
              />
              <MediaInput 
                label="Authenticity Certificate" 
                preview={previews.certificate_img_src} 
                onChange={(e) => handleSingleFile(e, 'certificate_img_src')} 
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit"
            disabled={isLoading}
            className={`w-full py-6 rounded-2xl font-black tracking-[0.3em] text-white transition-all shadow-2xl flex items-center justify-center gap-4 uppercase
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#CA0A7F] hover:bg-[#a8086a] active:scale-[0.98] shadow-pink-200'}
            `}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                <CheckCircle2 size={24} />
                {isEditMode ? "Update Collection Item" : "Publish to Inventory"}
              </>
            )}
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
      <div className="h-48 relative border-2 border-dashed border-gray-200 rounded-3xl overflow-hidden group hover:border-[#CA0A7F] transition-all bg-gray-50 flex flex-col items-center justify-center">
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover animate-in fade-in" />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300 group-hover:text-[#CA0A7F] transition-colors">
            <ImageIcon size={40} strokeWidth={1} />
            <span className="text-[10px] font-black mt-3 uppercase tracking-tighter">Upload Certificate</span>
          </div>
        )}
        <input type="file" onChange={onChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
        {preview && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="text-white text-[10px] font-black tracking-widest border border-white px-4 py-2 rounded-full">CHANGE FILE</span>
          </div>
        )}
      </div>
    </div>
  );
}