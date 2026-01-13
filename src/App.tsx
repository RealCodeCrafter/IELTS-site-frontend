import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import ExamPage from './pages/ExamPage';
import AttemptResult from './pages/AttemptResult';
import AdminDashboard from './pages/AdminDashboard';
import AdminExamEditor from './pages/AdminExamEditor';
import NavBar from './components/NavBar';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="layout">
      {!isAuthPage && <NavBar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin" />
              ) : (
                <StudentDashboard />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/exam/:id" element={user ? <ExamPage /> : <Navigate to="/login" />} />
        <Route path="/attempt/:id" element={user ? <AttemptResult /> : <Navigate to="/login" />} />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/exams/create"
          element={user?.role === 'admin' ? <AdminExamEditor /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/exams/:id/edit"
          element={user?.role === 'admin' ? <AdminExamEditor /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

