import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const LeadForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    leadName: '',
    email: '',
    phone: '',
    status: 'New',
    assignedEmployee: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch employees for dropdown
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://plexigenius-ghmo.onrender.com/api/employees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmployees(res.data);
      } catch (err) {
        console.error('Failed to fetch employees', err);
      }
    };
    fetchEmployees();

    if (isEdit) {
      const fetchLead = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`https://plexigenius-ghmo.onrender.com/api/leads/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = res.data;
          // Extract just the ID if populated
          if (data.assignedEmployee && typeof data.assignedEmployee === 'object') {
            data.assignedEmployee = data.assignedEmployee._id;
          }
          setFormData(data);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch lead data');
        }
      };
      fetchLead();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.assignedEmployee) {
      setError('Please select an employee to assign this lead to.');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (isEdit) {
        await axios.put(`https://plexigenius-ghmo.onrender.com/api/leads/${id}`, formData, config);
      } else {
        await axios.post('https://plexigenius-ghmo.onrender.com/api/leads', formData, config);
      }
      navigate('/leads');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="header-flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/leads" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={16} />
          </Link>
          <h2>{isEdit ? 'Edit Lead' : 'Add Lead'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label">Lead Name</label>
            <input type="text" name="leadName" className="input-field" value={formData.leadName} onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Phone</label>
            <input type="text" name="phone" className="input-field" value={formData.phone} onChange={handleChange} required pattern="[0-9]{10}" title="Must be 10 digits" />
          </div>

          <div className="input-group">
            <label className="input-label">Status</label>
            <select name="status" className="input-field" value={formData.status} onChange={handleChange} required>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Lost">Lost</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">Assigned Employee</label>
            <select name="assignedEmployee" className="input-field" value={formData.assignedEmployee} onChange={handleChange} required>
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.designation}) - {emp.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/leads" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Save Lead'}</button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
