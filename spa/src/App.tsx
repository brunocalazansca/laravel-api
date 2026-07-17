import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginCadastro/LoginCadastro';
import FinalizarCadastro from './pages/FinalizarCadastro/FinalizarCadastro';
import QuadroPlantoes from './pages/QuadroPlantoes/QuadroPlantoes'
import styles from './App.module.scss';

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const token = localStorage.getItem('token');
    return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/finalizar-cadastro" element={<PrivateRoute><FinalizarCadastro /></PrivateRoute>} />
          <Route path="/plantoes" element={<PrivateRoute><QuadroPlantoes /></PrivateRoute>} />
        </Routes>
      </Router>
  );
}