import React, { useState, useEffect } from 'react'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase'

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', descripcion: '', categoria: '' })
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    const productosSnapshot = await getDocs(collection(db, 'productos'))
    const productosLista = productosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    setProductos(productosLista)
  }

  const agregarProducto = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, 'productos'), nuevoProducto)
    setNuevoProducto({ nombre: '', precio: '', descripcion: '', categoria: '' })
    cargarProductos()
  }

  const actualizarProducto = async (e) => {
    e.preventDefault()
    await updateDoc(doc(db, 'productos', editando.id), editando)
    setEditando(null)
    cargarProductos()
  }

  const eliminarProducto = async (id) => {
    await deleteDoc(doc(db, 'productos', id))
    cargarProductos()
  }

  return (
    <div className="container mt-4">
      <h2>Gestión de Productos</h2>
      <form onSubmit={editando ? actualizarProducto : agregarProducto} className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={editando ? editando.nombre : nuevoProducto.nombre}
          onChange={(e) => editando ? setEditando({...editando, nombre: e.target.value}) : setNuevoProducto({...nuevoProducto, nombre: e.target.value})}
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={editando ? editando.precio : nuevoProducto.precio}
          onChange={(e) => editando ? setEditando({...editando, precio: e.target.value}) : setNuevoProducto({...nuevoProducto, precio: e.target.value})}
          className="form-control mb-2"
        />
        <textarea
          placeholder="Descripción"
          value={editando ? editando.descripcion : nuevoProducto.descripcion}
          onChange={(e) => editando ? setEditando({...editando, descripcion: e.target.value}) : setNuevoProducto({...nuevoProducto, descripcion: e.target.value})}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={editando ? editando.categoria : nuevoProducto.categoria}
          onChange={(e) => editando ? setEditando({...editando, categoria: e.target.value}) : setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">{editando ? 'Actualizar' : 'Agregar'} Producto</button>
        {editando && <button onClick={() => setEditando(null)} className="btn btn-secondary ml-2">Cancelar</button>}
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(producto => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>${producto.precio}</td>
              <td>{producto.categoria}</td>
              <td>
                <button onClick={() => setEditando(producto)} className="btn btn-sm btn-info">Editar</button>
                <button onClick={() => eliminarProducto(producto.id)} className="btn btn-sm btn-danger ms-2">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}