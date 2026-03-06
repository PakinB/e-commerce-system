import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/api';
import { formatCurrency } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    productService.detail(id).then(({ data }) => {
      setProduct(data.product);
      setSize(data.product.sizes?.[0] || '');
    });
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addItem(product._id, 1);
      alert('เพิ่มสินค้าเรียบร้อยแล้ว');
    } catch {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
    }
  };

  if (!product) return <div className="p-8 text-center text-slate-500">กำลังโหลดสินค้า...</div>;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="glass-card grid gap-8 p-6 md:grid-cols-2 md:p-8">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/500x500?text=Fashion'}
          alt={product.name}
          className="h-[500px] w-full rounded-2xl object-cover"
        />

        <div>
          <p className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            หมวดหมู่ {product.category}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{product.name}</h1>
          <p className="mt-4 leading-relaxed text-slate-600">{product.description}</p>
          <p className="mt-5 text-3xl font-extrabold text-brand">{formatCurrency(product.price)}</p>

          <div className="mt-5 flex items-end gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700">ไซซ์</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="mt-2 block rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              >
                {product.sizes?.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <p className="text-sm text-slate-500">คงเหลือ {product.stock} ชิ้น</p>
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-8 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800"
          >
            เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    </main>
  );
}