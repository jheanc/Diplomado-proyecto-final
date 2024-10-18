// Card.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Card = ({ producto, isLoggedIn, agregarProductoCarrito }) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (isLoggedIn) {
      agregarProductoCarrito(producto);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const discountedPrice = isLoggedIn ? producto.price * 0.85 : producto.price;

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img
          src={producto.image}
          className="card-img-top img-fluid"
          alt={producto.title}
          style={{ height: '200px', objectFit: 'contain' }}
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{producto.title}</h5>
          {isLoggedIn ? (
            <div>
              <p className="card-text">
                <del>${producto.price.toFixed(2)}</del>
              </p>
              <p className="card-text text-success font-weight-bold">
                ${discountedPrice.toFixed(2)}
                <span className="badge bg-success">15% off</span>
              </p>
            </div>
          ) : (
            <p className="card-text">${producto.price.toFixed(2)}</p>
          )}
          <p className="card-text flex-grow-1">{producto.description.substring(0, 100)}...</p>
          <div className="mt-auto d-flex flex-column align-items-center">
            <Link to={`/producto/${producto.id}`} className="btn btn-primary mb-2">Ver más</Link>
            <button
              onClick={handleAddToCart}
              className="btn btn-success"
            >
              <FontAwesomeIcon icon={faShoppingCart} /> Agregar
            </button>
          </div>
        </div>
      </div>
      {showLoginPrompt && (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Iniciar sesión requerido</h5>
                <button type="button" className="btn-close" onClick={handleLoginPromptClose}></button>
              </div>
              <div className="modal-body">
                <p>Para agregar productos al carrito, debes iniciar sesión primero.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleLoginPromptClose}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={handleLogin}>Iniciar sesión</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;