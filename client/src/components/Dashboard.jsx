import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Target } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          Admin Panel
        </div>
        <nav className="sidebar-nav">
          <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link to="/employees" className={`nav-item ${location.pathname.startsWith('/employees') ? 'active' : ''}`}>
            <Users size={20} />
            Employee List
          </Link>
          <Link to="/leads" className={`nav-item ${location.pathname.startsWith('/leads') ? 'active' : ''}`}>
            <Target size={20} />
            Lead List
          </Link>
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="topbar">
          <div style={{ marginRight: 'auto', fontWeight: '500' }}>
            Welcome, {userName}
          </div>
          <button onClick={handleLogout} className="btn btn-secondary" style={{ display: 'flex', gap: '0.5rem' }}>
            <LogOut size={16} />
            Logout
          </button>
        </header>
        
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
