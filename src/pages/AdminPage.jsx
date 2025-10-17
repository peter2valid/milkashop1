import { useEffect, useMemo, useState } from "react";
import { supabase, PRODUCTS_TABLE, PRODUCT_BUCKET } from "../lib/supabaseClient.js";
import Toast from "../components/Toast.jsx";

const ADMIN_PASSWORD = "12345";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });

  const [form, setForm] = useState({ id: null, name: "", description: "", price: "", imageFile: null });

  useEffect(() => {
    if (!authed) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) { console.error(error); setProducts([]); } else { setProducts(data || []); }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, [authed]);

  async function handleUploadImage(file) {
    if (!file) return { url: null };
    const fileExt = file.name.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { data, error } = await supabase.storage.from(PRODUCT_BUCKET).upload(filePath, file, { upsert: false });
    if (error) throw error;
    const { data: publicUrl } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(data.path);
    return { url: publicUrl.publicUrl, path: data.path };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let image_url = null;
      if (form.imageFile) {
        const up = await handleUploadImage(form.imageFile);
        image_url = up.url;
      }
      if (form.id) {
        const { error } = await supabase
          .from(PRODUCTS_TABLE)
          .update({ name: form.name, description: form.description, price: form.price, ...(image_url?{ image_url }: {}) })
          .eq("id", form.id);
        if (error) throw error;
        setToast({ open: true, type: "success", message: "Updated" });
      } else {
        const { error } = await supabase
          .from(PRODUCTS_TABLE)
          .insert({ name: form.name, description: form.description, price: form.price, image_url });
        if (error) throw error;
        setToast({ open: true, type: "success", message: "Added" });
      }
      setForm({ id: null, name: "", description: "", price: "", imageFile: null });
      // refresh
      const { data } = await supabase.from(PRODUCTS_TABLE).select("*").order("created_at", { ascending: false });
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setToast({ open: true, type: "error", message: err.message || "Error" });
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq("id", id);
    if (error) { setToast({ open: true, type: "error", message: error.message }); return; }
    setProducts(products.filter(p => p.id !== id));
    setToast({ open: true, type: "success", message: "Deleted" });
  }

  function onEdit(p) {
    setForm({ id: p.id, name: p.name || "", description: p.description || "", price: p.price || "", imageFile: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!authed) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold mb-2">Admin Login</h2>
        <p className="text-sm text-gray-600 mb-4">Enter password to manage products.</p>
        <form onSubmit={(e)=>{e.preventDefault(); setAuthed(password===ADMIN_PASSWORD);}} className="space-y-3">
          <input type="password" className="w-full px-4 py-3 rounded-xl border" placeholder="Password"
            value={password} onChange={(e)=>setPassword(e.target.value)} />
          <button className="px-4 py-3 rounded-xl bg-primary-700 text-white">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-lg font-bold mb-4">Add / Edit Product</h2>
        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <div className="space-y-3">
            <input className="w-full px-4 py-3 rounded-xl border" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
            <input className="w-full px-4 py-3 rounded-xl border" placeholder="Price (KES)" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} type="number" min="0" />
          </div>
          <div className="space-y-3">
            <textarea className="w-full px-4 py-3 rounded-xl border" placeholder="Description" rows={3} value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
            <input className="w-full" type="file" accept="image/*" capture="environment" onChange={(e)=>setForm({...form,imageFile:e.target.files?.[0]||null})} />
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button className="px-4 py-3 rounded-xl bg-primary-700 text-white" type="submit">{form.id?"Save Changes":"Add Product"}</button>
            <button type="button" className="px-4 py-3 rounded-xl bg-gray-100" onClick={()=>setForm({ id:null, name:"", description:"", price:"", imageFile:null })}>Reset</button>
          </div>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Products</h3>
        {loading ? (
          <div className="grid place-items-center py-10"><div className="loader"/></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow overflow-hidden">
                <div className="aspect-[4/3] bg-gray-100">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover"/>:null}
                </div>
                <div className="p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{p.name}</div>
                    <div className="font-bold">KES {Number(p.price||0).toLocaleString("en-KE")}</div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
                  <div className="flex gap-2 pt-2">
                    <button className="px-3 py-2 rounded-lg bg-gray-100" onClick={()=>onEdit(p)}>Edit</button>
                    <button className="px-3 py-2 rounded-lg bg-red-600 text-white" onClick={()=>onDelete(p.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={()=>setToast(t=>({...t,open:false}))} />
    </div>
  );
}


