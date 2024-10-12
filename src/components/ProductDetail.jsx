import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import LoginPrompt from './LoginPrompt';

const ProductDetail = ({ isLoggedIn, agregarProductoCarrito }) => {
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [variante, setVariante] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!response.ok) {
          throw new Error('No se pudo obtener el producto');
        }
        const data = await response.json();
        // Simulamos opciones para el producto
        data.options = ['Pequeño', 'Mediano', 'Grande'];
        setProducto(data);
        // Inicializar la variante con la primera opción si existe
        if (data.options && data.options.length > 0) {
          setVariante(data.options[0]);
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProducto();
  }, [id]);

  const handleAddToCart = () => {
    if (isLoggedIn) {
      const productoParaAgregar = {
        ...producto,
        cantidad: cantidad,
        variante: variante
      };
      agregarProductoCarrito(productoParaAgregar);
      alert('Producto agregado al carrito');
    } else {
      setShowModal(true);
    }
  };

  const incrementarCantidad = () => setCantidad(prev => prev + 1);
  const decrementarCantidad = () => setCantidad(prev => prev > 1 ? prev - 1 : 1);

  if (!producto) {
    return <div className="container mt-4">Cargando...</div>;
  }

  const discountedPrice = isLoggedIn ? producto.price * 0.85 : producto.price;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <img src={producto.image} alt={producto.title} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2>{producto.title}</h2>
          <p className="text-muted">{producto.category}</p>
          <p>{producto.description}</p>
          {isLoggedIn ? (
            <div>
              <p className="text-muted"><del>${producto.price.toFixed(2)}</del></p>
              <p className="h3 text-success">
                ${discountedPrice.toFixed(2)} 
                <span className="badge bg-success ms-2">15% off</span>
              </p>
            </div>
          ) : (
            <p className="h3">${producto.price.toFixed(2)}</p>
          )}
          
          {/* Opciones de compra */}
          <div className="mt-4">
            {/* Selector de cantidad */}
            <div className="d-flex align-items-center mb-3">
              <button className="btn btn-outline-secondary" onClick={decrementarCantidad}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span className="mx-3">{cantidad}</span>
              <button className="btn btn-outline-secondary" onClick={incrementarCantidad}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>

            {/* Selector de variante */}
            {producto.options && producto.options.length > 0 && (
              <div className="mb-3">
                <label htmlFor="variante" className="form-label">Variante:</label>
                <select 
                  id="variante" 
                  className="form-select" 
                  value={variante} 
                  onChange={(e) => setVariante(e.target.value)}
                >
                  {producto.options.map((opcion, index) => (
                    <option key={index} value={opcion}>{opcion}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Botón de agregar al carrito */}
            <button 
              onClick={handleAddToCart} 
              className="btn btn-primary btn-lg mt-3"
            >
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
      {showModal && <LoginPrompt onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ProductDetail;