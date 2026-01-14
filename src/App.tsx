import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
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
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';
  
  console.log('App render - current path:', location.pathname);

  return (
    <div className={location.pathname === '/' ? '' : 'layout'}>
      {!isAuthPage && <NavBar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
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
              <Navigate to="/" />
            )
          }
        />
        <Route path="/exam/:id" element={user ? <ExamPage /> : <Navigate to="/" />} />
        <Route path="/attempt/:id" element={user ? <AttemptResult /> : <Navigate to="/" />} />
        <Route
          path="/admin"
          element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/exams/create"
          element={user?.role === 'admin' ? <AdminExamEditor /> : <Navigate to="/" />}
        />
        <Route
          path="/admin/exams/:id/edit"
          element={user?.role === 'admin' ? <AdminExamEditor /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

