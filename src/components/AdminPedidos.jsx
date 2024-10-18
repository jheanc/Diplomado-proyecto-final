import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faEye } from  '@fortawesome/free-solid-svg-icons';

const AdminPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const pedidosQuery = query(collection(db, 'pedidos'), orderBy('fechaPedido', 'desc'));
      const pedidosSnapshot = await getDocs(pedidosQuery);
      const pedidosLista = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPedidos(pedidosLista);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    }
  };

  const actualizarEstadoPedido = async (id, nuevoEstado) => {
    try {
      await updateDoc(doc(db, 'pedidos', id), { estado: nuevoEstado });
      cargarPedidos();
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
    }
  };

  const formatearFecha = (timestamp) => {
    if (!timestamp) return 'Fecha no disponible';
    const fecha = timestamp.toDate();
    return fecha.toLocaleString();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestión de Pedidos</h2>
      <div className="row">
        <div className="col-md-8">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID Pedido</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id}>
                  <td>{pedido.id.slice(0, 8)}...</td>
                  <td>{pedido.nombre}</td>
                  <td>{formatearFecha(pedido.fechaPedido)}</td>
                  <td>${pedido.total.toFixed(2)}</td>
                  <td>
                    <select
                      value={pedido.estado}
                      onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
                      className="form-select form-select-sm"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-info me-2"
                      onClick={() => setPedidoSeleccionado(pedido)}
                    >
                      <FontAwesomeIcon icon={faEye} /> Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-4">
          {pedidoSeleccionado && (
            <div className="card">
              <div className="card-header">
                Detalles del Pedido
              </div>
              <div className="card-body">
                <h5 className="card-title">Pedido ID: {pedidoSeleccionado.id}</h5>
                <p><strong>Nombre:</strong> {pedidoSeleccionado.nombre}</p>
                <p><strong>Email:</strong> {pedidoSeleccionado.email}</p>
                <p><strong>Teléfono:</strong> {pedidoSeleccionado.telefono}</p>
                <p><strong>Dirección:</strong> {pedidoSeleccionado.direccion}</p>
                <p><strong>Ciudad:</strong> {pedidoSeleccionado.ciudad}</p>
                <p><strong>Código Postal:</strong> {pedidoSeleccionado.codigoPostal}</p>
                <h6>Productos:</h6>
                <ul>
                  {pedidoSeleccionado.productos.map((producto, index) => (
                    <li key={index}>
                      {producto.titulo} - Cantidad: {producto.cantidad} - Precio: ${producto.precio.toFixed(2)}
                    </li>
                  ))}
                </ul>
                <p><strong>Subtotal:</strong> ${pedidoSeleccionado.subtotal.toFixed(2)}</p>
                <p><strong>Descuento:</strong> ${pedidoSeleccionado.descuento.toFixed(2)}</p>
                <p><strong>Total:</strong> ${pedidoSeleccionado.total.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPedidos;