import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Target } from 'lucide-react';

const HomeStats = () => {
  const [stats, setStats] = useState({ totalEmployees: 0, totalLeads: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5001/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading statistics...</div>;
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', padding: '1rem', borderRadius: '50%' }}>
            <Users size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Employees</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.totalEmployees}</div>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--secondary)', padding: '1rem', borderRadius: '50%' }}>
            <Target size={32} />
          </div>
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '500' }}>Total Leads</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--text-main)' }}>{stats.totalLeads}</div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeStats;
