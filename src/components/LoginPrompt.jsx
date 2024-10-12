import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPrompt = ({ onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
    onClose();
  };

  const handleRegister = () => {
    navigate('/registro');
    onClose();
  };

  return (
    <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Acción Requerida</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Para agregar productos a tu carro de compras primero debes iniciar sesión en tu cuenta o registrarte.</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-primary" onClick={handleLogin}>Iniciar sesión</button>
            <button type="button" className="btn btn-secondary" onClick={handleRegister}>Registrarme</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPrompt;
