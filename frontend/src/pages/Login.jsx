import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'เข้าสู่ระบบไม่สำเร็จ');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <form onSubmit={handleSubmit} className="glass-card p-6">
        <h1 className="text-3xl font-extrabold">เข้าสู่ระบบ</h1>
        <p className="mt-1 text-sm text-slate-500">ยินดีต้อนรับกลับ เลือกช้อปต่อได้เลย</p>

        {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">{error}</p>}

        <input
          type="email"
          required
          placeholder="อีเมล"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-brand"
        />
        <input
          type="password"
          required
          placeholder="รหัสผ่าน"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
          className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none focus:border-brand"
        />
        <button className="mt-4 w-full rounded-xl bg-brand py-2.5 text-sm font-semibold text-white">เข้าสู่ระบบ</button>

        <p className="mt-3 text-sm text-slate-600">
          ยังไม่มีบัญชี? <Link className="font-semibold text-brand" to="/register">สมัครสมาชิก</Link>
        </p>
        <p className='mt-3 text-sm text-black font-bold'>บัญชีสำหรับทดลอง</p>
        <p className='mt-3 text-sm text-black font-bold'>สถานะแอดมิน</p>
        <p className='mt-3 text-sm text-slate-600 font-bold'>Email: admin@gmail.com</p>
        <p className='mt-3 text-sm text-slate-600 font-bold'>Password: 123456</p>
        <p className='mt-3 text-sm text-black font-bold'>สถานะลูกค้า</p>
        <p className='mt-3 text-sm text-slate-600 font-bold'>Email: user@gmail.com</p>
        <p className='mt-3 text-sm text-slate-600 font-bold'>Password: 123456</p>
      </form>
    </main>
  );
}