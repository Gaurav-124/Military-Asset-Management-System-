import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import AuditLogs from './pages/AuditLogs';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen bg-military-900 flex items-center justify-center">
      <div className="text-military-400 font-mono tracking-widest animate-pulse">AUTHENTICATING...</div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/purchases" element={<PrivateRoute roles={['admin', 'logistics_officer']}><Purchases /></PrivateRoute>} />
          <Route path="/transfers" element={<PrivateRoute roles={['admin', 'logistics_officer', 'base_commander']}><Transfers /></PrivateRoute>} />
          <Route path="/assignments" element={<PrivateRoute roles={['admin', 'base_commander']}><Assignments /></PrivateRoute>} />
          <Route path="/audit-logs" element={<PrivateRoute roles={['admin']}><AuditLogs /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
