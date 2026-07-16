import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginCadastro/LoginCadastro';
import FinalizarCadastro from './pages/FinalizarCadastro/FinalizarCadastro';
import styles from './App.module.scss';

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/finalizar-cadastro" element={<FinalizarCadastro />} />
        </Routes>
      </Router>
  );
}