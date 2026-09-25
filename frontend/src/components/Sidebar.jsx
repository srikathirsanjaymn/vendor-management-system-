import { BarChart3, Boxes, ClipboardList, LogOut, PackageSearch, Store } from 'lucide-react';

const items = [
  ['dashboard', 'Dashboard', BarChart3],
  ['vendors', 'Vendors', Store],
  ['products', 'Products & services', Boxes],
  ['orders', 'Orders', ClipboardList]
];

export default function Sidebar({ page, setPage, user, onLogout }) {
  return <aside className="sidebar">
    <div className="brand"><span className="brand-mark">V</span><span>vendom</span></div>
    <div className="workspace-label">OPERATIONS CONSOLE</div>
    <nav>{items.map(([id, label, Icon]) => <button key={id} className={page === id ? 'nav-item active' : 'nav-item'} onClick={() => setPage(id)}><Icon size={18} /><span>{label}</span></button>)}</nav>
    <div className="sidebar-bottom">
      <div className="user-mini"><div className="avatar">{user.name?.charAt(0)}</div><div><strong>{user.name}</strong><small>{user.role}</small></div></div>
      <button className="nav-item logout" onClick={onLogout}><LogOut size={18} /><span>Sign out</span></button>
    </div>
  </aside>;
}
