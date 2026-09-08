import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://plexigenius-ghmo.onrender.com/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://plexigenius-ghmo.onrender.com/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchLeads();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.assignedEmployee && lead.assignedEmployee.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="card">
      <div className="header-flex">
        <h2>Lead List</h2>
        <Link to="/leads/create" className="btn btn-primary" style={{ display: 'flex', gap: '0.5rem' }}>
          <Plus size={16} />
          Add Lead
        </Link>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Total Count: {filteredLeads.length}</span>
        <input 
          type="text" 
          placeholder="Search Leads..." 
          className="input-field" 
          style={{ width: '250px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Assigned Employee</th>
              <th>Status</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td style={{ fontWeight: '500' }}>{lead.leadName}</td>
                <td><a href={`mailto:${lead.email}`}>{lead.email}</a></td>
                <td>{lead.phone}</td>
                <td>
                  {lead.assignedEmployee ? lead.assignedEmployee.name : <span style={{ color: 'var(--text-muted)' }}>Unassigned</span>}
                </td>
                <td>
                  <span className="badge" style={{
                    backgroundColor: lead.status === 'New' ? '#DBEAFE' : lead.status === 'Closed' ? '#D1FAE5' : lead.status === 'Lost' ? '#FEE2E2' : '#FEF3C7',
                    color: lead.status === 'New' ? '#1D4ED8' : lead.status === 'Closed' ? '#065F46' : lead.status === 'Lost' ? '#991B1B' : '#92400E'
                  }}>
                    {lead.status}
                  </span>
                </td>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/leads/edit/${lead._id}`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                      <Edit size={14} />
                    </Link>
                    <button onClick={() => handleDelete(lead._id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadList;
