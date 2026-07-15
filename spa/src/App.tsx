import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginCadastro/LoginCadastro';
import styles from './App.module.scss';

function DashboardTemp() {
  return (
      <div className={styles.dashboard}>
        <h1 className={styles.dashboardTitle}>Bem-vindo ao Kanban de Plantões! 🎉</h1>
      </div>
  );
}

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<LoginPage />} />

          <Route path="/dashboard" element={<DashboardTemp />} />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
  );
}