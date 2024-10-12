import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faVenusMars } from '@fortawesome/free-solid-svg-icons';

const PerfilUsuario = ({ userData }) => {
  const [perfil, setPerfil] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState('');
  const [sexo, setSexo] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      if (userData && userData.uid) {
        try {
          const docRef = doc(db, "usuarios", userData.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setPerfil(docSnap.data());
            setNombre(docSnap.data().nombre || '');
            setSexo(docSnap.data().sexo || '');
          } else {
            setError("No se encontró el perfil del usuario");
          }
        } catch (error) {
          console.error("Error al cargar el perfil:", error);
          setError("Error al cargar el perfil del usuario");
        }
      }
    };
    cargarPerfil();
  }, [userData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData && userData.uid) {
      try {
        const docRef = doc(db, "usuarios", userData.uid);
        await updateDoc(docRef, {
          nombre: nombre,
          sexo: sexo
        });
        setPerfil({ ...perfil, nombre, sexo });
        setEditando(false);
        setError(null);
      } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        setError("Error al actualizar el perfil del usuario");
      }
    }
  };

  if (error) {
    return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  if (!perfil) {
    return <div className="container mt-5">Cargando perfil...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Perfil de Usuario</h2>
              {!editando ? (
                <div>
                  <div className="mb-3">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    <strong>Nombre:</strong> {perfil.nombre || 'No especificado'}
                  </div>
                  <div className="mb-3">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    <strong>Correo electrónico:</strong> {perfil.email}
                  </div>
                  <div className="mb-3">
                    <FontAwesomeIcon icon={faVenusMars} className="me-2" />
                    <strong>Sexo:</strong> {perfil.sexo || 'No especificado'}
                  </div>
                  <div className="mb-3">
                    <strong>Rol:</strong> {perfil.rol || 'No especificado'}
                  </div>
                  <button className="btn btn-primary" onClick={() => setEditando(true)}>
                    Editar Perfil
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sexo" className="form-label">Sexo</label>
                    <select
                      className="form-select"
                      id="sexo"
                      value={sexo}
                      onChange={(e) => setSexo(e.target.value)}
                      required
                    >
                      <option value="">Seleccione...</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary me-2">Guardar Cambios</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;