import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { formatCurrency } from '../utils/format';

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-extrabold">ตะกร้าสินค้า</h1>
        <p className="mt-1 text-sm text-slate-500">ตรวจสอบสินค้าและจำนวนก่อนชำระเงิน</p>

        {items.length === 0 ? (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 p-8 text-center">
            <p className="text-slate-600">ยังไม่มีสินค้าในตะกร้า</p>
            <Link to="/products" className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white">
              ไปเลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div key={item.productId?._id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4">
                <div>
                  <p className="font-semibold text-slate-800">{item.productId?.name}</p>
                  <p className="text-sm text-slate-500">{formatCurrency(item.productId?.price)}</p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.productId?._id, Number(e.target.value))}
                    className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-center"
                  />
                  <button
                    onClick={() => removeItem(item.productId?._id)}
                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <p className="text-xl font-bold text-slate-900">รวมทั้งหมด {formatCurrency(total)}</p>
              <Link to="/checkout" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
                ดำเนินการชำระเงิน
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}