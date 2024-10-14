import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone, faHome, faCreditCard, faLock, faShoppingCart, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const Checkout = ({ productos, cuponAplicado, calcularTotalConDescuento }) => {
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
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Limpiar el error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!/^\d{10}$/.test(formData.telefono)) newErrors.telefono = 'Teléfono inválido (10 dígitos)';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida';
    if (!formData.ciudad.trim()) newErrors.ciudad = 'La ciudad es requerida';
    if (!/^\d{5}$/.test(formData.codigoPostal)) newErrors.codigoPostal = 'Código postal inválido (5 dígitos)';
    if (!/^\d{16}$/.test(formData.numeroTarjeta)) newErrors.numeroTarjeta = 'Número de tarjeta inválido (16 dígitos)';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.fechaExpiracion)) newErrors.fechaExpiracion = 'Fecha inválida (MM/AA)';
    if (!/^\d{3,4}$/.test(formData.cvv)) newErrors.cvv = 'CVV inválido (3 o 4 dígitos)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Datos del formulario:', formData);
      // Aquí iría la lógica para procesar el pago y crear el pedido
      setShowConfirmation(true);
    }
  };

  const calcularSubtotal = () => {
    return productos.reduce((total, producto) => total + producto.price * producto.cantidad, 0);
  };

  const subtotal = calcularSubtotal();
  const total = calcularTotalConDescuento(subtotal);

  if (showConfirmation) {
    return (
      <div className="container mt-5">
        <div className="card shadow">
          <div className="card-body text-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-3" size="4x" />
            <h2 className="card-title">¡Compra Confirmada!</h2>
            <p className="card-text">Gracias por tu compra, {formData.nombre}.</p>
            <p className="card-text">Tu pedido llegará en aproximadamente 3-5 días hábiles.</p>
            <p className="card-text">Te hemos enviado un correo de confirmación a {formData.email}.</p>
          </div>
        </div>
      </div>
    );
  }

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
                    className={`form-control ${errors.nombre ? 'is-invalid' : ''}`}
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                  {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">
                    <FontAwesomeIcon icon={faPhone} className="me-2" />
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className={`form-control ${errors.telefono ? 'is-invalid' : ''}`}
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                  {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">
                    <FontAwesomeIcon icon={faHome} className="me-2" />
                    Dirección
                  </label>
                  <input
                    type="text"
                    className={`form-control ${errors.direccion ? 'is-invalid' : ''}`}
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                  />
                  {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                </div>
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className={`form-control ${errors.ciudad ? 'is-invalid' : ''}`}
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      required
                    />
                    {errors.ciudad && <div className="invalid-feedback">{errors.ciudad}</div>}
                  </div>
                  <div className="col">
                    <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
                    <input
                      type="text"
                      className={`form-control ${errors.codigoPostal ? 'is-invalid' : ''}`}
                      id="codigoPostal"
                      name="codigoPostal"
                      value={formData.codigoPostal}
                      onChange={handleChange}
                      required
                    />
                    {errors.codigoPostal && <div className="invalid-feedback">{errors.codigoPostal}</div>}
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
                    className={`form-control ${errors.numeroTarjeta ? 'is-invalid' : ''}`}
                    id="numeroTarjeta"
                    name="numeroTarjeta"
                    value={formData.numeroTarjeta}
                    onChange={handleChange}
                    required
                  />
                  {errors.numeroTarjeta && <div className="invalid-feedback">{errors.numeroTarjeta}</div>}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fechaExpiracion" className="form-label">Fecha de Expiración</label>
                    <input
                      type="text"
                      className={`form-control ${errors.fechaExpiracion ? 'is-invalid' : ''}`}
                      id="fechaExpiracion"
                      name="fechaExpiracion"
                      placeholder="MM/AA"
                      value={formData.fechaExpiracion}
                      onChange={handleChange}
                      required
                    />
                    {errors.fechaExpiracion && <div className="invalid-feedback">{errors.fechaExpiracion}</div>}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cvv" className="form-label">
                      <FontAwesomeIcon icon={faLock} className="me-2" />
                      CVV
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                    />
                    {errors.cvv && <div className="invalid-feedback">{errors.cvv}</div>}
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
              {productos && productos.length > 0 ? (
                <>
                  <ul className="list-unstyled">
                    {productos.map((producto) => (
                      <li key={producto.id} className="mb-2">
                        <span className="me-2">•</span>
                        {producto.title} (x{producto.cantidad})
                        <span className="float-end">${(producto.price * producto.cantidad).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Subtotal:</strong>
                    <strong>${subtotal.toFixed(2)}</strong>
                  </div>
                  {cuponAplicado && (
                    <div className="d-flex justify-content-between text-success">
                      <span>Descuento ({cuponAplicado.codigo}):</span>
                      <span>-${(subtotal * cuponAplicado.descuento).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mt-2">
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