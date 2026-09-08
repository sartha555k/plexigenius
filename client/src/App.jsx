import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import HomeStats from './components/HomeStats';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}>
          <Route index element={<HomeStats />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/create" element={<EmployeeForm />} />
          <Route path="employees/edit/:id" element={<EmployeeForm />} />
          <Route path="leads" element={<LeadList />} />
          <Route path="leads/create" element={<LeadForm />} />
          <Route path="leads/edit/:id" element={<LeadForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
