import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import LeadList from './components/LeadList';
import LeadForm from './components/LeadForm';
import HomeStats from './components/HomeStats';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />}>
          <Route index element={<HomeStats />} />
          <Route path="employees" element={<EmployeeList />} />
          <Route path="employees/create" element={<EmployeeForm />} />
          <Route path="employees/edit/:id" element={<EmployeeForm />} />
          <Route path="leads" element={<LeadList />} />
          <Route path="leads/create" element={<LeadForm />} />
          <Route path="leads/edit/:id" element={<LeadForm />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
