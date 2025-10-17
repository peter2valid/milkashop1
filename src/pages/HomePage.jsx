import { useEffect, useMemo, useState } from "react";
import { supabase, PRODUCTS_TABLE } from "../lib/supabaseClient.js";
import SearchBar from "../components/SearchBar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Modal from "../components/Modal.jsx";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from(PRODUCTS_TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (!mounted) return;
      if (error) {
        console.error(error);
        setProducts([]);
      } else {
        setProducts(data || []);
      }
      setLoading(false);
    })();
    const channel = supabase
      .channel("products-realtime")
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: PRODUCTS_TABLE },
        (payload) => {
          setProducts((prev) => {
            if (payload.eventType === 'INSERT') {
              return [payload.new, ...prev];
            }
            if (payload.eventType === 'UPDATE') {
              return prev.map(p => p.id === payload.new.id ? payload.new : p);
            }
            if (payload.eventType === 'DELETE') {
              return prev.filter(p => p.id !== payload.old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter(p => p.name?.toLowerCase().includes(q));
  }, [products, query]);

  return (
    <div className="space-y-4">
      <SearchBar value={query} onChange={setQuery} />
      {loading ? (
        <div className="grid place-items-center py-10"><div className="loader"/></div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div className="p-4 space-y-3">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
              {selected.image_url ? (
                <img src={selected.image_url} alt={selected.name} className="w-full h-full object-cover" />
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">{selected.name}</h3>
              <div className="font-extrabold text-primary-900">KES {Number(selected.price||0).toLocaleString("en-KE")}</div>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{selected.description}</p>
            <div className="flex justify-end">
              <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}


