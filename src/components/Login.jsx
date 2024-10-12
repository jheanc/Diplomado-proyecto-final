import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = ({ setIsLoggedIn, setUserData }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setIsLoggedIn(true);
        setUserData({
          email: userCredential.user.email,
          nombres: "Nombre",
          apellidos: "Apellido", 
          sexo: "No especificado" 
        });
        navigate('/quienessomos');
      } catch (error) {
        alert("Usuario o clave erradas, por favor intente de nuevo.");
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8" style={{ maxWidth: '37.0%' }}>
          <div className="card shadow border-0 rounded">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <span 
                    onClick={() => setShowPassword(!showPassword)} 
                    style={{ cursor: 'pointer', position: 'absolute', right: '10px', top: '35px' }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </span>
                </div>
                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
              </form>
              <p className="text-center mt-3">
                <a href="#" onClick={() => navigate('/registro')}>Aún no tienes una cuenta? Regístrate</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
