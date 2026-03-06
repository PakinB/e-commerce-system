import { useEffect, useState } from 'react';
import Pagination from '../components/Pagination';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import { useCart } from '../hooks/useCart';
import { productService } from '../services/api';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    page: 1,
    limit: 8,
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const { addItem } = useCart();

  useEffect(() => {
    productService.list(filters).then(({ data }) => {
      setProducts(data.products);
      setCategories(data.categories || []);
      setPagination(data.pagination);
    });
  }, [filters]);

  const handleAddToCart = async (productId) => {
    try {
      await addItem(productId);
    } catch {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มสินค้าลงตะกร้า');
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="glass-card p-5">
        <h1 className="text-3xl font-extrabold text-slate-900">เลือกซื้อสินค้า</h1>
        <p className="mt-1 text-sm text-slate-500">ค้นหาและกรองสินค้าตามหมวดหมู่และช่วงราคา</p>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <SearchBar
              value={filters.search}
              onChange={(search) => setFilters((prev) => ({ ...prev, search, page: 1 }))}
            />
          </div>

          <select
            value={filters.category}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value, page: 1 }))}
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none focus:border-brand"
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value, page: 1 }))}
              placeholder="ต่ำสุด"
              className="rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-brand"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value, page: 1 }))}
              placeholder="สูงสุด"
              className="rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>
      </div>

      <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </section>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.pages}
        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
      />
    </main>
  );
}