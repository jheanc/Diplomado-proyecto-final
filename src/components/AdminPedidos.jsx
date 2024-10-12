import React, { useState, useEffect } from 'react'
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])

  useEffect(() => {
    cargarPedidos()
  }, [])

  const cargarPedidos = async () => {
    const pedidosSnapshot = await getDocs(query(collection(db, 'carritos'), where('estado', '==', 'completado')))
    const pedidosLista = pedidosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setPedidos(pedidosLista)
  }

  const actualizarEstadoPedido = async (id, nuevoEstado) => {
    await updateDoc(doc(db, 'carritos', id), { estado: nuevoEstado })
    cargarPedidos()
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Pedidos</h2>
      <table className="table">
        <thead>
          <tr>
            <th>ID Pedido</th>
            <th>Usuario</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map(pedido => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.usuario}</td>
              <td>${pedido.total.toFixed(2)}</td>
              <td>{pedido.estado}</td>
              <td>
                <select
                  value={pedido.estado}
                  onChange={(e) => actualizarEstadoPedido(pedido.id, e.target.value)}
                  className="form-control"
                >
                  <option value="completado">Completado</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}