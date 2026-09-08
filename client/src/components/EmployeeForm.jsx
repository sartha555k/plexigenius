import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNo: '',
    designation: '',
    gender: '',
    course: [],
    image: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchEmployee = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`https://plexigenius-ghmo.onrender.com/api/employees/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setFormData(res.data);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch employee data');
        }
      };
      fetchEmployee();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      let updatedCourses = [...formData.course];
      if (checked) {
        updatedCourses.push(value);
      } else {
        updatedCourses = updatedCourses.filter(c => c !== value);
      }
      setFormData({ ...formData, course: updatedCourses });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.course.length === 0) {
      setError('Please select at least one course');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (isEdit) {
        await axios.put(`https://plexigenius-ghmo.onrender.com/api/employees/${id}`, formData, config);
      } else {
        await axios.post('https://plexigenius-ghmo.onrender.com/api/employees', formData, config);
      }
      navigate('/employees');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="header-flex">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/employees" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={16} />
          </Link>
          <h2>{isEdit ? 'Edit Employee' : 'Create Employee'}</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label className="input-label">Name</label>
            <input type="text" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="input-group">
            <label className="input-label">Email</label>
            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Mobile No</label>
            <input type="text" name="mobileNo" className="input-field" value={formData.mobileNo} onChange={handleChange} required pattern="[0-9]{10}" title="Must be 10 digits" />
          </div>

          <div className="input-group">
            <label className="input-label">Designation</label>
            <select name="designation" className="input-field" value={formData.designation} onChange={handleChange} required>
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label">Gender</label>
            <div className="checkbox-group" style={{ height: '38px' }}>
              <label><input type="radio" name="gender" value="M" checked={formData.gender === 'M'} onChange={handleChange} required /> Male</label>
              <label><input type="radio" name="gender" value="F" checked={formData.gender === 'F'} onChange={handleChange} required /> Female</label>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Course</label>
            <div className="checkbox-group" style={{ height: '38px' }}>
              <label><input type="checkbox" name="course" value="MCA" checked={formData.course.includes('MCA')} onChange={handleChange} /> MCA</label>
              <label><input type="checkbox" name="course" value="BCA" checked={formData.course.includes('BCA')} onChange={handleChange} /> BCA</label>
              <label><input type="checkbox" name="course" value="BSC" checked={formData.course.includes('BSC')} onChange={handleChange} /> BSC</label>
            </div>
          </div>

          <div className="input-group" style={{ gridColumn: 'span 2' }}>
            <label className="input-label">Image URL (Optional)</label>
            <input type="text" name="image" className="input-field" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Link to="/employees" className="btn btn-secondary">Cancel</Link>
          <button type="submit" className="btn btn-primary">{isEdit ? 'Update' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
