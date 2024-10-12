import React, { useEffect, useState } from 'react'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { guardarCarrito } from '../firebase';
import { Link } from 'react-router-dom';

const Carrito = ({ productos, eliminarProductoCarrito, modificarProductoCarrito, user, aplicarCupon, cuponAplicado, calcularTotalConDescuento }) => {
  const [cupon, setCupon] = useState('');

  const handleCantidadChange = (id, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;

    const productoExistente = productos.find((producto) => producto.id === id);
    if (productoExistente) {
      modificarProductoCarrito(id, { ...productoExistente, cantidad: nuevaCantidad });
    }
  };

  const incrementarCantidad = (id) => {
    const producto = productos.find(p => p.id === id);
    handleCantidadChange(id, (producto.cantidad || 1) + 1);
  };

  const decrementarCantidad = (id) => {
    const producto = productos.find(p => p.id === id);
    if (producto.cantidad > 1) {
      handleCantidadChange(id, producto.cantidad - 1);
    }
  };

  const calcularTotalProducto = (precio, cantidad) => {
    return (precio * cantidad).toFixed(2);
  };

  const calcularSubtotal = () => {
    return productos.reduce((total, producto) => {
      const cantidad = producto.cantidad || 1;
      return total + producto.price * cantidad;
    }, 0).toFixed(2);
  };

  const handleAplicarCupon = () => {
    const descuentoAplicado = aplicarCupon(cupon);
    if (!descuentoAplicado) {
      alert('Cupón inválido');
    }
  };

  useEffect(() => {
    if (user?.uid) {
      guardarCarrito(user.uid, productos);
    }
  }, [productos, user]);

  const subtotal = calcularSubtotal();
  const total = calcularTotalConDescuento(parseFloat(subtotal)).toFixed(2);

  return (
    <div className="container">
      <h3 className="my-4">Carrito de Compras</h3>
      {productos.length === 0 ? (
        <div>
          <p>No hay productos en el carrito.</p>
          <Link to="/quienessomos" className="btn btn-primary">Ir a la tienda</Link>
        </div>
      ) : (
        <>
          <div className="table-responsive mb-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img 
                          src={producto.image} 
                          alt={producto.title} 
                          className="img-fluid" 
                          style={{ width: '50px', height: '50px', objectFit: 'contain', marginRight: '10px' }} 
                        />
                        <span>{producto.title}</span>
                      </div>
                    </td>
                    <td>${producto.price.toFixed(2)}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => decrementarCantidad(producto.id)}>
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="mx-2">{producto.cantidad || 1}</span>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => incrementarCantidad(producto.id)}>
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                    </td>
                    <td>${calcularTotalProducto(producto.price, producto.cantidad || 1)}</td>
                    <td>
                      <button 
                        onClick={() => eliminarProductoCarrito(producto.id)} 
                        className="btn btn-danger btn-sm"
                      >
                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card p-3">
            <h4>Resumen del pedido</h4>
            <p>Subtotal: ${subtotal}</p>
            {cuponAplicado && (
              <p>Descuento aplicado: {cuponAplicado.descuento * 100}% ({cuponAplicado.codigo})</p>
            )}
            <h3>Total: ${total}</h3>
            <div className="input-group mb-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Ingrese cupón de descuento"
                value={cupon}
                onChange={(e) => setCupon(e.target.value)}
              />
              <button 
                className="btn btn-outline-secondary" 
                type="button"
                onClick={handleAplicarCupon}
              >
                Aplicar Cupón
              </button>
            </div>
            {cuponAplicado && <p className="text-success">Cupón aplicado correctamente</p>}
            <Link to="/checkout" className="btn btn-primary mt-3">Proceder al pago</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;