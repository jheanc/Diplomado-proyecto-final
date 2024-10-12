import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faHome, faCreditCard, faLock, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const Checkout = ({ cart, total }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    numeroTarjeta: '',
    fechaExpiracion: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
        Finalizar Compra
      </h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4">Información de Envío y Pago</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    <FontAwesomeIcon icon={faHome} className="me-2" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
                    <input
                      type="text"
                      className="form-control"
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <hr className="my-4" />
                <h4 className="mb-3">Información de Pago</h4>
                <div className="mb-3">
                  <label htmlFor="numeroTarjeta" className="form-label">
                    <FontAwesomeIcon icon={faCreditCard} className="me-2" />
                    Número de Tarjeta
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="numeroTarjeta"
                    name="numeroTarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fechaExpiracion" className="form-label">Fecha de Expiración</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fechaExpiracion"
                      name="fechaExpiracion"
                      placeholder="MM/AA"
                      value={formData.fechaExpiracion}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label">
                      <FontAwesomeIcon icon={faLock} className="me-2" />
                      CVV
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <button className="btn btn-primary w-100 mt-4" type="submit">
                  Realizar Pedido
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4">Resumen del Pedido</h3>
              {cart && cart.length > 0 ? (
                <>
                  {cart.map((item, index) => (
                    <div key={index} className="d-flex justify-content-between mb-2">
                      <span>{item.name}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                </>
              ) : (
                <p>No hay productos en el carrito.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;