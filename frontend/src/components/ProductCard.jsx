import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/format';

export default function ProductCard({ product, onAddToCart }) {
  const hasImage = product.images?.[0];

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img
          src={hasImage || 'https://via.placeholder.com/500x500?text=Fashion'}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {product.category}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-1 text-lg font-bold text-slate-800">{product.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>

        <div className="flex items-center justify-between">
          <p className="text-lg font-extrabold text-brand">{formatCurrency(product.price)}</p>
          <p className="text-xs text-slate-500">คงเหลือ {product.stock}</p>
        </div>

        <div className="flex gap-2">
          <Link
            className="w-1/2 rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            to={`/products/${product._id}`}
          >
            รายละเอียด
          </Link>
          <button
            onClick={() => onAddToCart(product._id)}
            className="w-1/2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </article>
  );
}