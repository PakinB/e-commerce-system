import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    productService.list({ page: 1, limit: 8, search }).then(({ data }) => {
      setProducts(data.products);
      setCategories(data.categories || []);
    });
  }, [search]);

  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId);
    } catch {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
    }
  };

  return (
    <main className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      <section className="glass-card overflow-hidden p-6 md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="inline-block rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">คอลเลกชันใหม่ล่าสุด</p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              เสื้อผ้าดีไซน์เรียบหรู
              <br />
              ใส่ได้ทุกวัน
            </h1>
            <p className="mt-4 text-slate-600">
              คัดสรรเสื้อผ้าคุณภาพสำหรับทุกสไตล์ พร้อมจัดส่งรวดเร็วทั่วประเทศ
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/products" className="rounded-xl bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800">
                เลือกซื้อสินค้า
              </Link>
              <Link to="/register" className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
                สมัครสมาชิก
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-cyan-700 to-emerald-700 p-6 text-white shadow-xl">
            <h2 className="text-2xl font-bold">ค้นหาแฟชั่นที่ใช่</h2>
            <p className="mt-2 text-cyan-50">พิมพ์ชื่อสินค้า หมวดหมู่ หรือคำที่ต้องการ</p>
            <div className="mt-5">
              <SearchBar value={search} onChange={setSearch} placeholder="เช่น เสื้อเชิ้ตสีขาว" />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.slice(0, 8).map((category) => (
                <span key={category} className="rounded-full bg-white/15 px-3 py-1 text-xs">
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">สินค้าแนะนำ</h2>
          <Link to="/products" className="text-sm font-semibold text-brand hover:underline">ดูทั้งหมด</Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
          ))}
        </div>
      </section>
    </main>
  );
}