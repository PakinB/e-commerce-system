import { useEffect, useState } from 'react';
import { orderService, productService } from '../services/api';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  sizes: 'S,M,L',
  stock: '',
  image: null,
};

const statusOptions = [
  { value: 'pending', label: 'รอดำเนินการ' },
  { value: 'processing', label: 'กำลังเตรียมสินค้า' },
  { value: 'shipped', label: 'จัดส่งแล้ว' },
  { value: 'delivered', label: 'จัดส่งสำเร็จ' },
  { value: 'cancelled', label: 'ยกเลิก' },
];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');

  const loadData = async () => {
    const [productRes, orderRes] = await Promise.all([
      productService.list({ page: 1, limit: 100 }),
      orderService.list(),
    ]);
    setProducts(productRes.data.products || []);
    setOrders(orderRes.data.orders || []);
  };

  useEffect(() => {
    loadData();
  }, []);

  const submitProduct = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') fd.append(key, value);
    });

    if (editingId) {
      await productService.update(editingId, fd);
    } else {
      await productService.create(fd);
    }

    setForm(initialForm);
    setEditingId('');
    await loadData();
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      sizes: product.sizes.join(','),
      stock: product.stock,
      image: null,
    });
  };

  const deleteProduct = async (id) => {
    await productService.remove(id);
    await loadData();
  };

  const updateOrderStatus = async (id, orderStatus) => {
    await orderService.updateStatus(id, { orderStatus });
    await loadData();
  };

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <h1 className="text-3xl font-extrabold">แผงควบคุมผู้ดูแลระบบ</h1>

      <form onSubmit={submitProduct} className="glass-card grid gap-3 p-5 md:grid-cols-2">
        <input placeholder="ชื่อสินค้า" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5" required />
        <input placeholder="หมวดหมู่" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5" required />
        <input type="number" placeholder="ราคา" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5" required />
        <input type="number" placeholder="สต็อก" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5" required />
        <input placeholder="ไซซ์ เช่น S,M,L" value={form.sizes} onChange={(e) => setForm((p) => ({ ...p, sizes: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5" required />
        <input type="file" accept="image/*" onChange={(e) => setForm((p) => ({ ...p, image: e.target.files?.[0] || null }))} className="rounded-xl border border-slate-300 px-3 py-2.5" />
        <textarea placeholder="คำอธิบายสินค้า" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="rounded-xl border border-slate-300 px-3 py-2.5 md:col-span-2" rows="3" required />
        <button className="rounded-xl bg-brand px-4 py-2.5 font-semibold text-white md:col-span-2">{editingId ? 'อัปเดตสินค้า' : 'เพิ่มสินค้าใหม่'}</button>
      </form>

      <section className="glass-card p-5">
        <h2 className="text-xl font-bold">จัดการคลังสินค้า</h2>
        <div className="mt-3 space-y-3">
          {products.map((product) => (
            <div key={product._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-slate-500">คงเหลือ {product.stock} ชิ้น</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => editProduct(product)} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">แก้ไข</button>
                <button onClick={() => deleteProduct(product._id)} className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm text-white">ลบ</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="glass-card p-5">
        <h2 className="text-xl font-bold">คำสั่งซื้อทั้งหมด</h2>
        <div className="mt-3 space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs text-slate-500">คำสั่งซื้อ: {order._id}</p>
              <p className="text-sm text-slate-600">ลูกค้า: {order.userId?.email}</p>
              <select
                value={order.orderStatus}
                onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                className="mt-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}