import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { orderService } from '../services/api';
import { formatCurrency } from '../utils/format';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await orderService.create({ shippingAddress });
      clearCart();
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-2">
      <form onSubmit={placeOrder} className="glass-card p-6">
        <h1 className="text-2xl font-extrabold">ข้อมูลการจัดส่ง</h1>
        <label className="mt-5 block text-sm font-medium text-slate-700">ที่อยู่สำหรับจัดส่ง</label>
        <textarea
          required
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-brand"
          rows="5"
          placeholder="บ้านเลขที่/ถนน/ตำบล/อำเภอ/จังหวัด/รหัสไปรษณีย์"
        />
        <button
          disabled={loading || items.length === 0}
          className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'กำลังยืนยันคำสั่งซื้อ...' : 'ยืนยันการสั่งซื้อ'}
        </button>
      </form>

      <div className="glass-card p-6">
        <h2 className="text-2xl font-extrabold">สรุปคำสั่งซื้อ</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.productId?._id} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-2 text-sm">
              <span>{item.productId?.name} x {item.quantity}</span>
              <span className="font-semibold">{formatCurrency((item.productId?.price || 0) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <p className="mt-5 border-t border-slate-200 pt-4 text-xl font-extrabold">ยอดชำระ {formatCurrency(total)}</p>
      </div>
    </main>
  );
}