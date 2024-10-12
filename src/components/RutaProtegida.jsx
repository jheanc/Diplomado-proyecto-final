import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    // Redirige al usuario a la página de inicio de sesión si no está autenticado
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RutaProtegida;