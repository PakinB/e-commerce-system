import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const navClass = ({ isActive }) =>
    `rounded-full px-3 py-1.5 transition ${isActive ? 'bg-brand text-white' : 'text-slate-700 hover:bg-slate-200'}`;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/50 bg-slate-50/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-2xl font-extrabold tracking-tight text-brand">
          PAKIN SHIRT SHOP
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
          <NavLink to="/products" className={navClass}>สินค้า</NavLink>
          <NavLink to="/cart" className={navClass}>ตะกร้า ({items.length})</NavLink>
          {user && <NavLink to="/profile" className={navClass}>บัญชีของฉัน</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navClass}>แอดมิน</NavLink>}
          {!user ? (
            <>
              <NavLink to="/login" className={navClass}>เข้าสู่ระบบ</NavLink>
              <NavLink to="/register" className={navClass}>สมัครสมาชิก</NavLink>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="rounded-full bg-slate-900 px-4 py-1.5 text-white transition hover:bg-slate-700"
            >
              ออกจากระบบ
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}