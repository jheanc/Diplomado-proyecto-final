import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import LoginPrompt from './LoginPrompt';

const Card = ({ producto, isLoggedIn, agregarProductoCarrito }) => {
  const [showModal, setShowModal] = useState(false);

  const handleAddToCart = () => {
    if (isLoggedIn) {
      agregarProductoCarrito(producto);
    } else {
      setShowModal(true);
    }
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
      {showModal && <LoginPrompt onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Card;