import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/api';
import { formatCurrency } from '../utils/format';

const statusLabel = {
  pending: 'รอดำเนินการ',
  processing: 'กำลังเตรียมสินค้า',
  shipped: 'จัดส่งแล้ว',
  delivered: 'จัดส่งสำเร็จ',
  cancelled: 'ยกเลิก',
};

const paymentLabel = {
  pending: 'รอชำระเงิน',
  paid: 'ชำระเงินแล้ว',
  failed: 'ชำระเงินไม่สำเร็จ',
};

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderService.list().then(({ data }) => setOrders(data.orders || []));
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-extrabold">บัญชีของฉัน</h1>
        <div className="mt-4 grid gap-2 text-sm text-slate-700">
          <p><span className="font-semibold">ชื่อ:</span> {user?.name}</p>
          <p><span className="font-semibold">อีเมล:</span> {user?.email}</p>
          <p><span className="font-semibold">ที่อยู่:</span> {user?.address || '-'}</p>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-2xl font-extrabold">ประวัติการสั่งซื้อ</h2>
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="glass-card p-4">
              <p className="text-xs text-slate-500">รหัสคำสั่งซื้อ: {order._id}</p>
              <p className="mt-1 font-bold">ยอดรวม: {formatCurrency(order.totalPrice)}</p>
              <p className="text-sm text-slate-600">สถานะคำสั่งซื้อ: {statusLabel[order.orderStatus] || order.orderStatus}</p>
              <p className="text-sm text-slate-600">สถานะชำระเงิน: {paymentLabel[order.paymentStatus] || order.paymentStatus}</p>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="glass-card p-6 text-center text-slate-500">ยังไม่มีประวัติการสั่งซื้อ</div>
          )}
        </div>
      </section>
    </main>
  );
}