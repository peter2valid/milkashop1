export default function ProductCard({ product, onClick }) {
  const { name, price, image_url } = product;
  return (
    <button onClick={onClick} className="text-left bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden border">
      <div className="aspect-[4/3] bg-gray-100">
        {image_url ? (
          <img src={image_url} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-gray-400">No Image</div>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold truncate">{name}</h3>
          <span className="font-bold text-primary-800">KES {Number(product.price||0).toLocaleString("en-KE")}</span>
        </div>
      </div>
    </button>
  );
}


