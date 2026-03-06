import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'สมัครสมาชิกไม่สำเร็จ');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <h1 className="text-3xl font-extrabold">สมัครสมาชิก</h1>
        <p className="mt-1 text-sm text-slate-500">สร้างบัญชีเพื่อสั่งซื้อและติดตามคำสั่งซื้อได้ง่ายขึ้น</p>

        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

        <input
          required
          placeholder="ชื่อ - นามสกุล"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-brand"
        />
        <input
          type="email"
          required
          placeholder="อีเมล"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-brand"
        />
        <input
          type="password"
          required
          placeholder="รหัสผ่าน"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-brand"
        />
        <button className="mt-4 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white">สมัครสมาชิก</button>

        <p className="mt-3 text-sm text-slate-600">
          มีบัญชีอยู่แล้ว? <Link className="font-semibold text-brand" to="/login">เข้าสู่ระบบ</Link>
        </p>
      </form>
    </main>
  );
}
